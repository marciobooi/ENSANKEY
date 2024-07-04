var sankeyToolsNameSpace = {

	disaggregationState: function (refState, idDisaggregateNode) {

		// shortcut if function is called without a specific node to (dis-)aggregate
		if (typeof idDisaggregateNode === "undefined") return refState;

		// initial state array
		var state = refState.split("").map(function (bit) { return bit > 0 });

		// this encodes the mapping from the node code onto the bit position in the state string
		// DO NOT TOUCH IT !!!
		var stateMap = {
			"N1_1": 0,
			"N1": 1,
			"T2": 2,
			"N2_1": 2,
			"N2_2": 2,
			"N6": 3,
			"N6_1": 4,
			"N6_1_1": 5,
			"N6_1_2": 6,
			"N6_1_1_1": 7,
			"N6_1_1_2": 8,
			"N6_1_1_3": 9,
			"E6_5": 10,
			"T2_6": 11,
			"N2_6_1": 11,
			"N2_6_2": 11,
			"T2_11": 12,
			"N2_11_1": 12,
			"N2_11_2": 12,
		};

		// update state
		state[stateMap[idDisaggregateNode]] = !state[stateMap[idDisaggregateNode]]

		// aggregate child nodes if parent is aggregated:
		state[stateMap["N1_1"]] *= state[stateMap["N1"]];
		state[stateMap["N6_1"]] *= state[stateMap["N6"]];
		state[stateMap["N6_1_1"]] *= state[stateMap["N6_1"]];
		state[stateMap["N6_1_2"]] *= state[stateMap["N6_1"]];
		state[stateMap["N6_1_1_1"]] *= state[stateMap["N6_1_1"]];
		state[stateMap["N6_1_1_2"]] *= state[stateMap["N6_1_1"]];
		state[stateMap["N6_1_1_3"]] *= state[stateMap["N6_1_1"]];
		state[stateMap["T2_6"]] *= state[stateMap["T2"]];
		state[stateMap["T2_11"]] *= state[stateMap["T2"]];

		// convert state array to string
		stateString = "";
		$.each(state, function (ibit, bit) {
			stateString += bit ? "1" : "0"
		});

		return stateString;
	},

	updateDisaggregationFlags: function (stateString) {
		var state = stateString.split("").map(function (bit) {
			return bit > 0
		});
		if (state.length != 13) {
			error("sankeyToolsNameSpace.updateDisaggregationFlags: state length = " + state.length);
			return;
		};

		// cf. stateMap object in updateDisaggregationFlags
		dataNameSpace.isProductionDisaggregated = state[0];
		dataNameSpace.isAllSourcesDisaggregated = state[1];
		dataNameSpace.isTransformationDisaggregated = state[2];
		dataNameSpace.isAfterTransformationDisaggregated = state[3];
		dataNameSpace.isFinalConsumptionDisaggregated = state[4];
		dataNameSpace.isEnergyConsumptionDisaggregated = state[5];
		dataNameSpace.isNonEnergyConsumptionDisaggregated = state[6];
		dataNameSpace.isIndustryDisaggregated = state[7];
		dataNameSpace.isTransportDisaggregated = state[8];
		dataNameSpace.isOtherSectorsDisaggregated = state[9];
		dataNameSpace.isConsumptionForEnergyBranchDisaggregated = state[10];
		dataNameSpace.isRPITransformationDisaggregated = state[11];
		dataNameSpace.isEHGTransformationDisaggregated = state[12];
	},

	// calculate diagram width from disaggregation flags
	getCropWidth: function (isDisaggregation, idDisaggregateNode) {
		var width = dataNameSpace.cropDefaultWidth;

		// update transformation crop width
		dataNameSpace.coefDisaggregationTransformation = 0.3 * dataNameSpace.isTransformationDisaggregated;

		// transformation
		if (dataNameSpace.isTransformationDisaggregated && dataNameSpace.isAfterTransformationDisaggregated)
			width += dataNameSpace.cropDisaggregationTransformation;

		// final consumption
		if (dataNameSpace.isFinalConsumptionDisaggregated || dataNameSpace.isConsumptionForEnergyBranchDisaggregated)
			width += dataNameSpace.cropDisaggregationFinalConsumption;

		// final (non-)energy consumption
		if (dataNameSpace.isEnergyConsumptionDisaggregated || dataNameSpace.isNonEnergyConsumptionDisaggregated)
			width += dataNameSpace.cropDisaggregationEnergyConsumption;

		// energy consumption sectors
		if (dataNameSpace.isIndustryDisaggregated || dataNameSpace.isTransportDisaggregated || dataNameSpace.isOtherSectorsDisaggregated)
			width += dataNameSpace.cropDisaggregationIndustryTransportOther;

		return width;
	},

	getGroupHeight: function (flowsList) {
		var height = 0;
		var sumSizeFlows = 0;
		var nbFlows = 0;
		$.each(flowsList, function (idx, obj) {
			if (obj.isTiny) return;
			sumSizeFlows += obj.size();
			nbFlows++;
		});
		height = sumSizeFlows / imgHeight + ((nbFlows - 1) * dataNameSpace.paddingNodeGroupY);
		return height;
	},

	getFlowList: function (codelist) {
		var list = [];
		$.each(codelist, function (idx, obj) {
			var fl = new Flow("F" + obj);
			list.push(fl);
		});
		return list;
	},

	//initialize groups of child flows emerging from a single parent node
	initializeChildFlows: function (parentFlow) {
		var childCodes = [];
		var refCodes = Object.keys(sankeyNodes).map(function (n) { return n.substring(1, 99) });
		var iFlow = 1;
		while (true) {
			var code = parentFlow.code.substring(1, 99) + "_" + iFlow;
			if (!refCodes.contains(code)) break;
			childCodes.push(code);
			iFlow++;
		};
		return this.getFlowList(childCodes);
	},

	//social media
	shareSocial: function (event) {
		var type = event.type;
		var targetClassName = event.target.className;
		var currentUrl = window.location.href;
		var encodedUrl = encodeURIComponent(currentUrl);
		var targetUrl = targetClassName.includes("linkedin")
			? 'https://www.linkedin.com/shareArticle?mini=true&title=Energy%20flow%20diagram&url=' + encodedUrl
			: targetClassName.includes("twitter")
			? 'https://twitter.com/share?text=Energy%20flow%20diagram&url=' + encodedUrl
			: targetClassName.includes("facebook")
			? 'https://www.facebook.com/sharer.php?t=Energy%20flow%20diagram&u=' + encodedUrl
			: targetClassName.includes("feedback")
			? "mailto:ESTAT-ENERGY@ec.europa.eu?subject=Energy%20flow%20diagram&body="
			: "mailto:?subject=Circular%20economy%20flow%20diagrams&body=";			

		if (type === "click" || (type === "keydown" && event.key === "Enter")) {
			window.open(
				(targetUrl += encodedUrl),
				targetClassName.includes("envelop") ? "_self" : "_blank",
				"menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=450,width=650"
			);
		
			event.preventDefault();
			event.stopPropagation();
		}
	},

	// reset zoom function
	resetZoom: function () {
		sankeyNameSpace.zoom.translate([dataNameSpace.reset.translateX,dataNameSpace.reset.translateY,]).scale(dataNameSpace.reset.scale);
		//   this is for the whole display of the diagram
		if (timelineNameSpace.isAutoplayLoaded) {
			$.each(timeSeries, function (iyear, year) {
				$("#zoom" + year * 100).attr(
					"transform",
					"translate(" +
						sankeyNameSpace.zoom.translate() +
						")scale(" +
						sankeyNameSpace.zoom.scale() +
						")"
				);
			});

		} else {
			$("#zoom").attr("transform","translate(" +sankeyNameSpace.zoom.translate() +")scale(" +sankeyNameSpace.zoom.scale() +")");
			$("#tb-tutorial-btn").focus()
		}

		dataNameSpace.setRefURL();
	},
	resetZoomOnExport: function () {
		var nodesDis = dataNameSpace.ref.nodeDisagg;

		const inputExpanded = nodesDis.charAt(0) === "1";
		const outputExpanded = ["5", "6", "8", "9"].some(
			(d) => nodesDis.charAt(d) === "1"
		);

		let zoomParams = {
			translateX: dataNameSpace.reset.translateX + 310,
			translateY: dataNameSpace.reset.translateY + 90,
			scale: dataNameSpace.reset.scale + 0,
		};

		if (inputExpanded) {
			zoomParams.translateX = dataNameSpace.reset.translateX + 290
		}

		sankeyNameSpace.zoom
			.translate([zoomParams.translateX, zoomParams.translateY])
			.scale(zoomParams.scale);
	},

	//initialize zoom content
	initZoom: function (action) {
		$("#zoom-content").draggable();
		if (action) {
			sankeyToolsNameSpace.zoomClick(action);
			event.preventDefault();
		} else {
			const btnZoom = document.getElementsByClassName("btn-zoom");
			Array.from(btnZoom).forEach((element) => {
				element.addEventListener("click", function (e) {
					sankeyToolsNameSpace.zoomClick(element.getAttribute("rel"));
					e.preventDefault();
				});
			});

			// Add mouse wheel event listener
			$("#svg-container").on("wheel", function (event) {
				event.preventDefault();
				const zoomFactor = 0.1;
				const delta = Math.sign(event.originalEvent.deltaY); // Get the scroll direction
				const action = delta > 0 ? "out" : "in"; // Determine zoom action based on scroll direction
				sankeyToolsNameSpace.zoomClick(action);
			});
		}
	},

	//put the diagram size when zoom in or out
	zoomed: function () {
		//    console.log("zoomed");
		//save zoom parameters
		// console.log(
		// 	"zoomed",
		// 	sankeyNameSpace.zoom.translate(),
		// 	sankeyNameSpace.zoom.scale()
		// );
		var zParam = sankeyNameSpace.zoom.translate().toString().split(",");
		sankeyNameSpace.translateX = zParam[0];
		sankeyNameSpace.translateY = zParam[1];
		sankeyNameSpace.scale = sankeyNameSpace.zoom.scale();

		REF.translateX = sankeyNameSpace.translateX;
		REF.translateY = sankeyNameSpace.translateY;
		REF.scale = sankeyNameSpace.scale;
		//console.log("zoomed", REF.translateX, REF.translateY, REF.scale)

		sankeyNameSpace.svgSankey.attr(
			"transform",
			"translate(" +
				sankeyNameSpace.zoom.translate() +
				")" +
				"scale(" +
				sankeyNameSpace.zoom.scale() +
				")"
		);

		//Move frames when dragging diagram
		var interFrame = 100 / dataNameSpace.nbFrames;
		var totalFrame = timeSeries.length * dataNameSpace.nbFrames;
		var interValue = 0;
		// var loopframe = totalFrame - dataNameSpace.nbFrames + 1; // FIXME RHI
		var loopframe = 1;

		if (
			document.getElementById(
				"zoom" + timelineNameSpace.firstYearTimeLine * 100
			)
		) {
			for (var i = 0; i < loopframe; i++) {
				interValue = timelineNameSpace.firstYearTimeLine * 100 + interFrame * i;
				interValue =
					document.querySelector("#diagramYearInfo").textContent * 100;
				document
					.getElementById("zoom" + interValue)
					.setAttribute(
						"transform",
						"translate(" +
							REF.translateX +
							"," +
							REF.translateY +
							")" +
							"scale(" +
							sankeyNameSpace.zoom.scale() +
							")"
					);
			}

			//stop animation
			timelineNameSpace.stopAutoplayTimeline();
		}
	},

	interpolateZoom: function (translate, scale) {
		//    console.log("interpolateZoom");
		dataNameSpace.ref.scale = scale;
		var self = this;
		return (
			d3.transition()
				.duration(350) // FIXME RHI
				// .duration(1)
				.tween("zoom", function () {
					var iTranslate = d3.interpolate(
							sankeyNameSpace.zoom.translate(),
							translate
						),
						iScale = d3.interpolate(sankeyNameSpace.zoom.scale(), scale);
					return function (t) {
						sankeyNameSpace.zoom.scale(iScale(t)).translate(iTranslate(t));
						sankeyToolsNameSpace.zoomed();
					};
				})
		);
	},

	//calculate the diagram position after clicking zoom in or zoom out buttons
	zoomClick: function (action) {
		if (action == "reset") {
			sankeyToolsNameSpace.resetZoom();
			sankeyToolsNameSpace.btnZoomUpdate(dataNameSpace.reset.scale);
			return;
		}

		var direction = action == "in" ? 1 : -1,
		factor = 0.2,
			target_zoom = sankeyNameSpace.zoom.scale() * (1 + factor * direction),
		center = [imgWidth / 2, imgHeight / 2],
		extent = sankeyNameSpace.zoom.scaleExtent(),
		translate = sankeyNameSpace.zoom.translate(),
		translate0 = [],
		l = [],
		view = {
			x: translate[0],
			y: translate[1],
			k: sankeyNameSpace.zoom.scale()
		};

		target_zoom = target_zoom > extent[1] ? extent[1] : target_zoom;
		target_zoom = target_zoom < extent[0] ? extent[0] : target_zoom;

		var direction = action == "in" ? 1 : -1,
			factor = 0.1,
			target_zoom = sankeyNameSpace.zoom.scale() * (1 + factor * direction),
			center = [imgWidth / 2, imgHeight / 2],
			extent = sankeyNameSpace.zoom.scaleExtent(),
			translate = sankeyNameSpace.zoom.translate(),
			translate0 = [],
			l = [],
			view = {
				x: translate[0],
				y: translate[1],
				k: sankeyNameSpace.zoom.scale(),
			};

		target_zoom = target_zoom > extent[1] ? extent[1] : target_zoom;
		target_zoom = target_zoom < extent[0] ? extent[0] : target_zoom;

		translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
		view.k = target_zoom;
		l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];
		view.x += center[0] - l[0];
		view.y += center[1] - l[1];

		sankeyToolsNameSpace.interpolateZoom([view.x, view.y], view.k);
		sankeyToolsNameSpace.btnZoomUpdate(view.k);
	},

	//action after zoom
	endZoom: function () {
		//    console.log("endZoom");
		$("#diagramYearInfo").fadeOut(1000);
	},
	btnZoomUpdate: function (scale) {
		zoom = ((scale / dataNameSpace.reset.scale) * 100).toFixed(0);
		$("#zoom-reset").html(zoom + "%");
	},
};
