var legendBoxNameSpace = {
	legendDialogBox: null,
	isLegendDisplayed: true,
	displayLegendByDefault: true,
	legendBox: function () {
		if (legendBoxNameSpace.isLegendDisplayed && !legendBoxNameSpace.displayLegendByDefault) {
			closeDialogBox(legendBoxNameSpace.legendDialogBox);
			legendBoxNameSpace.legendDialogBox = null;
		}

		legendBoxNameSpace.legendDialogBox = new jBox('Modal', {
			addClass: 'position-legend-box-modal',
			id: 'legend-box-modal',
			constructOnInit: true,
			position: {
				x: 'left',
				y: 'bottom'
			},
			title: languageNameSpace.labels["LEGEND_TITLE"],
			blockScroll: false,
			overlay: false,
			draggable: 'title',
			closeButton: 'none',
			closeOnEsc: false,
			content: $(legendBoxNameSpace.fillLegendContent()),
			repositionOnOpen: true,
			repositionOnContent: true,
			preventDefault: true,
			onCloseComplete: function () {this.destroy()},
			onCreated: function () {
				const div1 = document.getElementById('diagramContainer');
				const div2 = document.getElementById('legend-box-modal');
			
				insertAfter(div2, div1);
			  }
		});
		legendBoxNameSpace.legendDialogBox.open();
		legendBoxNameSpace.displayLegendByDefault = false;
		$("#legend-box-modal").css({ "top": "" });
	},

	fillLegendContent: function () {
		const content = document.createElement("ol");
		//set order in fuel list
		var fuelList = [];
		$.each(fuelMap(REF.fuels, REF.flowDisagg), function (idx, obj) {
			if(dataNameSpace.fuelListDrawn.contains(obj)) {
				fuelList.push(obj);
			}
		});
    content.className = "list-unstyled";
    content.id = "graph-legend-box-content";

		$.each(fuelList, function (idx, obj) {

			const elIcon = mkIconElement();
			const elText = mkFuelTextElement();
      const elAnchor = mkAnchorElement();
			const elLegendItem = mkLegendElement();

      elAnchor.appendChild(elIcon);
      elAnchor.appendChild(elText);
      elLegendItem.appendChild(elAnchor);
      content.appendChild(elLegendItem);

      function mkLegendElement() {
        // <a class="dropdown-item d-flex justify-content-start align-items-center" href="#"
        const el = document.createElement("li")
        el.className = "button-legend";
        return el;
      }

      function mkAnchorElement() {
				const i = getFuelIdx();
        const el = document.createElement("a");
				el.setAttribute("role", "button");
        el.className = "link-dark";
        el.href = "#";
        el.id = "legend-" + obj.toLowerCase();
        el.onclick = function () {
					nsMainModal.legendDialogBox(obj.toString(), i, "legend-box-modal"); //prettier-ignore
        };
        return el;
      }

			function mkFuelTextElement() {
				const fuelTextEl = document.createElement("span");
				fuelTextEl.className = "title";
				fuelTextEl.innerHTML = getFuelName(obj);
				return fuelTextEl;
			}

			function mkIconElement() {
				const legendIcon = document.createElement("span");
				legendIcon.className = "icon-legend-color";
				if (!REF.flowDisagg) {
					legendIcon.classList.add("icon-legend-color__total");
				}
				if (!dataNameSpace.isFuelFamilySelected) {
					const elIconImage = mkIconImgElement();
					legendIcon.appendChild(elIconImage);
				}
				legendIcon.style.backgroundColor = getFuelColor();
				return legendIcon;
			}

			function mkIconImgElement() {
				const fuelImg = document.createElement("img");
				fuelImg.className = "icon-legend";
				fuelImg.alt = "";
				fuelImg.src = "img/fuel-family/" + obj + ".png";
				return fuelImg;
			}

			function getFuelColor() {
				const i = getFuelIdx();
				let colour =
					REF.highlight !== "_" && !REF.highlight.contains(i.toString())
						? "rgb(150, 176, 176)"
						: fuelColors[obj];
				colour = REF.flowDisagg ? colour : fuelColors["TOTAL"];
				return colour;
			}

			function getFuelIdx() {
				return fuelMap(REF.fuels, dataNameSpace.isAllFlowsDisaggregated).indexOf(obj); //prettier-ignore
			}
		});

		return content;
	},

	drawFuelFamily: function (idFuel) {
		if (idFuel.toString() == "TOTAL") {
			dataNameSpace.isAllFlowsDisaggregated = true;
		} else {
			dataNameSpace.isFuelFamilySelected = true;
		}
		REF.fuels = idFuel.toString();
		REF.highlight = "_";

		//reset animation when changing node fuel family
		if(timelineNameSpace.isAutoplayLoaded) {
			timelineNameSpace.resetAutoplayTimeline();
		} else {
			sankeyNameSpace.drawDiagram();
		}
	},

	reduceLegendSize: function () {
		$('#legend-box-modal .button-legend .icon-legend-color').css({ "height": "20px", "width": "20px" });
		$('#legend-box-modal .button-legend .icon-legend').css({ "height": "15px", "margin-left": "3px", "margin-top": "3px" });
		$('#legend-box-modal .button-legend .title').css({ "font-size": "10px" });
		$('#legend-box-modal .button-legend').css({ "height": "20px" });
	}
};
