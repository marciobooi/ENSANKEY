/*
Update tools for online Sankey data:
Output Eurobase update file(s) or country files in bulk download tsv format
*/



// countries to load
var geoListRef = Object.keys(countriesEB);
//var geoListRef = ["FR", "SK"];

// global variables needed for the country cycle
var geoList = [];
var yearList = [];
var timer = new speedTest();
var startCountryCycle = true;
var isSourcefileParsed = false;
var isComextFile;

// codes to be downloaded: all that are needed for mapData(), cf. database.js
var codesDownload = codesMapData;

// object to store formatted string arrays for output
var updateFormat = "";
var deleteAll = true;
var updateData = {};
var updateHeader = "";
var updateFooter = "";
var updateSuffix = "";

// bulk download link for nrg_bal_c
var linkNRGBALC = "https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?file=data/nrg_bal_c.tsv.gz"

// link to Eurobase Upload Service
var linkEurobaseUploadService = "https://webgate.ec.europa.eu/estat/eurobaseupload/#/welcome-screen/";



// text-to-html wrapper
function dumpText(text) {
	d3.select("body").append("text").html(text);
};



// format as Eurobase update file
function updateEurobase() {
	alert("Depending on the amount of data requested (number of countries and years), this script may take some time to finish (up to 2 minutes). Please ignore any browser warnings that might pop up during that time and, if needed, continue the execution manually by clicking the respective button.");
	updateFormat = "Eurobase";
	processBeforeCycle(); // resets geoList and yearList
	updateHeader =
		"FLAT_FILE=STANDARD\r\n" +
		"ID_KEYS=NRG_BAL_SD\r\n" +
		"FIELDS=GEO,UNIT,NRG_BAL,SIEC,TIME\r\n";
	if (deleteAll) updateHeader += "UPDATE_MODE=DELETE_ALL\r\n";
	updateHeader += "UPDATE_MODE=RECORDS\r\n";
	updateFooter = "END_OF_FLAT_FILE";
	updateSuffix = ".txt";
	processCountries();
};



// format as a TSV file for each country
function updateTSV() {
	updateFormat = "TSV";
	processBeforeCycle(); // resets geoList and yearList
	updateHeader = "NRG_BAL,SIEC,GEO,UNIT\\TIME";
	$.each(yearList, function (iy, y) { updateHeader += "\t" + y; });
	updateHeader += "\n";
	updateFooter = "";
	updateSuffix = ".tsv";
	processCountries();
};



// what needs to be done before the country download cycle (process user input, set codes, etc.)
function processBeforeCycle() {
	codesDownload = codesMapData;
	var start = document.getElementById("first-year").value;
	var end = document.getElementById("last-year").value;
	deleteAll = document.getElementById("update-DR").checked;
	var geoIn = document.getElementById("geo-list").value;
	if (geoIn)
		geoList = geoIn.split(",");
	else
		geoList = geoListRef.slice(0);
	yearList = [];
	for (var y = parseInt(start) ; y <= parseInt(end) ; y++) yearList.push(y.toString());
	var nYear = yearList.length, nGeo = geoList.length;
	dumpText("<br><br><br><b>Loading data from source file (" + yearList.length + " year" + (nYear > 1 ? "s" : "") + " for " + geoList.length + " countr" + (nGeo > 1 ? "ies" : "y") + "):</b><br><br>");
	codesDownload.geo = geoList;
	codesDownload.year = yearList;
	return;
};



// function wrapper, depending whether input source file is provided
function processCountries() {

	// source file from html input query
	var reader = new FileReader();
	var sourceFile = document.getElementById("input-file").files[0];
	if (!sourceFile) {
		dumpText("<font color='red'>ERROR: Input source file missing! Please complete setting (1).</font>");
	} else {
		var ftype = sourceFile.name.split(".").pop();
		if (ftype !== "tsv" && ftype !== "TSV" && ftype !== "txt" && ftype !== "TXT") {
			dumpText("<font color='red'>ERROR: Input must be a TSV or TXT file! Please correct setting (1).</font>");
			return;
	};
		isComextFile = (ftype === "txt" || ftype === "TXT");
	};
	reader.onload = function (progressEvent) {

		// entire file
//		d3.tsv.parse(this.result, function (data) { console.log(data) });
		//console.log(this.result);
		processCountriesFromFile(this.result);

		// line by line
//		var lines = this.result.split('\n');
//		for (var line = 0; line < lines.length; line++) console.log(lines[line]);
	};
	reader.readAsText(sourceFile);
};



// CORE FUNCTION: parse nrg_bal_c source file provided by the user
function processCountriesFromFile(source) {

	// initialize sankeyDB and fill by parsing source file
	//if (!sankeyDB.value.length) {
		initializeDB(codesDownload);
		timer.log("initialize");
	//};
	
	console.log("isSourcefileParsed: "+isSourcefileParsed);
	console.log("isComextFile: "+isComextFile);
	
	if (isSourcefileParsed) {
		proceedAfterParse();
		return;
	};
	if (isComextFile) {
		dumpText("Parsing COMEXT extraction TXT file ... ");
		parseEurobaseUploadSource(source, proceedAfterParse);
	} else {
		dumpText("Parsing bulk download TSV file ... ");
		parseBulkDownloadSource(source, proceedAfterParse);
	};

	// code to execute after parsing
	function proceedAfterParse() {
		if (!isSourcefileParsed) {
			timer.log("parse source");
			dumpText("Done! (" + printOneDecimal(timer.total() / 1000) + " s)<br>");
			isSourcefileParsed = true;
		};

		// loop over countries and calculate Sankey data
		dumpText("Mapping country data ... ");
		$.each(geoList, function (igeo, geo) {
			if (!getMask(geo, "N1", "TOTAL", yearList[0])) mapData(geo);
			updateData[geo] = formatCountry(geo, updateFormat);
//			createGeoFile(geo); // output each country as file download
		});
		timer.log("mapping and formatting");
		dumpText("Done! (" + printOneDecimal(timer.last() / 1000) + " s)<br>");

		// final output file
		processAfterCycle();
		timer.log("output file");
		timer.dump("performance breakdown");
	};
};



// what needs to be done after the country download cycle (create upate files etc.)
function processAfterCycle() {

	// one file per country
//	for (var geo in updateData) createGeoFile(geo);

	// a single file for all data
	var updateGeo = [updateHeader];
	for (var geo in updateData) updateGeo = updateGeo.concat(updateData[geo]);
	updateGeo.push(updateFooter);
	addFileDownloadButton(updateGeo, "nrg_bal_sd_UPDATE" + updateSuffix);

	// add hyperlink to Eurobase Upload Service
	d3.select("body").append("a").text(" for Eurobase upload ");
	d3.select("body").append("a")
		.attr("href", linkEurobaseUploadService)
		.attr("target", "_blank")
		.attr("id", "eurobase-upload")
		.text("here");

	// add hyperlink to Sankey tool displaying current data in sankeyDB
	sessionStorage.clear();
	try { // see if session quota is exceeded
		sessionStorage.setItem("sankeyDB_STORAGE", JSON.stringify(sankeyDB));
	} catch (e) {
		if (isQuotaExceeded(e)) {
			dumpText("<br><font color='red'>Loaded data exceeds session cache - reduce years and/or countries to enable live data inspection.</font><br><br>");
			addResetButton(); // add a reset button
			return;
		};
	};
	d3.select("body").append("a")
		.attr("href", "sankey.html")
		.attr("target", "_blank")
		.attr("id", "go-to-sankey")
		.html("<br>Inspect data in Sankey tool");
	document.getElementById("go-to-sankey").onclick = function () {
		sessionStorage.setItem("refFuels_STORAGE", document.getElementById("show-fuel").value);
		return;
	};
	d3.select("body").append("a").html(" (go directly to fuel family: ");
	d3.select("body").append("input")
		.attr("type", "text")
		.attr("size", "4")
		.attr("id", "show-fuel")
		.attr("value", "TOTAL")
		.attr("placeholder", "TOTAL");
	d3.select("body").append("a").html(")<br><br>");

	// add a reset button
	addResetButton();

	return;

	function addResetButton() {
		d3.select("body").append("input")
			.attr("type", "button")
			.attr("value", "Reset form for new run")
			.attr("onclick", "location.reload()");
	};
};



//  create a download file for one single country
function createGeoFile(geo) {
	var updateGeo = updateData[geo].slice(0);
	updateGeo.unshift(updateHeader);
	updateGeo.push(updateFooter);
	addFileDownloadButton(updateGeo, geo + updateSuffix);
};



// country information in Eurobase upload format
function formatCountry(geo, format) {
	var output = [];
	
	// loop over flows and fuels in nrg_bal_sd
	$.each(codesSankey.flow, function (iflow, flow) {
		$.each(codesSankey.fuel, function (ifuel, fuel) {
			var outString = "";

			// check format and loop over years
			switch (format) {
			
				case ("Eurobase"):
					$.each(codesDownload.year, function (iyear, year) {
						var value = getValue(geo, flow, fuel, year);

						if (Math.abs(value) > 0) outString +=
							geo + "\tKTOE\t" + codeDictionary(flow) + "\t" + fuel + "\t" + year + "\t" +
							printOneDecimal(value) + "\r\n";
					});
					break;

				case ("TSV"):
					outString += geo + ",KTOE," + codeDictionary(flow) + "," + fuel;
					$.each(codesDownload.year, function (iyear, year) {
						var value = getValue(geo, flow, fuel, year);
						outString += "\t" + printOneDecimal(value);
					});
					outString += "\n";
					break;

				default:
					error("formatLines: Unknown format tag: " + format);
			}; // switch format
			
			output.push(outString);
		}); // fuels
	}); // flows

	return output;
};