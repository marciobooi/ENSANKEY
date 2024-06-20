// var optionbarboxNameSpace = {
// 	titleOnly: true,
// 	valueOnly: true,
// 	optionBarBox: null,
// 	nodeId: "",
// 	barChartID: "",

// 	drawOptionBarChartDialogBox: function (barChartID) {
// 		if (optionbarboxNameSpace.optionBarBox !== null) {
// 			closeDialogBox(optionbarboxNameSpace.optionBarBox);
// 		}
		
// 		optionbarboxNameSpace.barChartID = barChartID;
// 		var tmp = barChartID.split("-");
// 		optionbarboxNameSpace.nodeId = tmp[tmp.length-1];
		
// 		optionbarboxNameSpace.optionBarBox = new jBox('Modal', {
// 			addClass: 'check-style-modal position-box-modal',
// 			id: 'option-bar-chart-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: 'center',
// 				y: 'center'
// 			},
// 			title: languageNameSpace.labels["OPTIONS_BAR_CHART"],
// 			blockScroll: false,
// 			overlay: false,
// 			closeOnClick: 'body',
// 			closeOnEsc: true,
// 			closeButton: 'box',
// 			draggable: 'title',
// 			repositionOnOpen: true,
// 			repositionOnContent: true,
// 			preventDefault: true,
// 			width: 320,
// 			height: 'auto',
// 			zIndex: jBox.zIndexMax + 1,
// 			content: optionbarboxNameSpace.fillOptionBarChartModalContent(),
// 			// Once jBox is closed, destroy it
// 			onCloseComplete: function () {
// 				this.destroy();
// 			}
// 		});

// 		optionbarboxNameSpace.optionBarBox.barChartID = barChartID;
// 		optionbarboxNameSpace.optionBarBox.open();
// 	},

// 	fillOptionBarChartModalContent: function () {
// 		var content = 
// 			"<div id=\"dialog-option-bar-chart-content\">"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\" id=\"option-bar-image\" class=\"radio\" onclick=\"barChartNameSpace.openCountryFilterDialogBox(optionbarboxNameSpace.optionBarBox.barChartID);\">"
// 					+"<label for=\"option-bar-image\">"+languageNameSpace.labels["BOX_FILTER_COUNTRY"]+"</label>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\" id=\"option-bar-data\" class=\"radio\" onclick=\"barChartNameSpace.normalizeData(optionbarboxNameSpace.optionBarBox.barChartID);\">"
// 					+"<label for=\"option-bar-data\">"+(barCharts[optionbarboxNameSpace.nodeId].isDataNormalized? languageNameSpace.labels["BOX_DENORM_DATA"]:languageNameSpace.labels["BOX_NORM_DATA"])+"</label>"
// 				+"</div>"
// 			+"</div>"
// 		return content;
// 	}
// };
