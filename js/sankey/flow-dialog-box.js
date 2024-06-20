// var flowboxNameSpace = {
// 	flowBoxDisplaied: false,
// 	flowBoxOnload: false,
// 	widthFlowDialogBox: 480,
// 	heightFlowDialogBox: 130,
// 	idClickedFuel: null,
// 	numberClickedFuel: -1,
// 	flowBox: null,

// 	flowDialogBox: function (idClickedFuel, iFuel, idListener) {
// 		flowboxNameSpace.idClickedFuel = idClickedFuel;
// 		flowboxNameSpace.numberClickedFuel = iFuel;
// 		var container = document.querySelector("#" + idListener);
// 		container.addEventListener("mouseup", flowboxNameSpace.getClickFlowPosition, false);
// 	},

// 	getClickFlowPosition: function (e) {
// 		var xPosition = e.clientX;
// 		var yPosition = e.clientY + document.documentElement.scrollTop;
// 		var flowDialogBoxPosition = calculateDialogBoxPosition(xPosition, yPosition, flowboxNameSpace.widthFlowDialogBox, flowboxNameSpace.heightFlowDialogBox);
// 		flowboxNameSpace.drawFlowDialogBox(flowDialogBoxPosition);
// 		document.querySelector("#" + this.id).removeEventListener("mouseup", flowboxNameSpace.getClickFlowPosition, false);
// 	},

// 	drawFlowDialogBox: function (boxPosition) {
// 		var title;
// 		var idFuel = flowboxNameSpace.idClickedFuel;
// 		if (idFuel === "losses") {
// 			title = fuelLossesLabel;
// 		} else {
// 			title = languageNameSpace.labels[idFuel];
// 		}
// 		if (flowboxNameSpace.flowBox !== null) {
// 			closeDialogBox(flowboxNameSpace.flowBox);
// 		}
// 		flowboxNameSpace.flowBox = new jBox('Modal', {
// 			id: 'flow-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: boxPosition.x,
// 				y: boxPosition.y,
// 			},
// 			title: title,
// 			blockScroll: false,
// 			overlay: false,
// 			closeOnClick: 'body',
// 			closeOnEsc: true,
// 			closeButton: 'box',
// 			draggable: 'title',
// 			height: 120,
// 			content: flowboxNameSpace.fillFlowsDialogModalContent(),
// 			onCloseComplete: function () {
// 				this.destroy();
// 			}
// 		});
// 		flowboxNameSpace.flowBox.open();
// 	},

// 	disaggregateFlow: function (isDisaggregateFlowButtonChecked) {
// 		closeDialogBox(flowboxNameSpace.flowBox);
// 		if (isDisaggregateFlowButtonChecked) {
// 			REF.fuels = flowboxNameSpace.idClickedFuel;
// 			REF.flowDisagg = true;
// 		} else {
// 			for (var fuel in fuelMap) {
// 				if (fuelMap[fuel].IndexOf(flowboxNameSpace.idClickedFuel) >= 0) {
// 					REF.fuels = fuel;
// 					break;
// 				}
// 			}
// 			REF.flowDisagg = false;
// 		}
// 		REF.highlight = "_";

// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		}

// 		sankeyNameSpace.drawDiagram();

// 	},

// 	selectFuelFamily: function () {
// 		closeDialogBox(flowboxNameSpace.flowBox);
// 		if (dataNameSpace.isFuelFamilySelected) {
// 			REF.fuels = "TOTAL";
// 			dataNameSpace.isFuelFamilySelected = false;
// 		} else {
// 			REF.fuels = flowboxNameSpace.idClickedFuel;
// 			dataNameSpace.isFuelFamilySelected = true;
// 		}
// 		REF.highlight = "_";
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		}

// 		sankeyNameSpace.drawDiagram();
// 	},

// 	highlightFuel: function () {
// 		closeDialogBox(flowboxNameSpace.flowBox);
// 		if (REF.highlight.contains("_"+flowboxNameSpace.numberClickedFuel.toString()+"_")) {
// 			REF.highlight = "_";
// 		} else {
// 			REF.highlight += flowboxNameSpace.numberClickedFuel.toString()+"_";
// 		};
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		}

// 		dataNameSpace.dataLoaded = false;
// 		sankeyNameSpace.drawDiagram();
// 	},

// 	glossaryFlow: function (idFuel, title) {
// 		if (idFuel === undefined) {
// 			if (flowboxNameSpace.idClickedFuel === "losses") {
// 				title = fuelLossesLabel;
// 				idFuel = "TOTAL";
// 			} else {
// 				idFuel = flowboxNameSpace.idClickedFuel;
// 				title = languageNameSpace.labels[idFuel];
// 			}
// 			closeDialogBox(flowboxNameSpace.flowBox);
// 		}
// 		glossaryboxNameSpace.glossaryBox(idFuel, title);
// 	},

// 	triggerDisaggregateFlow: function () {

// 		$("#onoffswitchFlowDisagregation").prop("checked", REF.flowDisagg);
// 		if (REF.flowDisagg && aggregateFuels.includes(REF.fuels)) {
// 			$("#aggregate-flow-title").text(languageNameSpace.labels["HIDE_FUELS_DETAILS"]);
// 		}
// 		if (flowboxNameSpace.idClickedFuel === "losses" || !aggregateFuels.includes(REF.fuels)) {
// 			$("#onoffswitchFlowDisagregation").attr('disabled', 'disabled');
// 			$("#aggregate-flow-box").attr('onclick', null);
// 			$("#aggregate-flow-box").css('cursor', 'default');
// 			$("#aggregation-flow label").css("cursor", "default");
// 			$("#aggregation-flow").addClass("fade-out");
// 		}
// 	},

// 	triggerFuelFamily: function () {
// 		var urlIcon = null;
// 		var id = flowboxNameSpace.idClickedFuel;
// 		if (id === "losses") {
// 			id = "TOTAL";
// 		}
// 		if (!REF.flowDisagg && !dataNameSpace.isFuelFamilySelected) {
// 			$("#fuel-family-icon").attr('disabled', 'disabled');
// 			$("#fuel-family").addClass("fade-out");
// 			$("#fuel-family-box").attr('onclick', null);
// 			$("#fuel-family-box").css('cursor', 'default');

// 		} else {
// 			$("#fuel-family-icon").prop("checked", dataNameSpace.isFuelFamilySelected);
// 		}

// 		if (dataNameSpace.isFuelFamilySelected) {
// 			id = "TOTAL";
// 			var titleFuelFamily = languageNameSpace.labels["BACK_ALL_FUELS"];
// 			$("#fuel-title").text(titleFuelFamily);
// 		}

// 		urlIcon = "img/fuel-family/" + id + ".png";
// 		$("#fuel-family-icon").attr("src", urlIcon);
// 	},

// 	triggerFuelHighlight: function () {
// 		if (!REF.flowDisagg || !aggregateFuels.includes(REF.fuels)) {
// 			$("#highlight").addClass("fade-out");
// 			$("#fuel-highlight-box").attr('onclick', null);
// 			$("#fuel-highlight-box").css('cursor', 'default');
// 			$("#fuel-highlight").attr('disabled', 'disabled');

// 		}
// 		if (REF.highlight !== "_" && REF.highlight.contains("_"+flowboxNameSpace.numberClickedFuel.toString()+"_")) {
// 			var title = languageNameSpace.labels["NO_HIGHLIGHT"];
// 			$("#highlight-fuel-title").text(title);
// 		}

// 		if (flowboxNameSpace.idClickedFuel === "losses") {
// 			flowboxNameSpace.disabledLossesFlowBox();
// 		}
// 	},

// 	disabledLossesFlowBox: function () {
// 		$("#onoffswitchFlowDisagregation").attr('disabled', 'disabled');
// 		$("#aggregate-flow-box").attr('onclick', null);
// 		$("#aggregate-flow-box").css('cursor', 'default');
// 		$("#aggregation-flow label").css("cursor", "default");
// 		$("#aggregation-flow").addClass("fade-out");
// 		$("#fuel-family-icon").attr('disabled', 'disabled');
// 		$("#fuel-family").addClass("fade-out");
// 		$("#fuel-family-box").attr('onclick', null);
// 		$("#fuel-family-box").css('cursor', 'default');
// 		$("#highlight").addClass("fade-out");
// 		$("#fuel-highlight-box").attr('onclick', null);
// 		$("#fuel-highlight-box").css('cursor', 'default');
// 		$("#fuel-highlight").attr('disabled', 'disabled');
// 	},

// 	fillFlowsDialogModalContent: function () {
// 		var content =
// 			"<div id=\"dialog-flow-content\">"
// 				+"<div id=\"aggregation-flow\" class=\"data-box\">"
// 					+"<label  for=\"onoffswitchFlowDisagregation\">"
// 						+"<div class =\"data-sub-box\" id=\"aggregate-flow-box\">"
// 							+"<span class=\"switchFlow\">"
// 								+"<input id=\"onoffswitchFlowDisagregation\" type=\"checkbox\" />"
// 								+"<label for=\"onoffswitchFlowDisagregation\"></label>"
// 							+"</span>"
// 							+"<p id=\"aggregate-flow-title\">"+languageNameSpace.labels["SHOW_FUELS_DETAILS"]+"</p>"
// 						+"</div>"
// 					+"</label>"
// 				+"</div>"
// 				+"<div id=\"highlight\" class=\"data-box\">"
// 					+"<div class =\"data-sub-box\" id=\"fuel-highlight-box\" onclick=\"flowboxNameSpace.highlightFuel();\">"
// 						+"<input id=\"fuel-highlight\" type=\"image\" src=\"img/dialog-box/highlight-fuel.png\" style=\"width:50px\"></input>"
// 						+"<p id=\"highlight-fuel-title\">"+languageNameSpace.labels["HIGHLIGHT_FUEL"]+"</p>"
// 					+"</div>"
// 				+"</div>"
// 				+"<div id=\"fuel-family\" class=\"data-box\">"
// 					+"<div class =\"data-sub-box\" id=\"fuel-family-box\" onclick=\"flowboxNameSpace.selectFuelFamily();\">"
// 						+"<input id=\"fuel-family-icon\" type=\"image\" style=\"width:50px\"></input>"
// 						+"<p id=\"fuel-title\">"+languageNameSpace.labels["INTO_FUEL_FAMILY"]+"</p>"
// 					+"</div>"
// 				+"</div>"
// 				+"<div id=\"definition\" class=\"data-box\">"
// 					+"<div class =\"data-sub-box\" id=\"glossary-flow-box\" onclick=\"flowboxNameSpace.glossaryFlow();\">"
// 						+"<input id=\"glossary-flow\" type=\"image\" src=\"img/dialog-box/definitions.png\" style=\"width:50px\"></input>"
// 						+"<p id=\"defintions\">"+languageNameSpace.labels["DEFINITIONS"]+"</p>"
// 					+"</div>"
// 				+"</div>"
// 			+"</div>"

// 			+"<script>"
// 				+"flowboxNameSpace.triggerDisaggregateFlow();"
// 				+"flowboxNameSpace.triggerFuelFamily();"
// 				+"flowboxNameSpace.triggerFuelHighlight();"

// 				+"$('#aggregation-flow .switchFlow input[type=checkbox]').change(function () {"
// 					+"flowboxNameSpace.disaggregateFlow($('#onoffswitchFlowDisagregation').is(':checked'));"
// 				+"});"
// 			+"</script>";
// 		return content;
// 	}
// };
