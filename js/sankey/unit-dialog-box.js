// var unitboxNameSpace = {
// 	unitDialogBox: null,

// 	drawUnitDialogBox: function (nodeDialogBoxPosition) {
// 		if (unitboxNameSpace.unitDialogBox !== null) {
// 			closeDialogBox(unitboxNameSpace.unitDialogBox);
// 		}
// 		unitboxNameSpace.unitDialogBox = new jBox('Modal', {
// 			addClass: 'check-style-modal position-box-modal',
// 			id: 'unit-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: 'left',
// 				y: 'center'
// 			},
// 			title: languageNameSpace.labels["BOX_UNIT_TITLE"],
// 			blockScroll: false,
// 			overlay: false,
// 			closeOnClick: 'body',
// 			closeOnEsc: true,
// 			closeButton: 'box',
// 			draggable: 'title',
// 			content: unitboxNameSpace.fillUnitModalContent(),
// 			repositionOnOpen: true,
// 			repositionOnContent: true,
// 			preventDefault: true,
// 			width: 380,
// 			height: 'auto',
// 			// Once jBox is closed, destroy it
// 			onCloseComplete: function () {
// 				this.destroy();
// 			}
// 		});
// 		unitboxNameSpace.unitDialogBox.open();
// 	},

// 	fillUnitModalContent: function () {
// 		var content = "";
// 		$.each(energyUnits, function (idx, obj) {
// 			var checkUnit = "";
// 			if (REF.unit == idx) {
// 				checkUnit = "checked";
// 			}
// 			var unit = "<div class=\"buttonStyle\">"
// 				 + "<input type=\"radio\" name=\"radio\"  id=\"" + idx + "\" class=\"radio\" onclick=\"unitboxNameSpace.changeUnit('" + idx + "')\" " + checkUnit + ">"
// 				 + "<label for=\"" + idx + "\">" + obj.label + " (" + idx + ")</label>"
// 				 + "</div>";
// 			content = content + unit;
// 			var i = 0;
// 		});
// 		return content;
// 	},

// 	changeUnit: function (unit) {
// 		closeDialogBox(unitboxNameSpace.unitDialogBox);
// 		REF.unit = unit;
		
// 		//reset animation when changing unit
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		} else {
// 			//sankeyNameSpace.drawDiagram();
// 			sankeyNameSpace.drawDiagramFromSankeyDB();

// 		}

// 	}
// };
