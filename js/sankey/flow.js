// Flow object

// new constructor linking to the database
var Flow = function (code) {
	this.code = code;

	this.value = 0.;
	this.length = 0;
	this.fuels = [];
	this.values = [];
	this.colors = [];
	this.isTiny = true;

	// fuel names, values and colors are queried from central database objects, depending on global dimension codes
	// REF.geo, REF.year, REF.fuels, plus this flow code (special treatment for losses codes 'F4_XX')

	if (code.substring(0, 2) == "F4") {
		// special treatment for losses
		this.fuels = [fuelLossesLabel];
		this.values = (REF.fuels == "total" || REF.fuels == "TOTAL") ? [getValueForCountries(REF.geos.split(','), code, "TOTAL", REF.year, REF.unit)] : [0];
		this.colors = [fuelColorLosses];
	} else {
		if (Object.keys(sankeyDB.dimension.flow.index).indexOf(code) < 0) return;
		this.fuels = trimFuelLabels(REF.fuels, REF.flowDisagg);

		var values = [];
		$.each(fuelMap(REF.fuels, REF.flowDisagg), function (ifuel, fuel) {
			values.push(getValueForCountries(REF.geos.split(','), code, fuel, REF.year, REF.unit));
		});
		this.values = values;
		this.colors = trimFuels(fuelColors, REF.fuels, REF.flowDisagg);

		// set all fuel colors except one to background color in highlight mode
		if (REF.highlight !== "_")
			for (var i = 0; i < this.fuels.length; i++)
				if (!REF.highlight.contains("_"+i.toString()+"_"))
					this.colors[i] = fuelColorBackground;
	};

	// value, size and length can be obtained from the fuels list
	this.value = arraySum(this.values);
	this.length = this.fuels.length;

	// set flag if tiny
	this.isTiny = this.isTooSmall();
};

Flow.prototype.size = function () {
	return flowScale(this.value);
};

// copy another flow
Flow.prototype.copy = function (f, code) {
	this.code = (typeof code !== "undefined") ? code : f.code;
	this.value = f.value;
	this.length = f.length;
	this.fuels = f.fuels;
	this.values = f.values;
	this.colors = f.colors;
	this.isTiny = f.isTiny;
	return this;
};

// clone this flow
Flow.prototype.clone = function (code) {
	var f = new Flow();
	f.copy(this);
	if (typeof code !== "undefined") {
		f.code = code;
	}
	return f;
};

// add another flow
Flow.prototype.plus = function (flow) {
	this.value += flow.value;
	for (var i = 0; i < flow.length; i++) {
		var fuelName = flow.fuels[i];
		var fuelValue = flow.values[i];
		var fuelColor = flow.colors[i];
		var j = this.fuels.indexOf(fuelName);
		if (j < 0) {
			this.fuels.push(fuelName);
			this.values.push(fuelValue);
			this.colors.push(fuelColor);
			this.length += 1;
		} else {
			this.values[j] += fuelValue;
		};
	};
	this.isTiny = this.isTooSmall();
};

// create a new instance
Flow.prototype.Plus = function (fuel, code) {
	var cl = this.clone(code);
	return cl.plus(fuel);
};

// subtract another flow
subtractFlows = function (flow1, flow2) {
	if (flow1.code == flow2.code) return;
	flow1.value -= flow2.value;
	if (flow1.value < 0) {
		console.warn("WARNING: subtractFlows: resulting flow would be negative - replacing by 0.");
		flow1.value = 0;
	};
	for (var i = 0; i < flow2.length; i++) {
		var j = flow1.fuels.indexOf(flow2.fuels[i]);
		if (j < 0) {
			error("subtractFlows: trying to subtract from a non-existent fuel " + flow2.fuels[i]);
		} else {
			flow1.values[j] = Math.max(flow1.values[j] - flow2.values[i], 0);
		};
	};
	flow1.isTiny = flow1.isTooSmall();
};

// return a flag indiacting whether the flow is too small to be drawn
Flow.prototype.isTooSmall = function (threshold) {
	if (typeof threshold === "undefined") threshold = dataNameSpace.drawFuelValueThreshold;
	return this.values.map(function(v) {return (v < threshold)}).all();
};



// container for all global flow drawing functions
flowNameSpace = {

	// bookkeeping of all fuels drawn in the current view to populate the legend
	fuelListDrawn: [],

	// draw a single fuel from the flow
	drawFuel: function (canvas, allFuels, path, i, sourceNode, targetNode) {
		// don't draw tiny fuels
		if (allFuels.values[i] < dataNameSpace.drawFuelValueThreshold)
			return;

		var fuelCode = fuelMap(REF.fuels, REF.flowDisagg)[i];

		if (!dataNameSpace.fuelListDrawn.contains(fuelCode) && allFuels.code.substring(0, 2) !== "F4") dataNameSpace.fuelListDrawn.push(fuelCode);
		if (allFuels.code.substring(0, 2) === "F4") fuelCode = "losses";

		flowNameSpace.drawFlow(path, canvas, fuelCode, sourceNode, targetNode, allFuels, i);

	},

	drawFlow: function (path, canvas, fuelCode, sourceNode, targetNode, allFuels, i) {
		var flow = canvas
      .append("g")
      .attr("class", "flow")
      // add acccessibility to the sankey flows
      .attr("aria-label", function (Flow) {
        const flowDescription = `${languageNameSpace.labels['FROM']} ${sourceNode.name} ${languageNameSpace.labels['TO']} ${targetNode.name}
         ${languageNameSpace.labels[fuelCode.toString()]}: ${printNumber(allFuels.values[i])}`;

				return flowDescription
			})
      .attr("role", "group")
      .attr("font-stretch", "normal")
      .attr("tabindex", 0)
      .on("keydown", function () {
        var event = d3.event; // Get the event object
        if (event.key === "Enter") {
          // Perform the desired action when the Enter key is pressed
          console.log("Enter key pressed on node: " + materialCode);
        }
      });



		var isDragging = false;
		var initDragPosition = "";
		var currentDragPosition = "";
        var flowPathId = `${sourceNode.code}_${targetNode.code}_${fuelCode}`;
		flow
		.append("path")
		.attr("d", path)
        .attr("id", flowPathId)
		.attr("class", sourceNode.code+'_'+targetNode.code+'_'+fuelCode+containerId)
		.style("stroke", allFuels.colors[i])
		.style("stroke-width", Math.max(flowScale(allFuels.values[i]), dataNameSpace.drawFuelMinPixelSize))
		.style("fill", "none")
		.style("shape-rendering", "geometricPrecision")
		.on("mousedown", function () {
			initDragPosition = { "translateX": REF.translateX , "translateY": REF.translateY };
			currentDragPosition = { "translateX": REF.translateX , "translateY": REF.translateY };
			$(window).mousemove(function () {
				//console.log(initDragPosition);
				//console.log(currentDragPosition);
				isDragging = true;
				$('path').css({ 'cursor': 'move' });
				$(window).unbind("mousemove");
			});
		})
		.on("mouseup", function () {
			var isChrome = !!window.chrome && !!window.chrome.webstore; //Detect Chrome browser to avoid the bug of double clicking on a node to open node menu
			if(!isChrome) { //others browsers
				var wasDragging = isDragging;
				isDragging = false;
				$('path').css({ 'cursor': '' });
				$(window).unbind("mousemove");
				if (!wasDragging) {
					nsMainModal.flowDialogBox(fuelCode, i, "page", flowPathId);
          }
        } else {
          // Workaround for Chrome bug
          // https://bugs.chromium.org/p/chromium/issues/detail?id=161464
          currentDragPosition = {
            translateX: REF.translateX,
            translateY: REF.translateY
          };
          if (
            initDragPosition.translateX != currentDragPosition.translateX ||
            initDragPosition.translateY != currentDragPosition.translateY
          ) {
            $("path").css({ cursor: "" });
					$(window).unbind("mousemove");
					initDragPosition = { "translateX": currentDragPosition.translateX , "translateY": currentDragPosition.translateY };
				} else {
					//console.log("same position");
					nsMainModal.flowDialogBox(fuelCode, i, "page", flowPathId);
					$('path').css({'cursor' : ''});
					$(window).unbind("mousemove");
				}
			}
		})
		// .append("title")
		// .text(function () {
		// 	var value = languageNameSpace.labels[fuelCode] + ": " + printNumber(allFuels.values[i]) + " " + REF.unit;
		// 	return value;
		// });



/**
     * Adds event listeners to the SVG path element that displays the tooltip.       
     * @param {Event} e - The event object.       
     * @param {string} value - The value of the material.       
     * @param {string} material - The name of the material.       
     * @param {string} source - The name of the source node.       
     * @param {string} target - The name of the target node.       
     * @param {string} color - The color of the material.       
     * @returns None       
     */
const svgPath = document.getElementById(flowPathId),
  argsTooltip = {
	material: languageNameSpace.labels[fuelCode],
	value: printNumber(allFuels.values[i]) + " " + REF.unit ,
	source : languageNameSpace.labels[sourceNode.code.toString()],
	target : languageNameSpace.labels[targetNode.code.toString()],
	color: allFuels.colors[i],
  };

  svgPath.addEventListener("mousemove", handleTooltip);
  svgPath.addEventListener("focus", handleTooltip);
  svgPath.addEventListener("mouseout", hideTooltipSankey);
  svgPath.addEventListener("blur", hideTooltipSankey);
  
	function handleTooltip(e) {
	  showTooltipFlow(
		e,
		argsTooltip.value,
		argsTooltip.material,
		argsTooltip.source,
		argsTooltip.target,
		argsTooltip.color
	  );
	} 


	},

	// drawing routines for Flow objects, depending on adjacent node orientations:
	// function to draw curved flow link between two vertical nodes
	drawVV: function (canvas, flow, sourceNode, targetNode, widIn, posIn) {

		// width and position of flow curve are optional, and depend on each other: always restrict to reasonable values
		var wid = (typeof widIn === 'undefined') ? 1. / 3. : Math.max(Math.min(widIn, 1.), 0.);
		var pos = (typeof posIn === 'undefined') ? 1. / 3. : Math.max(Math.min(posIn, 1.), 0.);
		pos = Math.min(pos, 1. - wid);

		// source and target points must be in the middle of the total flow
		var sIn = sourceNode.positionOut().Plus(new Vec2(0., (0.5 - sourceNode.reverse) * flow.size()));
		var tIn = targetNode.positionIn().Plus(new Vec2(0., (0.5 - targetNode.reverse) * flow.size()));

		// check if the relative position of source and target is consistent
		var dIn = tIn.Minus(sIn);

		if (dIn.x < 0) {
			flowNameSpace.drawBackflow(canvas, flow, sourceNode, targetNode, widIn, posIn);
			return;
		};
		var dy = Math.min((Math.abs(dIn.y)), flow.size());
		var dxMin = Math.sqrt(dy * (2. * flow.size() - dy));
		if (dIn.x < 1.01 * dxMin) {
			error("flowNameSpace.drawVV: node positions are too close for flow size!");
			return;
		};

		// set start, target and inflection (mirror) point of the curve
		var s = sIn.Plus(new Vec2(pos * (dIn.x - dxMin), 0.));
		var t = tIn.Minus(new Vec2((1. - pos - wid) * (dIn.x - dxMin), 0.));

		// solve the geometric problem of fitting two circle segments of radius r and angle phi smoothly and symmetrically between s and t with inflection point m
		var d = t.Minus(s);
		var dist = s.distance(t);
		var phi = Math.min(2. * Math.acos(d.x / dist), Math.PI / 2.);
		var r = (phi < Math.PI / 2.) ? dist / (4. * Math.sin(phi / 2.)) : d.x / 2.;

		// loop over all fuels and draw the stacked links
		var dy = -flow.size() / 2.;
		var turnRight = (d.y > 0) ? 1 : 0;

		var sign = -Math.sign(d.y);

		// loop over all fuels contained in this flow
		for (var i = 0, n = flow.length; i < n; i++) {

			// calculate y shift for this fuel
			dy += flowScale(flow.values[i]) / 2.;

			// start point coordinates for SVG path string
			var path = "M " + sIn.x + "," + (sIn.y + dy);

			// regularize the phi > 0 condition to solve ENSANKEY-161:
			if (phi > 0.0001) { // exact threshold is trial and error

				// calculate new radii for the arc elements
				var dr = sign * dy;
				var r1 = r + dr;
				var r2 = r - dr;

				// 1st arc of curved path
				path = path + " L " + s.x + "," + (s.y + dy) + " A " + r1 + "," + r1 + " 0 0," + turnRight + " ";
				var p = s.Plus(t).mult(new Vec2(0.5, 0.5)).plus(new Vec2(dr * Math.sin(phi), dy * Math.cos(phi)));

				// if phi == 90�, add a vertical straight line
				if (phi < Math.PI / 2.) {
					path = path + p.x + "," + p.y;
				} else {
					path = path + p.x + "," + (s.y + dy - sign * r1);
					path = path + " L " + p.x + "," + (t.y + dy + sign * r2);
				};

				// 2nd arc of curved path
				path = path + " A " + r2 + "," + r2 + " 0 0," + (1 - turnRight) + " " + t.x + "," + (t.y + dy);
			};

			// add straight line to end point
			path = path + " L " + tIn.x + "," + (tIn.y + dy);

			// draw the path for the current fuel
			flowNameSpace.drawFuel(canvas, flow, path, i, sourceNode, targetNode);

			// add 2nd half of flow width
			dy += flowScale(flow.values[i]) / 2.;
		};
	},

	// function to draw curved flow link from a vertical node to a horizontal one
	drawVH: function (canvas, flow, sourceNode, targetNode, widIn) {

		// width and position of flow curve are optional, and depend on each other: always restrict to reasonable values
		var wid = (typeof widIn === 'undefined') ? 1. / 3. : Math.max(Math.min(widIn, 1.), 0.);

		// shift horizontal target node by total flow size
		var sIn = sourceNode.positionOut().Plus(new Vec2(0., -sourceNode.reverse * flow.size()));
		var tIn = targetNode.positionIn().Plus(new Vec2((1. - targetNode.reverse) * flow.size(), 0.));

		// check if the relative position of source and target is consistent
		var dIn = tIn.Minus(sIn);
		var w = Math.min(dIn.x, dIn.y);
		if (w < 1.01 * flow.size()) {
			error("flowNameSpace.drawVH: nodes are not properly placed! " + flow.code);
			return;
		};

		// set start, target and inflection (mirror) point of the curve
		var r = wid * w + flow.size() * (1. - wid);
		var s = new Vec2(tIn.x - r, sIn.y);
		var t = new Vec2(tIn.x, sIn.y + r);

		// loop over all fuels and draw the stacked links
		for (var i = 0, n = flow.length, dr = 0.; i < n; i++) {

			// calculate radius change for the flow
			dr += flowScale(flow.values[i]) / 2.;

			// assemble SVG string for curved path
			var path = "M " + sIn.x + "," + (sIn.y + dr) +
				" L " + s.x + "," + (s.y + dr) +
				" A " + (r - dr) + "," + (r - dr) + " 0 0,1 " + (t.x - dr) + "," + t.y +
				" L " + (tIn.x - dr) + "," + tIn.y;

			// draw the link for the current fuel
			flowNameSpace.drawFuel(canvas, flow, path, i, sourceNode, targetNode);

			// add 2nd half of flow width
			dr += flowScale(flow.values[i]) / 2.;
		};
	},

	// function to draw curved flow link from a horizontal node to a vertical one
	drawHV: function (canvas, flow, sourceNode, targetNode, widIn) {

		// width and position of flow curve are optional, and depend on each other: always restrict to reasonable values
		var wid = (typeof widIn === 'undefined') ? 1. / 3. : Math.max(Math.min(widIn, 1.), 0.);

		// shift horizontal source node by total flow size
		var sIn = sourceNode.positionOut().Plus(new Vec2((1. - sourceNode.reverse) * flow.size(), 0.));
		var tIn = targetNode.positionIn().Plus(new Vec2(0., -targetNode.reverse * flow.size()));

		// check if the relative position of source and target is consistent
		var dIn = tIn.Minus(sIn);
		var w = Math.min(dIn.x, dIn.y);
		if (dIn.x < 0. || dIn.y < 0.) {
			error("flowNameSpace.drawHV: nodes are not properly placed!");
			return;
		};

		// set start, target and inflection (mirror) point of the curve
		var r = wid * Math.min(dIn.x, dIn.y);
		var s = new Vec2(sIn.x, tIn.y - r);
		var t = new Vec2(sIn.x + r, tIn.y);

		// loop over all fuels and draw the stacked links
		for (var i = 0, n = flow.length, dr = 0.; i < n; i++) {

			// calculate radius change for the flow
			dr += flowScale(flow.values[i]) / 2.;

			// assemble SVG string for curved path
			var path = "M " + (sIn.x - dr) + "," + sIn.y +
				" L " + (s.x - dr) + "," + s.y +
				" A " + (r + dr) + "," + (r + dr) + " 0 0,0 " + t.x + "," + (t.y + dr) +
				" L " + tIn.x + "," + (tIn.y + dr);

			// draw the link for the current fuel
			flowNameSpace.drawFuel(canvas, flow, path, i, sourceNode, targetNode);

			// add 2nd half of flow width
			dr += flowScale(flow.values[i]) / 2.;
		};
	},

	// function to draw a curved backflow link from one vertical node to another one further upstream
	drawBackflow: function (canvas, flow, sourceNode, targetNode, widIn, posIn) {

		// width and position of backflow curve are optional, and depend on each other: always restrict to reasonable values
		var wid = (typeof widIn === 'undefined') ? 1. / 3. : Math.max(Math.min(widIn, 1.), 0.);
		var pos = (typeof posIn === 'undefined') ? 0. : Math.max(Math.min(posIn, 1.), 0.);
		pos = xScale(pos);

		// shift lower node point down by total flow size
		var sIn = sourceNode.positionOut().Minus(new Vec2(0., sourceNode.reverse * flow.size()));
		var tIn = targetNode.positionIn().Minus(new Vec2(0., sourceNode.reverse * flow.size()));
		var sign = Math.sign(tIn.y - sIn.y);
		if (sign > 0.)
			tIn.plus(new Vec2(0., flow.size()));
		else
			sIn.plus(new Vec2(0., flow.size()));

		// check if the relative position of source and target is consistent
		var dIn = tIn.Minus(sIn);
		var w = Math.min(Math.abs(dIn.y) / 2., flow.size() + pos);
		if (dIn.x > 0. || w < 1.01 * flow.size()) {
			error("flowNameSpace.drawBackflow: nodes are not properly placed!");
			return;
		};

		// set start, target and inflection (mirror) point of the curve
		var r = wid * w + flow.size() * (1. - wid);
		var s,
		t;
		if (sign > 0) {
			s = new Vec2(sIn.x + pos, sIn.y);
			t = new Vec2(s.x, tIn.y);
		} else {
			t = new Vec2(tIn.x - pos, tIn.y);
			s = new Vec2(t.x, sIn.y);
		};
		var p1 = s.Plus(new Vec2(sign * r, sign * r));
		var p2 = t.Plus(new Vec2(sign * r, -sign * r));

		// loop over all fuels and draw the stacked links
		for (var i = 0, n = flow.length, dr = 0.; i < n; i++) {

			// calculate radius change for the flow
			dr += flowScale(flow.values[i]) / 2.;
			var dy = sign * dr;

			// assemble SVG string for curved path
			var path = "M " + sIn.x + "," + (sIn.y + dy) +
				" L " + s.x + "," + (s.y + dy) +
				" A " + (r - dr) + "," + (r - dr) + " 0 0,1 " + (p1.x - dy) + "," + p1.y +
				" L " + (p2.x - dy) + "," + p2.y +
				" A " + (r - dr) + "," + (r - dr) + " 0 0,1 " + t.x + "," + (t.y - dy) +
				" L " + tIn.x + "," + (tIn.y - dy);

			// draw the link for the current fuel
			flowNameSpace.drawFuel(canvas, flow, path, i, sourceNode, targetNode);

			// add 2nd half of flow width
			dr += flowScale(flow.values[i]) / 2.;
		};
	},

	// CORE wrapper function to handle input and call the correct drawing function
	draw: function (canvas, flow, sourceNode, targetNode, wid, pos, stacked, scale) {
		// add source/target information to nodes
		// NOTE: this constructs the global diagram topology (i.e. which nodes are logically connected by which flows)
		sourceNode.nodeOut.push([targetNode.name, flow.value, flow.code]);
		targetNode.nodeIn.push([sourceNode.name, flow.value, flow.code]);

		// don't draw tiny flows
		if (flow.isTiny) return;

		// stacked flows (not fuels!): recalculate pos shift to avoid overlapping flows
		if (typeof stacked !== "undefined") {
			var dist, up, shift;
			if (typeof scale === "undefined")
				scale = 1;
			dist = targetNode.position.x - sourceNode.position.x;
			up = targetNode.positionIn().y < sourceNode.positionOut().y;
			switch (stacked) {
				case "S":
					if (up)
						shift = sourceNode.flowOut.size();
					else
						shift = sourceNode.flowIn.size() - sourceNode.flowOut.size() - flow.size();
					break;
				case "T":
					if (up)
						shift = targetNode.flowOut.size() - targetNode.flowIn.size() - flow.size();
					else
						shift = targetNode.flowIn.size();
					break;
				default:
					error("flowNameSpace.draw: unknown flag stacked = " + stacked);
			};
			pos += shift / dist * scale;
			wid = Math.max(Math.min(wid + pos / 2, 1 - pos), 0);
			if (stacked === "T")
				pos = 1 - wid - pos;
		};

		// case distinction for node combination
		switch (sourceNode.vertical + 2 * targetNode.vertical) {
			case 1:
				flowNameSpace.drawVH(canvas, flow, sourceNode, targetNode, wid); break;
			case 2:
				flowNameSpace.drawHV(canvas, flow, sourceNode, targetNode, wid); break;
			case 3:
				flowNameSpace.drawVV(canvas, flow, sourceNode, targetNode, wid, pos); break;
			default:
				error("flowNameSpace.draw: Link between nodes '" + sourceNode.name + "' and '" + targetNode.name + "' not implemented!"); return;
		};

		// add flow to in/out balances of nodes
		sourceNode.flowOut.plus(flow);
		targetNode.flowIn.plus(flow);

		// draw nodes
		nodeNameSpace.nodeListDrawn[sourceNode.code] = sourceNode;
		nodeNameSpace.nodeListDrawn[targetNode.code] = targetNode;
	}
};



function trimFuels(object, tag, flag) {
	var flist = fuelMap(tag, flag);
	var clist = [];
	for (var i = 0; i < flist.length; i++)
		//clist.push(languageNameSpace.labels[flist[i]]);
		clist.push(object[flist[i]]);
	return clist;
};

//get fuel labels from translated labels
function trimFuelLabels( tag, flag) {
	var flist = fuelMap(tag, flag);
	var clist = [];
	for (var i = 0; i < flist.length; i++)
		clist.push(languageNameSpace.labels[flist[i]]);
	return clist;
};

function getFuelName(id) {
	return languageNameSpace.labels[id];
};

//calculate global flow scale: Max(N1.value, N6.value) for all timeseries
function getFlowScaleMax(timeSeries) {
	var year = REF.year;
	var flowScaleMax = 0;
	var mxFlow = 0;

	$.each(timeSeries, function (i, n) {
		REF.year = n;
		mxFlow = Math.max(new Flow("N1").value, new Flow("N6").value);
		flowScaleMax = (flowScaleMax < mxFlow)? mxFlow : flowScaleMax;
	});

	REF.year = year;

	return flowScaleMax;
};
