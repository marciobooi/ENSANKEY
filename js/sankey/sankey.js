/*
CORE script to draw the current diagram view from global settings stored in REF
*/

// read global diagram variables from URL
dataNameSpace.getRefURL();
languageNameSpace.initLanguage(REF.language);
timeSeries = availableTimeInterval("nrg_bal_c", dataNameSpace.ref.geos).all;


//Loading dynamically list of countries available in Eurobase
// FIXME : Check if this additional API call is needed to filter out countries not available in the current time series
countryAvailableList = availableCountries("nrg_bal_c", timeSeries.last());
$.each(Object.keys(countriesEB), function (igeo, geo) {
	if (!countryAvailableList.contains(geo)) delete countriesEB[geo];
});

sankeyTransform ()

if (dataNameSpace.ref.year === "latest") dataNameSpace.ref.year = timeSeries.last();

dataNameSpace.isFuelFamilySelected = (REF.fuels !== "TOTAL");

// flag Eurobase download mode: full time series or only REF.year
//var timeSeriesNeeded = true;
var timeSeriesNeeded = false;

var dataAvailable = false;

// default view flows must be global objects
// var F1_2, F1_3, F1_4, F1_1, F1_1_1, F1_1_1, F1_1_2, F2_1, F2_2, F3, F4, F5_1, F5_2, F6_1, F6_2, F6_3, F6_4, F6_5, F6_6, F6_7, F6_8;

// global flow scale - to be defined later depending on flow sizes
var flowScale, flowScaleMax;

//id used to identify the interpolated frames for the diagram animation
var containerId = "";

// global NameSpace for Sankey diagram building function and objects
var sankeyNameSpace = {
	svgSankey: null,
	svgMarginsDevice: {},
	svgSize: {},
	zoom: d3.behavior
		.zoom()
		.translate([dataNameSpace.reset.translateX, dataNameSpace.reset.translateY])
		.scale([dataNameSpace.reset.scale])
		.scaleExtent([0.2, 5])
		.on("zoom", sankeyToolsNameSpace.zoomed),


	//zoom parameters
	translateX: REF.translateX,
	translateY: REF.translateY,
	scale: REF.scale,
	viewBox: "",
	//year used to build animation frames
	year: Number(timeSeries[0]),

	// change css and class properties to improve page view on low-resolution screens
	adaptToScreen: function (isLarge) {
		if (isLarge) {
			sankeyNameSpace.svgMarginsDevice = dataNameSpace.marginLarge;
			sankeyNameSpace.adaptCountryTitle();

		} else {
			sankeyNameSpace.svgMarginsDevice = dataNameSpace.marginSmall;		
		};
	},

	//Set country title font size depending on the number of country selected
	adaptCountryTitle: function () {
		function inRange(x, min, max) {
			return (x - min) * (x - max) <= 0;
			}

		var sizeRange = [
			{ min: 0, max: 10, size: "1rem" },
			{ min: 10, max: 30, size: "0.9rem" },
		];

		var geosLength = dataNameSpace.ref.geos.split(",").length;

		for (var i = 0; i < sizeRange.length; i++) {
			if (inRange(geosLength, sizeRange[i].min, sizeRange[i].max)) {
				$("span.sankey-category.geo").css({ "font-size": sizeRange[i].size });
				break;
			}
		}
	},
	appendYearToTitle: function (year) {
		var title = languageNameSpace.labels["HEADER_TITLE"];
		title += " " + REF.year;
		$("#header-title-label").text(title);
	},

	appendYearToSubTitle: function (year) {
		let el = $("span.sankey-category.geo");
		let subTitle = el.text();
		// remove the year from the title
		subTitle = subTitle.replace(/\d{4}/g, "");
		// add the year to the title
		subTitle += " " + REF.year;
		el.text(subTitle);
	},

	//Set country labels
	setCountryLabels: function () {
		var labelCountries = [];
		$.each(countriesEB, function (idx, obj) {
			if (jQuery.inArray( idx, REF.geos.split(',') ) > -1) {
				labelCountries.push(obj);
			}
		});
		let label = labelCountries.toString().replace(/,/g, " + ");
		label += " - " + languageNameSpace.labels["TITLE_YEAR"];
		$("span.sankey-category.geo").text(label);
	},

	// add the country and the unit on the information panel
	setUnitInHeader: function () {
		document.querySelector(".sankey-category.units").innerHTML =
			languageNameSpace.labels[`${REF.unit}`];
	},

	setId: function () {
		containerId = sankeyNameSpace.year.toFixed(2).toString().replace(".", "");
		containerId = containerId.substring(0, 4) + "00";
	},

	setFrame: function () {
		const div = document.createElement("div");
		div.id = `diagramContainer${containerId}`;
		div.style.display = "none";
		document.getElementById("allContainer").appendChild(div);
	},

	sankeyContainer: function (containerId) {
		return d3
			.select("#diagramContainer" + containerId)
			.append("svg")
			.attr("id", "svg-container" + containerId)
			.classed("svg-content", true)
			.append("g") //probably not needed
			.call(sankeyNameSpace.zoom)
			.on("dblclick.zoom", null)
			.on(
				"mouseup",
				timelineNameSpace.isAutoplayStarted
					? sankeyToolsNameSpace.endZoom
					: dataNameSpace.setRefURL
			)
			.append("g")
			.attr("id", "zoom" + containerId);
	},

	getDiagramViewBox: function (id) {
		const svgContainer = document.querySelector(`#svg-container${id}`);
		const { xMin, xMax, yMin, yMax } = [...svgContainer.children].reduce(
			(acc, el) => {
				const { x, y, width, height } = el.getBBox();
				if (!acc.xMin || x < acc.xMin) acc.xMin = x;
				if (!acc.xMax || x + width > acc.xMax) acc.xMax = x + width;
				if (!acc.yMin || y < acc.yMin) acc.yMin = y;
				if (!acc.yMax || y + height > acc.yMax) acc.yMax = y + height;
				return acc;
			},
			{}
		);

		sankeyNameSpace.viewBox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;
		sankeyNameSpace.svgSize = { width: xMax - xMin, height: yMax - yMin };
	},

	setDiagramViewBox: function (id) {
		const svgContainer = document.querySelector(`#svg-container${id}`);
		svgContainer.setAttribute("viewBox", sankeyNameSpace.viewBox);
		svgContainer.setAttribute("preserveAspectRatio", "xMinYMin meet");
	},

	setDiagramTranslate: function (id, svgSize) {
		const svgContainer = document.querySelector(`#svg-container${id}`);
			sankeyTransform(svgSize.width, svgSize.height);		
			sankeyNameSpace.zoom.scale(dataNameSpace.reset.scale);

		// TODO : device scale
		// scale = imgHeight / sankeyNameSpace.svgSize.height;
		const zoomGroup = svgContainer.querySelector(`#zoom${id}`);
		zoomGroup.setAttribute(
			"transform",
			`translate(${dataNameSpace.reset.translateX},${dataNameSpace.reset.translateY})scale(${dataNameSpace.reset.scale})`
		);
	},

	buildSankey: function () {
		// detect mobile devices and show warning once
		if (isMobile) {
			if (!sessionStorage.getItem("isMobileChecked")) {
				const p = {
					head: languageNameSpace.labels["MSG_24"],
					body: `${languageNameSpace.labels["MSG_MOBILE_DEV_1"]}<br/>${languageNameSpace.labels["MSG_MOBILE_DEV_2"]}`,
					checkbox: false,
				};
				messageboxNameSpace.messageModalBs(p);

				sessionStorage.setItem("isMobileChecked", true);
			}
		} else {
			sessionStorage.setItem("isBrowserChecked", true);
		}

		// adapt to screen resolution
		sankeyNameSpace.adaptToScreen(dataNameSpace.isLargeRes);

		if (timelineNameSpace.isAutoplayStarted) {
			//function to build the diagram animation
			requestAnimationFrame(() => {
				this.setId();
				//create interpolated frames
				this.setFrame();
				sankeyNameSpace.svgSankey = this.sankeyContainer(containerId);
				this.setDiagramViewBox(containerId);
				this.setDiagramTranslate(containerId, sankeyNameSpace.svgSize);
				// time line and diagram itself
				sankeyNameSpace.drawAnimationDiagram();
			});
		} else {
			containerId = "";
			sankeyNameSpace.svgSankey = this.sankeyContainer(containerId);
			// time line and diagram itself
			timelineNameSpace.constructTimeline();
			sankeyNameSpace.drawDiagram();
			this.getDiagramViewBox(containerId);
			this.setDiagramViewBox(containerId);
			this.setDiagramTranslate(containerId, sankeyNameSpace.svgSize);
		}
	},

	drawAnimationDiagram: function () {
		$("#loader").show();
		$("#progress").html(languageNameSpace.labels["MSG_18"]+": "+ Math.floor((sankeyNameSpace.year.toFixed(2)-Number(timeSeries[0]))/(timeSeries.length-1)*100)+"%");
		REF.year = sankeyNameSpace.year.toFixed(2).toString();
		sankeyNameSpace.drawDiagramFromSankeyDB();
	},

	// Ajax wrapper for Eurobase query
	drawDiagram: function (idDisaggregateNode) {

		$("#loader").show();
		$("#progress").html(languageNameSpace.labels["MSG_18"]+"...");

			REF.nodeDisagg = sankeyToolsNameSpace.disaggregationState(REF.nodeDisagg, idDisaggregateNode);
			sankeyToolsNameSpace.updateDisaggregationFlags(REF.nodeDisagg);

			//re-initialize the fuel list all the time the fuel list drawn change
			dataNameSpace.fuelListDrawn = [];

			// recalculate the diagram size from disaggregation status
			imgWidth = dataNameSpace.calculateImgWidth(
				sankeyToolsNameSpace.getCropWidth(),
				sankeyNameSpace.svgMarginsDevice
			);

			var notAvailableCountries = countriesNotAvailable(
				REF.year,
				dataNameSpace.ref.geos,
				REF.flowDisagg
			);

			notAvailableCtryProcess();

			sankeyNameSpace.setCountryLabels();
			sankeyNameSpace.appendYearToSubTitle($(".selected").attr("id"));
			sankeyNameSpace.setUnitInHeader();

			if (timeSeriesNeeded) {
				REF.year = sankeyNameSpace.year.toFixed(2).toString();
			}

			if (sankeyDB.value.length == 0) {
				initializeDB(codesSankey, undefined, timeSeries);

				const filter = {
					geo: REF.geos.split(","),
					time: REF.year,
					fuel: reducedFuelListForDataApi,
					flow: Array.from(reducedNrgBalListForDataApi),
				};

				getEurobaseData(filter);
			}
			if (notAvailableCountries.length == 0) {
				sankeyNameSpace.drawDiagramFromSankeyDB();
			}

		return notAvailableCountries.length == 0;

		function notAvailableCtryProcess() {
			if (notAvailableCountries.length != 0) {
				var message = languageNameSpace.labels["MSG_19"];
				for (var i = 0; i < notAvailableCountries.length; i++) {
					if (i > 0)
						message +=
							i < notAvailableCountries.length - 1
								? ","
								: " " + languageNameSpace.labels["MSG_20"];

					message += " " + countriesEB[notAvailableCountries[i]];
				}

				var p = {
					title: languageNameSpace.labels["MSG_21"],
					body: message,
					footer: false,
					ssKey: "info-MSG_21",
					checkbox: false,
				};

				messageboxNameSpace.messageModalBs(p);

				const button = document.getElementById("tb-flow-disagg-btn"),
					bsButton = new bootstrap.Button(button);

				bsButton.toggle();

				if (REF.before.flowDisagg) {
					button.setAttribute("aria-pressed", true);
					button.classList.add("active");
				}

				REF.geos = REF.before.geos;
				REF.year = REF.before.year;
				REF.unit = REF.before.unit;
				REF.flowDisagg = REF.before.flowDisagg;

				$("#loader").fadeOut(1000);
			}
		}
		// }, 200);
	},


	// SVG canvas
	drawDiagramFromSankeyDB: function () {
		var t = new speedTest();
		// clear canvas
		sankeyNameSpace.svgSankey.selectAll("g").remove();

		//t.log("after remove");

		// calculate global flow scale: Max(N1.value, N6.value)
		flowScaleMax = getFlowScaleMax(timeSeries);

		var weightFunction = 1;
		var isDragging = false;
		flowScale = d3.scale.linear()
			.domain([0., flowScaleMax])
			.range([0., 0.2 * weightFunction * imgHeight]);

		// check for empty diagram
		if (flowScaleMax == 0)
			messageboxNameSpace.messageBox("Info", languageNameSpace.labels["MSG_22"]);

		// readjust canvas size
//		$("#svg-container"+containerId) .attr("version", 1.1) .attr("xmlns", "http://www.w3.org/2000/svg") .attr("width", imgWidth) .attr("height", imgHeight);

		//add a draggable zone for the whole diagram
		$("#draggable-zone").remove();
		sankeyNameSpace.svgSankey.append("rect")
			.attr("id","draggable-zone"+containerId)
			.attr("fill", "none")
			.attr("pointer-events","all")
			.attr("width", imgWidth) // "100%"
			.attr("height", imgHeight) //"100%"
			.on("mousedown", function () {
				$(window).mousemove(function () {
					isDragging = true;
					$('rect').css({'cursor' : 'move'});
					$(window).unbind("mousemove");
				});
			})
			.on("mouseup", function () {
				var wasDragging = isDragging;
				isDragging = false;
				$('rect').css({'cursor' : ''});
				$(window).unbind("mousemove");
			});

		//t.log("before draw");

		// draw the actual diagram
		sankeyNameSpace.drawCommonPartDiagram();

		// store global diagram variables in URL
		if(!timelineNameSpace.isAutoplayStarted)
			dataNameSpace.setRefURL();

		// draw time line with correct range for the current country
		if(!timelineNameSpace.isAutoplayStarted && !timelineNameSpace.isAutoplayLoaded)
			timelineNameSpace.disableTimeLine();

		//re-draw the legend all the time it is displayed
		if(!timelineNameSpace.isAutoplayStarted) {
			if (legendBoxNameSpace.isLegendDisplayed) {
				legendBoxNameSpace.legendBox();
				if (!dataNameSpace.isLargeRes) {
					legendBoxNameSpace.reduceLegendSize();
				}
			}
		}

		// draw node warning if needed
		if (nodeNameSpace.warningNodes.length && !timelineNameSpace.isAutoplayStarted) {
			messageboxNameSpace.warningBox(nodeNameSpace.warningNodes);
			console.log("WARNING: Energy not conserved (> " + printOneDecimal(100 * dataNameSpace.energyWarningThreshold) + "%) in the following nodes:");
			$.each(nodeNameSpace.warningNodes, function (i, n) {
				console.log("- " + n[0] + ": " + printOneDecimal(100. * n[1]) + "%");
			});
			nodeNameSpace.warningNodes = [];
		};

		// draw statistical difference warning if needed
		var sd = {}, sd_nodes = [], sd_values = [];


		var F1 = new Flow("N1").value;
		var F6 = new Flow("N6").value;

		if (F1 == 0 && F6 == 0) {
			messageboxNameSpace.messageBox("Info", languageNameSpace.labels["MSG_22"]);
		}

		sd.N1in = (dataNameSpace.isAllSourcesDisaggregated) ? F1_4.value / F1 : 0;
		sd.N6in = (sd.N1in < 1) ? 0 : F1_4.value / F6;
		sd.N6out = (dataNameSpace.isAfterTransformationDisaggregated) ? F6_8.value / F6 : 0;
		sd.N1out = (sd.N6out < 1) ? 0 : F6_8.value / F1;
		for (n in sd)
			if (sd[n] > dataNameSpace.energyWarningThreshold && sd[n] < 1) {
				sd_nodes.push(n.substring(0, 2));
				sd_values.push(sd[n]);
			};
		if (sd_nodes.length && !timelineNameSpace.isAutoplayStarted) messageboxNameSpace.warningBox(sd_nodes, sd_values);

		if(timelineNameSpace.isAutoplayStarted) {
			if(sankeyNameSpace.year.toFixed(2) < timeSeries.last()) {
				$("#diagramContainer"+containerId).hide();
				sankeyNameSpace.year += (1 / dataNameSpace.nbFrames);
				sankeyNameSpace.buildSankey();
			} else {
				$("#loader").hide();
				$("#diagramContainer").hide();
				timelineNameSpace.startAutoplayTimeline();
			}
		} else {
			$("#loader").hide();
		}
		$(".cck-content-content > p").html(languageNameSpace.labels["COOKIETEXT"]);
				$(".cck-actions > a:nth-child(1)").text(languageNameSpace.labels["COOKIECOMPLETEacceptAll"]);
				$(".cck-actions > a:nth-child(2)").text(languageNameSpace.labels["COOKIECOMPLETEonlyTechnical"]);
				$(".cck-content-complete > p").html(languageNameSpace.labels["COOKIECOMPLETE"]);
				$(".cck-actions > a[href=\'#close']").text(languageNameSpace.labels["COOKIECOMPLETEclose"]);
				$(".cck-actions > a[href=\'#close']").append('<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.538 15.205L13.32 11.99l3.199-3.194-1.332-1.332-3.2 3.193L8.812 7.48 7.48 8.812l3.177 3.177-3.195 3.199 1.334 1.333 3.193-3.2 3.217 3.217 1.333-1.333zm5.594-7.49a10.886 10.886 0 00-2.355-3.492 10.882 10.882 0 00-3.492-2.355A10.906 10.906 0 0012 1c-1.488 0-2.93.293-4.286.868a10.958 10.958 0 00-3.492 2.355 10.888 10.888 0 00-2.355 3.492A10.925 10.925 0 001 12a10.958 10.958 0 003.222 7.778 10.9 10.9 0 003.492 2.355C9.07 22.707 10.512 23 12 23a10.964 10.964 0 007.777-3.222 10.912 10.912 0 002.355-3.492A10.94 10.94 0 0023 12c0-1.487-.294-2.93-.868-4.285zM21.702 12a9.642 9.642 0 01-2.844 6.858A9.619 9.619 0 0112 21.703a9.635 9.635 0 01-6.859-2.844A9.617 9.617 0 012.298 12a9.619 9.619 0 012.843-6.859A9.615 9.615 0 0112 2.298a9.619 9.619 0 016.858 2.843A9.623 9.623 0 0121.703 12z"></path></svg>')

		// remove the tooltip if found
		var tooltip = document.getElementById("tooltip");
		if (tooltip) tooltip.remove();
		// add the tooltip
		sankeyNameSpace.tooltip = d3
			.select("body")
			.append("div")
			.attr("id", "tooltip")
			.attr("display", "none")
			.style("opacity", 1)
			.style("display", "none");

		//t.dump("inside after query");
	},

	// Animation SVG canvas
		drawAnimationDiagramFromSankeyDB: function () {

			//var t = new speedTest();

			// clear canvas
			sankeyNameSpace.svgSankey.selectAll("g").remove();

			// calculate global flow scale: Max(N1.value, N6.value)
			flowScaleMax = getFlowScaleMax(timeSeries);

			var weightFunction = 1;
			var isDragging = false;
			flowScale = d3.scale.linear()
				.domain([0., flowScaleMax])
				.range([0., 0.2 * weightFunction * imgHeight]);

			// readjust canvas size
			// $("#svg-container"+containerId)
			// 	.attr("version", 1.1)
			// 	.attr("xmlns", "http://www.w3.org/2000/svg")
			// 	.attr("width", imgWidth)
			// 	.attr("height", imgHeight);

			//add a draggable zone for the whole diagram
			$("#draggable-zone").remove();
			sankeyNameSpace.svgSankey.append("rect")
				.attr("id","draggable-zone"+containerId)
				.attr("fill", "none")
				.attr("pointer-events","all")
				.attr("width", imgWidth) //"100%"
				.attr("height", imgHeight) //"100%"
				.on("mousedown", function () {
					$(window).mousemove(function () {
						isDragging = true;
						$('rect').css({'cursor' : 'move'});
						$(window).unbind("mousemove");
					});
				})
				.on("mouseup", function () {
					isDragging = false;
					$('rect').css({'cursor' : ''});
					$(window).unbind("mousemove");
				});

			//t.log("before draw");

			// draw the actual diagram
			sankeyNameSpace.drawCommonPartDiagram();

			// draw statistical difference warning if needed
			var sd = {}, sd_nodes = [], sd_values = [];

			var F1 = new Flow("N1").value;
			var F6 = new Flow("N6").value;
			sd.N1in = (dataNameSpace.isAllSourcesDisaggregated) ? F1_4.value / F1 : 0;
			sd.N6in = (sd.N1in < 1) ? 0 : F1_4.value / F6;
			sd.N6out = (dataNameSpace.isAfterTransformationDisaggregated) ? F6_8.value / F6 : 0;
			sd.N1out = (sd.N6out < 1) ? 0 : F6_8.value / F1;
			for (n in sd)
				if (sd[n] > dataNameSpace.energyWarningThreshold && sd[n] < 1) {
					sd_nodes.push(n.substring(0, 2));
					sd_values.push(sd[n]);
				};
			if (sd_nodes.length && !timelineNameSpace.isAutoplayStarted) messageboxNameSpace.warningBox(sd_nodes, sd_values);

			//t.log("end drawAnimationDiagramFromSankeyDB");

			if(sankeyNameSpace.year.toFixed(2) < timeSeries.last()) {
				$("#diagramContainer"+containerId).hide();
				sankeyNameSpace.year += (1 / dataNameSpace.nbFrames);
				sankeyNameSpace.buildSankey();
			} else {
				$("#loader").hide();
				$("#diagramContainer").hide();
				timelineNameSpace.startAutoplayTimeline();
			}

			//t.dump("inside drawAnimationDiagramFromSankeyDB");
		},


	//draw the common part of the diagram
	drawCommonPartDiagram: function () {

		var t = new speedTest();

		// reset node drawing list
		nodeNameSpace.nodeListDrawn = {};

		// initialize default view flows
		F1_2 = new Flow("F1_2");
		F1_3 = new Flow("F1_3");
		F1_4 = new Flow("F1_4");
		F1_1 = new Flow("F1_1");
		F1_1_1 = new Flow("F1_1_1");
		F1_1_2 = new Flow("F1_1_2");
		F2_1 = new Flow("F2_1");
		F2_2 = new Flow("F2_2");
		F2_6_1 = new Flow("F2_6_1");
		F2_6_2 = new Flow("F2_6_2");
		F2_11_1 = new Flow("F2_11_1");
		F2_11_2 = new Flow("F2_11_2");
		F3 = new Flow("F3");
		F4 = new Flow("F4");
		F5_1 = new Flow("F5_1");
		F5_2 = new Flow("F5_2");
		F6_1 = new Flow("F6_1");
		F6_2 = new Flow("F6_2");
		F6_3 = new Flow("F6_3");
		F6_4 = new Flow("F6_4");
		F6_5 = new Flow("F6_5");
		F6_6 = new Flow("F6_6");
		F6_7 = new Flow("F6_7");
		F6_8 = new Flow("F6_8");

		// nodes
		var N1 = new sankeyNode("N1", new Vec2(dataNameSpace.xN1, dataNameSpace.yMain), true, false, "B");
		var N6 = new sankeyNode("N6", new Vec2(dataNameSpace.xN6 + dataNameSpace.coefDisaggregationTransformation, dataNameSpace.yMain), true);

		//t.log("init flow s and nodes");

		if (dataNameSpace.isAllSourcesDisaggregated) {
			sankeyNameSpace.drawDisaggregateAllSources(N1);
		};

		//t.log("after drawDisaggregateAllSources");

		//calculate the x position of transformation nodes, N5 and N3
		var xTransformationPosition = (N6.positionNormalized.x + N1.positionNormalized.x) / 2;
		dataNameSpace.xExportTitle = xScale(xTransformationPosition);

		sankeyNameSpace.drawTransformation(dataNameSpace.isTransformationDisaggregated, xTransformationPosition, N1, N6);

		if (dataNameSpace.isAfterTransformationDisaggregated) {
			sankeyNameSpace.drawDisaggregateAfterTransformation(N6);
		};

		//t.log("after drawTransformation");

		// draw all nodes, and check energy conservation
		for (var code in nodeNameSpace.nodeListDrawn) {
			var n = nodeNameSpace.nodeListDrawn[code];
			nodeNameSpace.draw(sankeyNameSpace.svgSankey, n, containerId);
			dataNameSpace.xExportRef = Math.max(n.position.x, dataNameSpace.xExportRef);
			var relDiff = n.checkEnergyConservation();
			if (relDiff) nodeNameSpace.warningNodes.push([n.name, relDiff]);
		};

		//t.log("after drawing all nodes");

		//t.dump("inside drawCommonPartDiagram");
	},

	drawDisaggregateAllSources: function (N1) {
//		var t = new speedTest();
		var N1_1 = new sankeyNode("N1_1", new Vec2(dataNameSpace.xN1_1, yScale.invert(N1.position.y + F1_2.size() + F1_3.size() + F1_4.size())), true, false, "B");
		var E1_4 = new sankeyNode("E1_4", new Vec2(xScale.invert(N1.position.x) - 0.02, 0.15), false, true, "R");
		var E1_3 = new sankeyNode("E1_3", new Vec2(xScale.invert(E1_4.position.x - F1_4.size()) - dataNameSpace.paddingNodeGroupX, 0.05), false, true, "R");
		var E1_2 = new sankeyNode("E1_2", new Vec2(xScale.invert(E1_3.position.x - F1_3.size()) - dataNameSpace.paddingNodeGroupX, 0.05), false, true, "L");

		//E1.4 -> N1: statistical difference - inflow
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F1_4, E1_4, N1, 0.2);
		//E1.3 -> N1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F1_3, E1_3, N1, 0.1);
		//E1.2 -> N1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F1_2, E1_2, N1, 0.);
		//N1.1 -> N1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F1_1, N1_1, N1);

		if (dataNameSpace.isProductionDisaggregated) {
			sankeyNameSpace.drawDisaggregateProduction(N1_1);
		};

		////t.dump("drawDisaggregateAllSources");
		//t.dump("inside drawDisaggregateAllSources");
	},

	drawDisaggregateProduction: function (N1_1) {
		var t = new speedTest();
		var E1_1_2 = new sankeyNode("E1_1_2", new Vec2(0.002, N1_1.positionNormalized.y), true);
		var E1_1_1 = new sankeyNode("E1_1_1", new Vec2(0.002, yScale.invert(E1_1_2.position.y + F1_1_2.size() + xScale(dataNameSpace.paddingNodeGroupX))), true,false,"B");

		//E1.1.2 -> N1.1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F1_1_2, E1_1_2, N1_1);
		//E1.1.1 -> N1.1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F1_1_1, E1_1_1, N1_1);

		//t.log("drawDisaggregateProduction");
		//t.dump("inside drawDisaggregateProduction");
	},

	//draw Transformation aggregation or disaggregation
	drawTransformation: function (isDisaggregate, xTransformationPosition, N1, N6) {
		var t = new speedTest();
		// losses node
		var E4 = new sankeyNode("E4", new Vec2(xTransformationPosition + 0.05 + xScale.invert(F2_1.size() - F2_2.size()), dataNameSpace.yBottom), false, true, "B");

		if (isDisaggregate) {
			if(dataNameSpace.isRPITransformationDisaggregated || dataNameSpace.isEHGTransformationDisaggregated) {
				sankeyNameSpace.drawDisaggregateRPIEHGTransformation(xTransformationPosition, N1, N6, E4);
			} else {
				sankeyNameSpace.drawDisaggregateTransformation(xTransformationPosition, N1, N6, E4);
			}
		} else {
			sankeyNameSpace.drawAggregateTransformation(xTransformationPosition, N1, N6, E4);
		};

		//t.log("drawTransformation");
		//t.dump("inside drawTransformation");
	},

	//draw the aggregate transformation diagram
	drawAggregateTransformation: function (xPosition, N1, N6, E4) {
		var t = new speedTest();
		//nodes
		var N5 = new sankeyNode("N5", new Vec2(xPosition, dataNameSpace.yMain), true);
		var T2 = new sankeyNode("T2", new Vec2(xPosition, Math.max(dataNameSpace.yT2, yScale.invert(N5.position.y + F5_1.size()) + dataNameSpace.paddingTransformationFlow)), true);

		//N5 -> N6
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F5_1, N5, N6);
		//N1 -> N5
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F5_2, N1, N5);

		//N1 -> T2
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_1, N1, T2, 0.2, 0.1);
		//T2 -> N6
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_2, T2, N6, 0.2, 0.7);
		//T2 -> E4
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F4, T2, E4, 0.2);

		//t.log("drawAggregateTransformation");
		//t.dump("inside drawAggregateTransformation");
	},

	//draw the disaggregate transformation diagram
	drawDisaggregateTransformation: function (xPosition, N1, N6, E4) {
		var t = new speedTest();
		var nbTransformationNodes = 0;
		var sumSizeFlow = 0;
		var allTransformationNodes = Object.keys(sankeyNodes)
			.filter(function (n) { return (n.substring(0, 3) === "T2_" && n.substring(0, 5) !== "T2_6_" && n.substring(0, 6) !== "T2_11_" ) })
			.map(function (n) { return n.split("_").last() });
		$.each(allTransformationNodes, function (idx, obj) {
			var f1 = new Flow("F2_" + obj + "_1");
			var f2 = new Flow("F2_" + obj + "_2");
			if (f1.isTiny && f2.isTiny) return;
			sumSizeFlow += Math.max(f1.size(), f2.size());
			nbTransformationNodes++;
		});

		// total normalized height of disaggregated transformation sector (between N3 and N5)
		var heightTransformation = sumSizeFlow / imgHeight + (nbTransformationNodes - 1) * dataNameSpace.paddingTransformationFlow;

		//nodes
		var yTrans; // master y coordinate to define central y position of transformation and backflow nodes
		if (yScale.invert(N1.position.y + F5_1.size()) + heightTransformation + 2 * dataNameSpace.paddingN5N3 < (E4.positionNormalized.y - dataNameSpace.paddingN3E4))
			yTrans = yScale.invert(N1.position.y + F5_1.size() - Math.max(F2_1.size(), F2_2.size()) / 2) + heightTransformation / 2 + dataNameSpace.paddingN5N3;
		else
			yTrans = yScale.invert(E4.position.y - Math.max(F2_1.size(), F2_2.size()) / 2) - dataNameSpace.paddingN3E4 - heightTransformation / 2 - dataNameSpace.paddingN5N3;
		var N2_1 = new sankeyNode("N2_1", new Vec2(xScale.invert(N1.position.x + flowScale(flowScaleMax) + xScale(dataNameSpace.nodeThickness)), yTrans), true, false, "B");
		var N2_2 = new sankeyNode("N2_2", new Vec2(xScale.invert(N6.position.x - flowScale(flowScaleMax) - xScale(dataNameSpace.nodeThickness)), yTrans), true, false, "B");

		var nodeYPosition = yScale.invert(N2_1.position.y + Math.max(F2_1.size(), F2_2.size()) / 2) - heightTransformation / 2.;
		var N5 = new sankeyNode("N5", new Vec2(xPosition, Math.min(N1.positionNormalized.y, yScale.invert(yScale(nodeYPosition) - F5_1.size()) - dataNameSpace.paddingN5N3)), true);

		//N1 -> N5
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F5_1, N1, N5, 0.2, 0);
		//N5 -> N6
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F5_2, N5, N6, 0.2, 1);
		//N1 -> N2_1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_1, N1, N2_1, 0.2);
		//N2_2 -> N6
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_2, N2_2, N6, 0.2);

		$.each(allTransformationNodes, function (idx, obj) {
			var inflow = new Flow("F2_" + obj + "_1");
			var outflow = new Flow("F2_" + obj + "_2");
			var losses = new Flow("F4_" + obj);
			var transformationNode = new sankeyNode("T2_" + obj, new Vec2(xPosition, nodeYPosition), true);
			flowNameSpace.draw(sankeyNameSpace.svgSankey, inflow, N2_1, transformationNode, 0.5, 0, "S", 1.3);
			flowNameSpace.draw(sankeyNameSpace.svgSankey, outflow, transformationNode, N2_2, 0.5, 0, "T", 1.3);
			flowNameSpace.draw(sankeyNameSpace.svgSankey, losses, transformationNode, E4, 0.2);
			if (inflow.isTiny && outflow.isTiny) return;
			nodeYPosition += Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow;
		});

		// backflow
		N3 = new sankeyNode("N3", new Vec2(xPosition, nodeYPosition + dataNameSpace.paddingN5N3 - dataNameSpace.paddingTransformationFlow), true);
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F3, N2_2, N3, 0, 0.02);
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F3, N3, N2_1, 0, 0.02);

		//if(dataNameSpace.isRPITransformationDisaggregated) {
			//sankeyNameSpace.drawDisaggregateRPITransformation(xPosition*1.5, N2_1, N2_2, E4);
		//}

		//t.log("drawDisaggregateTransformation");
		//t.dump("inside drawDisaggregateTransformation");
	},

	//draw the disaggregate refinery and petrochemical industry transformation diagram
	drawDisaggregateRPIEHGTransformation: function (xPosition, N1, N6, E4) {
		var t = new speedTest();

		var nbTransformationNodes = 0;
		var nbRPITransformationNodes = 0;
		var nbEHGTransformationNodes = 0;

		var sumSizeFlow = 0;
		var sumRPISizeFlow = 0;
		var sumEHGSizeFlow = 0;

		var allTransformationNodes = Object.keys(sankeyNodes)
		.filter(function (n) { return (n.substring(0, 3) === "T2_" && n.substring(0, 5) !== "T2_6_" && n.substring(0, 6) !== "T2_11_" ) })
		.map(function (n) { return n.split("_").last() });

		var allRPITransformationNodes = Object.keys(sankeyNodes)
			.filter(function (n) { return n.substring(0, 5) === "T2_6_" })
			.map(function (n) { return n.split("_").last() });

		var allEHGTransformationNodes = Object.keys(sankeyNodes)
		.filter(function (n) { return n.substring(0, 6) === "T2_11_" })
		.map(function (n) { return n.split("_").last() });

		$.each(allTransformationNodes, function (idx, obj) {
			var f1 = new Flow("F2_" + obj + "_1");
			var f2 = new Flow("F2_" + obj + "_2");
			if (f1.isTiny && f2.isTiny) return;
			sumSizeFlow += Math.max(f1.size(), f2.size());
			nbTransformationNodes++;
		});

		$.each(allRPITransformationNodes, function (idx, obj) {
			var f1_6 = new Flow("F2_6_" + obj + "_1");
			var f2_6 = new Flow("F2_6_" + obj + "_2");
			if (f1_6.isTiny && f2_6.isTiny) return;
			sumRPISizeFlow += Math.max(f1_6.size(), f2_6.size());
			nbRPITransformationNodes++;
		});

		$.each(allEHGTransformationNodes, function (idx, obj) {
			var f1_11 = new Flow("F2_11_" + obj + "_1");
			var f2_11 = new Flow("F2_11_" + obj + "_2");
			if (f1_11.isTiny && f2_11.isTiny) return;
			sumEHGSizeFlow += Math.max(f1_11.size(), f2_11.size());
			nbEHGTransformationNodes++;
		});


		// total normalized height of disaggregated transformation sector (between N3 and N5)
		var heightTransformation = (sumSizeFlow + sumRPISizeFlow + sumEHGSizeFlow) / imgHeight + (nbTransformationNodes + nbRPITransformationNodes + nbEHGTransformationNodes - 3) * dataNameSpace.paddingTransformationFlow;


		//nodes
		var yTrans; // master y coordinate to define central y position of transformation and backflow nodes
		if (yScale.invert(N1.position.y + F5_1.size()) + heightTransformation + 2 * dataNameSpace.paddingN5N3 < (E4.positionNormalized.y - dataNameSpace.paddingN3E4))
			yTrans = yScale.invert(N1.position.y + F5_1.size() - Math.max(F2_1.size(), F2_2.size()) / 2) + heightTransformation / 2 + dataNameSpace.paddingN5N3;
		else
			yTrans = yScale.invert(E4.position.y - Math.max(F2_1.size(), F2_2.size()) / 2) - dataNameSpace.paddingN3E4 - heightTransformation / 2 - dataNameSpace.paddingN5N3;
		var N2_1 = new sankeyNode("N2_1", new Vec2(xScale.invert(N1.position.x + flowScale(flowScaleMax) + xScale(dataNameSpace.nodeThickness)), yTrans), true, false, "B");
		var N2_2 = new sankeyNode("N2_2", new Vec2(xScale.invert(N6.position.x - flowScale(flowScaleMax) - xScale(dataNameSpace.nodeThickness)), yTrans), true, false, "B");

		var nodeYPosition = yScale.invert(N2_1.position.y + Math.max(F2_1.size(), F2_2.size()) / 2) - heightTransformation / 2.;
		var N5 = new sankeyNode("N5", new Vec2(xPosition, Math.min(N1.positionNormalized.y, yScale.invert(yScale(nodeYPosition) - F5_1.size()) - 3.5*dataNameSpace.paddingN5N3)), true);

		//N1 -> N5
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F5_1, N1, N5, 0.2, 0);
		//N5 -> N6
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F5_2, N5, N6, 0.2, 1);
		//N1 -> N2_1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_1, N1, N2_1, 0.2);
		//N2_2 -> N6
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_2, N2_2, N6, 0.2);


		//RPI nodes
		var N2_6_1 = new sankeyNode("N2_6_1", new Vec2(xScale.invert(N2_1.position.x + flowScale(flowScaleMax) + xScale(dataNameSpace.nodeThickness)), yTrans/2.2), true, false);
		var N2_6_2 = new sankeyNode("N2_6_2", new Vec2(xScale.invert(N2_2.position.x - flowScale(flowScaleMax) - xScale(dataNameSpace.nodeThickness)), yTrans/2.2), true, false);

		if(dataNameSpace.isRPITransformationDisaggregated) {
			//N2_1 -> N2_6_1
			flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_6_1, N2_1, N2_6_1, 0.2);
			//N2_6_2 -> N2_2
			flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_6_2, N2_6_2, N2_2, 0.2);

			$.each(allRPITransformationNodes, function (idx, obj) {

				var inflow = new Flow("F2_6_" + obj + "_1");
				var outflow = new Flow("F2_6_" + obj + "_2");
				var losses = new Flow("F4_6_" + obj);

				var y = nodeYPosition;
				if(idx == 0) {
					y = yTrans/2.2;
					nodeYPosition += 1.5*(Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow);
				}

				var transformationNode = new sankeyNode("T2_6_" + obj, new Vec2(xPosition, y), true);
				flowNameSpace.draw(sankeyNameSpace.svgSankey, inflow, N2_6_1, transformationNode, 0.5, 0, "S", 1.3);
				flowNameSpace.draw(sankeyNameSpace.svgSankey, outflow, transformationNode, N2_6_2, 0.5, 0, "T", 1.3);
				flowNameSpace.draw(sankeyNameSpace.svgSankey, losses, transformationNode, E4, 0.2);
				if (inflow.isTiny && outflow.isTiny) return;
				if(idx != 0) nodeYPosition += Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow;
			});

			nodeYPosition += 1*dataNameSpace.paddingTransformationFlow;

			$.each(allTransformationNodes, function (idx, obj) {
				if(obj > 6 && obj < 11) {
					var inflow = new Flow("F2_" + obj + "_1");
					var outflow = new Flow("F2_" + obj + "_2");
					var losses = new Flow("F4_" + obj);
					var transformationNode = new sankeyNode("T2_" + obj, new Vec2(xPosition, nodeYPosition), true);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, inflow, N2_1, transformationNode, 0.5, 0, "S", 1.3);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, outflow, transformationNode, N2_2, 0.5, 0, "T", 1.3);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, losses, transformationNode, E4, 0.2);
					if (inflow.isTiny && outflow.isTiny) return;
					nodeYPosition += Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow;
				}
			});
		} else {
			$.each(allTransformationNodes, function (idx, obj) {
				if(obj < 11) {
					var inflow = new Flow("F2_" + obj + "_1");
					var outflow = new Flow("F2_" + obj + "_2");
					var losses = new Flow("F4_" + obj);
					var transformationNode = new sankeyNode("T2_" + obj, new Vec2(xPosition, nodeYPosition), true);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, inflow, N2_1, transformationNode, 0.5, 0, "S", 1.3);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, outflow, transformationNode, N2_2, 0.5, 0, "T", 1.3);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, losses, transformationNode, E4, 0.2);
					if (inflow.isTiny && outflow.isTiny) return;
					nodeYPosition += Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow;
				}
			});

			nodeYPosition += 1*dataNameSpace.paddingTransformationFlow;
		}


		//EHG nodes
		if(dataNameSpace.isEHGTransformationDisaggregated) {

			//set position depending disaggregation status
			var yOffset = 1.5;
			if(!dataNameSpace.isRPITransformationDisaggregated || nbRPITransformationNodes == 0) yOffset = 1.2;

			var N2_11_1 = new sankeyNode("N2_11_1", new Vec2(xScale.invert(N2_1.position.x + flowScale(flowScaleMax) + xScale(dataNameSpace.nodeThickness)), yTrans*yOffset), true, false, "B");
			var N2_11_2 = new sankeyNode("N2_11_2", new Vec2(xScale.invert(N2_2.position.x - flowScale(flowScaleMax) - xScale(dataNameSpace.nodeThickness)), yTrans*yOffset), true, false, "B");

			//N2_1 -> N2_11_1
			flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_11_1, N2_1, N2_11_1, 0.2);
			//N2_11_2 -> N2_2
			flowNameSpace.draw(sankeyNameSpace.svgSankey, F2_11_2, N2_11_2, N2_2, 0.2);

			$.each(allEHGTransformationNodes, function (idx, obj) {
				var inflow = new Flow("F2_11_" + obj + "_1");
				var outflow = new Flow("F2_11_" + obj + "_2");
				var losses = new Flow("F4_11_" + obj);
				var transformationNode = new sankeyNode("T2_11_" + obj, new Vec2(xPosition, nodeYPosition), true);
				flowNameSpace.draw(sankeyNameSpace.svgSankey, inflow, N2_11_1, transformationNode, 0.5, 0.1, "S", 1.3);
				flowNameSpace.draw(sankeyNameSpace.svgSankey, outflow, transformationNode, N2_11_2, 0.5, 0.1, "T", 1.3);
				flowNameSpace.draw(sankeyNameSpace.svgSankey, losses, transformationNode, E4, 0.2);
				if (inflow.isTiny && outflow.isTiny) return;
				nodeYPosition += Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow;
			});

			nodeYPosition += 1*dataNameSpace.paddingTransformationFlow;

			$.each(allTransformationNodes, function (idx, obj) {
				if(obj > 11) {
					var inflow = new Flow("F2_" + obj + "_1");
					var outflow = new Flow("F2_" + obj + "_2");
					var losses = new Flow("F4_" + obj);
					var transformationNode = new sankeyNode("T2_" + obj, new Vec2(xPosition, nodeYPosition), true);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, inflow, N2_1, transformationNode, 0.1, 0, "S", 1.3); //0.5 -> 0.2
					flowNameSpace.draw(sankeyNameSpace.svgSankey, outflow, transformationNode, N2_2, 0.1, 0, "T", 1.3);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, losses, transformationNode, E4, 0.2);
					if (inflow.isTiny && outflow.isTiny) return;
					nodeYPosition += Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow;
				}
			});
		}else {
			$.each(allTransformationNodes, function (idx, obj) {
				if(obj >= 11) {
					var inflow = new Flow("F2_" + obj + "_1");
					var outflow = new Flow("F2_" + obj + "_2");
					var losses = new Flow("F4_" + obj);
					var transformationNode = new sankeyNode("T2_" + obj, new Vec2(xPosition, nodeYPosition), true);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, inflow, N2_1, transformationNode, 0.5, 0, "S", 1.3);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, outflow, transformationNode, N2_2, 0.5, 0, "T", 1.3);
					flowNameSpace.draw(sankeyNameSpace.svgSankey, losses, transformationNode, E4, 0.2);
					if (inflow.isTiny && outflow.isTiny) return;
					nodeYPosition += Math.max(inflow.size(), outflow.size()) / imgHeight + dataNameSpace.paddingTransformationFlow;
				}
			});
		}


		// backflow
		N3 = new sankeyNode("N3", new Vec2(xPosition, nodeYPosition + dataNameSpace.paddingN5N3 - dataNameSpace.paddingTransformationFlow), true);
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F3, N2_2, N3, 0, 0.02);
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F3, N3, N2_1, 0, 0.02);

		//t.log("drawDisaggregateTransformation");
		//t.dump("inside drawDisaggregateTransformation");
	},

	drawDisaggregateAfterTransformation: function (N6) {
		var t = new speedTest();
		var N6_1 = new sankeyNode("N6_1", new Vec2(dataNameSpace.xN6_1 + dataNameSpace.coefDisaggregationTransformation, dataNameSpace.yMain), true);
		var E6_5 = new sankeyNode("E6_5", new Vec2(N6_1.positionNormalized.x, yScale.invert(N6_1.position.y + F6_1.size()) + dataNameSpace.paddingConsumption +0.28), true);
		var E6_8 = new sankeyNode("E6_8", new Vec2(xScale.invert(E6_5.position.x - F6_5.size()) - dataNameSpace.paddingNodeGroupX - 0.02, dataNameSpace.yBottom), false, true, "B");
		var E6_6 = new sankeyNode("E6_6", new Vec2(xScale.invert(E6_8.position.x - F6_8.size()) - dataNameSpace.paddingNodeGroupX, 0.9), false, true, "L");
		var E6_7 = new sankeyNode("E6_7", new Vec2(xScale.invert(E6_6.position.x - F6_6.size()) - dataNameSpace.paddingNodeGroupX, 0.75), false, true, "L");
		var E6_4 = new sankeyNode("E6_4", new Vec2(N6.positionNormalized.x + 5.0 * dataNameSpace.paddingNodeGroupX - 0.03, 0.8), false, false, "B");
		var E6_2 = new sankeyNode("E6_2", new Vec2(N6.positionNormalized.x + 3.0 * dataNameSpace.paddingNodeGroupX, 0.9), false, false, "B");
		var E6_3 = new sankeyNode("E6_3", new Vec2(N6.positionNormalized.x + 1.0 * dataNameSpace.paddingNodeGroupX, dataNameSpace.yBottom), false, false, "L");

		//N6 -> N6.1: Final consumption
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_1, N6, N6_1);
		//N6 -> N6.5: Consumption of the energy branch
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_5, N6, E6_5, 0.15, 0.99);
		//N6 -> N6.8: statistical difference - outflow
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_8, N6, E6_8, 0.2);
		//N6 -> N6.6: Distribution and transmission losses
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_6, N6, E6_6, 0.2);
		//N6 -> N6.7: international aviation
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_7, N6, E6_7, 0.2);
		//N6 -> N6.4: Marine bunkers
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_4, N6, E6_4, 0.2);
		//N6 -> E6.2: Stock build
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_2, N6, E6_2, 0.2);
		//N6 -> N6.3: Exports
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_3, N6, E6_3, 0.2);


		if (dataNameSpace.isFinalConsumptionDisaggregated) {
			sankeyNameSpace.drawDisaggregateFinalConsumption(N6_1);
		};

		if(dataNameSpace.isConsumptionForEnergyBranchDisaggregated){
			sankeyNameSpace.drawFlowGroup(dataNameSpace.xE6_5_X, E6_5, sankeyToolsNameSpace.getFlowList(["6_5_1", "6_5_2", "6_5_3","6_5_4", "6_5_5", "6_5_6","6_5_7", "6_5_8", "6_5_9","6_5_10", "6_5_11", "6_5_12","6_5_13", "6_5_14", "6_5_15", "6_5_16"]));
		};

		//t.log("drawDisaggregateAfterTransformation");
		//t.dump("inside drawDisaggregateAfterTransformation");
	},

	//draw the diagram when the final consumption node is disaggregated
	//the coefDisaggregationTransformation is added all the time
	//if the transformation group is disaggregated the coefDisaggregationTransformation value is changed
	//if the energy consumption is disaggregated we draw this part of diagram also
	drawDisaggregateFinalConsumption: function (N6_1) {
		var t = new speedTest();
		var F6_1_1 = new Flow("F6_1_1");
		var F6_1_2 = new Flow("F6_1_2");
		var N6_1_1 = new sankeyNode("N6_1_1", new Vec2(dataNameSpace.xN6_1_X + dataNameSpace.coefDisaggregationTransformation, N6_1.positionNormalized.y), true);
		var N6_1_2 = new sankeyNode("N6_1_2", new Vec2(dataNameSpace.xN6_1_X + dataNameSpace.coefDisaggregationTransformation, yScale.invert(N6_1_1.position.y + F6_1_1.size()) + dataNameSpace.paddingConsumption), true);

		//N6.1 -> N6.1.1
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_1_1, N6_1, N6_1_1, 0.2);
		//N6.1 -> E6.1.2
		flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_1_2, N6_1, N6_1_2, 0.2, 0.6);

		if(dataNameSpace.isEnergyConsumptionDisaggregated){
			sankeyNameSpace.drawDisaggregateEnergyConsumption(N6_1_1);
		};

		if(dataNameSpace.isNonEnergyConsumptionDisaggregated){
			sankeyNameSpace.drawFlowGroup(dataNameSpace.xN6_1_2_X, N6_1_2, sankeyToolsNameSpace.getFlowList(["6_1_2_1", "6_1_2_2", "6_1_2_3"]));
		};

		//t.log("drawDisaggregateFinalConsumption");

		//t.dump("inside drawDisaggregateFinalConsumption");
	},

	//draw the diagram when the energy consumption node is disaggregated
	//the coefDisaggregationTransformation is added all the time
	//if the transformation group is disaggregated the coefDisaggregationTransformation value is changed
	//if the industry, transport or other consumption nodes are disaggregated we draw this part of diagram also
	drawDisaggregateEnergyConsumption: function (N6_1_1) {
		var t = new speedTest();
		var F6_1_1_1 = new Flow("F6_1_1_1");
		var F6_1_1_2 = new Flow("F6_1_1_2");
		var F6_1_1_3 = new Flow("F6_1_1_3");

		// check if any of the energy consumptions sectors is further disaggregated
		if (dataNameSpace.isIndustryDisaggregated || dataNameSpace.isTransportDisaggregated || dataNameSpace.isOtherSectorsDisaggregated) {
			var numberSectors = (!F6_1_1_1.isTiny) + (!F6_1_1_2.isTiny) + (!F6_1_1_3.isTiny);
			var x = dataNameSpace.xN6_1_1_X_dis + dataNameSpace.coefDisaggregationTransformation;
			var y = (numberSectors > 1) ? dataNameSpace.yN6_1_1_X_X : N6_1_1.positionNormalized.y;
			var paddingSectors = (numberSectors == 2 ? 4. : 1.5) * dataNameSpace.paddingNodeGroupY;
			var industryFlows, transportFlows, otherFlows;

			// industry
			var N6_1_1_1 = new sankeyNode("N6_1_1_1", new Vec2(x, y), true);
			//N6.1.1 -> N6.1.1.1
			flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_1_1_1, N6_1_1, N6_1_1_1, 0.2, 0.6);
			if (!F6_1_1_1.isTiny) {
				if (dataNameSpace.isIndustryDisaggregated) {
					industryFlows = sankeyToolsNameSpace.initializeChildFlows(F6_1_1_1);
					y = sankeyNameSpace.drawFlowGroup(dataNameSpace.xN6_1_1_X_X, N6_1_1_1, industryFlows);
				} else {
					y += F6_1_1_1.size() / imgHeight;
				};
				y += paddingSectors;
			};

			// transport
			if (!F6_1_1_2.isTiny) {
				var nodeHeight = F6_1_1_2.size() / imgHeight;
				if (dataNameSpace.isTransportDisaggregated) {
					transportFlows = sankeyToolsNameSpace.initializeChildFlows(F6_1_1_2);
					y += sankeyToolsNameSpace.getGroupHeight(transportFlows) / 2 - nodeHeight / 2;
				};
			};
			var N6_1_1_2 = new sankeyNode("N6_1_1_2", new Vec2(x, y), true);
			//N6.1.1 -> N6.1.1.2
			flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_1_1_2, N6_1_1, N6_1_1_2, 0.2, 0.8);
			if (!F6_1_1_2.isTiny) {
				if (dataNameSpace.isTransportDisaggregated) {
					y = sankeyNameSpace.drawFlowGroup(dataNameSpace.xN6_1_1_X_X, N6_1_1_2, transportFlows);
				} else {
					y += nodeHeight;
				};
				y += paddingSectors;
			};

			// other
			if (!F6_1_1_3.isTiny) {
				if (dataNameSpace.isOtherSectorsDisaggregated) {
					otherFlows = sankeyToolsNameSpace.initializeChildFlows(F6_1_1_3);
					y += sankeyToolsNameSpace.getGroupHeight(otherFlows) / 2 - F6_1_1_3.size() / imgHeight / 2;
				};
			};
			var N6_1_1_3 = new sankeyNode("N6_1_1_3", new Vec2(x, y), true);
			//N6.1.1 -> N6.1.1.3
			flowNameSpace.draw(sankeyNameSpace.svgSankey, F6_1_1_3, N6_1_1, N6_1_1_3, 0.2, 0.6);
			if (!F6_1_1_3.isTiny) {
				if (dataNameSpace.isOtherSectorsDisaggregated) {
					y = sankeyNameSpace.drawFlowGroup(dataNameSpace.xN6_1_1_X_X, N6_1_1_3, otherFlows);
				};
			};

		// all energy consumption sectors aggregated
		} else {
			sankeyNameSpace.drawFlowGroup(dataNameSpace.xN6_1_1_X_agg, N6_1_1, [F6_1_1_1, F6_1_1_2, F6_1_1_3]);
		};

		//t.log("drawDisaggregateEnergyConsumption");

		//t.dump("inside drawDisaggregateEnergyConsumption");
	},

	// draw a flow group
	// The coefDisaggregationTransformation is added all the time in the case where transformation node is disaggregated
	drawFlowGroup: function (xIn, sourceNode, flowList) {
		var t = new speedTest();
		var x = xIn + dataNameSpace.coefDisaggregationTransformation;
		var y = Math.max(dataNameSpace.maxTopNode, sourceNode.positionNormalized.y + (sourceNode.size() / imgHeight - sankeyToolsNameSpace.getGroupHeight(flowList)) / 2);
		$.each(flowList, function (idx, obj) {
			var code = "E" + obj.code.substring(1, 99);
			if (typeof sankeyNodes[code] === "undefined") code = "N" + code.substring(1, 99);
			var targetNode = new sankeyNode(code, new Vec2(x, y), true, false, "E_R");
			flowNameSpace.draw(sankeyNameSpace.svgSankey, obj, sourceNode, targetNode, 0.4, 0.2, "S", 1.5);
			if (obj.isTiny) return;
			y += obj.size() / imgHeight + dataNameSpace.paddingNodeGroupY;
		});
		return (y - dataNameSpace.paddingNodeGroupY);

		//t.log("drawFlowGroup");

		//t.dump("inside drawFlowGroup");
	}
};