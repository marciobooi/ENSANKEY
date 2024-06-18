var messageboxNameSpace = {
	/**
	 * @param {Object} p
	 * @param {string} p.title
	 * @param {string} p.body
	 * @param {boolean} p.footer
	 * @param {string} p.ssKey
	 * @param {boolean} p.checkbox
	 */
	messageModalBs: function (p) {
		const modalWrapper = document.createElement("div");
		const modalHeader = p.title ? mkHeader() : '';
		const modalContent = mkContent();
		const modalBody = mkBody();
		const modalFooter = p.footer ? mkFooter() : '';

		modalHeader ? modalContent.appendChild(modalHeader) : '';
		modalContent.appendChild(modalBody);
		modalFooter ? modalContent.appendChild(modalFooter) : '';
		modalWrapper.appendChild(modalContent);

		const modal = mkPlaceholder();
		document.getElementById("page").prepend(modal);

    // create event listeners
		modalListeners();

		// Create the modal
		const messageModal = new bootstrap.Modal(modal, {
			keyboard: true,
			backdrop: true,
		});

		// Show the modal
		messageModal.show();


    /**
     * functions
     * */
		function mkPlaceholder() {
			const modal = document.createElement("div");
			modal.classList.add("modal", "fade");
			modal.setAttribute("id", "sankey-secondary-modal");
			modal.setAttribute("tabindex", "-1");
			modal.setAttribute("aria-labelledby", "sankey-secondary-modal-label");
			modal.setAttribute("aria-hidden", "true");

			modal.appendChild(modalWrapper);
			return modal;
		}

		function mkHeader() {
			const modalHeader = document.createElement("div");
			modalHeader.classList.add("modal-header", "py-2");
			const modalTitle = document.createElement("h5");
			modalTitle.classList.add("modal-title");
			modalTitle.textContent = p.title;
			modalHeader.appendChild(modalTitle);
			const closeButton = document.createElement("button");
			closeButton.classList.add("btn-close", "btn-close-white");
			closeButton.setAttribute("data-bs-dismiss", "modal");
			closeButton.setAttribute("aria-label", "Close");
			modalHeader.appendChild(closeButton);
			return modalHeader;
		}

		function mkContent() {
			const modalContent = document.createElement("div");
			modalWrapper.classList.add("modal-dialog", "modal-dialog-centered");
			modalContent.classList.add("modal-content");
			return modalContent;
		}

		function mkBody() {
			const modalBody = document.createElement("div");
			modalBody.classList.add("modal-body");
			modalBody.innerHTML = p.body;
			// const closeButton = document.createElement("button");
			// closeButton.classList.add("btn-close");
			// closeButton.setAttribute("data-bs-dismiss", "modal");
			// closeButton.setAttribute("aria-label", "Close");
			// modalBody.appendChild(closeButton);
			return modalBody;
		}

		function mkFooter() {
			const modalFooter = document.createElement("div"),
				okButton = document.createElement("button");
			modalFooter.classList.add(
				"modal-footer",
				"d-flex",
				"py-2",
			);
			if (p.checkbox) {
				modalFooter.classList.add("justify-content-evenly");
				const checkbox = getCheckbox();
				modalFooter.appendChild(checkbox);
			}
			okButton.classList.add("btn", "btn-sm", "btn-secondary", "modalCloseBtn");
			okButton.setAttribute("data-bs-dismiss", "modal");
			okButton.textContent = languageNameSpace.labels.BTN_OK;
			modalFooter.appendChild(okButton);
			return modalFooter;
		}

		function getCheckbox() {
			const checkbox = document.createElement("div");
			checkbox.classList.add("form-check");
			const checkboxInput = document.createElement("input");
			checkboxInput.classList.add("form-check-input");
			checkboxInput.setAttribute("type", "checkbox");
			checkboxInput.setAttribute("value", "");
			checkboxInput.setAttribute("id", p.ssKey);
			checkbox.appendChild(checkboxInput);
			const checkboxLabel = document.createElement("label");
			checkboxLabel.classList.add("form-check-label");
			checkboxLabel.setAttribute("for", p.ssKey);
			checkboxLabel.textContent =
				languageNameSpace.labels["DISCLAIMER_DONT_SHOW_AGAIN"];
			checkbox.appendChild(checkboxLabel);
			return checkbox;
		}
    
    function modalListeners() {
      modal.addEventListener("hidden.bs.modal", function () {
        const setItemSessionStorage = p.checkbox
          ? document.getElementById(p.ssKey).checked
          : false;
        if (setItemSessionStorage)
          sessionStorage.setItem(p.ssKey, "true");

        var m = bootstrap.Modal.getInstance(modal);
        m.dispose();
        modal.remove();
      });
    }
	},

	// generic message box
	messageBox: function (boxTitle, boxMessage, boxWidth) {
		if (typeof boxWidth === "undefined") boxWidth = 400;
		var messageModal = new jBox("Modal", {
			id: "browser-message-modal-info",
			addClass: "glossary",
			title: boxTitle,
			content: '<div class="content">' + boxMessage + "</div>",
			repositionOnOpen: true,
			repositionOnContent: true,
			preventDefault: true,
			closeOnClick: "body",
			closeOnEsc: true,
			closeButton: "box",
			constructOnInit: true,
			draggable: "title",
			width: boxWidth,
			height: "auto",
			overlay: false,
			blockScroll: false,
			// Once jBox is closed, destroy it
			onCloseComplete: function () {
				this.destroy();
			},
		});
		messageModal.open();
	},

	warningBox: function (warnNodes, shareSD) {
		var content = "<b>" + languageNameSpace.labels["MSG_23"] + "</b>: ";
		if (typeof shareSD !== "undefined") {
			if (warnNodes.length !== shareSD.length)
				fatal(
					"fillWarningModalContent: 'warnNodes' and 'shareSD' of unequal length! STOP."
				);
			content += languageNameSpace.labels["MSG_06"] + "!</br>";
			$.each(warnNodes, function (iNode, node) {
				content +=
					"- " +
					languageNameSpace.labels["MSG_07"] +
					" " +
					printTwoDecimal(100 * shareSD[iNode]) +
					" " +
					languageNameSpace.labels["MSG_08"] +
					" " +
					languageNameSpace.labels[node] +
					"</br>";
			});
		} else {
			content += languageNameSpace.labels["MSG_09"] + ":</br>";
			$.each(warnNodes, function (iNode, node) {
				content +=
					"- " +
					node[0] +
					" (" +
					printTwoDecimal(100 * node[1]) +
					" " +
					languageNameSpace.labels["MSG_10"] +
					")</br>";
			});
			content +=
				"</br>" +
				languageNameSpace.labels["MSG_11"] +
				' <a href="https://appsso.eurostat.ec.europa.eu/nui/show.do?query=BOOKMARK_DS-465368_QID_1D57FD4D_UID_-3F171EB0&layout=TIME,C,X,0;GEO,L,Y,0;UNIT,L,Z,0;PRODUCT,L,Z,1;INDIC_ENV,L,Z,2;INDICATORS,C,Z,3;&zSelection=DS-465368UNIT,MIOT_T;DS-465368PRODUCT,TOTAL;DS-465368INDIC_NRG,B_100900;DS-465368INDICATORS,OBS_FLAG;&rankName1=TIME_1_0_0_0&rankName2=UNIT_1_2_-1_2&rankName3=GEO_1_2_0_1&rankName4=INDICATORS_1_2_-1_2&rankName5=PRODUCT_1_2_-1_2&rankName6=INDIC-NRG_1_2_-1_2&sortC=ASC_-1_FIRST&rStp=&cStp=&rDCh=&cDCh=&rDM=true&cDM=true&footnes=false&empty=false&wai=false&time_mode=ROLLING&time_most_recent=true&lang=EN&cfo=%23%23%23%2C%23%23%23.%23%23%23" target="_blank">' +
				languageNameSpace.labels["MSG_12"] +
				"</a>. " +
				languageNameSpace.labels["MSG_13"] +
				' <a title="opens mailing program to send a message to material flows accounts team at the Eurostat" href="mailto:ESTAT-CIRCULAR-ECONOMY@ec.europa.eu?subject=SANKEY%20BUG%20REPORT&body=' +
				encodeURIComponent(window.location.href) +
				'">' +
				languageNameSpace.labels["MSG_14"] +
				"</a>.";
		}

		messageboxNameSpace.messageBox(languageNameSpace.labels["MSG_24"], content);
	},
};
