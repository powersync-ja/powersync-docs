// customize
const inkeepSettings = {
    baseSettings: {
      apiKey: "1c24ba8dde97e56465741f2e64a51389662f75793a7d0ec1", // required
      primaryBrandColor: "#4e89ff", // required -- your brand color, the color scheme is derived from this
      organizationDisplayName: "PowerSync",
      // ...optional settings
    },
    aiChatSettings: {
      // ...optional settings
      // aiAssistantAvatar: "https://mydomain.com/mylogo.svg",
      exampleQuestions: [
        "What backend databases are supported?",
        "What SDKs are available on the client-side?",
        "How do I get started?",
      ]
    },
    modalSettings: {
      isShortcutKeyEnabled: false, // disable default cmd+k behavior
      // ...optional settings
    },
  };
   
  // The Mintlify search triggers, which we'll reuse to trigger the Inkeep modal
  const searchButtonContainerIds = [
    "search-bar-entry",
    "search-bar-entry-mobile",
  ];
   
  // Clone and replace, needed to remove existing event listeners
  const clonedSearchButtonContainers = searchButtonContainerIds.map((id) => {
    const originalElement = document.getElementById(id);
    const clonedElement = originalElement.cloneNode(true);
    originalElement.parentNode.replaceChild(clonedElement, originalElement);
   
    return clonedElement;
  });
   
  // Load the Inkeep component library
  const inkeepScript = document.createElement("script");
  inkeepScript.type = "module";
  inkeepScript.src = "https://unpkg.com/@inkeep/cxkit-js@^0.5.36/dist/embed.js";
  document.body.appendChild(inkeepScript);
   
  // Once the Inkeep library is loaded, instantiate the UI components
  inkeepScript.addEventListener("load", function () {
    // Customization settings
   
    // Instantiate the 'Ask AI' button. Optional.
    Inkeep.ChatButton({
      baseSettings: {
        ...inkeepSettings.baseSettings,
        colorMode: {
          sync: {
            target: document.documentElement,
            attributes: ["class"],
            isDarkMode: (attributes) => !!attributes.class?.includes("dark"),
          },
        },
      },
    });
   
    // Instantiate the search bar modal
    const inkeepSearchModal = Inkeep.ModalSearchAndChat({
      baseSettings: {
        ...inkeepSettings.baseSettings,
        colorMode: {
          sync: {
            target: document.documentElement,
            attributes: ["class"],
            isDarkMode: (attributes) => !!attributes.class?.includes("dark"),
          },
        },
      },
      modalSettings: {
        onOpenChange: handleOpenChange,
      },
    });
   
    function handleOpenChange(newOpen) {
      inkeepSearchModal.update({ modalSettings: { isOpen: newOpen } });
    }
   
    // When the Mintlify search bar elements are clicked, open the Inkeep search modal
    clonedSearchButtonContainers.forEach((trigger) => {
      trigger.addEventListener("click", function () {
        inkeepSearchModal.update({
          modalSettings: { isOpen: true },
        });
      });
    });
   
    // Open the Inkeep Modal with cmd+k
    window.addEventListener(
      "keydown",
      (event) => {
        if (
          (event.metaKey || event.ctrlKey) &&
          (event.key === "k" || event.key === "K")
        ) {
          event.stopPropagation();
          inkeepSearchModal.update({
            modalSettings: { isOpen: true },
          });
          return false;
        }
      },
      true
    );
  });