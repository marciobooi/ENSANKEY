class Footer {
    constructor() {
      this.footer = document.createElement('footer');
      this.footer.classList.add('pt-4');
  
      const footerContainer = document.createElement('div');
      footerContainer.id = 'footer';
      footerContainer.classList.add('d-flex', 'flex-wrap', 'justify-content-end', 'align-items-center', 'fixed-bottom', 'py-1');
  
      const footerCreditsList = document.createElement('ul');
      footerCreditsList.id = 'footerCredits';
      footerCreditsList.classList.add('nav', 'justify-content-end');
  
      footerContainer.appendChild(footerCreditsList);
      this.footer.appendChild(footerContainer);
    }



/**
 * Builds the links for the footer.
 */
  
    buildLinksFooter() {
      const footerCredits = document.querySelector('#footerCredits');
      footerCredits.innerHTML = '';
  
      const linksContent = ` <li>
      <a href="https://ec.europa.eu/info/cookies_${REF.language.toLowerCase()}" target="_blank" rel="noreferrer noopener" id="footer-cookies" class="footer-decoration">
        <span>${languageNameSpace.labels["FOOTER_COOKIES"]}</span>
        <svg viewBox="0 0 13 20">
          <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
        </svg>
      </a>
    </li>
    <li>
      <a href="https://ec.europa.eu/info/privacy-policy_${REF.language.toLowerCase()}" target="_blank" rel="noreferrer noopener" id="footer-privacy" class="footer-decoration">
        <span>${languageNameSpace.labels["FOOTER_PRIVACY"]}</span>
        <svg viewBox="0 0 13 20">
          <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
        </svg>
      </a>
    </li>
    <li>
      <a href="https://ec.europa.eu/info/legal-notice_${REF.language.toLowerCase()}" target="_blank" rel="noreferrer noopener" id="footer-legal" class="footer-decoration">
        <span>${languageNameSpace.labels["FOOTER_LEGAL"]}</span>
        <svg viewBox="0 0 13 20">
          <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
        </svg>
      </a>
    </li>
    <li>
      <a href='#' id="footer-feedback" class="footer-decoration" onclick="sankeyToolsNameSpace.shareSocial(event);" onkeydown="sankeyToolsNameSpace.shareSocial(event);">
        <span class='feedback'>${ languageNameSpace.labels["FOOTER_FEEDBACK"] }</span>
        <svg viewBox="0 0 13 20">
          <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
        </svg>
      </a>
    </li>`;
  
      footerCredits.innerHTML = linksContent;
    }
  
    addToDOM(targetElement) {
      const container = document.querySelector(targetElement);
      const mainElement = document.querySelector('main');
    const parentElement = mainElement.parentNode;
    parentElement.insertBefore(this.footer, mainElement.nextSibling);

    // Call the buildLinksFooter method after inserting the footer into the DOM
    this.buildLinksFooter();
  }
}
  