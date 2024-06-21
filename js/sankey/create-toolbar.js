const nsToolbarConf = {
	nodeExpandState: {
		all: "EXPAND_NODES",
		none: "COLLAPSE_NODES",
		default: "DEFAULT_VIEW",
	},
	languageState: {
		EN: "LEN",
		DE: "LDE",
		FR: "LFR",
	},
	args: [
		{
			tbItemId: "tb-country",
			fn: "createCountryMenuitem",
			ddItemId: "tb-country-btn",
			tooltipText: "MENU_COUNTRY",
			icon: "fas fa-globe",
			type: "dropdown",
		},
		{
			tbItemId: "tb-unit",
			fn: "createUnitMenuitem",
			ddItemId: "tb-unit-btn",
			tooltipText: "MENU_UNIT",
			icon: "fas fa-swatchbook",
			type: "dropdown",
		},
		{
			tbItemId: "tb-node",
			fn: "createNodeDisaggMenuitem",
			ddItemId: "tb-node-disagg-btn",
			tooltipText: "MENU_NODE_DETAILS",
			icon: "fas fa-project-diagram",
			type: "dropdown",
		},
		{
			tbItemId: "tb-flow",
			fn: "createFlowDisaggMenuitem",
			ddItemId: "tb-flow-disagg-btn",
			tooltipText: "MENU_FLOW",
			icon: "fas fa-stream",
			type: "button",
		},
		{
			tbItemId: "tb-export",
			fn: "createExportMenuitem",
			ddItemId: "tb-export-btn",
			tooltipText: "MENU_SAVE_DIAGRAM",
			icon: "fas fa-download",
			type: "dropdown",
		},
		{
			tbItemId: "tb-reload",
			fn: "createReloadMenuitem",
			ddItemId: "tb-reload-btn",
			tooltipText: "MENU_RELOAD",
			icon: "fas fa-redo-alt",
			type: "button",
		},
		{
			tbItemId: "tb-tutorial",
			fn: "createTutorialMenuitem",
			ddItemId: "tb-tutorial-btn",
			tooltipText: "MENU_TUTORIAL",
			icon: "fas fa-book-reader",
			type: "button",
		},
		// {
		// 	tbItemId: "tb-language",
		// 	fn: "createLanguageMenuitem",
		// 	ddItemId: "tb-language-btn",
		// 	tooltipText: "MENU_LANGUAGE",
		// 	icon: "fas fa-language",
		// 	type: "dropdown",
		// },
	],
};

const nsToolbarCountry = {
	/**
	 * Creates a country menuitem for the toolbar.
	 * @param {object} args - The arguments for the menuitem.
	 * @returns {object} The menuitem object.
	 */
	createCountryMenuitem: function (args) {
		// const button = nsToolbar.navItem(args);
		// const anchor = nsToolbar.navItemLink(args);
		// const divAllContainer = document.createElement("div");
		// const divGeoList = getGeoListContainer();
		// const items = getGeoListItems();

		// items.forEach(([geoCode, geoLabel]) => {
		// 	const ddAnchor = anchor();
		// 	// const img = flag();
		// 	const col1Box = document.createElement("span");
		// 	col1Box.innerText = geoLabel;
		// 	// col1Box.prepend(img);
		// 	ddAnchor.appendChild(col1Box);
		// 	const ddIcon = document.createElement("i");
		// 	ddIcon.classList.add("fas", "fa-check", "invisible", "ms-2");
		// 	ddAnchor.appendChild(ddIcon);

		// 	divGeoList.appendChild(ddAnchor);

		// 	// function flag() {
		// 	// 	const img = document.createElement("img");
		// 	// 	const altGeoCode = { EU27_2020: "eu", EL: "gr" };
		// 	// 	const flagCode = altGeoCode[geoCode] || geoCode;
		// 	// 	img.classList.add("flag", "me-2");
		// 	// 	img.setAttribute(
		// 	// 		"src",
		// 	// 		"img/country_flags/" + flagCode.toLowerCase() + ".webp"
		// 	// 	);
		// 	// 	img.setAttribute("alt", "");
		// 	// 	return img;
		// 	// }

		// 	function anchor() {
		// 		const ddAnchor = document.createElement("a");
		// 		ddAnchor.setAttribute("role", "menuitem");
		// 		ddAnchor.classList.add(
		// 			"dropdown-item",
		// 			"d-flex",
		// 			"justify-content-between",
		// 			"align-items-center"
		// 		);

		// 		// disable the option if the country is not available for the selected year
		// 		// disableOptionIfCountryNotAvailable(ddAnchor, geoCode);

		// 		ddAnchor.setAttribute("href", "#");
		// 		ddAnchor.setAttribute(
		// 			"onclick",
		// 			`nsToolbarHandler.eCountryChange(event,'${geoCode}');`
		// 		);
		// 		ddAnchor.setAttribute("data-geo", geoCode);
		// 		ddAnchor.setAttribute("data-bs-toggle", "button");
		// 		return ddAnchor;
		// 	}
		// });

		// if ($("#dropdown-geo-list").length) {
		// 	return;
		// }

		// const divControl = addControl();

		// divAllContainer.classList.add("dropdown-menu");
		// divAllContainer.setAttribute("role", "none");
		// divAllContainer.appendChild(divGeoList);
		// divAllContainer.appendChild(divControl);

		// anchor.setAttribute("data-bs-auto-close", "outside");

		// button.appendChild(anchor);
		// button.appendChild(divAllContainer);

		// document.getElementById(container).appendChild(button);

		// return button;

		// function getGeoListItems() {
		// 	const euAggrCodes = Object.keys(countriesEB)
		// 		.filter((key) => key.indexOf("EU") !== -1)
		// 		.map((key) => [key, countriesEB[key]]);
		// 	const countryCodesSorted = Object.keys(countriesEB)
		// 		.filter((key) => key.indexOf("EU") === -1)
		// 		.map((key) => [key, countriesEB[key]])
		// 		.sort((a, b) => a[1].localeCompare(b[1]));
		// 	return [...euAggrCodes, ...countryCodesSorted];
		// }

		// function getGeoListContainer() {
		// 	if ($("#dropdown-geo-list").length) {
		// 		$("#dropdown-geo-list").empty();
		// 		return document.getElementById("dropdown-geo-list");
		// 	}
		// 	const divGeoList = document.createElement("div");
		// 	divGeoList.style.cssText =
		// 		"height: auto;max-height: 48vh; overflow-x: hidden;";
		// 	divGeoList.setAttribute("id", "dropdown-geo-list");
		// 	divGeoList.setAttribute("role", "menu");
		// 	return divGeoList;
		// }

		// function addControl() {
		// 	const div = document.createElement("div");
		// 	div.classList.add("d-flex", "justify-content-evenly", "py-2");
		// 	["ok", "cancel", "reset"].forEach((id) => {
		// 		const btn = document.createElement("button");
		// 		btn.classList.add(				
		// 			"ecl-button",
		// 			id ==="ok"? "ecl-button--primary" : "ecl-button--secondary",
		// 		);
		// 		btn.setAttribute("type", "button");
		// 		btn.setAttribute("id", `btn-country-${id}`);
		// 		btn.innerText = languageNameSpace.labels[`BTN_${id.toUpperCase()}`];
		// 		div.appendChild(btn);
		// 	});
		// 	return div;
		// }

		// function disableOptionIfCountryNotAvailable(ddAnchor, geoCode) {
		// 	const queryString = window.location.search;
		// 	const urlParams = new URLSearchParams(queryString);
		// 	const year = urlParams.get("year");
		// 	const notAvailableCountries = countriesNotAvailable(
		// 		year,
		// 		geoCode,
		// 		REF.flowDisagg
		// 	);
		// 	if (notAvailableCountries.length !== 0) {
		// 		ddAnchor.classList.add("disabled");
		// 		ddAnchor.setAttribute("tabindex", "-1");
		// 		ddAnchor.setAttribute("aria-disabled", "true");
		// 	}
		// }
	},
};

var isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;
var container = isMobilePortrait ? "btnGroup" : "sankeyToolbox";

const nsToolbar = {
	
	createUnitMenuitem: function (args) {
		const navitemList = this.navItemList(args);
		const items = energyUnits;

		

		Object.entries(items).forEach(([key, value]) => {
			const ddAnchor = createAnchor();
			const ddIcon = document.createElement("i");
			ddIcon.classList.add(
				"fas",
				"fa-dot-circle",
				"invisible",
				"me-2",
				nsToolbarConf.args[1].tbItemId
			);
			if (REF.unit === key) {
				ddIcon.classList.remove("invisible");
			}
			ddAnchor.prepend(ddIcon);
			const ddList = document.createElement("li");
			ddList.appendChild(ddAnchor);
			ddList.setAttribute("role", "none");
			navitemList.appendChild(ddList);

			function createAnchor() {
				const ddAnchor = document.createElement("a");
				ddAnchor.classList.add(
					"dropdown-item",
					"d-flex",
					"justify-content-start",
					"align-items-center"
				);
				ddAnchor.setAttribute("role", "menuitem");
				ddAnchor.setAttribute("href", "#");
				ddAnchor.innerText = value.label;
				ddAnchor.setAttribute(
					"onclick",
					`nsToolbarHandler.eUnitsChange('${key}');`
				);
				ddAnchor.setAttribute("data-unit", key);
				return ddAnchor;
			}
		});

		const anchor = this.navItemLink(args);
		const button = this.navItem(args, "dropdown");
		button.appendChild(anchor);
		button.appendChild(navitemList);
		document.getElementById(container).appendChild(button);
		return navitemList;
	},

	createNodeDisaggMenuitem: function (args) {
		const navitemList = this.navItemList(args);
		const items = nsToolbarConf.nodeExpandState;
		let activeOption = "default";
		if (REF.nodeDisagg === "1111111111111") {
			activeOption = "all";
		}
		if (REF.nodeDisagg === "0000000000000") {
			activeOption = "none";
		}

		Object.entries(items).forEach(([key, value]) => {
			const ddList = document.createElement("li");
			ddList.setAttribute("role", "none");
			const ddAnchor = createAnchor();

			const ddIcon = document.createElement("i");
			ddIcon.classList.add(
				"fas",
				"fa-dot-circle",
				"invisible",
				"me-2",
				nsToolbarConf.args[2].tbItemId
			);
			if (key === activeOption) {
				ddIcon.classList.remove("invisible");
			}
			ddAnchor.prepend(ddIcon);

			ddList.appendChild(ddAnchor);
			navitemList.appendChild(ddList);

			function createAnchor() {
				const ddAnchor = document.createElement("a");
				ddAnchor.classList.add(
					"dropdown-item",
					"d-flex",
					"justify-content-start",
					"align-items-center"
				);
				ddAnchor.setAttribute("role", "menuitem");
				ddAnchor.setAttribute("href", "#");
				ddAnchor.setAttribute(
					"onclick",
					`nsToolbarHandler.eNodeDisaggChange(event,'${key}');`
				);
				ddAnchor.innerText = languageNameSpace.labels[value];
				return ddAnchor;
			}
		});

		const anchor = this.navItemLink(args);
		const button = this.navItem(args);
		button.appendChild(anchor);
		button.appendChild(navitemList);
		document.getElementById(container).appendChild(button);
		return navitemList;
	},

	createFlowDisaggMenuitem: function (args) {
		const navitemLink = this.navItemLink(args);
		navitemLink.setAttribute("data-bs-toggle", "button");
		const navitem = this.navItem(args, "button");
		navitem.appendChild(navitemLink);
		document.getElementById(container).appendChild(navitem);

		if (REF.flowDisagg) {
			const button = document.getElementById(args.ddItemId);
			const bsButton = new bootstrap.Button(button);
			bsButton.toggle();
		}

		return navitemLink;
	},

	createExportMenuitem: function (args) {
		const navitemList = this.navItemList(args);
		const items = {
			"exportImageNameSpace.exportDiagramAsPNG": "MENU_SUB_SAVE_PNG",
			"exportToPDFNameSpace.exportDiagramAsPDF": "MENU_SUB_SAVE_PDF",
		};

		Object.entries(items).forEach(([key, value]) => {
			const ddList = document.createElement("li");
			ddList.setAttribute("role", "none");
			const ddAnchor = createAnchor();
			ddList.appendChild(ddAnchor);
			navitemList.appendChild(ddList);

			function createAnchor() {
				const ddAnchor = document.createElement("a");
				ddAnchor.classList.add("dropdown-item");
				ddAnchor.setAttribute("role", "menuitem");
				ddAnchor.setAttribute("href", "#");
				ddAnchor.innerHTML = languageNameSpace.labels[value];
				ddAnchor.setAttribute("onclick", `${key}();`);
				return ddAnchor;
			}
		});

		const navItemLink = this.navItemLink(args);
		const navItem = this.navItem(args);
		navItem.appendChild(navItemLink);
		navItem.appendChild(navitemList);
		document.getElementById(container).appendChild(navItem);
		return navitemList;
	},

	createLanguageMenuitem: function (args) {
		const navitemList = this.navItemList(args);
		const items = nsToolbarConf.languageState;

		Object.entries(items).forEach(([key, value]) => {
			const ddList = document.createElement("li");
			ddList.setAttribute("role", "none");

			if (REF.language === key) {
				ddList.classList.add("active");
			}

			const ddAnchor = createAnchor(key);
			ddList.appendChild(ddAnchor);
			navitemList.appendChild(ddList);

			function createAnchor(languageCode) {
				const ddAnchor = document.createElement("a");
				ddAnchor.classList.add("dropdown-item");
				ddAnchor.setAttribute("role", "menuitem");
				ddAnchor.setAttribute("href", "#");
				ddAnchor.innerHTML = languageNameSpace.labels[value];
				ddAnchor.addEventListener("click", function () {
					languageNameSpace.setLanguage(languageCode);
				});
				return ddAnchor;
			}
		});

		const navItemLink = this.navItemLink(args);
		const navItem = this.navItem(args);
		navItem.appendChild(navItemLink);
		navItem.appendChild(navitemList);
		document.getElementById(container).appendChild(navItem);
		return navitemList;
	},

	createReloadMenuitem: function (args) {
		const navItemLink = this.navItemLink(args, "button");
		const navItem = this.navItem(args, "button");
		navItem.appendChild(navItemLink);
		document.getElementById(container).appendChild(navItem);
		return navItemLink;
	},

	createTutorialMenuitem: function (args) {
		const navItemLink = this.navItemLink(args, "button");
		const navItem = this.navItem(args, "button");
		navItem.appendChild(navItemLink);
		document.getElementById(container).appendChild(navItem);
		return navItemLink;
	},

	// create toolbar helpers
	tooltipText: (args) => languageNameSpace.labels[args.tooltipText],

	navItemIcon: (str) => {
		const i = document.createElement("i");
		str.split(" ").forEach((item) => i.classList.add(item));
		return i;
	},

	navItemList: (args) => {
		const ul = document.createElement("ul");
		ul.classList.add("dropdown-menu");
		ul.classList.add("dropdown-menu-end");
		ul.setAttribute("role", "menu");
		return ul;
	},

	navItem: (args) => {
		// if id exists, return it else create it
		if ($("#" + args.tbItemId).length) {
			return $("#" + args.tbItemId)[0];
		}

		const navItem = document.createElement("li");
		navItem.classList.add("nav-item", args.type, "px-1");
		navItem.setAttribute("id", args.tbItemId);
		navItem.setAttribute("role", "none");
		return navItem;
	},

	navItemLink: (args) => {
		const link = document.createElement("button"),
			icon = nsToolbar.navItemIcon(args.icon);

		link.setAttribute("href", "#");
		link.classList.add("btn", "ecl-button", "ecl-button--primary");
		link.setAttribute("data-bs-toggle", args.type);
		link.setAttribute("role", "menuitem");
		link.setAttribute("title", nsToolbar.tooltipText(args));
		if (args.type === "dropdown") {
			// link.classList.add("dropdown-toggle");
			link.setAttribute("aria-haspopup", "true");
			link.setAttribute("aria-expanded", "false");
		}
		link.setAttribute("id", args.ddItemId);
		link.appendChild(icon);
		return link;
	},
};

const nsToolbarHandler = {
	/**
	 * Updates the country dimension to the current selected country.
	 * @returns None
	 */
	// countryDimensionUpdate: () => {
	// 	sankeyNameSpace.adaptCountryTitle();
	// 	sankeyNameSpace.setCountryLabels();
	// },

	// setCountryLabels: function () {
	// 	var labelCountries = [];
	// 	$.each(countriesEB, function (idx, obj) {
	// 		if (jQuery.inArray(idx, REF.geos.split(",")) > -1) {
	// 			labelCountries.push(obj);
	// 		}
	// 	});
	// 	let label = labelCountries.toString().replace(/,/g, " + ");
	// 	label += " - " + languageNameSpace.labels["TITLE_YEAR"];
	// 	$("span.sankey-category.geo").text(label);
	// },


	/**
	 * Changes the unit of the graph.
	 * Updates toolbar and sankey.
	 * @param {string} unit - the unit to change to.
	 * @returns None
	 */
	eUnitsChange: function (unit) {
		REF.unit = unit;
		dataNameSpace.ref.unit = unit;
		sankeyNameSpace.setUnitInHeader();
		[
			...document.getElementsByClassName(nsToolbarConf.args[1].tbItemId),
		].forEach((i) => {
			i.classList.add("invisible");
		});
		document.querySelectorAll(`[data-unit="${REF.unit}"]`).forEach((a) => {
			a.querySelector("i").classList.remove("invisible");
		});
	},

	/**
	 * Handles the change of the node disaggregation.
	 * Upates toolbar and sankey.
	 * @param {Event} e - The event object.
	 * @param {string} details - The details of the node disaggregation.
	 * @returns None
	 */
	eNodeDisaggChange: function (e, details) {
		[
			...document.getElementsByClassName(nsToolbarConf.args[2].tbItemId),
		].forEach((i) => {
			i.classList.add("invisible");
		});
		[
			...e.target.getElementsByClassName(nsToolbarConf.args[2].tbItemId),
		].forEach((i) => {
			i.classList.remove("invisible");
		});

		REF.nodeDisagg = dataNameSpace.nodesDisaggregated[details];
	},

	eFlowDisaggToggle: (element) => {
		REF.before = {
			geos: REF.geos,
			year: REF.year,
			unit: REF.unit,
			flowDisagg: REF.flowDisagg,
		};
		REF.highlight = "_";
		REF.flowDisagg =
			element.getAttribute("aria-pressed") === "true" ? true : false;

		//reset animation when changing details
		if (timelineNameSpace.isAutoplayLoaded) {
			timelineNameSpace.resetAutoplayTimeline();
		} else {
			sankeyNameSpace.drawDiagram();
		}
	},

	/**
	 * Updates the country dimension to the new country selected.
	 * @returns None
	 */
	// eCountryChange: function (e, geoCode) {
	// 	const geoAggr = document.querySelector(
	// 		`#dropdown-geo-list a[data-geo="EU27_2020"]`
	// 	);

	// 	// if selected country is not EU27_2020, then remove EU27_2020 from active countries
	// 	if (geoCode !== "EU27_2020") {
	// 		geoAggr.classList.remove("active");
	// 		geoAggr.querySelector("i").classList.add("invisible");
	// 	}

	// 	// if selected country is EU27_2020, then remove all other countries from active countries
	// 	if (geoCode === "EU27_2020") {
	// 		const activeButtons = document.querySelectorAll(
	// 			"#dropdown-geo-list a.active"
	// 		);
	// 		activeButtons.forEach((button) => {
	// 			button.classList.remove("active");
	// 			button.querySelector("i").classList.add("invisible");
	// 		});
	// 	}

	// 	// toggle selected country
	// 	const countryListItem = document.querySelector(
	// 		`#dropdown-geo-list a[data-geo="${geoCode}"]`
	// 	);
	// 	countryListItem.querySelector("i").classList.toggle("invisible");

	// 	// collect all active countries
	// 	const activeButtons = document.querySelectorAll(
	// 		"#dropdown-geo-list a.active"
	// 	);

	// 	// restore EU27_2020 if no other country is selected
	// 	if (activeButtons.length === 0) {
	// 		geoAggr.classList.add("active");
	// 		geoAggr.querySelector("i").classList.remove("invisible");
	// 	}

	// 	// list all active countrie codes
	// 	const activeButtonsGeo = [...activeButtons].map((a) =>
	// 		a.getAttribute("data-geo")
	// 	);
	// 	REF.geos = activeButtons.length ? activeButtonsGeo.join(",") : "EU27_2020";

	// 	this.countryDimensionUpdate();
	// 	// this.countryChangeUpdateUnits();
	// 	e.preventDefault();
	// },

	// countryDropdownClose: () => {
	// 	const countryDropdownToggle = document.getElementById(
	// 		nsToolbarConf.args[0].ddItemId
	// 	);
	// 	let dropdown = new bootstrap.Dropdown(countryDropdownToggle);
	// 	dropdown.hide();
	// },

	/**
	 * This function is called when the user clicks the "OK" button in the country dropdown.
	 * It closes the dropdown and resets the timeline if the timeline is loaded.
	 * Otherwise it is drawing the diagram.
	 */
	// btnCountryOK: function () {
	// 	const notAvailableCountries = countriesNotAvailable(
	// 		REF.year,
	// 		dataNameSpace.ref.geos,
	// 		REF.flowDisagg
	// 	);

	// 	if (notAvailableCountries.length == 0) infobox();

	// 	this.countryDropdownClose();
	// 	//reset animation when changing country
	// 	if (timelineNameSpace.isAutoplayLoaded) {
	// 		timelineNameSpace.resetAutoplayTimeline();
	// 	}

	// 		composeAndCacheYearsOfGeo(flagRedrawDiagram = true,[performance.now()]);
	// 		composeAndCacheGeosOfYear();
		

	// 	function infobox() {
	// 		const geos = REF.geos.split(",");
	// 		const countries = geos.map((geo) => countriesEB[geo]).join(", ");

	// 		if (geos && geos.length > 1) {
	// 			const msg = languageNameSpace.labels.INFO_COUNTRY_SELECTOR.replace(
	// 				/\+/g,
	// 				countries
	// 			);
	// 			p = {
	// 				body: `<p>${msg}</p>`,
	// 				checkbox: false,
	// 				ssKey: "countrySelectorInfoAccepted",
	// 				title: "Information",
	// 				closeX: true,
	// 				footer: false,
	// 			};
	// 			messageboxNameSpace.messageModalBs(p);
	// 		}
	// 	}
	// },
	/**
	 * Remove the active class on the dropdown
	 * Update the REF.geos variable.
	 * Update the category title
	 */
	// btnCountryReset: function () {
	// 	document.querySelectorAll("#dropdown-geo-list a").forEach(function (a) {
	// 		a.classList.remove("active");
	// 		a.setAttribute("aria-pressed", false);
	// 		a.querySelector("i").classList.add("invisible");
	// 	});

	// 	// set EU27_2020 as active
	// 	const geoAggr = document.querySelector(
	// 		`#dropdown-geo-list a[data-geo="EU27_2020"]`
	// 	);
	// 	geoAggr.classList.add("active");
	// 	geoAggr.querySelector("i").classList.remove("invisible");

	// 	REF.geos = "EU27_2020";
	// 	this.countryDimensionUpdate();
	// },
	/**
	 * Restore the previous state of the dropdown
	 * Restore the previous state of the REF variable
	 */
	// btnCountryCancel: function () {
	// 	this.countryDropdownClose();
	// 	REF.geos = REF.before.geos;
	// 	if (REF.unit !== REF.before.unit) {
	// 		this.eUnitsChange(REF.before.unit);
	// 	}
	// 	this.countryDimensionUpdate();
	// },

	/**
	 * Adds an event listener to the given element for each of the given events.
	 * @param {HTMLElement} element - the element to add the event listener to.
	 * @param {string[]} events - the events to add the event listener to.
	 * @param {Function} handler - the event handler to add to the element.
	 * @returns None
	 */
	setHandlers: function (args, element) {
		/**
		 * Adds an event listener to the dropdown element that will trap focus to the menuitem button.
		 */
		function trapFocus() {
			// Get the dropdown element
			var dropdown = document.getElementById(args.ddItemId);
			// When the dropdown is hidden, focus on the button
			dropdown.addEventListener("hidden.bs.dropdown", function (e) {
				e.relatedTarget.focus();
			});
		}

		/**
		 * Event listener for the country dropdown menu.
		 * More listeners are added in the createCountryMenuitem function.
		 * @param {Event} e - The event object.
		 */
		// if (args.fn === "createCountryMenuitem") {
		// 	this.setEventListener(element, ["keyup"], function (e) {
		// 		/**
		// 		 * Keyboard navigation: if escape key is pressed
		// 		 * restore the previous state : Click the cancel button
		// 		 * close the dropdown : Click the menuitem button
		// 		 * set focus on the menitem button
		// 		 */
		// 		if (e.key === "Escape") {
		// 			nsToolbarHandler.btnCountryCancel();
		// 			nsToolbarHandler.countryDropdownClose();
		// 		}
		// 		if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
		// 			trapFocus();
		// 		}
		// 	});

		// 	document.getElementById(args.ddItemId).addEventListener("click", () => {
		// 		// Global variable to restore the previous state
		// 		REF.before = {
		// 			geos: REF.geos,
		// 			year: REF.year,
		// 			unit: REF.unit,
		// 			flowDisagg: REF.flowDisagg,
		// 		};

		// 		const active = document.querySelectorAll("#dropdown-geo-list .active");
		// 		removeAllActivOptions(active);

		// 		// Adds the active options for the given geo to the dropdown menu.

		// 		const activeGeos = REF.geos.split(",").filter((geo) => geo !== "");
		// 		for (let i = 0; i < activeGeos.length; i++) {
		// 			addGeoActiveOptions(activeGeos[i]);
		// 		}

		// 		function removeAllActivOptions(activeOptions) {
		// 			if (activeOptions) {
		// 				activeOptions.forEach((a) => {
		// 					a.classList.remove("active");
		// 					a.setAttribute("aria-pressed", false);
		// 					if (a.querySelector("i")) {
		// 						a.querySelector("i").classList.add("invisible");
		// 					}
		// 				});
		// 			}
		// 		}
		// 		function addGeoActiveOptions(geo) {
		// 			const geoElement = document.querySelector(
		// 				`#dropdown-geo-list a[data-geo="${geo}"]`
		// 			);
		// 			if (geoElement) {
		// 				geoElement.classList.add("active");
		// 				geoElement.setAttribute("aria-pressed", true);
		// 				geoElement.querySelector("i").classList.remove("invisible");
		// 			}
		// 		}
		// 	});

		// 	document
		// 		.getElementById("btn-country-ok")
		// 		.addEventListener("click", () => {
		// 			this.btnCountryOK();
		// 		});

		// 	document
		// 		.getElementById("btn-country-cancel")
		// 		.addEventListener("click", (e) => {
		// 			REF.geos = REF.before.geos;
		// 			REF.unit = REF.before.unit;
		// 			this.btnCountryCancel();
		// 		});

		// 	document
		// 		.getElementById("btn-country-reset")
		// 		.addEventListener("click", () => {
		// 			this.btnCountryReset();
		// 		});
		// }
		/**
		 * end of createCountryMenuitem function
		 *
		 *
		 *
		 */

		/**
		 * contineous event listener: unit, node, flow, export, reload, tutorial
		 * make sure the button is focused when the user presses the space or enter keys
		 */
		if (args.fn === "createUnitMenuitem") {
			this.setEventListener(element, ["click", "keydown"], function (e) {
				if (timelineNameSpace.isAutoplayLoaded) {
					timelineNameSpace.resetAutoplayTimeline();
				} else {
					sankeyNameSpace.drawDiagramFromSankeyDB();
				}
				if (e.key === "Enter" || e.key === " ") {
					trapFocus();
				}
			});
		}
		if (args.fn === "createLanguageMenuitem") {
			this.setEventListener(element, ["click", "keydown"], function (e) {
				if (timelineNameSpace.isAutoplayLoaded) {
					timelineNameSpace.resetAutoplayTimeline();
				} else {
					sankeyNameSpace.drawDiagramFromSankeyDB();
				}
				if (e.key === "Enter" || e.key === " ") {
					trapFocus();
				}
			});
		}
		if (args.fn === "createNodeDisaggMenuitem") {
			this.setEventListener(element, ["click", "keydown"], function (e) {
				if (timelineNameSpace.isAutoplayLoaded) {
					timelineNameSpace.resetAutoplayTimeline();
				} else {
					dataNameSpace.dataLoaded = false;
					sankeyNameSpace.drawDiagram();
				}
				if (e.key === "Enter" || e.key === " ") {
					trapFocus();
				}
			});
		}
		if (args.fn === "createFlowDisaggMenuitem") {
			this.setEventListener(element, ["click"], function (e) {
				nsToolbarHandler.eFlowDisaggToggle(element);
			});
		}
		if (args.fn === "createExportMenuitem") {
			this.setEventListener(element, ["click", "keydown"], function (e) {
				timelineNameSpace.stopAutoplayTimeline();
				if (e.key === "Enter" || e.key === " ") {
					trapFocus();
				}
			});
		}
		if (args.fn === "createReloadMenuitem") {
			this.setEventListener(element, ["click"], function (e) {
				location.assign(location.origin + location.pathname);
			});
		}
		if (args.fn === "createTutorialMenuitem") {
			this.setEventListener(element, ["click", "keydown"], function (e) {
				if (e.key === "Enter" || e.key === " " || e.type === "click") {
					timelineNameSpace.stopAutoplayTimeline();
					tutorial();
					traptutorialfocus()
				}
			});
		}
	},
	/**
	 * Adds an event listener to the given element for each of the given events.
	 * @param {HTMLElement} element - the element to add the event listener to.
	 * @param {string[]} events - the events to add the event listener to.
	 * @param {Function} handler - the event handler to add to the element.
	 * @returns None
	 */
	setEventListener: function (element, events, handler) {
		events.forEach((e) => element.addEventListener(e, handler));
	},
};

$(document).ready(function () {

	
	const components = [
		{ instance: new ZoomControls(), target: "#zoomControls" },
		{ instance: new SubNavbar(), target: "#subnavbar-container" },
		{ instance: new Footer(), target: "#componentFooter" },
		{ instance: new HorizontalTimeline(), target: "#timeLineComponent" },
		{ instance: new Navbar(), target: "#navbar-container" },
	];

	components.forEach(({ instance, target }) => {
		instance.addToDOM(target);
	});

	populateCountries()

	/**
	 *  create toolbar items
	 * if the function returns 1, it means there is no need to set handlers
	 * if the function returns an element, it means we need to set handlers to the element
	 */
	nsToolbarConf.args.forEach(function (item, index) {
		const newBtn =
			index === 0 ? nsToolbarCountry[item.fn](item) : nsToolbar[item.fn](item);
		if (newBtn !== 1) {
			nsToolbarHandler.setHandlers(item, newBtn);
		}
	});

	/**
	 * Adds an event listener to the toolbar button that will
	 * cancel the country selection if the user clicks outside te dropdown .
	 */
	// document
	// 	.getElementById(nsToolbarConf.args[0].ddItemId)
	// 	.addEventListener("hidden.bs.dropdown", function (e) {
	// 		if (e.clickEvent) {
	// 			nsToolbarHandler.btnCountryCancel();
	// 			nsToolbarHandler.countryDropdownClose();
	// 		}
	// 	});

	// document
	// 	.getElementById(nsToolbarConf.args[0].ddItemId)
	// 	.addEventListener("show.bs.dropdown", function (e) {
	// 		nsToolbarCountry.createCountryMenuitem(nsToolbarConf.args[0]);
	// 	});

		ECL.autoInit();
});
