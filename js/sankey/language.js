var languageNameSpace = {

	//Label containers for the selected language
	labels: {},
	tutorial: {},

	//selected language
	languageSelected: '',

	  // Eurostat credits
	  getSourceString: function() {
		return  `${languageNameSpace.labels["EXPORT_FOOTER_TITLE"]} (${Object.keys(codesEurobase).join("; ")})`
	  },

	//init of the labels for the language defined in the URL
	initLanguage: function (language) {


		languageNameSpace.languageSelected = language;

		$.ajax({
			url: 'data/labels_'+language+'.json',
			type: "GET",
			//contentType: "application/json; charset=ISO-8859-1",
			//important for encoding character with accent
			beforeSend: function(jqXHR) {
				jqXHR.overrideMimeType('text/html;charset=iso-8859-1');
			},
			dataType: "json",
			async: false,
			success: function (data) {
				languageNameSpace.labels = data;
			},
			error: function () {
				console.log("Error with language: "+language);
				error("initLanguage: No label found!");
				//if language not found => set EN version by default
				languageNameSpace.setLanguage("EN");
				languageNameSpace.languageSelected = 'EN';
			}
		});

		$.ajax({
			url: 'data/tutorial_'+language+'.json',
			type: "GET",
			//contentType: "application/json; charset=ISO-8859-1",
			//important for encoding character with accent
			beforeSend: function(jqXHR) {
				jqXHR.overrideMimeType('text/html;charset=iso-8859-1');
			},
			dataType: "json",
			async: false,
			success: function (data) {
				languageNameSpace.tutorial = data;
			},
			error: function () {
				console.log("Error with language: "+language);
				error("initLanguage: No data found for tutorial!");
			}
		});

		//set labels for the selected language
		$( document ).ready(function() {

			//set language in language drop down list
	

			// $('#tb-language-btn').on('change', function() {
			// 	languageNameSpace.setLanguage( $(this).val());
			// });



			//Header labels
			$("#header-title-label").text(languageNameSpace.labels["HEADER_TITLE"]);

			//Menu labels
			$("#menu-country-title").text(languageNameSpace.labels["MENU_COUNTRY"]);
			$("#menu-unit-title").text(languageNameSpace.labels["MENU_UNIT"]);
			$("#menu-legend-title").text(languageNameSpace.labels["MENU_HIDE_LEGEND"]);
			$("#menu-node-labels-title").text(languageNameSpace.labels["MENU_NODE_LABELS"]);
			$("#menu-node-details-title").text(languageNameSpace.labels["MENU_NODE_DETAILS"]);
			$("#menu-save-diagram-title").text(languageNameSpace.labels["MENU_SAVE_DIAGRAM"]);
			$("#menu-more-title").text(languageNameSpace.labels["MENU_MORE"]);

			//set export header title
			$("#exportHeaderTitle").text(languageNameSpace.labels["EXPORT_HEADER_TITLE"]);
			$("#exportFooterTitle").text(languageNameSpace.labels["EXPORT_FOOTER_TITLE"]);


			//Set country labels
			$.each(Object.keys(countriesEB), function (igeo, geo) {
				countriesEB[geo] = languageNameSpace.labels[geo];
			});




			energyUnits["KTOE"].label = languageNameSpace.labels["KTOE"];
			energyUnits["GJ"].label = languageNameSpace.labels["GJ"];
			energyUnits["TJ"].label = languageNameSpace.labels["TJ"];
			energyUnits["GWh"].label = languageNameSpace.labels["GWh"];
			energyUnits["Gcal"].label = languageNameSpace.labels["Gcal"];
			energyUnits["Tcal"].label = languageNameSpace.labels["Tcal"];

			fuelLossesLabel = languageNameSpace.labels["losses"];

		});
	},

	//Set language function
	setLanguage: function (language) {
		REF.language = language;
		dataNameSpace.setRefURL();
		// function in basiccs file to check the trailor cardinal at the end of the url
		checkCardinalInUrl()

		location.reload();
	},

  getFlowLabel: function (selected) {
    return {
      inFlow: languageNameSpace.labels["FLOWS_GOING_INTO"],
      outFlow: languageNameSpace.labels["FLOWS_GOING_OUT_FROM"],
      throughFuel: languageNameSpace.labels["FUELS_GOING_THROUGH"],
      inFuel: languageNameSpace.labels["FUELS_GOING_INTO"],
      outFuel: languageNameSpace.labels["FUELS_GOING_OUT_FROM"],
    }[selected];
  },
};
