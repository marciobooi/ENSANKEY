// var exportpieboxNameSpace = {
// 	titleOnly: true,
// 	valueOnly: true,
// 	exportPieBox: null,

// 	drawExportPieChartDialogBox: function (pieChartID) {
// 		if (exportpieboxNameSpace.exportPieBox !== null) {
// 			closeDialogBox(exportpieboxNameSpace.exportPieBox);
// 		}
// 		exportpieboxNameSpace.exportPieBox = new jBox('Modal', {
// 			addClass: 'check-style-modal position-box-modal',
// 			id: 'export-pie-chart-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: 'center',
// 				y: 'center'
// 			},
// 			title: languageNameSpace.labels["SAVE_PIE_CHART"],
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
// 			content: exportpieboxNameSpace.fillExportPieChartModalContent(),
// 			// Once jBox is closed, destroy it
// 			onCloseComplete: function () {
// 				this.destroy();
// 			}
// 		});
// 		exportpieboxNameSpace.exportPieBox.pieChartID = pieChartID;
// 		exportpieboxNameSpace.exportPieBox.open();
// 	},

// 	fillExportPieChartModalContent: function () {
// 		var content = 
// 			"<div id=\"dialog-export-pie-chart-content\">"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\" id=\"export-pie-image\" class=\"radio\" onclick=\"exportImageNameSpace.exportAsPNG(exportpieboxNameSpace.exportPieBox.pieChartID, 'pie-chart.png');\">"
// 					+"<label for=\"export-pie-image\">"+languageNameSpace.labels["SAVE_PNG_IMAGE"]+"</label>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\" id=\"export-pie-data\" class=\"radio\" onclick=\"saveTextAsFile(formatPieChartsAsCSV(exportpieboxNameSpace.exportPieBox.pieChartID), 'pie-chart-data.csv');\">"
// 					+"<label for=\"export-pie-data\">"+languageNameSpace.labels["SAVE_DATA_TABLE"]+"</label>"
// 				+"</div>"
// 			+"</div>"
// 		return content;
// 	}
// };
