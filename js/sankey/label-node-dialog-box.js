// var labelboxNameSpace = {
// 	titleOnly: true,
// 	valueOnly: dataNameSpace.isLargeRes,
// 	labelDialogBox: null,

// 	labelNodeBox: function (id, titleModalBox) {
// 		if (labelboxNameSpace.labelDialogBox !== null) {
// 			closeDialogBox(labelboxNameSpace.labelDialogBox);
// 		}
// 		labelboxNameSpace.labelDialogBox = new jBox('Modal', {
// 			addClass: 'check-style-modal position-box-modal',
// 			id: 'label-node-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: 'left',
// 				y: 'center'
// 			},
// 			title: languageNameSpace.labels["BOX_NODE_LABELS_TITLE"],
// 			blockScroll: false,
// 			overlay: false,
// 			closeOnClick: 'body',
// 			closeOnEsc: true,
// 			closeButton: 'box',
// 			draggable: 'title',
// 			repositionOnOpen: true,
// 			repositionOnContent: true,
// 			preventDefault: true,
// 			width: 230,
// 			height: 'auto',
// 			content: labelboxNameSpace.fillNodeLabelsModalContent(),
// 			// Once jBox is closed, destroy it
// 			onCloseComplete: function () {
// 				this.destroy();
// 			}
// 		});
// 		labelboxNameSpace.labelDialogBox.open();
// 	},

// 	triggerLabelState: function () {
// 		var id;
// 		if (labelboxNameSpace.titleOnly && labelboxNameSpace.valueOnly) {
// 			id = "title-value";
// 		} else if (labelboxNameSpace.titleOnly) {
// 			id = "title-only";
// 		} else if (labelboxNameSpace.valueOnly) {
// 			id = "value-only";
// 		} else {
// 			id = "no-label";
// 		}
// 		document.getElementById(id).checked = true;
// 	},

// 	hideNodeLabels: function () {
// 		closeDialogBox(labelboxNameSpace.labelDialogBox);
// 		labelboxNameSpace.titleOnly = false;
// 		labelboxNameSpace.valueOnly = false;
		
// 		//reset animation when changing label status
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		} else {
// 			dataNameSpace.dataLoaded = false;
// 			sankeyNameSpace.drawDiagram();
// 			//sankeyNameSpace.drawDiagramFromSankeyDB();
// 		}
// 	},

// 	displayTitleValueNode: function () {
// 		closeDialogBox(labelboxNameSpace.labelDialogBox);
// 		labelboxNameSpace.titleOnly = true;
// 		labelboxNameSpace.valueOnly = true;
		
// 		//reset animation when changing label status
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		} else {
// 			dataNameSpace.dataLoaded = false;
// 			sankeyNameSpace.drawDiagram();
// 			//sankeyNameSpace.drawDiagramFromSankeyDB();
// 		}
// 	},

// 	displayTitleNode: function () {
// 		closeDialogBox(labelboxNameSpace.labelDialogBox);
// 		labelboxNameSpace.titleOnly = true;
// 		labelboxNameSpace.valueOnly = false;
		
// 		//reset animation when changing node status
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		} else {
// 			dataNameSpace.dataLoaded = false;
// 			sankeyNameSpace.drawDiagram();
// 			//sankeyNameSpace.drawDiagramFromSankeyDB();
// 		}
// 	},

// 	displayValueNode: function () {
// 		closeDialogBox(labelboxNameSpace.labelDialogBox);
// 		labelboxNameSpace.titleOnly = false;
// 		labelboxNameSpace.valueOnly = true;

// 		//reset animation when changing noe status
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		} else {
// 			//sankeyNameSpace.drawDiagram();
// 			sankeyNameSpace.drawDiagramFromSankeyDB();
// 		}
// 	},
	
// 	fillNodeLabelsModalContent: function () {
// 		var content = 
// 			"<div id=\"dialog-label-node-content\">"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\"  id=\"no-label\" class=\"radio\" onclick=\"labelboxNameSpace.hideNodeLabels();\">"
// 					+"<label for=\"no-label\">"+languageNameSpace.labels["NO_LABELS"]+"</label>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\"  id=\"title-only\" class=\"radio\" onclick=\"labelboxNameSpace.displayTitleNode();\">"
// 					+"<label for=\"title-only\">"+languageNameSpace.labels["TITLE_ONLY"]+"</label>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 					+"<input type=\"radio\" name=\"radio\"  id=\"value-only\" class=\"radio\" onclick=\"labelboxNameSpace.displayValueNode();\">"
// 					+"<label for=\"value-only\">"+languageNameSpace.labels["VALUE_ONLY"]+"</label>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\" id=\"button-title-value\">"
// 					+"<input type=\"radio\" name=\"radio\"  id=\"title-value\" class=\"radio\" onclick=\"labelboxNameSpace.displayTitleValueNode();\">"
// 					+"<label for=\"title-value\">"+languageNameSpace.labels["TITLE_AND_VALUE"]+"</label>"
// 				+"</div>"
// 			+"</div>"
		
// 			+"<script>labelboxNameSpace.triggerLabelState();</script>";
// 		return content;
// 	}
	

// };
