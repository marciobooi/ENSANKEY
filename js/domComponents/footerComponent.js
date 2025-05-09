class Footer {
  constructor() {
    this.footer = document.createElement("footer");

    const footerContainer = document.createElement("div");
    footerContainer.id = "footer";
    footerContainer.classList.add("ecl-site-footer");

    const footerCreditsList = document.createElement("ul");
    footerCreditsList.id = "footerCredits";
    footerCreditsList.classList.add("ecl-site-footer__list");

    footerContainer.appendChild(footerCreditsList);
    this.footer.appendChild(footerContainer);
  }

  /**
   * Builds the links for the footer.
   */

  buildLinksFooter() {
    const footerCredits = document.querySelector("#footerCredits");
    footerCredits.innerHTML = "";

    const linksContent = /*html*/ `     
    <li class="ecl-site-footer__list-item">
    <a id="footer-privacy" href="https://ec.europa.eu/info/legal-notice_${REF.language.toLowerCase()}" title="${languageNameSpace.labels["FOOTER_LEGAL"]}" class="ecl-link ecl-link--standalone ecl-site-footer__link">
    ${languageNameSpace.labels["FOOTER_LEGAL"]}
    </a>
    </li>
    <li class="ecl-site-footer__list-item">
    <a id="footer-legal" href="https://ec.europa.eu/info/privacy-policy_${REF.language.toLowerCase()}" title="${languageNameSpace.labels["FOOTER_PRIVACY"]}" class="ecl-link ecl-link--standalone ecl-site-footer__link">
    ${languageNameSpace.labels["FOOTER_PRIVACY"]}
    </a>
    </li>
    <li class="ecl-site-footer__list-item">
      <a id="footer-cookies" href="https://ec.europa.eu/info/cookies_${REF.language.toLowerCase()}" title="${languageNameSpace.labels["FOOTER_COOKIES"]}" class="ecl-link ecl-link--standalone ecl-site-footer__link">
      ${languageNameSpace.labels["FOOTER_COOKIES"]}
      </a>
    </li>
    <li class="ecl-site-footer__list-item">
        <a id="footer-access" href="https://ec.europa.eu/eurostat/web/main/help/accessibility" title="${languageNameSpace.labels["FOOTER_ACCESSIBILITY"]}" class="ecl-link ecl-link--standalone ecl-site-footer__link">
      ${languageNameSpace.labels["FOOTER_ACCESSIBILITY"]}
      </a>
    </li>`;

    footerCredits.innerHTML = linksContent;
  }

  addToDOM(targetElement) {
    const container = document.querySelector(targetElement);
    container.appendChild(this.footer);

    // Call the buildLinksFooter method after inserting the footer into the DOM
    this.buildLinksFooter();
  }
}
