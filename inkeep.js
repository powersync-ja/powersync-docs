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
      "How do I get started?",
      "What backend databases are supported?",
      "What SDKs are available on the client-side?"
    ]
  }
};

// The Mintlify search triggers, which we'll reuse to trigger the Inkeep modal
// const searchButtonContainerIds = [
//   "search-bar-entry",
//   "search-bar-entry-mobile",
// ];

// Clone and replace, needed to remove existing event listeners
// const clonedSearchButtonContainers = searchButtonContainerIds.map((id) => {
//   const originalElement = document.getElementById(id);
//   const clonedElement = originalElement.cloneNode(true);
//   originalElement.parentNode.replaceChild(clonedElement, originalElement);

//   return clonedElement;
// });

// Load the Inkeep component library
const inkeepScript = document.createElement("script");
inkeepScript.type = "module";
inkeepScript.src = "https://unpkg.com/@inkeep/cxkit-js@^0.5.36/dist/embed.js";
document.body.appendChild(inkeepScript);

// Once the Inkeep library is loaded, instantiate the UI components
inkeepScript.addEventListener("load", function () {
  // Customization settings

  // Instantiate the 'Ask AI' floating action button
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
    aiChatSettings: {
      ...inkeepSettings.aiChatSettings,
    }
  });

  // Create and add the 'Ask AI' button next to the search bar
  // function addAskAIButton() {
  //   // Function to create the Ask AI button
  //   function createAskAIButton() {
  //     const button = document.createElement("button");
  //     button.id = "ask-ai-button";
  //     button.innerHTML = "Ask AI";
  //     button.className = "ask-ai-button";
      
  //     // Style the button to match the "Get Started" button
  //     button.style.backgroundColor = inkeepSettings.baseSettings.primaryBrandColor;
  //     button.style.color = "white";
  //     button.style.border = "none";
  //     button.style.borderRadius = "12px"; // Pill-shaped to match the search bar in the screenshot
  //     button.style.padding = "8px 8px"; // Slightly wider padding
  //     button.style.marginLeft = "10px";
  //     button.style.cursor = "pointer";
  //     button.style.fontWeight = "500";
  //     button.style.fontSize = "14px";
  //     button.style.display = "flex";
  //     button.style.alignItems = "center";
  //     button.style.justifyContent = "center"; // Center text horizontally
  //     button.style.minWidth = "100px"; // Ensure the button has a minimum width
  //     button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"; // Subtle shadow for depth
  //     button.style.transition = "all 0.2s ease"; // Smooth transition for hover effects
      
  //     // Add a subtle hover effect
  //     button.onmouseover = function() {
  //       this.style.backgroundColor = "#3a78f2"; // Slightly darker shade when hovering
  //       this.style.transform = "translateY(-1px)"; // Slight lift effect
  //       this.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)"; // Enhanced shadow on hover
  //     };
  //     button.onmouseout = function() {
  //       this.style.backgroundColor = inkeepSettings.baseSettings.primaryBrandColor;
  //       this.style.transform = "translateY(0)"; // Reset position
  //       this.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"; // Reset shadow
  //     };
      
  //     return button;
  //   }

  //   // Add the button only to the main search bar entry
  //   const searchContainer = document.getElementById("search-bar-entry");
  //   if (searchContainer) {
  //     const buttonContainer = document.createElement("div");
  //     buttonContainer.id = "ask-ai-button-container";
  //     buttonContainer.style.display = "flex";
  //     buttonContainer.style.alignItems = "center";
      
  //     const askAIButton = createAskAIButton();
      
  //     // Add click event to the button
  //     askAIButton.addEventListener("click", () => {
  //       modalChat.update({ modalSettings: { isOpen: true } });
  //     });
      
  //     // Insert the button after the search container
  //     buttonContainer.appendChild(askAIButton);
      
  //     // Insert the button container after the search container
  //     searchContainer.parentNode.insertBefore(buttonContainer, searchContainer.nextSibling);
      
  //     // Add CSS to hide the button on mobile
  //     const style = document.createElement('style');
  //     style.textContent = `
  //       @media (max-width: 768px) {
  //         #ask-ai-button-container {
  //           display: none !important;
  //         }
  //       }
  //     `;
  //     document.head.appendChild(style);
  //   }
  // }

  // Instantiate the 'Ask AI' modal chat
  const modalChat = Inkeep.ModalChat({
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
    aiChatSettings: {
      ...inkeepSettings.aiChatSettings,
    },
    modalSettings: {
      onOpenChange: handleOpenChange,
    },
  });

  function handleOpenChange(newOpen) {
    modalChat.update({ modalSettings: { isOpen: newOpen } });
  }

  // Add the Ask AI button once the DOM is fully loaded
  if (document.readyState === "complete") {
    addAskAIButton();
  } else {
    window.addEventListener("load", addAskAIButton);
  }

  // The existing chat-button listener (if the element exists)
  const existingChatButton = document.querySelector("#chat-button");
  if (existingChatButton) {
    existingChatButton.addEventListener("click", () => {
      modalChat.update({ modalSettings: { isOpen: true } });
    });
  }

  // Access chat methods
  modalChat.clearChat();

  // Instantiate the search bar modal
  // const inkeepSearchModal = Inkeep.ModalSearchAndChat({
  //   baseSettings: {
  //     ...inkeepSettings.baseSettings,
  //     colorMode: {
  //       sync: {
  //         target: document.documentElement,
  //         attributes: ["class"],
  //         isDarkMode: (attributes) => !!attributes.class?.includes("dark"),
  //       },
  //     },
  //   },
  //   modalSettings: {
  //     onOpenChange: handleOpenChange,
  //   },
  // });

  // function handleOpenChange(newOpen) {
  //   inkeepSearchModal.update({ modalSettings: { isOpen: newOpen } });
  // }

  // When the Mintlify search bar elements are clicked, open the Inkeep search modal
  // clonedSearchButtonContainers.forEach((trigger) => {
  //   trigger.addEventListener("click", function () {
  //     inkeepSearchModal.update({
  //       modalSettings: { isOpen: true },
  //     });
  //   });
  // });

  // Open the Inkeep Modal with cmd+k
  // window.addEventListener(
  //   "keydown",
  //   (event) => {
  //     if (
  //       (event.metaKey || event.ctrlKey) &&
  //       (event.key === "k" || event.key === "K")
  //     ) {
  //       event.stopPropagation();
  //       inkeepSearchModal.update({
  //         modalSettings: { isOpen: true },
  //       });
  //       return false;
  //     }
  //   },
  //   true
  // );
});