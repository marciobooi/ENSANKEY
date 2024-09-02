// const allCountries = Object.keys(countriesEB).map((key) => [key, countriesEB[key]]).sort((a, b) => a[1].localeCompare(b[1]));
// const countriesAgregates = ["EU27_2020"];

//  EU_MEMBER_COUNTRY_CODES = Object.keys(countriesEB).filter((key) => key.indexOf("EU") === -1).sort((a, b) => countriesEB[a].localeCompare(countriesEB[b]));

//  NON_MEMBER_COUNTRY_CODES = allCountries.filter(country => !EU_MEMBER_COUNTRY_CODES.includes(country) && !countriesAgregates.includes(country));


function populateCountries() {
  $('#sankeyToolbox').append('<div id="containerCountry"></div>');

  const target = document.querySelector("#containerCountry");
  const elementId = 'selectCountries';
  const labelDescription = languageNameSpace.labels["COUNTRY"];
  const textChange = languageNameSpace.labels["MENU_COUNTRY"];

  const existingSingleSelect = document.getElementById(elementId);
  if (existingSingleSelect) {    
    existingSingleSelect.parentElement.parentElement.remove();
  }

  const countriesAggregates = ["EU27_2020"];
  const EU_COUNTRY_CODES = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE"];
  const EFTA_COUNTRY_CODES = ["IS", "LI", "NO"];
  const ENLARGEMENT_COUNTRY_CODES = ["BA", "ME", "MK", "AL", "RS", "TR", "XK"];
  const OTHER_THIRD_COUNTRY_CODES = ["UA", "MD", "GE"];

  const html = /*html*/`      
    <div class="ecl-form-group" role="application">
      <div class="ecl-select__container">
        <select class="ecl-select" id="selectCountries" name="country" required="" multiple="" 
          data-ecl-auto-init="Select" 
          data-ecl-select-multiple="true"
          data-ecl-select-default="${languageNameSpace.labels["SELITEN"]}" 
          data-ecl-select-search="${languageNameSpace.labels["KEYWORD"]}" 
          data-ecl-select-no-results="${languageNameSpace.labels["NORESULTS"]}" 
          data-ecl-select-all="${languageNameSpace.labels["SELALL"]}"
          data-ecl-select-clear-all="${languageNameSpace.labels["CLEAR"]}" 
          data-ecl-select-close="${languageNameSpace.labels["CLOSE"]}">
          <optgroup label="${languageNameSpace.labels["AGGREGATE"]}">
            ${countriesAggregates.map(ctr => `<option data-geo="${ctr}" value="${ctr}" ${REF.geos.includes(ctr) ? 'selected' : ''}>${languageNameSpace.labels[ctr]}</option>`).join('')}
          </optgroup>
          <optgroup label="${languageNameSpace.labels["EUCTR"]}">
            ${EU_COUNTRY_CODES.map(ctr => `<option data-geo="${ctr}" value="${ctr}" ${REF.geos.includes(ctr) ? 'selected' : ''}>${languageNameSpace.labels[ctr]}</option>`).join('')}
          </optgroup>
          <optgroup label="${languageNameSpace.labels["EFTA"]}">
            ${EFTA_COUNTRY_CODES.map(ctr => `<option data-geo="${ctr}" value="${ctr}" ${REF.geos.includes(ctr) ? 'selected' : ''}>${languageNameSpace.labels[ctr]}</option>`).join('')}
          </optgroup>
          <optgroup label="${languageNameSpace.labels["ENLARGEMENT"]}">
            ${ENLARGEMENT_COUNTRY_CODES.map(ctr => `<option data-geo="${ctr}" value="${ctr}" ${REF.geos.includes(ctr) ? 'selected' : ''}>${languageNameSpace.labels[ctr]}</option>`).join('')}
          </optgroup>
          <optgroup label="${languageNameSpace.labels["OTHERCTR"]}">
            ${OTHER_THIRD_COUNTRY_CODES.map(ctr => `<option data-geo="${ctr}" value="${ctr}" ${REF.geos.includes(ctr) ? 'selected' : ''}>${languageNameSpace.labels[ctr]}</option>`).join('')}
          </optgroup>
        </select>
        <div class="ecl-select__icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ecl-icon ecl-icon--s ecl-button__icon ecl-select__icon-shap" focusable="false" aria-hidden="true">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
          </svg>
        </div>
      </div>
    </div>`;

  $(target).append(html);

  $(document).on('mouseover', `#containerCountry > div > div > div.ecl-select__multiple > div:nth-child(1) > input`, function(event) {
    $('#containerCountry > div > div > div.ecl-select__multiple > div:nth-child(1) > input').hover(
      function() {
        $(`label#selectCountry`).text(textChange);
      },
      function() {
        $(`label#selectCountry`).text(labelDescription);
      }
    );
  });

  let countriesToLoad = ""; // Define the variable to store selected country codes

  $(document).on('click', `.ecl-select-multiple-toolbar > .ecl-button.ecl-button--primary`, function(event) {
    const selectedValues = Array.from(document.getElementById('selectCountries').selectedOptions).map(option => option.value);

    // Join the selected values into a comma-separated string
    countriesToLoad = selectedValues.join(",");
    
    REF.geos = countriesToLoad;

    sankeyNameSpace.adaptCountryTitle();
	setCountryLabels();


		const notAvailableCountries = countriesNotAvailable(
			REF.year,
			dataNameSpace.ref.geos,
			REF.flowDisagg
		);

		if (notAvailableCountries.length == 0) infobox();


		//reset animation when changing country
		if (timelineNameSpace.isAutoplayLoaded) {
			timelineNameSpace.resetAutoplayTimeline();
		}

			composeAndCacheYearsOfGeo(flagRedrawDiagram = true,[performance.now()]);
			composeAndCacheGeosOfYear();
		

		function infobox() {
			const geos = REF.geos.split(",");
			const countries = geos.map((geo) => countriesEB[geo]).join(", ");

			if (geos && geos.length > 1) {
				const msg = languageNameSpace.labels.INFO_COUNTRY_SELECTOR.replace(
					/\+/g,
					countries
				);
				p = {
					body: `<p>${msg}</p>`,
					checkbox: false,
					ssKey: "countrySelectorInfoAccepted",
					title: "Information",
					closeX: true,
					footer: false,
				};
				messageboxNameSpace.messageModalBs(p);
			}
		}
  });

  function setCountryLabels () {
    var labelCountries = [];
    $.each(countriesEB, function (idx, obj) {
        if (jQuery.inArray(idx, REF.geos.split(",")) > -1) {
            labelCountries.push(obj);
        }
    });
    let label = labelCountries.toString().replace(/,/g, " + ");
    label += " - " + languageNameSpace.labels["TITLE_YEAR"];
    $("span.sankey-category.geo").text(label);
    }

  ECL.autoInit();

  const selectAllContainer = document.querySelector('.ecl-select__multiple');

  function countSelectedElements(countriesString) {
    if (!countriesString) {
        return 0;
    }
    const countriesArray = countriesString.split(',');
    return countriesArray.length;
}
  
  setTimeout(() => {
    if (selectAllContainer) {    
      const checkboxes = selectAllContainer.querySelectorAll('.ecl-checkbox__input');
      if (REF.geos.length > 0) {
        checkboxes.forEach(checkbox => {          
          const countryCode = checkbox.id.split('-')[2];
          if (REF.geos.includes(countryCode)) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }
        });  
      } else {
        const selectAllCheckbox = selectAllContainer.querySelector('.ecl-checkbox__input');
        selectAllCheckbox.checked = true;
      }

      const selectionsCounter = document.querySelector('.ecl-select-multiple-selections-counter');
      const spanElement = selectionsCounter.querySelector('span');
      selectionsCounter.classList.add('ecl-select-multiple-selections-counter--visible');
      const count = countSelectedElements(REF.geos);
      spanElement.textContent = count > 0 ? count : "42";
    }
  }, 1000);
}


// setTimeout(() => {
//   console.log('works');
//   populateCountries();
// }, 500);
