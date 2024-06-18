var nsBarChart = {
	cbName: "barChartCombo",
	chartBox: function (params) {
		var node = nodeNameSpace.nodeListDrawn[params.targetId];
		nsCharts.initChartState("open", nsBarChart.cbName, node);

		nsBarChart.cbChange(node);
		nsBarChart.renderChart(node);
	},

	cbChange: function (node) {
		document
			.getElementById(nsBarChart.cbName)
			.addEventListener("change", function () {
				nsBarChart.renderChart(node);
			});
	},

	/**
	 * Generates a chart series object based on the given node and trend.
	 * This is the raw output and needs to be aligned for the HighCharts.
	 * @param {Object} node - The node object to generate the chart series for.
	 * @param {string} trend - The trend to generate the chart series for.
	 * @returns {Object} - The chart series object { data: { category: value,... } }
	 */
	chartSeriesRaw: function (node, trend, isFlowSeries, order) {
		const currentGeos = REF.geos.split(",");
		const countryAggregates = ["EU27_2020", "EA19"];
		const countries = codesSankey.geo.filter((c) =>
			!filteredAgregates
				? !countryAggregates.includes(c)
				: !countryAggregates[1].includes(c)
		);

		// creating a flag for Selected Countries
		if (currentGeos.length > 1) {
			countries.push("CHARTS_CTRY_AGRR");
		}

		if (order === "ALPHA") {
			sortCountriesByLabel(countries);
		}

		const year = REF.year;
		const unit = REF.unit;

		return isFlowSeries
			? makeSeries(makeFlowSeries)
			: makeSeries(makeFuelSeries);

		function makeSeries(seriesBuilder) {
			const series = { rank: {} };
			const fuel = "TOTAL";
			const flows = trend === "inFlow" ? node.nodeIn : node.nodeOut;
			const flowCodes = flows.map((n) => n[2]);

			seriesBuilder(series, flowCodes, fuel);

			return series;
		}

		function makeFlowSeries(series, flowCodes, fuel) {
			const flows = trend === "inFlow" ? node.nodeIn : node.nodeOut;

			flowCodes.forEach((flow, idx) => {
				series[flow] = { seriesName: flows[idx][0] };

				countries.forEach((geo) => {
					const value =
						geo === "CHARTS_CTRY_AGRR"
							? currentGeos.reduce(
									(acc, geo) => acc + getValue(geo, flow, fuel, year, unit),
									0
							  )
							: getValue(geo, flow, fuel, year, unit);

					updateSeriesBasedOnOrder(series, flow, geo, value);
				});
			});
		}

		function makeFuelSeries(series, flowCodes) {
			const fuelCodes = fuelMap("TOTAL", true);

			fuelCodes.forEach((fuel) => {
				series[fuel] = { seriesName: languageNameSpace.labels[fuel] };

				countries.forEach((geo) => {
					const value =
						geo === "CHARTS_CTRY_AGRR"
							? currentGeos.reduce(
									(acc, geo) => acc + getFuelValueFromFlows(geo, fuel),
									0
							  )
							: getFuelValueFromFlows(geo, fuel);

					updateSeriesBasedOnOrder(series, fuel, geo, value);
				});
			});

			function getFuelValueFromFlows(geo, fuel) {
				return flowCodes.reduce((acc, flow) => {
					const flowValue = getValue(geo, flow, fuel, year, unit);
					return acc + flowValue;
				}, 0);
			}
		}

		function updateSeriesBasedOnOrder(series, key, geo, value) {
			series[key][geo] = value;
			series.rank[geo] ||= 0;

			switch (order) {
				case "ASC":
					series.rank[geo] += value;
					break;
				case "DSC":
					series.rank[geo] -= value;
					break;
			}
		}

		function sortCountriesByLabel(countries) {
			const sortedMap = new Map();
			countries.forEach((country) => {
				const label = languageNameSpace.labels[country];
				sortedMap.set(country, label);
			});

			// Sort the map by label
			const sortedCountries = new Map(
				[...sortedMap.entries()].sort((a, b) => a[1].localeCompare(b[1]))
			);

			// Extract the sorted countries from the map
			countries.length = 0;
			countries.push(...sortedCountries.keys());
		}
	},

	/**
	 * Takes in a dataset and returns a formatted data for series.
	 * @param {Object} cs - the chart series to convert to a series array
	 * @returns {Array} - the series array for the chart
	 * @format { name: "name", data: [value, value, value] }
	 */
	chartSeriesAligned: function (cs, isFlowSeries) {
		const series = [];
		Object.entries(cs)
			.filter(([key]) => key !== "rank")
			.forEach(([dim, cat]) => {
				const seriesData = Object.entries(cat)
					.filter(([g]) => g !== "seriesName")
					.map(([g, v]) => ({
						name: languageNameSpace.labels[g], // x-axis label
						custom: { rank: cs.rank[g] },
						y: decimalPlaces3(v),
					}));

				seriesData.sort((a, b) => b.custom.rank - a.custom.rank);

				let seriesObj = {
					name: cat.seriesName,
					data: seriesData,
					dataSorting: {
						enabled: true,
						sortKey: "custom.rank",
					},
				};

				seriesObj.color = isFlowSeries ? fuelColors[dim] : null;

				series.push(seriesObj);
			});
		// console.log("series", series);
		// console.log("series", JSON.stringify(series));
		return series;
	},

	renderChart: function (node) {
		const trend = document.getElementById(nsBarChart.cbName).value;
		const isFlowSeries = trend.substring(trend.length - 4) === "Flow";
		const chartSeriesRaw = nsBarChart.chartSeriesRaw(node, trend, isFlowSeries, order = "ASC"); // prettier-ignore
		const chartSeriesAligned = nsBarChart.chartSeriesAligned(chartSeriesRaw, isFlowSeries); // prettier-ignore

		drawBarChart(node.code, trend, chartSeriesAligned);
	},
};

let stackingOption = "normal";

function drawBarChart(idNode, trend, chartSeriesAligned) {
	const chartTitle = `${languageNameSpace.getFlowLabel(trend)} ${languageNameSpace.labels[idNode].toLowerCase()}`, // prettier-ignore
		lineSubTitle = getSubtitleStr();

	chartOpen = nsBarChart;

	chartObject = Highcharts.chart("chart", {
		accessibility: {
			enabled: true,
			screenReaderSection: {
				beforeChartFormat: "<h2>{chartTitle}</h2>",
			},
		},
		chart: {
			className: "barChartObject",
			type: "column",			
			spacingBottom: 50,
			events: chartInitOptions.customCredits,
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			style: {
				animation: true,
				duration: 1000,
				fontFamily: "Arial",
			},
		},
		title: {
			text: chartTitle,
			style: {
				fontFamily: "Arial",
				fontSize: "1.3rem",
				fontWeight: "200",
			},
		},
		subtitle: {
			text: lineSubTitle,
			style: {
				fontFamily: "Arial",
				fontSize: "1rem",
				fontWeight: "200",
				color: "black",
			},
		},
		xAxis: {
			type: "category",
			lineColor: "black",
			labels: {
				// align: "left",
				style: {
					fontFamily: "Arial",
					fontSize: ".875rem",
					color: "black",
				},
			},
		},
		yAxis: {
			gridLineDashStyle: "dash",
			labels: {
				format: ["G_T"].includes(REF.unit) ? "{value: ,.2f}" : "{value: ,.0f}",
				style: {
					color: "black",
				},
			},
			title: {
				text: languageNameSpace.labels[REF.unit],
				style: {
					fontFamily: "Arial",
					fontSize: "1em",
					fontWeight: "200",
				},
			},
		},
		navigation: chartInitOptions.navigation,
		tooltip: {
			formatter: function () {
				const decimalPlaces =
						REF.unit === "G_T" || REF.unit === "T_HAB" ? 2 : 0,
					tblWidth = 380;
				let html = "";

				this.points.forEach(function (point) {
					const color = point.series.color,
						value = Highcharts.numberFormat(point.y, decimalPlaces, ".", " "),
						category = point.series.name,
						title = point.key;
					if (html === "") {
						html = `<table style="white-space:normal;width:${tblWidth}px">
								<tr> <td> <span style="font-size: 12px; font-weight: bolder;">${title}</span>
							</table>
						<hr style="height: 1px; box-shadow: none; margin: 3px 0 0 0;width:${tblWidth}px">
						<table style="white-space:normal;width:${tblWidth}px">`;
					}
					html += `<tr><td>
							<svg width="10" height="10" style=" vertical-align: baseline;">
								<circle cx="5" cy="5" r="5" fill="${color}" /> </svg>
							<span style="font-size: .875rem;">${category}</span>
							<span style="float: right; font-size: .875rem">${value}</span>`;
				});

				html += `</table>`;
				return html;
			},
			backgroundColor: "#FFFFFF",
			shared: true,
			useHTML: true,
		},
		credits: chartInitOptions.credits,
		plotOptions: {
			series: {
				stacking: stackingOption,
			},
		},
		legend: {
			padding: 3,   
			itemMarginTop: 5,
			itemMarginBottom: 5,
			itemHiddenStyle: {
			  color: '#767676'
			},
			itemStyle: {
			  fontSize: '.9rem',
			  fontWeight: 'light'
			}
		  },
		series: chartSeriesAligned,
		colors: [...flowColors],
		responsive: {
			rules: [
				{
					condition: {
						maxWidth: 820,
						maxHeight: 300,
					},
					chartOptions: {
						scrollbar: {
							enabled: false,
						},
						legend: {
							enabled: false,
						},
					},
				},
			],
		},
		exporting: {
			filename: languageNameSpace.labels["dataset"],
			tableCaption: chartTitle + "<br>" + lineSubTitle + "<br>" + creditsHTML,
			csv: {
				columnHeaderFormatter: function (item, key) {
					if (!item || item instanceof Highcharts.Axis) {
						return languageNameSpace.labels["CSV_EXPORT_COUNTRY"];
					} else {
						return item.name;
					}
				},
			},
			chartOptions: {
				chart: Object.assign(chartExporting.chart, chartExporting.credits),
			},
			buttons: chartInitOptions.buttons,
			menuItemDefinitions: chartExporting.menuItemDefinitions(chartTitle),
		},
	});

	enableScreenREader()

	function getSubtitleStr() {
		let lineSubTitle = "";
		if (!filteredAgregates) {
			let labelCountries = [];

			REF.geos.split(",").forEach((geo) => {
				labelCountries.push(languageNameSpace.labels[geo]);
			});

			if (REF.geos.split(",").length > 1) {
				lineSubTitle += languageNameSpace.labels.CHARTS_CTRY_AGRR;
				lineSubTitle += ": ";
				lineSubTitle += labelCountries.toString().replace(/,/g, ", ");
				lineSubTitle += "; ";
			}
		}

		lineSubTitle += `${languageNameSpace.labels["CHARTS_YEAR"]}: ${REF.year}, ${
			languageNameSpace.labels["CHARTS_UNIT"]
		}: ${languageNameSpace.labels[REF.unit].toLowerCase()}`;

		return lineSubTitle;
	}
}
