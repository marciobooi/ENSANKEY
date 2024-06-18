var nsPieChart = {
	cbName: "pieChartCombo",

	chartBox: function (params) {
		var node = nodeNameSpace.nodeListDrawn[params.targetId];
		nsCharts.initChartState("open", nsPieChart.cbName, node);
		document
			.getElementById(nsPieChart.cbName)
			.addEventListener("change", function () {
				nsPieChart.renderChart(node);
			});
		nsPieChart.renderChart(node);
	},

 /**
  * Returns the chart series data for the given node and trend.
  * @param {Object} node - The node object containing the data for the chart.
  * @param {string} trend - The trend to display on the chart. Can be "inFlow", "outFlow", or anything else.
  * @returns {Array} - An array of chart series data that need to be aligned with the Highcharts format.
	* return format = { data: { category: value,... } }
  */
	chartSeriesRaw: function (node, trend) {
		if (trend === "inFlow") {
			return node.nodeIn;
		} else if (trend === "outFlow") {
			return node.nodeOut;
		} else {
			return makeFuelSeries();
		}

		function makeFuelSeries() {
			const flow = node.flowIn.value > node.flowOut.value ? node.flowIn : node.flowOut;
			const series = [];
			for (let i = 0; i < flow.values.length; i++) {
				series.push([flow.fuels[i], flow.values[i], flow.colors[i]]);
			}
			return series;
		}
	},

 /**
  * Aligns the chart series data for a given chart and trend.
  * @param {Array} csRaw - The raw chart series data.
  * @param {string} trend - The trend for the chart.
  * @returns {Array} An array of objects containing the chart series data aligned with the Highcharts format.
  */
	chartSeriesAligned: function (csRaw, trend) {
		const series = [];
		
		for (i = 0; i < csRaw.length; i++) {
			let seriesObj = {
				name: csRaw[i][0],
				y: csRaw[i][1],
			};
			if (trend.substring(trend.length - 4) !== "Flow") {
				seriesObj.color = csRaw[i][2];
			}
			series.push(seriesObj);
		}
		return [
			{
				name: languageNameSpace.labels[REF.unit],
				data: series,
			},
		];
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
		const trend = document.getElementById(nsPieChart.cbName).value;
		const chartSeriesRaw = nsPieChart.chartSeriesRaw(node, trend);
		const chartSeriesAligned = nsPieChart.chartSeriesAligned(chartSeriesRaw, trend);
		drawPieChart(node, trend, chartSeriesAligned);
	},
};

var chartObject;

function drawPieChart(node, trend, chartSeriesAligned) {
	let labelCountries = [];

	chartSeriesAligned[0].data.sort((a, b) => b.y - a.y);

	$.each(countriesEB, function (idx, obj) {
		if (jQuery.inArray(idx, REF.geos.split(",")) > -1) {
			labelCountries.push(obj);
		}
	});

	const chartTitle = `${languageNameSpace.getFlowLabel(
		trend
	)} ${node.name.toLowerCase()}`;
	let lineSubTitle =
		REF.geos.split(",").length > 1
			? languageNameSpace.labels["CHARTS_COUNTRIES"]
			: languageNameSpace.labels["CHARTS_COUNTRY"];
	lineSubTitle += ": ";
	lineSubTitle += labelCountries.toString().replace(/,/g, ", ");
	lineSubTitle += `; ${languageNameSpace.labels["CHARTS_YEAR"]}: ${REF.year}`;
	lineSubTitle += `; ${
		languageNameSpace.labels["CHARTS_UNIT"]
	}: ${languageNameSpace.labels[REF.unit].toLowerCase()}`;
	chartOpen = nsPieChart;

	chartObject = Highcharts.chart("chart", {
		lang: {
			accessibility: {
				chartContainerLabel: "Pie chart with patterns.",
			},
		},
		accessibility: {
			enabled: true,
			screenReaderSection: {
				beforeChartFormat: "<h2>${chartTitle}</h2>",
			},
		},
		chart: {
			type: "pie",
			spacingBottom: 50,
			events: Object.assign(
				chartInitOptions.events.pie,
				// chartInitOptions.customCredits
			),
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

		navigation: chartInitOptions.navigation,
		tooltip: {
			useHTML: true,
			pointFormat: "{point.percentage:.1f}%</b>: {point.y:,.2f}",
			backgroundColor: "#FFFFFF",
		},
		// accessibility: {
		// 	point: {
		// 		valueSuffix: languageNameSpace.labels[REF.unit],
		// 	},
		// },
		credits: chartInitOptions.credits,
		plotOptions: {
			pie: {

				allowPointSelect: true,
				// size: "75%",
				innerSize: "75%",
				showInLegend: true,
				animation: true,
				cursor: "pointer",
				dataLabels: {
				  enabled: true,
				  style: {
					fontSize: '.8rem',
					fontWeight: 'normal'
				},
				  format: "<b>{point.name}</b>:<br>{point.percentage:.2f} %<br>"+ languageNameSpace.labels["VAL"]+": {point.y:,.2f} " + REF.unit
				},


				// allowPointSelect: true,
				// whiteSpace: "nowrap",
				// animation: true,
				// cursor: "pointer",
				// showInLegend: true,
				// overflow: "hidden",
				// textOverflow: "ellipsis",
				// dataLabels: {
				// 	enabled: true,
				// 	format:
				// 		"<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>" +
				// 		languageNameSpace.labels["TOTAL"] +
				// 		": {point.y:,.2f} ",
				// },
				// point: {
				// 	events: {
				// 		click: function (e) {
				// 			var point = this,
				// 				tooltip = point.series.chart.tooltip;
				// 			if (tooltip) {
				// 				tooltip.hide();
				// 			}
				// 		},
				// 		mouseOver: function (event) {
				// 			var p = this;
				// 			if (!p.sliced) {
				// 				p.select(true);
				// 			}
				// 		},
				// 		mouseOut: function (event) {
				// 			var p = this;
				// 			if (p.sliced) {
				// 				p.select(false);
				// 			}
				// 		},
				// 	},
				// },
			},
			series: {
				// size: "60%",
				// innerSize: "65%",
				showInLegend: true,
				dataLabels: {
					enabled: true,
					connectorColor: "silver",
					style: {
						font: "11pt Arial, sans-serif",
					},
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
						maxHeight: 400,
					},
					chartOptions: {
						scrollbar: {
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
						return languageNameSpace.labels["CSV_EXPORT_INDICATOR"];
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
}
