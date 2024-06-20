var nsMainModal = {
	flowDialogBox: function (flowId, iMaterial, idListener, launcherId) {
		const params = {
			title: languageNameSpace.labels[flowId],
			targetId: flowId,
			modalType: "flow",
			materialId: iMaterial.toString() || "-1",
			launcherId: launcherId, //g.path.id eg - #E2_N1_MF1,
		};
		document
			.getElementById(idListener)
			.addEventListener("mouseup", this.drawFlowDialogBox(params), false);
	},

	legendDialogBox: function (flowId, iMaterial) {
		const params = {
			title: languageNameSpace.labels[flowId],
			targetId: flowId,
			modalType: "legend",
			materialId: iMaterial.toString() || "-1",
			launcherId: "legend-" + flowId.toLowerCase(),
		};
		this.drawFlowDialogBox(params);
	},

	drawFlowDialogBox: function (params) {
		// create modal
		const modal = document.getElementById("sankey-primary-modal");
		modal.innerHTML = nsSankeyModal.modalEnvelopeHtml(params);

		// add event listener
		if (REF.flowDisagg) {
			document
				.getElementById("btn-flow-highlight")
				.addEventListener("click", () => {
					this.highlightMaterial(params);
				});
		} else {
			$("#btn-flow-highlight").hide();
		}

		const notAvailableCountries = countriesNotAvailable(
			REF.year,
			dataNameSpace.ref.geos,
			true
		);

		// add event listener
		if (notAvailableCountries.length == 0) {
			document
				.getElementById("btn-flow-toggle")
				.addEventListener("click", () => {
					this.disaggregateFlow(params);
				});
		} else {
			$("#btn-flow-toggle").hide();
		}

		// add event listener
		if (REF.flowDisagg) {
			document.getElementById("btn-fuel-family").addEventListener("click", () => {
				this.selectFuelFamily(params);
			});
		} else {
			$("#btn-fuel-family").hide();
		}

		//set Button state
		this.labelFlowDisaggBtn();
		this.labelHighlightBtn(params);
		this.labelFuelFamilyBtn();

		function disableKeyboardEvents() {
			document.addEventListener("keydown", preventEvent, true);
			document.addEventListener("keypress", preventEvent, true);
			document.addEventListener("keyup", preventEvent, true);
		  }

		  // Enable keyboard events for all elements
		  function enableKeyboardEvents() {
			document.removeEventListener("keydown", preventEvent, true);
			document.removeEventListener("keypress", preventEvent, true);
			document.removeEventListener("keyup", preventEvent, true);
		  }

		  // Prevent the default behavior of keyboard events
		  function preventEvent(event) {
			event.stopPropagation();
			event.preventDefault();
		  }

		// show modal
		// const myModal = new bootstrap.Modal(modal, {
		// 	keyboard: true,
		// 	backdrop: true,
		// });

		// return focus to the button that opened the modal
		// if (params.launcherId) {
		// 	modal.addEventListener("hidden.bs.modal", () => {
		// 		// check if the button still exists
		// 		if (document.getElementById(params.launcherId)) {
		// 			document.getElementById(params.launcherId).focus();
		// 		} else {
		// 			// if the button does not exist, focus on the first button in the legend
		// 			const legendButtons =
		// 				document.getElementsByClassName("button-legend");
		// 			if (legendButtons.length > 0) {
		// 				const firstLegendButton = legendButtons[0];
		// 				const firstLegendButtonAnchor =
		// 					firstLegendButton.getElementsByTagName("a")[0];
		// 				firstLegendButtonAnchor.focus();
		// 			}
		// 		}
		// 	});
		// }

		// 		  // Disable key events on other elements when the modal is shown
		// 		  $(myModal).on("show.bs.modal", function() {
		// 			disableKeyboardEvents();
		// 		  });
		// 		  $(myModal).on("hidden.bs.modal", function() {
		// 			enableKeyboardEvents();
		// 		  });

		// const modal = document.getElementById("sankey-primary-modal");

		function showModal() {
			if (!modal.hasAttribute('open')) {
			  if (modal.showModal) {
				modal.showModal();
			  } else {
				// Fallback for browsers that do not support the dialog element
				modal.setAttribute('open', 'true');
			  }
			}
		  }
	  
		  // Function to close the modal
		  function closeModal() {
			if (modal.hasAttribute('open')) {
			  modal.close();
			}
		  }



		ECL.autoInit();

		modal.show();

		const closeButton = modal.querySelector('.ecl-modal__close');
		const closeButtonMenu = modal.querySelector('.modalCloseBtn');

		closeButton.addEventListener('click', closeModal);
		closeButtonMenu.addEventListener('click', closeModal);

		var tablists = document.querySelectorAll('[role=tablist].automatic');
		for (var i = 0; i < tablists.length; i++) {
		  new TabsAutomatic(tablists[i]);
		}
	},

	disaggregateFlow: function (params) {
		nsSankeyModal.closeModal();

		const toolbarBtn = document.getElementById("tb-flow-disagg-btn");
		const bsButton = new bootstrap.Button(toolbarBtn);
		bsButton.toggle();

		REF.flowDisagg =
			toolbarBtn.getAttribute("aria-pressed") === "true" ? true : false;
		REF.highlight = "_";

		// const tooltipText = REF.flowDisagg ? "MENU_FLOW_T" : "MENU_FLOW_D";
		// $('.tooltip-inner').html(languageNameSpace.labels[tooltipText])
		// $(e.trigger).tooltip('update')

		if (REF.flowDisagg) {
			REF.material = params.targetId;
		} else {
			for (var material in flowMap) {
				if (flowMap[material].IndexOf(params.targetId) >= 0) {
					REF.material = material;
					break;
				}
			}
		}

		if (timelineNameSpace.isAutoplayLoaded) {
			timelineNameSpace.resetAutoplayTimeline();
		}

		sankeyNameSpace.drawDiagram();
	},

	selectFuelFamily: function (params) {
		if (dataNameSpace.isFuelFamilySelected) {
			REF.fuels = "TOTAL";
			dataNameSpace.isFuelFamilySelected = false;
		} else {
			REF.fuels = params.targetId;
			dataNameSpace.isFuelFamilySelected = true;
		}
		REF.highlight = "_";
		if (timelineNameSpace.isAutoplayLoaded) {
			timelineNameSpace.resetAutoplayTimeline();
		}

		sankeyNameSpace.drawDiagram();

		// close the modal
		nsSankeyModal.closeModal();
	},

	// highlight material on click
	highlightMaterial: function (params) {
		// Toggles the highlight state of a material ID in the REF.highlight string.
		REF.highlight = REF.highlight.contains(params.materialId)
			? REF.highlight.replace("_" + params.materialId + "_", "_")
			: (REF.highlight += params.materialId + "_");
		// if the timeline is loaded, reset it
		if (timelineNameSpace.isAutoplayLoaded)
			timelineNameSpace.resetAutoplayTimeline();
		// data is not loaded
		dataNameSpace.dataLoaded = false;
		// draw the diagram
		sankeyNameSpace.drawDiagram();

		// close the modal
		nsSankeyModal.closeModal();
	},

	labelFlowDisaggBtn: function () {
		var btnTitle = languageNameSpace.labels["SHOW_FLOWS_DETAILS"];
		if (REF.flowDisagg && aggregateFuels.includes(REF.fuels)) {
			btnTitle = languageNameSpace.labels["HIDE_FLOWS_DETAILS"];
		}
		var span = document.createElement("span");
		span.innerHTML = btnTitle;
		$("#btn-flow-toggle").append(span);
	},

	labelHighlightBtn: function (params) {
		var btnTitle = languageNameSpace.labels["HIGHLIGHT_FLOW"];
		if (REF.highlight !== "_" && REF.highlight.contains(params.materialId)) {
			btnTitle = languageNameSpace.labels["NO_HIGHLIGHT"];
		}
		var span = document.createElement("span");
		span.innerHTML = btnTitle;
		$("#btn-flow-highlight").append(span);
	},

	labelFuelFamilyBtn: function () {
		var btnTitle = languageNameSpace.labels["INTO_FUEL_FAMILY"];
		if (dataNameSpace.isFuelFamilySelected) {
			btnTitle = languageNameSpace.labels["BACK_ALL_FUELS"];
		}
		var span = document.createElement("span");
		span.innerHTML = btnTitle;
		$("#btn-fuel-family").append(span);
	},
};

const nsSankeyModal = {
	closeModal: function () {
		// marcio
		const modal = document.getElementById("sankey-primary-modal");
		if (modal.hasAttribute('open')) {
			modal.close();
		  }
	},

	modalEnvelopeHtml: function (params) {


       return /*html*/ `<div class="ecl-modal__container ecl-container">
          <div class="ecl-modal__content">
            <header class="ecl-modal__header">
              <div class="ecl-modal__header-content" id="modal-example-header">${params.title}</div>
              <button class="ecl-button ecl-button--tertiary ecl-modal__close ecl-button--icon-only" type="button" data-ecl-modal-close>
                <span class="ecl-button__container">
				<span class="ecl-button__label" data-ecl-label="true">Close</span>
                <svg class="ecl-icon ecl-icon--m ecl-button__icon small-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                </svg>
                </span>
              </button>
            </header>      
			  ${this.modalContentHtml(params)}             
          </div>
        </div>`
	},

	modalContentHtml: function (params) {
		const obj = excelInfoData[0].find((o) => o.CODE === params.targetId) || {
			CREDIT: "",
			PICTURE: 1,
			EN: "",
			DE: "",
			FR: "",
		}; // FIXME: remove dummy data
		creditsEl = document.createElement("p");

		if (obj.CREDIT) {
			creditsEl.classList.add("text-end", "my-0");
			creditsEl.innerHTML = `<em> Source: ${obj["CREDIT"]} </em>`;
		} else {
			creditsEl.classList.add("text-end", "my-3");
		}

		const content = `<div class="ecl-modal__body-scroll">
  <div class="ecl-container h-100">
    <div class="ecl-row h-100">
      <div class="ecl-col-9 bd">
        <div class="">
          <div class="">
            <picture class="ecl-picture ecl-card__picture" data-ecl-picture-link>
              <img class="ecl-card__image" src="img/fuel-pics/${obj.PICTURE}.jpg" alt="card image" />
            </picture>
            <div id="dialog-picture-credit" style="font-size: .7rem">${creditsEl.outerHTML}</div>
          </div>
    
          <!-- nav tabs -->
          <nav class="navTabsMenu">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
                type="button" role="tab" aria-controls="nav-home" aria-selected="true">Description</button>
              <button class="nav-link" id="nav-meta-tab" data-bs-toggle="tab" data-bs-target="#nav-meta" type="button"
                role="tab" aria-controls="nav-meta" aria-selected="false">
                <span class="fa-stack fa-1x" aria-hidden="true">
                  <i class="far fa-file fa-stack-2x"></i>
                  <strong class="fa-stack-1x icon-meta-text">M</strong>
                </span>
              </button>
              <button class="nav-link" id="nav-dataset-tab" data-bs-toggle="tab" data-bs-target="#nav-dataset" type="button" role="tab" aria-controls="nav-dataset" aria-selected="false">
                <i class="fas fa-database fa-2x"></i>
              </button>
            </div>
          </nav>
        </div>          
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-label="Description">
              ${obj[REF.language]}
            </div>
            <div class="tab-pane fade" id="nav-meta" role="tabpanel" aria-labelledby="nav-meta-title">
              <p class="card-title text-start" id="nav-meta-title">${languageNameSpace.labels["METADATA"]}</p>
              <div class="d-grid gap-2 col-10 me-auto">${this.externalLinksBtn("metadata")}</div>
            </div>
            <div class="tab-pane fade" id="nav-dataset" role="tabpanel" aria-labelledby="nav-dataset-title">
              <p class="card-title text-start" id="nav-dataset-title">${languageNameSpace.labels["SANKEY_DATASET"]}</p>
              <div class="d-grid gap-2 col-10 me-auto">${this.externalLinksBtn("dataset")}</div>
            </div>
          </div>       
      </div>

      <div class="ecl-col-3">
        <div class="" id="optionsBtnSection">
          <nav class="nav flex-column" id="node-modal-bg">${this.modalToolbarHtml(params.modalType)}</nav>         
          <button type="button" class="ecl-button ecl-button--primary modalCloseBtn w-100" aria-label="Close">${languageNameSpace.labels["BTN_CLOSE"]}</button>        
        </div>
      </div>

    </div>
  </div> 
</div>`;

		return content;
	},

	externalLinksBtn: function (subject) {
		const sheetId = 3,
			dictionary = excelInfoData[sheetId];

		const btnHtml = dictionary
			.filter((o) => o.LANGUAGE === REF.language && o.SUBJECT === subject)
			.reduce((acc, cur) => {
				acc += `<a href="${cur.URL}" target="_blank" rel="noreferrer noopener"
				class="ecl-button ecl-button--secondary modalBtn">${cur.TITLE}</a>`;
				return acc;
			}, "");

		return btnHtml;
	},

	modalToolbarHtml: function (modalType) {
		return modalType === "node" ? this.nodeToolbarHtml() : this.flowToolbarHtml();
	},

	flowToolbarHtml: function () {
		return `
		<ul class="nav flex-column">
			<li class="nav-item">
				<button class="ecl-button nav-link" id="btn-flow-toggle">
					<i class="fas fa-stream"></i>
				</button>
			</li>
			<li class="nav-item">
				<button class="ecl-button nav-link" id="btn-flow-highlight">
					<i class="fas fa-highlighter"></i>
				</button>
			</li>
			<li class="nav-item">
				<button class="ecl-button nav-link" id="btn-fuel-family">
					<i class="fas fa-expand-arrows-alt"></i>
				</button>
			</li>
		</ul>`;
	},

	nodeToolbarHtml: function () {
		return `
      <button class="ecl-button nav-link" id="btn-node-toggle">
        <i class="fas fa-project-diagram fa-1x"></i>
			</button>
      <button class="ecl-button nav-link" id="time-chart">
        <i class="fas fa-chart-line fa-1x"></i>
        <span>${languageNameSpace.labels["TIME_GRAPHS"]}</span>
      </button>
      <button class="ecl-button nav-link" id="pie-chart">
        <i class="fas fa-chart-pie fa-1x"></i>
        <span>${languageNameSpace.labels["PIE_CHARTS"]}</span>
      </button>
      <button class="ecl-button nav-link" id="bar-chart">
        <i class="fas fa-chart-bar fa-1x"></i>
        <span>${languageNameSpace.labels["BAR_CHARTS"]}</span>
      </button>`;
	},
};
