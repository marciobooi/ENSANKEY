// var exportbarboxNameSpace = {
// 	titleOnly: true,
// 	valueOnly: true,
// 	exportBarBox: null,

// 	drawExportBarChartDialogBox: function (barChartID) {
// 		if (exportbarboxNameSpace.exportBarBox !== null) {
// 			closeDialogBox(exportbarboxNameSpace.exportBarBox);
// 		}
// 		exportbarboxNameSpace.exportBarBox = new jBox('Modal', {
// 			addClass: 'check-style-modal position-box-modal',
// 			id: 'export-bar-chart-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: 'center',
// 				y: 'center'
// 			},
// 			title: languageNameSpace.labels["SAVE_BAR_CHART"],
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
// 			content: exportbarboxNameSpace.fillExportBarChartModalContent(),
// 			// Once jBox is closed, destroy it
// 			onCloseComplete: function () {
// 				this.destroy();
// 			}
// 		});
// 		exportbarboxNameSpace.exportBarBox.barChartID = barChartID;
// 		exportbarboxNameSpace.exportBarBox.open();
// 	},

// 	fillExportBarChartModalContent: function () {
// 		var content = 
// 			"<div id=\"dialog-export-bar-chart-content\">"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\" id=\"export-bar-image\" class=\"radio\" onclick=\"exportImageNameSpace.exportBarChartAsPNG(exportbarboxNameSpace.exportBarBox.barChartID, 'bar-chart.png');\">"
// 					+"<label for=\"export-bar-image\">"+languageNameSpace.labels["SAVE_PNG_IMAGE"]+"</label>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\" id=\"export-bar-data\" class=\"radio\" onclick=\"saveTextAsFile(formatBarChartsAsCSV(exportbarboxNameSpace.exportBarBox.barChartID), 'bar-chart-data.csv');\">"
// 					+"<label for=\"export-bar-data\">"+languageNameSpace.labels["SAVE_DATA_TABLE"]+"</label>"
// 				+"</div>"
// 			+"</div>"
// 		return content;
// 	}
// };
