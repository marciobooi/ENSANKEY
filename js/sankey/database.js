/*
contains 'sankeyDB' definition and access handlers
*/

// JSON structure of the CORE DATABASE OBJECT 'sankeyDB'
// The static 4-dimensional structure of the database is hard-coded here, cf. 'dimension.id' field
var sankeyDB = {
	value: [], // 1-dimensional array containing all data points
	mask: [], // array of flags indicating which data point has already been filled (downloaded or calculated)
	isTimeDownloaded: {}, // flag - all years queried and cached for the REF.geos
	isYearBalancesDownloaded: {}, // flag - all countries queried and cached for the REF.year.
	dimension: {
		id: ["geo", "flow", "fuel", "year"], // static: DON'T TOUCH
		size: [0, 0, 0, 0], // 4 dimensions static: DON'T TOUCH
		geo: {
			index: {},
			label: {},
		},
		flow: {
			index: {},
			label: {},
		},
		fuel: {
			index: {},
			label: {},
		},
		year: {
			index: {},
			label: {},
		},
	},
};

// initialize 'sankeyDB' object with dimension specifications as contained in codes argument
function initializeDB(codes, geoIn, yearIn) {
	//Add to initialize DB for all countries
	geoIn = Object.keys(countriesEB);

	var db = sankeyDB.dimension;

	var geo = typeof geoIn === "undefined" ? codes.geo : geoIn;
	var year = typeof yearIn === "undefined" ? codes.year : yearIn;

	// set dimension sizes
	db.size[0] = geo.length;
	db.size[1] = codes.flow.length;
	db.size[2] = codes.fuel.length;
	db.size[3] = year.length;

	// initialize all values with 0
	// optimized for memory allocation: using the array constructor
	sankeyDB.value = new Array(arrayProduct(db.size)).fill(0);
	sankeyDB.mask = new Array(arrayProduct(db.size)).fill(false);

	// initialize all labels with 'n/a' (except years)
	for (var i = 0; i < geo.length; i++) {
		db.geo.index[geo[i]] = i;
		db.geo.label[geo[i]] = "n/a";
	}
	for (var i = 0; i < codes.flow.length; i++) {
		db.flow.index[codes.flow[i]] = i;
		db.flow.label[codes.flow[i]] = "n/a";
	}
	for (var i = 0; i < codes.fuel.length; i++) {
		db.fuel.index[codes.fuel[i]] = i;
		db.fuel.label[codes.fuel[i]] = "n/a";
	}
	for (var i = 0; i < year.length; i++) {
		db.year.index[year[i]] = i;
		db.year.label[year[i]] = year[i];
	}
	return 0;
}

// check if a cell is part of the sankeyDB
function isElementDB(geo, flow, fuel, year) {
	var db = sankeyDB.dimension;
	return (
		geo in db.geo.index &&
		flow in db.flow.index &&
		fuel in db.fuel.index &&
		year in db.year.index
	);
}

// helper function to convert 4 database dimensions to one flat array index
function getIndex(geo, flow, fuel, year) {
	// skip non-existent elements
	if (!isElementDB(geo, flow, fuel, year)) {
		return -1;
	}

	var db = sankeyDB.dimension;

	// map code strings onto array indices
	var iGeo = db.geo.index[geo];
	var iFlow = db.flow.index[flow];
	var iFuel = db.fuel.index[fuel];
	var iYear = db.year.index[year];

	// convert 4 indices to one flat index, using information on dimension sizes in 'sankeyDB'
	var s = db.size;
	var index =
		iGeo * s[1] * s[2] * s[3] + iFlow * s[2] * s[3] + iFuel * s[3] + iYear;

	return index;
}

// inverse function
function getCodes(indexIn) {
	var db = sankeyDB.dimension;

	// convert one flat index to 4 code indices, using information on dimension sizes in 'sankeyDB'
	var s = db.size;
	var index = indexIn;
	var iGeo = Math.floor(index / (s[1] * s[2] * s[3]));
	index = index % (s[1] * s[2] * s[3]);
	var iFlow = Math.floor(index / (s[2] * s[3]));
	index = index % (s[2] * s[3]);
	var iFuel = Math.floor(index / s[3]);
	var iYear = index % s[3];

	return [
		Object.keys(db.geo.index)[iGeo],
		Object.keys(db.flow.index)[iFlow],
		Object.keys(db.fuel.index)[iFuel],
		Object.keys(db.year.index)[iYear],
	];
}

// set one data point in 'sankeyDB'
function setValue(geo, flow, fuel, year, input, debug = false) {
	const index = getIndex(geo, flow, fuel, year);
	const isNumber = typeof input === "number";

	sankeyDB.value[index] = isNumber ? input : 0;
	sankeyDB.mask[index] = isNumber;

	if (debug) {
		console.log(
			`setValue: [${geo}, ${flow} (${codeDictionary(
				flow
			)}), ${fuel}, ${year}] = ${input}`
		);
	}

	return 0;
}

// load all values from a given Eurobase query dataset
function composeAndCacheGeoYear(eurobaseDs, flowCodes) {
	const years = eurobaseDs.Dimension("time").id;
	const geos = eurobaseDs.Dimension("geo").id;

	// calculate Sankey flows for 3 type of fuels and loss:
	years.forEach((year) => {
		geos.forEach((geo) => {
			computeAllFuels(geo, year, eurobaseDs, flowCodes);
			calculateLosses(geo, year);
		});
	});
}

function computeAllFuels(geo, year, eurobaseDs, flowCodes=[]) {
	const elementaryFuels = eurobaseDs
		.Dimension("siec")
		.id.filter((f) => f !== "TOTAL"); // filter out TOTAL because we do our own aggregation
	const flowsExcludingLosses = codesSankey.flow.filter(
		(c) => !c.startsWith("F4")
	);
	const applyFlowClampToZero = (f, v) => {
		const clampingFunctions = {
			F1_3: (v) => Math.max(v, 0),
			F1_4: (v) => -Math.min(v, 0),
			F6_2: (v) => -Math.min(v, 0),
			F6_8: (v) => Math.max(v, 0),
			F3: (v) => Math.max(v, 0),
		};
		return clampingFunctions[f] ? clampingFunctions[f](v) : v;
	};

	//============================ 1 elementary fuels ============================
	const filteredFlowKeys =
		flowCodes.length > 0
			? Object.keys(flowFormulas).filter((f) => flowCodes.includes(f))
			: Object.keys(flowFormulas);
	elementaryFuels
		.filter((fuel) => sankeyDB.dimension.fuel.index.hasOwnProperty(fuel)) // filter out fuels not in Sankey
		.forEach((fuel) => {
			const operandValue = (operandList) => {
				return computeOperandValue(operandList, eurobaseDs, fuel, year, geo); //prettier-ignore
			};


			filteredFlowKeys.forEach((flow) => {
				const v = computeFlowValue(flow, operandValue);
				const vClamped = applyFlowClampToZero(flow, v);
				setValue(geo, flow, fuel, year, vClamped); //prettier-ignore
			});
		});
	//============================ 2 ad-hoc fuels =================================
	// adhocFuels.forEach((fuel) => {
	// 	flowsExcludingLosses.forEach((flow) => {
	// 		const adhocValue = fuelMap(fuel, true).reduce((acc, fuelAddends) => {
	// 			const operandValue = (operandList) => {
	// 				return computeOperandValue( operandList, eurobaseDs, fuelAddends, year, geo,); //prettier-ignore
	// 			};

	// 			const v = computeFlowValue(flow, operandValue);
	// 			const vClamped = applyFlowClampToZero(flow, v);
	// 			return acc + vClamped;
	// 		}, 0);
	// 		setValue(geo, flow, fuel, year, adhocValue); //prettier-ignore
	// 	});
	// });
	//============================ 3 aggregated fuels ==============================
	aggregateFuels.forEach((fuel) => {
		const fuelList = getPrimaryCodeList(fuel, true);
		flowsExcludingLosses.forEach((flow) => {
			const adhocValue = fuelList.reduce((acc, fuelAddends) => {
				const operandValue = (operandList) => {
					return computeOperandValue( operandList, eurobaseDs, fuelAddends, year, geo); //prettier-ignore
				};
				const v = computeFlowValue(flow, operandValue); //Prettier-ignore
				const vClamped = applyFlowClampToZero(flow, v);
				return acc + vClamped
			}, 0);

			setValue(geo, flow, fuel, year, adhocValue);
		});
	});
	//==================================================================================================

	function computeFlowValue(flow, operandValue, debug = false) {
		const { operand1, operand2, operand3, operand4 } = flowFormulas[flow];
		let result = operandValue(operand1);

		if (operand4) {
			result -=
				operandValue(operand2) -
				(operandValue(operand3) - operandValue(operand4));
		} else if (operand3) {
			result -= operandValue(operand2) - operandValue(operand3);
		} else if (operand2) {
			result -= operandValue(operand2);
		}

		return result || 0;
	}

	function computeOperandValue(flowOperandList, eurobaseDs, fuel, year, geo) {
		//prettier-ignore
		return flowOperandList.reduce((acc, flowOperand) => {
			const v = codesEurobase.nrg_bal_c.nrg_bal.includes(flowOperand)
				? eurobaseDs.Data( { nrg_bal: flowOperand, siec: fuel, time: year, geo: geo }, false) //prettier-ignore
				: getValue(geo, flowOperand, fuel, year);
			return (acc += v);
		}, 0);
	}

	function getPrimaryCodeList(fuel) {
		const codes = [];
		const nestedCodes = fuelCodeTable[fuel];

		if (nestedCodes) {
			nestedCodes.forEach((code) => {
				const subCodes = getPrimaryCodeList(code, fuelCodeTable);
				codes.push(...subCodes);
			});
		} else {
			codes.push(fuel);
		}

		return codes;
	}
}

function calculateLosses(geo, year) {
	const flowsLosses = codesSankey.flow.filter((c) => c.startsWith("F4"));
	if (!flowsLosses) return;
	const fuel = "TOTAL";
	const get = (flow) => getValue(geo, flow, fuel, year);
	const set = (flow, v) => setValue(geo, flow, fuel, year, v);
	const imbalance = (input, output) => Math.max(get(input) - get(output), 0);

	flowsLosses.forEach((loss) => {
		const i = loss.substring(2);
		set(loss, imbalance("F2" + i + "_1", "F2" + i + "_2"));
	});
}
// End: computing flows

// Start: load time series values for selected countries
async function composeAndCacheYearsOfGeo(flagRedrawDiagram = false, t = []) {
	// console.log("composeAndCacheYearsOfGeo");
	if (flagRedrawDiagram) {
		$("#loader").show();
		$("#progress").html(languageNameSpace.labels["MSG_18"] + "...");
	}

	const queryFilter = {
		time: "all",
		fuel: fuelListForSankeyDB,
		flow: Array.from(reducedNrgBalListForDataApi),
	};
	const countryList = REF.geos.split(",");
	let iChunk = 1;

	async function getTimelineOfGeo(country) {
		// return if already cached
		if (sankeyDB.isTimeDownloaded[country]) return;

		queryFilter.geo = country;
		const query = queryBuilder("nrg_bal_c", queryFilter);

		try {
			const eurobaseDS = await EuroJSONstat.fetchDataset(query);

			if (eurobaseDS.class === "error") {
				console.error(eurobaseDS.label, eurobaseDS);
			} else {
				t[3] = performance.now();
				composeAndCacheGeoYear(eurobaseDS);
				t[4] = performance.now();

				sankeyDB.isTimeDownloaded[country] = true;

				if (debugLevel.speed) {
					console.table({
						"Time series": {
							Chunk: iChunk++ + " of " + countryList.length,
							Geo: country,
							Query: parseInt(t[3] - (t[2] || t[0])) + " ms",
							"Load DB": parseInt(t[4] - t[3]) + " ms",
							Total: ((t[4] - t[0]) / 1000).toFixed(2) + " sec",
						},
					});
				}
			}
		} catch (error) {
			console.warn("Failed fetching query:", error.message);
		}
	}

	if (debugLevel.promise) {
		console.log(
			"Start async load of the time series data. For:",
			countryList.join(", ")
		);
	}

	const getTimelineOfGeoPromises = [];
	for (const geo of countryList) {
		getTimelineOfGeoPromises.push(getTimelineOfGeo(geo));
	}

	await Promise.all(getTimelineOfGeoPromises);

	// All promises are done
	if (debugLevel.promise) {
		console.log("Time promises are done");
	}

	flagRedrawDiagram && sankeyNameSpace.drawDiagram();
	// $("#list-years").find("a[role='button']").removeClass("data-loading");
	// $(".filling-line").removeClass("d-none");
	$("#autoplay-start").fadeIn();
}

//Start: load countries for the given year
async function composeAndCacheGeosOfYear(
	flagRedrawDiagram = false,
	t = [],
	flowCodes = Array.from(reducedNrgBalListForDataApi)
) {
	// console.log("composeAndCacheGeosOfYear");
	if (flagRedrawDiagram) {
		$("#loader").show();
		$("#progress").html(languageNameSpace.labels["MSG_18"] + "...");
	}

	// filter out already cached flows
	const filteredFlowCodes = filterOutCachedFlows(flowCodes);
	// return if already cached
	if (filteredFlowCodes.length === 0) {
		// console.log("All flows are cached");
		return;
	}
	// console.log("Flows to be loaded:", filteredFlowCodes.join(", "));
	setIsYearBalancesDownloaded(filteredFlowCodes);

	const countries = REF.geos.split(",");

	const queryFilter = {
		time: REF.year,
		geo: codesSankey.geo
			.filter((c) => !countries.includes(c))
			.filter((c) => c !== "EA19"),
		fuel: reducedFuelListForDataApi,
		flow: filteredFlowCodes,
	};

	const query = queryBuilder("nrg_bal_c", queryFilter);

	try {
		const eurobaseDS = await EuroJSONstat.fetchDataset(query);

		if (eurobaseDS.class === "error") {
			console.error(eurobaseDS.label, eurobaseDS);
		} else {
			composeAndCacheGeoYear(eurobaseDS, filteredFlowCodes);
		}
	} catch (error) {
		console.warn("Failed fetching query:", error.message);
	}

	if (debugLevel.promise) {
		console.log("Geo promise is done");
	}

	flagRedrawDiagram && sankeyNameSpace.drawDiagram();
	$("#dimension-labels").removeClass("data-loading");

	function filterOutCachedFlows(flowCodes) {
		// console.log("filterOutCachedFlows");
		let filteredFlows;

		if (sankeyDB.isYearBalancesDownloaded.hasOwnProperty(REF.year)) {
			// console.log("Year is cached");
			filteredFlows = flowCodes.filter((f) => {
				const hasNotBeenDownloaded =
					!sankeyDB.isYearBalancesDownloaded[REF.year].hasOwnProperty(f);
				if (hasNotBeenDownloaded) {
					console.log(
						`The flow ${f} has not been downloaded for year ${REF.year}`
					);
				}
				return hasNotBeenDownloaded;
			});
		} else {
			// console.log("Year is not cached");
			filteredFlows = flowCodes;
		}

		// console.log("Filtered flows:", filteredFlows);
		return filteredFlows;
	}
}

// query function to 'sankeyDB' returning a single data point
function getValue(geo, flow, fuel, year, unitIn) {
	var unit = typeof unitIn === "string" ? unitIn : "KTOE";
	return (
		energyUnits[unit].conversionFactor *
		sankeyDB.value[getIndex(geo, flow, fuel, year)]
	);
}

//query function to 'sankeyDB' returning a single data point for multi countries
function getValueForCountries(geos, flow, fuel, year, unitIn) {
	var value = 0;
	var unit = typeof unitIn === "string" ? unitIn : "KTOE";
	var conv = energyUnits[unit].conversionFactor;

	var x = year % 1; // x = i/X
	var Vy = 0;
	var Vy1 = 0;

	for (var i = 0; i < geos.length; i++) {
		Vy = conv * sankeyDB.value[getIndex(geos[i], flow, fuel, Math.floor(year))];
		if (x > 0)
			Vy1 =
				conv * sankeyDB.value[getIndex(geos[i], flow, fuel, Math.ceil(year))];
		value += Vy + (Vy1 - Vy) * x;

		//value = value + (conv * sankeyDB.value[getIndex(geos[i], flow, fuel, year)]);
	}
	return value;
}

function setIsYearBalancesDownloaded(flowCodes) {
	sankeyDB.isYearBalancesDownloaded[REF.year] =
		sankeyDB.isYearBalancesDownloaded[REF.year] || {};
	flowCodes.forEach((bal) => {
		sankeyDB.isYearBalancesDownloaded[REF.year][bal] = true;
	});
}

// query function to 'sankeyDB' returning a single data point
function getMask(geo, flow, fuel, year) {
	return sankeyDB.mask[getIndex(geo, flow, fuel, year)];
}

// query function to 'sankeyDB' accepting code lists as arguments and returning a list of data points
function getMaskList(geoIn, flowIn, fuelIn, yearIn) {
	var list = [];
	var geo = typeof geoIn === "string" ? [geoIn] : geoIn;
	var flow = typeof flowIn === "string" ? [flowIn] : flowIn;
	var fuel = typeof fuelIn === "string" ? [fuelIn] : fuelIn;
	var year = typeof yearIn === "string" ? [yearIn] : yearIn;
	for (var i = 0; i < geo.length; i++)
		for (var j = 0; j < flow.length; j++)
			for (var k = 0; k < fuel.length; k++)
				for (var l = 0; l < year.length; l++)
					list.push(sankeyDB.mask[getIndex(geo[i], flow[j], fuel[k], year[l])]);
	return list;
}

// get the latest reference year in Eurobase
function availableTimeInterval(dataset, geos = "EU27_2020") {
	let years = [];

	// Set the smallest range of years for the selected countries
	geos.split(",").forEach((geo, igeo) => {
		geo = countriesEB[geo] || "EU27_2020"; // TODO: remove this fallback and replace with warning
		const url = getApiUri(dataset, { geo: geo, time: "all", fuel: ["TOTAL"] });
		const d = JSONstat(url).Dataset(0);
		const yearsForGeo = d.Dimension("time").id.filter((val, ival) => {
			return d.Data(ival).value > 0;
		});

		if (igeo === 0 || years.length > yearsForGeo.length) {
			years = yearsForGeo;
		}
	});

	return { first: years[0], last: years[years.length - 1], all: years };
}

//Get countries available in Eurobase
function availableCountries(dataset, year) {
	if (typeof year === "undefined") year = "latest";
	var url = "";
	var d = "";
	var geosForYear = [];
	url = getApiUri(dataset, { geo: "", time: year, fuel: ["TOTAL"] });
	d = JSONstat(url).Dataset(0);
	geosForYear = d.Dimension("geo").id;

	return geosForYear;
}

//get country list not available for the selected year
function countriesNotAvailable(time, geos, flowDisagg) {
	if (sankeyDB.value.length === 0 || geos === "EU27_2020") {
		return [];
	}

	let countriesNotAvailable = [];
	// FIXME: target list of flows
	const flows = ["F1_2"], // check only for some flows. Full list: Object.keys(sankeyDB.dimension.flow.index)
		materials = fuelMap(["TOTAL"], flowDisagg);

	geos.split(",").forEach(function (geo) {
		[].concat(time).forEach(function (year) {
			flows.forEach(function (flow) {
				const valMaterial = materials.map(function (material) {
					const index = getIndex(geo, flow, material, year);
					return sankeyDB.value[index];
				});

				const valMaterialSum = valMaterial.reduce(function (a, b) {
					return a + b;
				});

				if (valMaterialSum === 0) {
					countriesNotAvailable.push(geo);
				}
			});
		});
	});

	return countriesNotAvailable;
}

/**
 * ==============================
 * NEW jsonStat Euro adaption
 * ==============================
 */

const debugLevel = {};
debugLevel.uri = 0;
debugLevel.response = 0;
debugLevel.tracer = 0;
debugLevel.speed = 0;
debugLevel.promise = 0;
debugLevel.lightWeightQuery = 0;

function getEurobaseData(filter) {
	debugLevel.tracer && console.trace();
	const datasetNames = ["nrg_bal_c"];

	datasetNames.forEach(function (dsCode) {
		const t = { 0: performance.now() };
		const url = getApiUri(dsCode, filter),
			ds = JSONstat(url);

		if (!ds) return;

		if (debugLevel.response) {
			console.log("get Eurobase Data");
			console.log("dataset name", ds.extension.id);
			console.log("dataset code", ds.id[1]);
			console.log("dim size", ds.size);
			console.log("dim label", ds.id);
			for (let i = 0; i < ds.Dimension().length; i++) {
				console.log(i, " --> ", ds.id[i], ds.Dimension(i).id);
			}
			console.log("val", ds.value);
		}
		if (debugLevel.dimSize) {
			console.log( "dim size", ds.size.reduce((a, b) => a * b, 1), ds.size); //prettier-ignore
		}

		t[1] = performance.now();
		composeAndCacheGeoYear(ds);
		t[2] = performance.now();
		!debugLevel.lightWeightQuery &&
			composeAndCacheYearsOfGeo((flagRedrawDiagram = false), t);
		t[8] = performance.now();
		!debugLevel.lightWeightQuery &&
			composeAndCacheGeosOfYear((flagRedrawDiagram = false), t);
			// console.log("is download", sankeyDB.isYearBalancesDownloaded, Object.values(sankeyDB.isYearBalancesDownloaded[REF.year]).length);
		t[9] = performance.now();

		// test speed of the loadNrgBalSDValues function
		if (debugLevel.speed) {
			console.table({
				"First load": {
					Query: parseInt(t[1] - t[0]) + " ms",
					Load: parseInt(t[2] - t[1]) + " ms",
					years: parseInt(t[8] - t[2]) + " ms",
					geos: parseInt(t[9] - t[8]) + " ms",
					Total: ((t[9] - t[0]) / 1000).toFixed(2) + " sec",
				},
			});
		}
	});

	$("#loader").css("display", "none");
}

function queryBuilder(datasetName, f) {
	// debugLevel.tracer && console.trace();

	f.fuel = f.fuel || fuelMap(REF.fuels, REF.flowDisagg);
	f.flow = f.flow || ["FC_E"];
	f.unit = f.unit || ["KTOE"];

	let query = {
		dataset: datasetName,
		lang: REF.language,
		filter: {
			nrg_bal: f.flow,
			geo: f.geo,
			siec: f.fuel,
			unit: f.unit,
			time: f.time,
		},
	};

	if (!f.geo || f.geo === "all") {
		query = EuroJSONstat.removeParamQuery(query, ["geo"]);
	}

	if (f.fuel === "all") {
		query = EuroJSONstat.removeParamQuery(query, ["siec"]);
	}

	if (!f.flow || f.flow === "all") {
		query = EuroJSONstat.removeParamQuery(query, ["nrg_bal"]);
	}

	if (!f.time || f.time === "all") {
		query = EuroJSONstat.removeParamQuery(query, ["time"]);
		// query = EuroJSONstat.addParamQuery(query, { sinceTimePeriod: 1990 });
	}

	if (f.time === "latest") {
		query = EuroJSONstat.lastPeriodQuery(query);
	}

	debugLevel.uri && console.log("query url:", EuroJSONstat.getURL(query));

	return query;
}

function getApiUri(datasetCode, filter = filter || {}) {
	const query = queryBuilder(datasetCode, filter);
	//Translate query into Eurostat end-point
	return EuroJSONstat.getURL(query);
}
