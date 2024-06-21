var dataNameSpace = {

	// flag whether the tool is running on offline input data
	offlineData: false,

	// global node thickness normalized to image width
	nodeThickness: 0.005,

	// upper y threshold for the top node drawn in the fully disaggregated consumption sector
	maxTopNode: 0.05,

	isFuelFamilySelected: false, // check if we have a family view or 'All products' view

	// 10 flags to encode the global node disaggregation state
	isProductionDisaggregated: false,
	isAllSourcesDisaggregated: true,
	isTransformationDisaggregated: false,
	isAfterTransformationDisaggregated: true,
	isConsumptionForEnergyBranchDisaggregated: false,
	isFinalConsumptionDisaggregated: false,
	isEnergyConsumptionDisaggregated: false,
	isNonEnergyConsumptionDisaggregated: false,
	isIndustryDisaggregated: false,
	isTransportDisaggregated: false,
	isOtherSectorsDisaggregated: false,
	isRPITransformationDisaggregated: false,
	isEHGTransformationDisaggregated: false,
	nodesDisaggregated: { // global disaggregation state: 10 bits
		"all": "1111111111111",
		"none": "0000000000000",
		"default": "0101000000000"
	},

	// reference variables for global diagram setup + default settings
	ref: {
		"geos": 'EU27_2020', // cf. countriesEB object in codes.js
		"year": "latest", // "latest" or any "<year>" available in nrg_bal_sd
		"unit": "KTOE", // cf. energyUnits object in codes.js
		"fuels": "TOTAL", // "TOTAL", "SFFP", "O4000", "G3000-CO350-370", "RA000", "W6100_6220", "N900H", "H8000", "E7000"
		"highlight": "_", // global indices for fuels in fuelMap(REF.fuels) to be highlighted
		"nodeDisagg": "0101000000000", // 13-bit string to encode current node disaggregation state
		"flowDisagg": "0", // master flag to disaggregate all flows: "0" or "1"
		"language": "EN" // language selected
	},

	// available image size and scales
	cropDefaultHeight : 0.97,
	cropDefaultWidth : 0.98,
	cropHeight : 0,
	cropDisaggregationTransformation : 0.3,
	cropDisaggregationFinalConsumption : 0.3,
	cropDisaggregationEnergyConsumption : 0.15,
	cropDisaggregationIndustryTransportOther : 0.3,
	coefDisaggregationTransformation : 0,

	heightIndustryFlowsSpace : 0.4,
	heighttransportFlowsSpace : 0.22,
	heightOtherSectorsFlowsSpace : 0.15,
	flowScaleMax : -1,

	// global normalized coordinates for various node groups
	xN1: 0.24,
	yMain: 0.32,
	yT2: 0.55, // aggregated transformation node T2
	yBottom: 0.95, // y position of all nodes exiting to the bottom of the diagram
	xSD: 0.09,
	xN1_1: 0.07,
	xN6: 0.57,
	xN6_1: 0.95,
	xN6_1_X: 1.1, // x of final energy and non-energy consumption
	xN6_1_1_X_agg: 1.22, // x of final energy consumption sectors (aggregated)
	xN6_1_1_X_dis: 1.4, // x of final energy consumption sectors (disaggregated)
	xN6_1_2_X: 1.22, // final non-energy consumption sectors
	xN6_1_1_X_X: 1.6, // final energy consumption sub-sectors
	yN6_1_1_X_X: 0.2, // starting y of final energy consumption sub-sectors
	xE6_5_X: 1.1, // consumption for the energy branch
	xT2_9: 0.55, // aggregated transformation node T2_9 - Refineries and petrochimical industry
	xT2_10: 0.55, // aggregated transformation node T2_10 - Electricity and heat generation

	// x positions of title and Eurostat ref. in exported diagrams
	xExportTitle: 0,
	xExportRef: 0,

	// threshold value and min. pixel size for drawing a fuel
	drawFuelValueThreshold: 0.5,
	drawFuelMinPixelSize: 0.5,

	// minimal pixel size of clicking area for a node
	nodeSizeMin: 10,
	nodeFontRel: 0.014, // relative font size (proportion of imgHeight) for node labels

	//padding
	paddingTransformationFlow: 0.04,
	paddingNodeGroupX: 0.03,
	paddingNodeGroupY: 0.032,
	paddingN5N3: 0.06, // padding between N5 and first (resp. N3 and last) disaggregated transformation node
	paddingN3E4: 0.075, // padding between N3 and E4
	paddingConsumption: 0.12, // padding between final consumption nodes N6.1.1 and N6.1.2

	marginSmall: {
		top: 55,
		bottom: 25,
		left: 57
	},

	marginLarge: {
		top: 90,
		bottom: 25,
		left: 72
	},

	// min. relative violation of energy conservation at a node to trigger a warning
	energyWarningThreshold: 0.075,

	// handle different window resolutions
	largeResHeightPixelThreshold: 650,
	isLargeRes: false,

	//calculate the diagram height
	calculateImgHeight: function (crop, width, margins) {
		var height = Math.min(
			(width * 9) / 16,
			crop *
				(window.innerHeight ||
					document.documentElement.clientHeight ||
					document.body.clientHeight) -
				margins.top -
				margins.bottom
		);
		dataNameSpace.isLargeRes =
			height > dataNameSpace.largeResHeightPixelThreshold;
		return height;
	},

	//calculate the diagram width
  calculateImgWidth: function (crop, margins) {
		return (
			crop *
			((window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth) -
				margins.left)
		);
	},

  // add parameters to URL
  urlAddParam: function (param, value) {
    var url = window.location.href;
    // if param exist in url, replace it
    if (url.indexOf(param + "=") > 0) {
      var prefix = url.substring(0, url.indexOf(param + "="));
      var suffix = url.substring(url.indexOf(param + "=")).substring(url.substring(url.indexOf(param + "=")).indexOf("&") + 1);
      url = prefix + param + "=" + value + (suffix.length > 0 ? "&" + suffix : "");
    } else {
      url += (url.indexOf("?") > 0 ? "&" : "?") + param + "=" + value;
    }
    window.location.assign(url);
  },

	// set global ref variables in URL
	setRefURL: function () {
		var url = window.location.href;
		var end = url.indexOf("?");

		url = end > 0 ? url.slice(0, end) : url.slice(0);
		var iref = 0;
    for (var ref in dataNameSpace.ref) {
          if (ref === "translateX" || ref === "translateY" || ref === "scale" || ref === "before") { continue };

			url += (iref == 0) ? "?" : "&";
			url += ref + "=" + dataNameSpace.ref[ref].toString();
			iref++;
		};
		changeUrl("title", url);
	},

	// get global ref variables in URL
	getRefURL: function () {
		var refURL = getUrlVars();
		for (var ref in dataNameSpace.ref) {
			if (typeof refURL[ref] === "undefined") continue;
			dataNameSpace.ref[ref] = refURL[ref];

			if (ref === "geos" && dataNameSpace.ref[ref] === "EU27") {
				dataNameSpace.ref[ref] = "EU27_2020";
			}

		}
		dataNameSpace.ref["flowDisagg"] = parseBool(dataNameSpace.ref["flowDisagg"]);
	},

	//Number of frames used to interpolate diagram animation
  	nbFrames: 2,
	freqFrames: 120,

	dataLoaded: false, // TODO: remove this variable - not used anymore
};

// global shortcut to reference setting
var REF = dataNameSpace.ref;

// general visualisation settings
dataNameSpace.isLargeRes =
	(window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight) > dataNameSpace.largeResHeightPixelThreshold;
var imgWidth = dataNameSpace.calculateImgWidth(
	dataNameSpace.cropDefaultWidth,
	dataNameSpace.isLargeRes
		? dataNameSpace.marginLarge
		: dataNameSpace.marginSmall
);
var imgHeight = dataNameSpace.calculateImgHeight(
	dataNameSpace.cropDefaultHeight,
	imgWidth,
	dataNameSpace.isLargeRes
		? dataNameSpace.marginLarge
		: dataNameSpace.marginSmall
);

var xScale = d3.scale
  .linear()
  .domain([0, 1])
  .range([
    dataNameSpace.nodeThickness * imgWidth,
    (1 - dataNameSpace.nodeThickness) * imgWidth
  ]);

var yScale = d3.scale
  .linear()
  .domain([0, 1])
  .range([
    dataNameSpace.nodeThickness * imgWidth,
    imgHeight - dataNameSpace.nodeThickness * imgWidth
  ]);


// The scaleHandler function is used to calculate the scale factor for the diagram
// The scale factor is calculated by using the height of the screen and the height of the diagram
// the scale factor will squeeze the ready made diagram into the screen
function scaleHandler(cliWidth, cliHeight, svgWidth, svgHeight) {
	// freeSpaceRatio is estimated arbitrary ratio depending on the screen layout.
  // The ratio is different for portrait and landscape mode.
	// freeSpaceRatio is set to fixed values until we find a better solution
	const freeSpaceRatio = cliWidth < cliHeight ? 0.28 : 0.61,
		boxHeight = cliHeight * freeSpaceRatio,
		scaleFactor = boxHeight / svgHeight;
	return scaleFactor;
}

function screenHandler(cliWidth, cliHeight) {
  // left and top margins for the diagram
  let xy = isMobile ? [10, 60] : [120, 10];
  return xy;
}

function sankeyTransform(svgWidth = 1, svgHeight = 1) {
  const cliHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight,
    cliWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

  const [x, y] = screenHandler(cliWidth, cliHeight),
    k = scaleHandler(cliWidth, cliHeight, svgWidth, svgHeight);
  dataNameSpace.reset = { translateX: x, translateY: y, scale: k };
  Object.assign(REF, dataNameSpace.reset);
}
