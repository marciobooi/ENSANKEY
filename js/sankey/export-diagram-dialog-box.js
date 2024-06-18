var exportdiagramNameSpace = {
	titleOnly: true,
	valueOnly: true,
	exportPieBox: null,

	drawExportDiagramDialogBox: function () {

		exportdiagramNameSpace.exportDiagram = new jBox('Modal', {
			addClass: 'check-style-modal position-box-modal',
			id: 'export-diagram-box-modal',
			constructOnInit: true,
			position: {
				x: 'center',
				y: 'center'
			},
			title: languageNameSpace.labels["SAVE_DIAGRAM_FLOW"],
			blockScroll: false,
			overlay: false,
			closeOnClick: 'body',
			closeOnEsc: true,
			closeButton: 'box',
			draggable: 'title',
			repositionOnOpen: true,
			repositionOnContent: true,
			preventDefault: true,
			width: 240,
			height: 'auto',
			zIndex: jBox.zIndexMax + 1,
			content: fillExportDiagramDialogModalContent(),
			// Once jBox is closed, destroy it
			onCloseComplete: function () {
				this.destroy();
			}
		});
		exportdiagramNameSpace.exportDiagram.open();
	}
};

function fillExportDiagramDialogModalContent() {
	
	var containerFrameYear = "";
	if(timelineNameSpace.isAutoplayLoaded) {
		containerFrameYear = REF.year*100;
	} 

	var content = 	
		"<div id=\"dialog-export-diagram-content\">"
			/*+"<div class=\"buttonStyle\">"
				+"<input type=\"radio\" name=\"radio\"  id=\"export-diagram-image\" class=\"radio\" onclick=\"exportImageNameSpace.exportDiagramAsPNG('#svg-container');\">"
				+"<label for=\"export-diagram-image\">"+languageNameSpace.labels["SAVE_DIAGRAM_PNG"]+"</label>"
			+"</div>"*/
			+"<div class=\"buttonStyle\">"
				+"<input type=\"radio\" name=\"radio\"  id=\"export-whole-diagram-PDF\" class=\"radio\" onclick=\"exportImageNameSpace.exportWholeDiagramAsPDF('diagramContainer"+containerFrameYear+"');\">"
				+"<label for=\"export-whole-diagram-PDF\">"+languageNameSpace.labels["SAVE_WHOLE_DIAGRAM_PDF"]+"</label>"
			+"</div>"
			+"<div class=\"buttonStyle\">"
				+"<input type=\"radio\" name=\"radio\"  id=\"export-current-diagram-PDF\" class=\"radio\" onclick=\"exportImageNameSpace.exportDiagramAsPDF('diagramContainer"+containerFrameYear+"');\">"
				+"<label for=\"export-current-diagram-PDF\">"+languageNameSpace.labels["SAVE_CURRENT_DIAGRAM_PDF"]+"</label>"
			+"</div>"
		+"</div>";
		
	return content;
};
