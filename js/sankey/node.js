// Node object constructor
//node name
//node position (X,Y)
//whether node is vertical (true) or horizontal (false)
//new node object
var labelboxNameSpace = {
	titleOnly: true,
	valueOnly: true,
};
var sankeyNode = function (code, positionNormalized, vertical, reverse, position) {
	this.code = code;
	this.name = languageNameSpace.labels[code];
	this.positionNormalized = positionNormalized.clone();
	this.position = new Vec2(xScale(positionNormalized.x), yScale(positionNormalized.y));
	this.vertical = (typeof vertical === 'undefined') ? true : vertical;
	this.reverse = (typeof reverse === 'undefined') ? false : reverse;
	this.flowIn = new Flow(code + "_inflow");
	this.flowOut = new Flow(code + "_outflow");
	this.nodeIn = [];
	this.nodeOut = [];
	this.thickness = xScale(dataNameSpace.nodeThickness);
	this.draw = true;
	this.labelPosition = (typeof position !== "undefined") ? position : "T";
};

// return current position to attach a new in-/out-flow
sankeyNode.prototype.positionIO = function (isInflow) {
	var size = (isInflow) ? this.flowIn.size() : this.flowOut.size();
	var thickness = (0.5 - isInflow) * this.thickness;
	var shift = new Vec2(thickness, (1. - 2. * this.reverse) * size);
	if (!this.vertical) {
		shift.set(shift.y, shift.x);
	}
	return this.position.Plus(shift);
};

sankeyNode.prototype.positionIn = function () {
	return this.positionIO(true);
};
sankeyNode.prototype.positionOut = function () {
	return this.positionIO(false);
};

// loss function: in-/out-flow balance at the node
sankeyNode.prototype.loss = function () {
	return (this.flowIn.value - this.flowOut.value);
};

sankeyNode.prototype.value = function () {
	return Math.max(this.flowIn.value, this.flowOut.value)
};

sankeyNode.prototype.size = function () {
	return Math.max(this.flowIn.size(), this.flowOut.size())
};

sankeyNode.prototype.checkEnergyConservation = function (thresh) {
	if (typeof thresh === "undefined") thresh = dataNameSpace.energyWarningThreshold;
	if (!this.nodeIn.length || !this.nodeOut.length || this.code.substring(0, 1) === "T") return 0;
	var fMin = Math.min(Math.abs(this.flowIn.value), Math.abs(this.flowOut.value));
	var fMax = Math.max(Math.abs(this.flowIn.value), Math.abs(this.flowOut.value));
	if (fMax < 2 * dataNameSpace.drawFuelValueThreshold / thresh) return 0;
	var relDiff = 1. - (fMin / fMax);
	return (relDiff > thresh) ? relDiff : 0;
};



// protect global node drawing function by a NameSpace
nodeNameSpace = {

	// global node bookkeeping
	nodeListDrawn: {}, // keep track of all node instances drawn in the current view
	warningNodes: [], // container for all nodes that get a warning due to energy non-conservation
	// windowH: $(window).height(),

	// CORE node drawing function
	draw: function (canvas, n, ref) {
		var displayName = "", displayValue = "";
		var gapLabelDiagram = 3, gapNameValue = 2, gapLabelRight = 8;

		// draw each node only once
		if (!n.draw) return;
		n.draw = false;

		var nodeSize = Math.max(n.size(), 3 * dataNameSpace.drawFuelMinPixelSize);

		//calculate node positions
		var { ty, tx, wx, x, y, wy } = getNodePosition();

		var scaleRes = (dataNameSpace.isLargeRes || (labelboxNameSpace.titleOnly && labelboxNameSpace.valueOnly)) ? 1. : 1.5;
		var fontSize = scaleRes * dataNameSpace.nodeFontRel * imgHeight;
		var tyName = ty;
		var txLabel = tx;
		var tyValue = ty;
		var lineHeight = imgHeight / 80.

		if (n.reverse) {
			txLabel -= wx;
		};

		getLabelPosition();

		if (!labelboxNameSpace.titleOnly) {
			displayName = "none";
		};

		var nodeContainer = canvas
		.append("g")
		.attr("class", "node")
		.attr("font-size", fontSize + "px")
		.attr("style","font-family: Arial,sans-serif;")

		// add acccessibility to the sankey nodes
		.attr("aria-label", function () {
			return languageNameSpace.labels[n.code] + ", value: " + printNumber(n.value()) + " " + REF.unit;
		})
		.attr("class", "node node_" + n.code)
		.attr("font-stretch", "normal")
		.attr("style", "font-family: Arial,sans-serif;")
		.attr("role", "group")
		.attr("tabindex", 0)
		.on("keydown", function () {
			var event = d3.event; // Get the event object
			if (event.key === "Enter") {
			  // Perform the desired action when the Enter key is pressed
			  console.log("Enter key pressed on node: " + languageNameSpace.labels[n.code]);
			}
		  })


		var labelNode = nodeContainer.append("text");
		var nameNode = labelNode.append('tspan');
		var valueNode = labelNode.append('tspan');

		// energy value string
		var energyValue = printNumber(n.value()) + " " + REF.unit;
		var energyValueId = "energyValue_" + n.code;

		//add label
		labelNode
		.attr("class", "labelNode");

		//add the node name
		nameNode
		.attr("class", "nameNode")
		.attr("id", "energyValue_" + n.code)
		.attr("x", txLabel)
		.attr("y", tyName)
		.attr("display", displayName)
		.text(n.name)




		.call(wrap);

		if (!labelboxNameSpace.valueOnly) {
			displayValue = "none";
		}

		//add the node value
		valueNode
			.attr("id", energyValueId)
			.attr("x", txLabel)
			.attr("y", tyValue)
			.attr("display", displayValue)
			.attr("class", "valueNode")
			.text(energyValue);

		// handle tiny nodes click area
		setAreaForTinyNode();

		//add visible node form corresponding to actual node size
		appendNodeArrowHead(x, y, wx, wy, 1, ref);

		function getNodePosition() {
			var x, y, wx, wy, tx, ty;
			if (n.vertical) {
				wx = n.thickness;
				wy = nodeSize;
				tx = n.position.x - n.thickness / 2.;
				ty = n.position.y;
				x = tx;
				y = ty - n.reverse * wy;
			} else {
				wx = nodeSize;
				wy = n.thickness;
				tx = n.position.x;
				ty = n.position.y - n.thickness / 2.;
				x = tx - n.reverse * wx;
				y = ty;
			};
			return { ty, tx, wx, x, y, wy };
		}

		function getLabelPosition() {
			switch (n.labelPosition) {
				case "B":
					tyName += wy + lineHeight + gapLabelDiagram;
					tyValue = tyName + lineHeight + gapNameValue;
					if (!labelboxNameSpace.titleOnly)
						tyValue = tyName;
					break;
				case "L":
					tyValue = tyName + lineHeight + gapNameValue;
					if (!labelboxNameSpace.titleOnly)
						tyValue -= lineHeight;
					break;
				case "R":
					txLabel += n.size() + gapLabelRight;
					tyValue = tyName + lineHeight + gapNameValue;
					if (!labelboxNameSpace.titleOnly)
						tyValue -= lineHeight;
					break;
				case "E_R":
					txLabel += wx + gapLabelDiagram;
					tyName += n.thickness / 2;
					tyValue = tyName + lineHeight + gapNameValue;
					if (!labelboxNameSpace.titleOnly)
						tyValue -= lineHeight;
					break;
				case "T":
					tyValue -= gapLabelDiagram;
					tyName = tyValue - lineHeight - gapNameValue;
					if (!labelboxNameSpace.valueOnly)
						tyName += lineHeight;
					break;
				default:
					fatal("nodeNameSpace.draw: unknown position tag = " + n.labelPosition);
			};
		}

		function setAreaForTinyNode() {
			if (wx < dataNameSpace.nodeSizeMin || wy < dataNameSpace.nodeSizeMin) {
				var xx, yy, wxx, wyy;
				if (n.vertical) {
					xx = x;
					wxx = wx;
					yy = y + (nodeSize - dataNameSpace.nodeSizeMin) / 2;
					wyy = dataNameSpace.nodeSizeMin;
				} else {
					xx = x + (nodeSize - dataNameSpace.nodeSizeMin) / 2;
					wxx = dataNameSpace.nodeSizeMin;
					yy = y;
					wyy = wy;
				};

				//add invisible node area for clicking
				appendNodeArrowHead(xx, yy, wxx, wyy, 0, ref);
			};
		}

		function appendNodeArrowHead(x, y, wx, wy, opacity, ref) {
			var isDragging = false;


			const graphMouseDown = function () {
				initDragPosition = { "translateX": REF.translateX, "translateY": REF.translateY };
				currentDragPosition = { "translateX": REF.translateX, "translateY": REF.translateY };
				$(window).mousemove(function () {
					isDragging = true;
					$("path").css({ cursor: "move" });
					$(window).unbind("mousemove");
				});
			};
			const graphMouseUp = function () {
				var isChrome = !!window.chrome && !!window.chrome.webstore; //Detect Chrome browser to avoid the bug of double clicking on a node to open node menu
				if (!isChrome) { //others browsers
					var wasDragging = isDragging;
					isDragging = false;
					$("path").css({ cursor: "" });
					$(window).unbind("mousemove");
					if (!wasDragging) { nodeboxNameSpace.nodeDialogBox(n); }
				} else { //Workaround for Chrome bug https://bugs.chromium.org/p/chromium/issues/detail?id=161464
					currentDragPosition = { "translateX": REF.translateX, "translateY": REF.translateY };
					if (initDragPosition.translateX != currentDragPosition.translateX || initDragPosition.translateY != currentDragPosition.translateY) {
						$('path').css({ 'cursor': '' });
						$(window).unbind("mousemove");
						initDragPosition = { "translateX": currentDragPosition.translateX, "translateY": currentDragPosition.translateY };
					} else {
						nodeboxNameSpace.nodeDialogBox(n);
						$("path").css({ cursor: "" });
						$(window).unbind("mousemove");
					}
				}
			};

			var pathPoly = getNodeShapePath(wy, x, wx, y);
			var nodeClass = n.code + ref;
			// opacity = .5;

			nodeContainer
				.append("path")
				.attr("d", pathPoly.join(" "))
				.attr("class", nodeClass)
				.attr("id", "node_" + n.code)
				.style("opacity", opacity)
				// .style("fill", "#195757") // black opacity 0.5 over green
				.style("fill", "black") // black opacity 0.4 over green
				// .style("fill", "#237a7a") // black opacity 0.3 over green
				.on("mousedown", graphMouseDown)
				.on("mouseup", graphMouseUp)
				// .append("title")
				// .text(function () {
				// 	var value = `${n.name}: ${energyValue}`;
				// 	return value;
				// });
				

	const svgPath = d3.select("#node_" + n.code);
  
	const argsTooltip = {
	  material: [n.name],
	  value: [printNumber(n.value()) + " " + REF.unit],
	  name: [n.name],
	};
  
	svgPath.on("mousemove", handleTooltip);
	svgPath.on("focus", handleTooltip);
	svgPath.on("mouseout", hideTooltipSankey);
	svgPath.on("blur", hideTooltipSankey);

	  function handleTooltip(e) {
		showTooltipNode(
		  d3.event,
		  argsTooltip.value,
		  argsTooltip.material,
		  argsTooltip.name
		)
	  } 

  

		};

		function getNodeShapePath(wy, x, wx, y) {
			var bottom_y = y + wy;
			var right_x = x + wx;
			var pathPoly = [];

			if (n.code === "N3") {
				backwardArrowhead();
			} else if (n.vertical) {
				forwardArrowhead();
			} else {
				downwardArrowhead();
			}

			return pathPoly;

			function downwardArrowhead() {
				var arrowPeak_wx = wx / 2;
				var arrowPeak_wy = wx <= 25 ? (wx / 2) * 0.66 : (wx / 2) * 0.33; // make chevron sharper for thinner nodes

				pathPoly.push("M", x, y);
				pathPoly.push("V", bottom_y);
				pathPoly.push("l", arrowPeak_wx, arrowPeak_wy);
				pathPoly.push("L", right_x, bottom_y);
				pathPoly.push("V", y);
				pathPoly.push("Z");
			}

			function backwardArrowhead() {
				var arrowPeak_wx = wy <= 25 ? (wy / 2) * 0.66 : (wy / 2) * 0.33; // make chevron sharper for thinner nodes
				var arrowPeak_wy = wy / 2;

				pathPoly.push("M", x, y);
				pathPoly.push("l", -arrowPeak_wx, arrowPeak_wy);
				pathPoly.push("L", x, bottom_y);
				pathPoly.push("H", right_x);
				pathPoly.push("V", y);
				pathPoly.push("Z");
			}

			function forwardArrowhead() {
				var arrowPeak_wx = wy <= 25 ? (wy / 2) * 0.66 : (wy / 2) * 0.33; // make chevron sharper for thinner nodes
				var arrowPeak_wy = wy / 2;

				pathPoly.push("M", x, y);
				pathPoly.push("H", right_x);
				pathPoly.push("l", arrowPeak_wx, arrowPeak_wy);
				pathPoly.push("L", right_x, bottom_y);
				pathPoly.push("H", x);
				pathPoly.push("Z");
			}
		}

		//drawing node label in different lines
		function wrap(text) {
			//the label for transformation nodes and external right nodes will be in one line
			if (n.labelPosition !== "E_R" && n.code.substring(0, 2) !== "T2" && n.code !== "N3" && n.code !== "E4") {
				text.each(function () {
					var lineWidth = 0;
					var label = d3.select(this),
					words = label.text().split(/\s+/),
					word,
					line = [],
					lineHeight = scaleRes * imgHeight / 80.,
					y = parseFloat(label.attr("y")),
					x = parseFloat(label.attr("x")),
					tspan = label.text(null).append("tspan"),
					maxAllowedWidth = imgHeight / 7.;
					var top = (n.labelPosition === "T" || n.labelPosition === "L" || n.labelPosition === "R");
					var boxLines = [], boxWidth = (labelboxNameSpace.valueOnly) ? energyValue.visualLength(fontSize) : 0;

					// parse all words and split them into several lines, depending on allowed width
					while (word = words.shift()) {
						line.push(word);
						lineWidth = line.join(" ").visualLength(fontSize);
						if (lineWidth > maxAllowedWidth) {
							line.pop();
							boxLines.push(line);
							line = [word];
							lineWidth = word.visualLength(fontSize);
						};
						boxWidth = Math.max(boxWidth, lineWidth);
					};
					boxLines.push(line);
					if (top) boxLines.reverse();

					// shift x position to the left for selected nodes and aggregation states
					if ((n.code == "N1")
						|| (n.code == "N6_1" && !dataNameSpace.isFinalConsumptionDisaggregated)
						|| (n.code == "N2_1")) {
						x -= boxWidth * 0.6;
						txLabel = x;
					} else if (n.labelPosition === "L") {
						x -= boxWidth + 15;
						txLabel = x;
					};

					// loop over each line and add it as text string to label
					$.each(boxLines, function (il, l) {
						tspan = label.append("tspan")
							.attr("x", x)
							.attr("y", y + (1 - 2 * top) * il * lineHeight)
							.text(l.join(" "))
						;
					});


					// reference y correction for labels growing downwards
					if (!top && labelboxNameSpace.titleOnly) tyValue += (boxLines.length - 1) * lineHeight;
				});
			};
		};
	}
};

function getNodeName(id) {
	return languageNameSpace.labels[id];
};
