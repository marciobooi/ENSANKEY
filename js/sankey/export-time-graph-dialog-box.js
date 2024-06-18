var exporttimeboxNameSpace = {
	titleOnly: true,
	valueOnly: true,
	exportTimeBox: null,

	drawExportTimeGraphDialogBox: function (timeGraphID) {
		if (exporttimeboxNameSpace.exportTimeBox !== null) {
			closeDialogBox(exporttimeboxNameSpace.exportTimeBox);
		}
		exporttimeboxNameSpace.exportTimeBox = new jBox('Modal', {
			addClass: 'check-style-modal position-box-modal',
			id: 'export-time-graph-box-modal',
			constructOnInit: true,
			position: {
				x: 'center',
				y: 'center'
			},
			title: languageNameSpace.labels["SAVE_TIME_GRAPH"],
			blockScroll: false,
			overlay: false,
			closeOnClick: 'body',
			closeOnEsc: true,
			closeButton: 'box',
			draggable: 'title',
			repositionOnOpen: true,
			repositionOnContent: true,
			preventDefault: true,
			width: 320,
			height: 'auto',
			zIndex: jBox.zIndexMax + 1,
			content: fillexportTimeGraphDialogModalContent(),
			/*ajax: {
				url: 'modal-boxes/dialogBoxExportTimeGraph.html',
				data: 'id=1',
				reload: true
			},*/
			// Once jBox is closed, destroy it
			onCloseComplete: function () {
				this.destroy();
			}
		});
		exporttimeboxNameSpace.exportTimeBox.timeGraphID = timeGraphID;
		exporttimeboxNameSpace.exportTimeBox.open();
	}
};

function fillexportTimeGraphDialogModalContent() {
	var content = 
		"<div id=\"dialog-export-time-graph-content\">"
			+"<div class=\"buttonStyle\">"
				+"<input type=\"radio\" name=\"radio\"  id=\"export-time-image\" class=\"radio\" onclick=\"exportImageNameSpace.exportTimeGraphAsPNG(exporttimeboxNameSpace.exportTimeBox.timeGraphID, 'time-graph.png');\">"
				+"<label for=\"export-time-image\">"+languageNameSpace.labels["SAVE_PNG_IMAGE"]+"</label>"
			+"</div>"
			+"<div class=\"buttonStyle\">"
				+"<input type=\"radio\" name=\"radio\"  id=\"export-time-data\" class=\"radio\" onclick=\"saveTextAsFile(formatTimeGraphsAsCSV(exporttimeboxNameSpace.exportTimeBox.timeGraphID), 'time-graph-data.csv');\">"
				+"<label for=\"export-time-data\">"+languageNameSpace.labels["SAVE_DATA_TABLE"]+"</label>"
			+"</div>"
		+"</div>";
	return content;
};
