// Mintlify uses client-side nav; the browser won't restore scroll on #content-container. (almond theme specifically)
// This script saves scroll position per route in sessionStorage and restores it on back/forward.
(() => {
  if (window.__powersyncScrollRestoration) return;
  window.__powersyncScrollRestoration = true;

  const storagePrefix = "powersync:docs-scroll:";
  // Mintlify scrolls this inner element, not window — don't switch to document.documentElement.
  const contentSelector = "#content-container";
  // Content height isn't ready immediately after nav; retry until layout settles.
  const scrollRestorationDelays = [100, 300, 600, 900, 1200];
  const replaceState = window.history.replaceState.bind(window.history);

  let contentContainer;
  let currentRoute = routeKey(window.location.href);
  let scrollRestorationTimers = [];
  let isRestoringScrollPosition = false;
  // Next.js App Router stores internal state on history.state.__NA which we need to preserve when changing hash.
  let routerState = window.history.state?.__NA ? window.history.state : null;

  function routeKey(url) {
    const parsedUrl = new URL(url, window.location.origin);
    return `${parsedUrl.pathname}${parsedUrl.search}`;
  }

  function storageKey(route) {
    return `${storagePrefix}${route}`;
  }

  function rememberRouterState() {
    if (window.history.state?.__NA) {
      routerState = window.history.state;
    }
  }

  // Mintlify seems to use history.replaceState for hash/heading links, which updates the URL
  // fragment but drops Next.js App Router state (history.state.__NA).This function repairs the current entry
  // before leaving so going back restores both the page and the anchor correctly.
  function fixHashHistoryEntry() {
    if (!routerState || window.history.state?.__NA) return;

    replaceState(
      routerState,
      "",
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    );
  }

  function readScrollPosition(route) {
    try {
      const value = window.sessionStorage.getItem(storageKey(route));
      if (value === null) return null;

      const parsed = JSON.parse(value);
      if (!parsed || typeof parsed !== "object" || !("position" in parsed)) {
        return null;
      }

      const position = Number(parsed.position);
      if (!Number.isFinite(position) || position < 0) return null;

      return {
        position,
        hash: typeof parsed.hash === "string" ? parsed.hash : "",
      };
    } catch {
      return null;
    }
  }

  function writeScrollPosition(route, position, hash) {
    try {
      window.sessionStorage.setItem(
        storageKey(route),
        JSON.stringify({ position, hash: hash || "" }),
      );
    } catch {
      // Scroll restoration remains optional when storage is unavailable.
    }
  }

  function saveScrollPosition() {
    const container = document.querySelector(contentSelector);
    if (!container || isRestoringScrollPosition) return;

    writeScrollPosition(
      routeKey(window.location.href),
      container.scrollTop,
      window.location.hash,
    );
  }

  function restoreHash(hash) {
    if (!hash || window.location.hash === hash) return;

    replaceState(
      routerState ?? window.history.state,
      "",
      `${window.location.pathname}${window.location.search}${hash}`,
    );
  }

  function scrollToHash(hash) {
    cancelScrollRestoration();

    if (!hash) {
      contentContainer?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const fragment = hash.slice(1);
    let decodedFragment = fragment;

    try {
      decodedFragment = decodeURIComponent(fragment);
    } catch {
      // Fall back to the literal fragment when the hash is malformed.
    }

    const target =
      document.getElementById(decodedFragment) ??
      document.getElementById(fragment);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // mintlify replaces #content-container with a new node when navigating; move the scroll listener to the new node.
  function bindContentContainer() {
    const nextContainer = document.querySelector(contentSelector);
    if (!nextContainer || nextContainer === contentContainer) return;

    contentContainer?.removeEventListener("scroll", saveScrollPosition);
    contentContainer = nextContainer;
    contentContainer.addEventListener("scroll", saveScrollPosition, {
      passive: true,
    });
  }

  function cancelScrollRestoration() {
    scrollRestorationTimers.forEach(window.clearTimeout);
    scrollRestorationTimers = [];
    isRestoringScrollPosition = false;
  }

  function restoreScrollPosition(route, staleContainer) {
    const saved = readScrollPosition(route);
    if (saved === null) return;

    cancelScrollRestoration();
    isRestoringScrollPosition = true;

    for (const delay of scrollRestorationDelays) {
      scrollRestorationTimers.push(
        window.setTimeout(() => {
          if (routeKey(window.location.href) !== route) {
            cancelScrollRestoration();
            return;
          }

          bindContentContainer();
          // If the stale container is still the current container, don't restore scroll.
          if (staleContainer && contentContainer === staleContainer) return;

          restoreHash(saved.hash);
          contentContainer?.scrollTo({
            top: saved.position,
            behavior: "smooth",
          });

          if (delay === scrollRestorationDelays.at(-1)) {
            scrollRestorationTimers = [];
            isRestoringScrollPosition = false;
          }
        }, delay),
      );
    }
  }

  function handleHistoryChange() {
    const nextRoute = routeKey(window.location.href);
    const routeChanged = nextRoute !== currentRoute;
    const staleContainer = contentContainer;
    currentRoute = nextRoute;
    rememberRouterState();

    if (routeChanged) {
      restoreScrollPosition(nextRoute, staleContainer);
    } else {
      // The browser does not scroll Mintlify's inner container on hash-only popstate.
      scrollToHash(window.location.hash);
      bindContentContainer();
    }
  }

  function beforeLeavePage() {
    saveScrollPosition();
    fixHashHistoryEntry();
  }

  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method];

    window.history[method] = function (...args) {
      if (
        method === "pushState" &&
        args[2] &&
        routeKey(args[2]) !== routeKey(window.location.href)
      ) {
        beforeLeavePage();
      }

      const result = original.apply(this, args);
      currentRoute = routeKey(window.location.href);
      rememberRouterState();
      bindContentContainer();
      return result;
    };
  }

  // Capture phase: save scroll before Mintlify's click handler runs pushState.
  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a[href]");
      if (!link || link.origin !== window.location.origin) return;
      if (routeKey(link.href) !== routeKey(window.location.href)) {
        beforeLeavePage();
      }
    },
    true,
  );

  for (const eventName of ["wheel", "touchstart", "pointerdown", "keydown"]) {
    window.addEventListener(eventName, cancelScrollRestoration, {
      capture: true,
      passive: true,
    });
  }

  window.addEventListener("popstate", handleHistoryChange);
  window.addEventListener("pagehide", saveScrollPosition);

  window.addEventListener("pageshow", (event) => {
    rememberRouterState();
    bindContentContainer();

    const navigation = window.performance.getEntriesByType("navigation")[0];
    if (event.persisted || navigation?.type === "back_forward") {
      restoreScrollPosition(routeKey(window.location.href));
    }
  });

  // Fallback when nav swaps DOM without firing history events we already handle.
  new MutationObserver(bindContentContainer).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  rememberRouterState();
  bindContentContainer();
})();
