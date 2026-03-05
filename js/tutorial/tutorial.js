let buttonTimer;
let currentStep;
let isOpen = false



function tutorial() {
	// closeTutorial();

	const introProfile = introJs();

	const confTutorial = excelInfoData[4];
	const lang = REF.language || "EN";
	const steps = confTutorial.map((step) => ({
		element: step.ELEMENT,
		title: step[lang + "-title"],
		intro: step[lang + "-intro"],
		position: "auto",
	}));

	introProfile.setOptions({
		showProgress: false,
		scrollToElement: false,
		showBullets: false,
		autoPosition:false,
		tooltipClass: "customTooltip",
		steps: steps,
	});

	introProfile.onexit(function () { window.scrollTo(0, 0) });

	introProfile.start();

	isOpen = true

	// Observe tooltip container to ensure any created tooltip has an accessible name
	try {
		const refLayer = document.querySelector('body > div.introjs-tooltipReferenceLayer');
		function ensureTooltipName(tooltipEl) {
			if (!tooltipEl) return;
			try {
				const titleEl = tooltipEl.querySelector('.introjs-tooltip-title');
				if (titleEl) {
					if (!titleEl.id) titleEl.id = 'introjs-tooltip-title-' + (currentStep || 0);
					tooltipEl.setAttribute('aria-labelledby', titleEl.id);
				} else {
					tooltipEl.setAttribute('aria-label', languageNameSpace.labels['MENU_TUTORIAL'] || 'Tutorial');
				}
			} catch (e) {}
		}

		if (refLayer) {
			// handle any existing tooltip
			const existing = refLayer.querySelector('.introjs-tooltip.customTooltip');
			ensureTooltipName(existing);

			const observer = new MutationObserver((mutations) => {
				mutations.forEach((m) => {
					m.addedNodes.forEach((node) => {
						if (node.nodeType !== 1) return;
						if (node.classList && node.classList.contains('introjs-tooltip')) {
							ensureTooltipName(node);
						} else {
							const found = node.querySelector && node.querySelector('.introjs-tooltip.customTooltip');
							if (found) ensureTooltipName(found);
						}
					});
				});
			});
			observer.observe(refLayer, { childList: true, subtree: true });
		}
	} catch (e) {
		// ignore
	}

	introProfile.onchange(function () {

		currentStep = this._currentStep

		// Ensure the tooltip (role="dialog") has an accessible name
		try {
			const tooltipEl = document.querySelector('body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltip.customTooltip');
			if (tooltipEl) {
				const titleEl = tooltipEl.querySelector('.introjs-tooltip-title');
				if (titleEl) {
					if (!titleEl.id) titleEl.id = 'introjs-tooltip-title-' + currentStep;
					tooltipEl.setAttribute('aria-labelledby', titleEl.id);
				} else {
					tooltipEl.setAttribute('aria-label', languageNameSpace.labels['MENU_TUTORIAL'] || 'Tutorial');
				}
			}
		} catch (e) {
			// ignore
		}

		if (currentStep === 0) {
			document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").innerHTML = languageNameSpace.labels['BTN_CLOSE']
			setTimeout(() => {
				$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton.introjs-disabled").addClass( "close" )			
			}, 100);
		} else {
			document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").innerHTML = languageNameSpace.labels['tutBACK']
			$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").removeClass( "close" )

			$(".introjs-tooltip.customTooltip.introjs-auto").css({
				"left": "50% !important",
				"top": "50%",
				"margin-left": "auto",
				"margin-top": "auto",
				"transform": "translate(-50%,-50%)"
			})
		}
	
	});

	$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltip-header > a").attr({
		"alt": "Close",
		"id": "tutorialClose",
		"tabindex": "0",
		"href": "javascript:",
		"class": "ecl-button ecl-button--primary",
		"style": "background-color:#264b9e"
	});

	document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").innerHTML = languageNameSpace.labels['BTN_CLOSE']
	$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").addClass( "close " )
}

function closeTutorial() {
	buttonTimer = setTimeout("introJs().exit()", 4000);
	isOpen = false
}

btn = document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-nextbutton");

$(document).on("click", btn, function () {
	clearTimeout(buttonTimer);
});


function closeProcess(params) {
	event.preventDefault();
	introJs().exit()
	buttonTimer = setTimeout("introJs().exit()", 4000);
	clearTimeout(buttonTimer);
	document.querySelector("#tb-tutorial-btn");
	const button = document.getElementById('tb-tutorial-btn');
	button.focus();
	isOpen = false
}


$(document).on("click keydown", "#tutorialClose", function(event) {
	const isClickEvent = event.type === "click";
	const isKeyEvent = event.type === "keydown" && (event.key === "Escape" || event.key === "Enter" || event.keyCode === 13);
	if (isClickEvent || isKeyEvent) {
		closeProcess();
	}
  });


$(document).on("click keydown", ".close", function(event) {
	const isClickEvent = event.type === "click";
	const isKeyEvent = event.type === "keydown" && (event.key === "Escape" || event.key === "Enter" || event.keyCode === 13);
	if (isClickEvent || isKeyEvent) {
		closeProcess();
	}
});

  document.addEventListener('keydown', function(event) {
	if (event.key === 'Escape') {
		if(isOpen){
			closeProcess()
		} 
	}
  });

  function traptutorialfocus() {	

	const focusableElements = '.introjs-tooltip.customTooltip.introjs-floating a[role="button"][tabindex="0"]:not([tabindex="-1"])';
	const element = document.querySelector('.introjs-tooltip.customTooltip.introjs-floating');

	log(element)
  
	if (element) {
	  const focusableContent = element.querySelectorAll(focusableElements);
	  const firstFocusableElement = focusableContent[0];
	  const lastFocusableElement = focusableContent[focusableContent.length - 1];
  
	  document.addEventListener('keydown', function (e) {
		const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
  
		if (!isTabPressed) {
		  return;
		}
  
		if (e.shiftKey) {
		  if (document.activeElement === firstFocusableElement) {
			lastFocusableElement.focus();
			e.preventDefault();
		  }
		} else {
		  if (document.activeElement === lastFocusableElement) {
			firstFocusableElement.focus();
			e.preventDefault();
		  }
		}
	  });
  
	  // Set initial focus on the first focusable element
	  if (focusableContent.length > 0) {
		firstFocusableElement.focus();
	  }
	}
  };
  