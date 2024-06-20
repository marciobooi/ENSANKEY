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
    const modalTemplate = createModalTemplate({
      id: 'browser-message-modal-info',
      title: p.title,
      body: p.body,
      footer: p.footer,
      checkbox: p.checkbox,
      ssKey: p.ssKey
    });

    // Insert the modal into the DOM
    document.getElementById("page").insertAdjacentHTML('afterbegin', modalTemplate);

    // Initialize and show the modal
    ECL.autoInit();
    const modal = document.getElementById('browser-message-modal-info');
    modal.show();

    // Add event listener to handle modal close
    modal.addEventListener("close", function () {
      const setItemSessionStorage = p.checkbox ? document.getElementById(p.ssKey).checked : false;
      if (setItemSessionStorage) {
        sessionStorage.setItem(p.ssKey, "true");
      }
      modal.remove();
    });
  },

  // Generic message box
  messageBox: function (boxTitle, boxMessage) {
    const modalTemplate = createModalTemplate({
      id: 'browser-message-modal-info',
      title: boxTitle,
      body: boxMessage,
      footer: true,
      checkbox: false,
      ssKey: ''
    });

    // Insert the modal into the DOM
    document.getElementById("page").insertAdjacentHTML('afterbegin', modalTemplate);

    // Initialize and show the modal
    ECL.autoInit();
    const modal = document.getElementById('browser-message-modal-info');
    modal.show();

    // Add event listener to handle modal close
    modal.addEventListener("close", function () {
      modal.remove();
    });
  },

  warningBox: function (warnNodes, shareSD) {
	if (typeof shareSD !== "undefined" && warnNodes.length !== shareSD.length) {
	  fatal("fillWarningModalContent: 'warnNodes' and 'shareSD' of unequal length! STOP.");
	}
  
	let content = `<b>${languageNameSpace.labels["MSG_23"]}</b>: `;
	
	if (typeof shareSD !== "undefined") {
	  content += `${languageNameSpace.labels["MSG_06"]}!<br>`;
	  warnNodes.forEach((node, iNode) => {
		content += `- ${languageNameSpace.labels["MSG_07"]} ${printTwoDecimal(100 * shareSD[iNode])} ${languageNameSpace.labels["MSG_08"]} ${languageNameSpace.labels[node]}<br>`;
	  });
	} else {
	  content += `${languageNameSpace.labels["MSG_09"]}:<br>`;
	  warnNodes.forEach((node) => {
		content += `- ${node[0]} (${printTwoDecimal(100 * node[1])} ${languageNameSpace.labels["MSG_10"]})<br>`;
	  });
	  content += `<br>${languageNameSpace.labels["MSG_11"]} 
		<a href="https://appsso.eurostat.ec.europa.eu/nui/show.do?query=BOOKMARK_DS-465368_QID_1D57FD4D_UID_-3F171EB0&layout=TIME,C,X,0;GEO,L,Y,0;UNIT,L,Z,0;PRODUCT,L,Z,1;INDIC_ENV,L,Z,2;INDICATORS,C,Z,3;&zSelection=DS-465368UNIT,MIOT_T;DS-465368PRODUCT,TOTAL;DS-465368INDIC_NRG,B_100900;DS-465368INDICATORS,OBS_FLAG;&rankName1=TIME_1_0_0_0&rankName2=UNIT_1_2_-1_2&rankName3=GEO_1_2_0_1&rankName4=INDICATORS_1_2_-1_2&rankName5=PRODUCT_1_2_-1_2&rankName6=INDIC-NRG_1_2_-1_2&sortC=ASC_-1_FIRST&rStp=&cStp=&rDCh=&cDCh=&rDM=true&cDM=true&footnes=false&empty=false&wai=false&time_mode=ROLLING&time_most_recent=true&lang=EN&cfo=%23%23%23%2C%23%23%23.%23%23%23" target="_blank">
		${languageNameSpace.labels["MSG_12"]}</a>. 
		${languageNameSpace.labels["MSG_13"]}
		<a title="opens mailing program to send a message to material flows accounts team at the Eurostat" href="mailto:ESTAT-CIRCULAR-ECONOMY@ec.europa.eu?subject=SANKEY%20BUG%20REPORT&body=${encodeURIComponent(window.location.href)}">
		${languageNameSpace.labels["MSG_14"]}</a>.`;
	}
  
	messageboxNameSpace.messageBox(languageNameSpace.labels["MSG_24"], content);
  },
  
};

// Helper function to create modal template
function createModalTemplate({ id, title, body, footer, checkbox, ssKey }) {
  return `
    <dialog data-ecl-auto-init="Modal" data-ecl-modal-toggle="modal-toggle" id="${id}" aria-modal="true" class="ecl-modal ecl-modal--information ecl-modal--s" aria-labelledby="modal-example-header">
      <div class="ecl-modal__container ecl-container">
        <div class="ecl-modal__content">
          <header class="ecl-modal__header">
			<span class="iconContainerSvg">
				<i class="fa-solid fa-info"></i>
			</span>
            <div class="ecl-modal__header-content" id="modal-example-header">${title}</div>
            <button class="ecl-button ecl-button--tertiary ecl-modal__close ecl-button--icon-only" type="button" data-ecl-modal-close>
              <span class="ecl-button__container">
                <span class="ecl-button__label" data-ecl-label="true">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path>
                </svg>
              </span>
            </button>
          </header>
          <div class="ecl-modal__body">${body}</div>
          ${footer ? `
          <div class="ecl-modal__footer">
            ${checkbox ? `
            <div class="ecl-checkbox">
              <input class="ecl-checkbox__input" type="checkbox" id="${ssKey}">
              <label class="ecl-checkbox__label" for="${ssKey}">
                ${languageNameSpace.labels["DISCLAIMER_DONT_SHOW_AGAIN"]}
              </label>
            </div>` : ''}
            <button class="ecl-button ecl-button--primary" type="button" data-ecl-modal-close>${languageNameSpace.labels.BTN_OK}</button>
          </div>` : ''}
        </div>
      </div>
    </dialog>`;
}
