var nsTimeChart = {
	cbName: "lineChartCombo",
	chartBox: function (params) {
		var node = nodeNameSpace.nodeListDrawn[params.targetId];
		nsCharts.initChartState("open", nsTimeChart.cbName, node);
		document
			.getElementById(nsTimeChart.cbName)
			.addEventListener("change", function () {
				nsTimeChart.renderChart(node);
		});
		nsTimeChart.renderChart(node);
	},

	/**
	 * chartSeriesRaw - return unformatted data
	 *  * combine values of all promises
	 *  * return format = { data: { category: value,... } }
	 *
	 */
	chartSeriesRaw: function (node, trend) {

		if (trend.substring(trend.length-4) === "Flow") {
			return makeFlowSeries();
		} else {
			return makeFuelSeries();
		}

		function makeFlowSeries() {
			const series = {};
			const geos = REF.geos.split(",");
			const fuel = "TOTAL";
			const flows = trend === "inFlow" ? node.nodeIn : node.nodeOut;
			const flowCodes = flows.map((n) => n[2]);
			const unit = REF.unit;

			flowCodes.forEach((flow, idx) => {
				series[flow] = { seriesName: flows[idx][0] };
				timeSeries.forEach((year) => {
					const value = geos.reduce((acc, geo) => {
						return acc + getValue(geo, flow, fuel, year, unit);
					}, 0);
					series[flow][year] = value;
				});
			});

			return series;
		}

		function makeFuelSeries() {
			const series = {};
			const geos = REF.geos.split(",");
			const fuelCodes = fuelMap("TOTAL", true);
			const unit = REF.unit;

			fuelCodes.forEach((fuel) => {
				series[fuel] = { seriesName: languageNameSpace.labels[fuel] };
				timeSeries.forEach((year) => {
					const value = geos.reduce((acc, geo) => {
						return acc + getFuelValueFromFlows(geo, fuel, year);
					}, 0);
					series[fuel][year] = value;
				});
			});

			return series;

			function getFuelValueFromFlows(geo, fuel, year) {
				const flows = node.nodeIn.length > 0 ? node.nodeIn : node.nodeOut;
				const flowCodes = flows.map((n) => n[2]);
				return flowCodes.reduce((acc, flow) => {
					const flowValue = getValue(geo, flow, fuel, year, unit);
					return acc + flowValue;
				}, 0);
			}
		}
	},

	/**
	 * Takes in a chart series object and returns a new object with the series data aligned.
	 * @param {ChartSeries} cs - the chart series object
	 * @returns {ChartSeries} - the chart series object with the data aligned.
	 */
	chartSeriesAligned: function (cs, trend) {
		const series = [];
		Object.entries(cs)
			.filter(([, cat]) => Object.values(cat).some((v) => v !== 0))
			.forEach(([dim, cat]) => {
				// dim is a fuel code or a flow code
				// iterate categories (ie. x-axis, eg. time, geo )
				const seriesData = Object.keys(cat)
					// weed out seriesName - seriesName is not a category but a series property
					.filter((k) => k !== "seriesName")
					.reduce((acc, k) => {
						return [...acc, cat[k]];
					}, []);

        let seriesObj = { name: cat.seriesName, data: seriesData };

				if (trend.substring(trend.length - 4) !== "Flow")
					seriesObj.color = fuelColors[dim];

				series.push(seriesObj);
			});

		return series;
	},

	/**
	 * Returns an array of all the categories in the data object for the chart x-axis.
	 * @param {Object} data - the data object to get the categories from
	 * @returns {Array} - an array of all the categories in the data object
	 */
	chartCategories: function (data) {
		let cat = [];
		Object.values(data).forEach(function (category) {
			if (cat < Object.keys(category).length) cat = Object.keys(category);
		});
		return cat;
	},

	renderChart: function (node) {
		const trend = document.getElementById(nsTimeChart.cbName).value;
		const chartSeriesRaw = nsTimeChart.chartSeriesRaw(node, trend);
		const chartSeriesAligned = nsTimeChart.chartSeriesAligned(
			chartSeriesRaw,
			trend
		);
		const chartCategories = nsTimeChart.chartCategories(chartSeriesRaw);
		// console.log("chartSeriesAligned", chartSeriesAligned);

		drawTimeChart(node.code, chartCategories, chartSeriesAligned);
	},
};

function drawTimeChart(idNode, xAxisCategories, chartSeriesAligned) {
	let labelCountries = [];

	$.each(countriesEB, function (idx, obj) {
		if (jQuery.inArray(idx, REF.geos.split(",")) > -1) {
			labelCountries.push(obj);
		}
	});

	const trend = document.getElementById(nsTimeChart.cbName).value,
		chartTitle = `${languageNameSpace.getFlowLabel(trend)} ${languageNameSpace.labels[idNode].toLowerCase()}`;
	let lineSubTitle =
		REF.geos.split(",").length > 1
			? languageNameSpace.labels["CHARTS_COUNTRIES"]
			: languageNameSpace.labels["CHARTS_COUNTRY"]
	lineSubTitle += ": ";
	lineSubTitle += labelCountries.toString().replace(/,/g, ", ");
	lineSubTitle += `; ${
		languageNameSpace.labels["CHARTS_UNIT"]
	}: ${languageNameSpace.labels[REF.unit].toLowerCase()}`;

	chartOpen = nsTimeChart;

	chartObject = Highcharts.chart("chart", {
		accessibility: {
			screenReaderSection: {
				beforeChartFormat: "<h2>{chartTitle}</h2>",
			},
		},
		chart: {
			type: "spline",
			spacingBottom: 50,
			// styledMode: true,
			events: chartInitOptions.customCredits,
			style: {
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
			categories: xAxisCategories,
			lineColor: "black",
			labels: {
				style: {
					color: "black",
					fontFamily: "Arial",
					fontSize: ".875rem",
					fontWeight: "normal",
					color: "black",
				},
			},
		},
		yAxis: {
			gridLineDashStyle: "dash",
			labels: {
				format: ["G_T"].includes(REF.unit)
					? "{value: ,.2f}"
					: "{value: ,.0f}",
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
					tblWidth = 310;
				let html = "";

				this.points.forEach(function (point) {
					const color = point.series.color,
						value = Highcharts.numberFormat(point.y, decimalPlaces, ".", " "),
						category = point.series.name,
						title = point.key;
					if (html === "") {
						html = `<table style="white-space:nowrap;width:${tblWidth}px">
								<tr> <td> <span style="font-size: 12px; font-weight: bolder;">${title}</span>
							</table>
						<hr style="height: 1px; box-shadow: none; margin: 3px 0 0 0;width:${tblWidth}px">
						<table style="white-space:nowrap;width:${tblWidth}px">`;
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
			crosshairs: true,
			shared: true,
			useHTML: true,
		},
		credits: chartInitOptions.credits,
		plotOptions: {
			spline: {
				marker: {
					radius: 2,
					lineWidth: 1,
				},
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
						maxHeight: 380,
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
						return languageNameSpace.labels["CSV_EXPORT_YEAR"];
					} else {
						return item.name;
					}
				},
			},
			chartOptions: {
				chart: Object.assign(chartExporting.chart, chartExporting.credits),
			},
			buttons: (function () {
				const btns = chartInitOptions.buttons;
				btns.contextButton.menuItems = btns.contextButton.menuItems.filter(
					(item) => item !== "downloadCSV"
				);
				return btns;
			})(),
			// menuItemDefinitions: chartExporting.menuItemDefinitions(chartTitle), // view the data table is not working
		},
	});

	enableScreenREader()
}
