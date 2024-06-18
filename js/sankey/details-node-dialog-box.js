var detailsboxNameSpace = {
	details: "default",
	detailsDialogBox: null,

	detailsNodeBox: function (id, titleModalBox) {
		if (detailsboxNameSpace.detailsDialogBox !== null) {
			closeDialogBox(detailsboxNameSpace.detailsDialogBox);
		}
		detailsboxNameSpace.detailsDialogBox = new jBox('Modal', {
			addClass: 'check-style-modal position-box-modal',
			id: 'details-node-box-modal',
			constructOnInit: true,
			position: {
				x: 'left',
				y: 'center'
			},
			title: languageNameSpace.labels["BOX_NODE_DETAILS_TITLE"],
			blockScroll: false,
			overlay: false,
			closeOnClick: 'body',
			closeOnEsc: true,
			closeButton: 'box',
			draggable: 'title',
			repositionOnOpen: true,
			repositionOnContent: true,
			preventDefault: true,
			width: 230,
			height: 'auto',
			zIndex: jBox.zIndexMax + 1,
			content: detailsboxNameSpace.fillNodeDetailsModalContent(),
			// Once jBox is closed, destroy it
			onCloseComplete: function () {
				this.destroy();
			}
		});
		detailsboxNameSpace.detailsDialogBox.open();
	},

	triggerDetailsState: function () {
		document.getElementById("node-details-" + detailsboxNameSpace.details).checked = true;
	},
	
	setNodeDetails: function (details) {
		closeDialogBox(detailsboxNameSpace.detailsDialogBox);
		detailsboxNameSpace.details = details;
		REF.nodeDisagg = dataNameSpace.nodesDisaggregated[details];
		
		//reset animation when changing details
		if(timelineNameSpace.isAutoplayLoaded) {
			timelineNameSpace.resetAutoplayTimeline();
		} else {
			dataNameSpace.dataLoaded = false;
			sankeyNameSpace.drawDiagram();
			
		}
	},
	
	fillNodeDetailsModalContent: function () {
		var content = 
			"<div id=\"dialog-details-node-content\">"
				+"<div class=\"buttonStyle\">"
					+"<input type=\"radio\" name=\"radio\"  id=\"node-details-all\" class=\"radio\" onclick=\"detailsboxNameSpace.setNodeDetails('all');\">"
					+"<label for=\"node-details-all\">"+languageNameSpace.labels["EXPAND_NODES"]+"</label>"
				+"</div>"
				+"<div class=\"buttonStyle\">"
					+"<input type=\"radio\" name=\"radio\"  id=\"node-details-none\" class=\"radio\" onclick=\"detailsboxNameSpace.setNodeDetails('none');sankeyToolsNameSpace.resetZoom();\">"
					+"<label for=\"node-details-none\">"+languageNameSpace.labels["COLLAPSE_NODES"]+"</label>"
				+"</div>"
				+"<div class=\"buttonStyle\">"
					+"<input type=\"radio\" name=\"radio\"  id=\"node-details-default\" class=\"radio\" onclick=\"detailsboxNameSpace.setNodeDetails('default');sankeyToolsNameSpace.resetZoom();\">"
					+"<label for=\"node-details-default\">"+languageNameSpace.labels["DEFAULT_VIEW"]+"</label>"
				+"</div>"
			+"</div>";
		return content;
	}
};
