// Mintlify uses client-side nav; the browser won't restore scroll on #content-container. (almond theme specifically)
// This script saves scroll position per route in sessionStorage and restores it on back/forward.
(() => {
  if (window.__powersyncScrollRestoration) return;
  window.__powersyncScrollRestoration = true;

  const storagePrefix = "powersync:docs-scroll:";
  // Mintlify scrolls this inner element, not window — don't switch to document.documentElement.
  const contentSelector = "#content-container";
  // Content height isn't ready immediately after nav; retry until layout settles.
  const restoreDelays = [100, 300, 600, 900, 1200];
  const replaceState = window.history.replaceState.bind(window.history);

  let contentContainer;
  let currentRoute = routeKey(window.location.href);
  let restoreTimers = [];
  let isRestoring = false;
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

  function fixHashHistoryEntry() {
    if (!routerState || window.history.state?.__NA) return;

    replaceState(
      routerState,
      "",
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    );
  }

  function readSaved(route) {
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

  function writeSaved(route, position, hash) {
    try {
      window.sessionStorage.setItem(
        storageKey(route),
        JSON.stringify({ position, hash: hash || "" }),
      );
    } catch {
      // Scroll restoration remains optional when storage is unavailable.
    }
  }

  function savePosition() {
    const container = document.querySelector(contentSelector);
    if (!container || isRestoring) return;

    writeSaved(
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

  // mintlify replaces #content-container with a new node when navigating; move the scroll listener to the new node.
  function bindContentContainer() {
    const nextContainer = document.querySelector(contentSelector);
    if (!nextContainer || nextContainer === contentContainer) return;

    contentContainer?.removeEventListener("scroll", savePosition);
    contentContainer = nextContainer;
    contentContainer.addEventListener("scroll", savePosition, {
      passive: true,
    });
  }

  function cancelRestoration() {
    restoreTimers.forEach(window.clearTimeout);
    restoreTimers = [];
    isRestoring = false;
  }

  function restorePosition(route, staleContainer) {
    const saved = readSaved(route);
    if (saved === null) return;

    cancelRestoration();
    isRestoring = true;

    for (const delay of restoreDelays) {
      restoreTimers.push(
        window.setTimeout(() => {
          if (routeKey(window.location.href) !== route) {
            cancelRestoration();
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

          if (delay === restoreDelays.at(-1)) {
            restoreTimers = [];
            isRestoring = false;
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
      restorePosition(nextRoute, staleContainer);
    } else {
      // Same route, hash-only change — restore scroll from storage, just re-bind listener.
      bindContentContainer();
    }
  }

  function beforeLeavePage() {
    savePosition();
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
    window.addEventListener(eventName, cancelRestoration, {
      capture: true,
      passive: true,
    });
  }

  window.addEventListener("popstate", handleHistoryChange);
  window.addEventListener("pagehide", savePosition);

  window.addEventListener("pageshow", (event) => {
    rememberRouterState();
    bindContentContainer();

    const navigation = window.performance.getEntriesByType("navigation")[0];
    if (event.persisted || navigation?.type === "back_forward") {
      restorePosition(routeKey(window.location.href));
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
