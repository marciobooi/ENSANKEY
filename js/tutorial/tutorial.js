/**
 * tutorial.js
 * Rewritten using Driver.js v1.x to drive the interactive walkthrough of the Sankey tool.
 * Maintains the same style, translations, and logic as the original intro.js setup.
 */

let driverObj = null;
let isOpen = false;

function tutorial() {
  const confTutorial = excelInfoData[4];
  const lang = REF.language || "EN";

  // Map the steps dynamically from the excelInfoData config
  const steps = confTutorial.map((step) => ({
    element: step.ELEMENT,
    popover: {
      title: step[lang + "-title"] || "",
      description: step[lang + "-intro"] || "",
      side: "auto"
    }
  }));

  // Initialize Driver.js Obj
  driverObj = window.driver.js.driver({
    showProgress: false,
    animate: true,
    allowClose: true,
    overlayColor: "#000",
    overlayOpacity: 0.4,
    steps: steps,
    popoverClass: "customTooltip",
    onPopoverRender: (popover, { config, state }) => {
      const activeIndex = driverObj.getActiveIndex();

      // Configure close button styles and attributes
      popover.closeButton.setAttribute("alt", "Close");
      popover.closeButton.setAttribute("id", "tutorialClose");
      popover.closeButton.setAttribute("tabindex", "0");
      popover.closeButton.className = "ecl-button ecl-button--primary driver-popover-close-btn";
      popover.closeButton.style.backgroundColor = "#264b9e";
      popover.closeButton.style.color = "white";

      // Configure previous button (serves as close button on first step)
      if (activeIndex === 0) {
        popover.previousButton.innerHTML = languageNameSpace.labels['BTN_CLOSE'] || "Close";
        popover.previousButton.classList.add("close");
      } else {
        popover.previousButton.innerHTML = languageNameSpace.labels['tutBACK'] || "Back";
        popover.previousButton.classList.remove("close");
      }

      // Configure next button
      if (activeIndex === steps.length - 1) {
        popover.nextButton.innerHTML = languageNameSpace.labels['tutFINISH'] || "Finish";
      } else {
        popover.nextButton.innerHTML = languageNameSpace.labels['tutNEXT'] || "Next";
      }
    },
    onDestroyStarted: (element, step, { config, state }) => {
      driverObj.destroy();
      const button = document.getElementById('tb-tutorial-btn');
      if (button) button.focus();
      isOpen = false;
    }
  });

  driverObj.drive();
  isOpen = true;
}

function closeTutorial() {
  if (driverObj) {
    driverObj.destroy();
  }
  isOpen = false;
}

function closeProcess() {
  closeTutorial();
  const button = document.getElementById('tb-tutorial-btn');
  if (button) button.focus();
}

// Keep a stub function to prevent breaking any callers in create-toolbar.js
function traptutorialfocus() {
  // Driver.js handles keyboard focus trapping natively.
}

// Escape key listener
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && isOpen) {
    closeProcess();
  }
});