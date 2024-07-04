/**
 *========================================
 * HighCharts - chart open and close
 *========================================
 */

const nsCharts = {
	/**
	 * Initializes the chart state.
	 * @param {string} action - the action to take.
	 * @returns None
	 */
  initChartState: function (action, chart, node) {
    const controls = new ChartControls(chart, node);
    const isOpen = action === "open";

    if (isOpen) {
        controls.addToDOM("#auxChartControls");
    } else {
        controls.removeFromDOM();
    }
    
    showHideTimeline(action);

    // Using a utility function to update display style for multiple elements
    const updateDisplay = (selectors, display) => {
        selectors.forEach(selector => {
            $(selector).css("display", display);
        });
    };

    updateDisplay(["#chartContainer"], isOpen ? "block" : "none");
    updateDisplay(["#diagramContainer", ".horizontal-timeline", "#legendContainer", "#legend-box-modal", "#reset-to-default"], isOpen ? "none" : "block");
    updateDisplay(["#mainToolbar", "#zoom-content"], isOpen ? "none" : "flex");
}

};


/**
 *============================================================
 * HighCharts - Common options for pie, bar and line HighCharts
 *============================================================
 */
const creditsHTML = `<span style="font-size: .875rem;">${languageNameSpace.labels["EXPORT_FOOTER_TITLE"]} - </span>
  <a style="color:blue; text-decoration: underline; font-size: .875rem;"
  href="https://ec.europa.eu/eurostat/databrowser/view/nrg_bal_c/default/table?lang=${REF.language}">${languageNameSpace.labels["accData"]}</a>
  <span style="font-size: .875rem;"> </span>`;


chartInitOptions = {
  navigation: {
    buttonOptions: {
      // enabled: true,
      theme: {
        style: {
          fontSize: "20px",
          color: "#888",
        },
        states: {
          hover: {
            style: {
              color: "#000",
            },
          },
        },
      },
      useHTML: true,
    },
  },
  buttons: {
    contextButton: {
      enabled: false,
      menuItems: [
        {
          text: "Close",
          onclick: function () {
            nsCharts.initChartState("close");
            setTimeout(function () {
              $("#chart").highcharts().destroy();
            }, 510);
          },
        },
        // "viewFullscreen",
        "printChart",
        "separator",
        "downloadPNG",
        "downloadJPEG",
        "downloadSVG",
        "separator",
        // "downloadCSV",
        "downloadXLS",
        // "viewData",
      ],
    },
  },
  credits: {
    text: creditsHTML,
    href: "",
    style: {
      color: "black",
      fontSize: "16px",
    },
    position: {
      align: "center",
    },
  },
  customCredits: {
    load: function () {
      // if (1 == 1) return;
      // const customCredits = this.credits.getBBox();
      // this.renderer.image("img/eurostat-logo.png")
      //   .addClass("chartLogo")
      //   .attr({
      //     zIndex: 9999,
      //     preserveAspectRatio: "xMidYMid meet",
      //     cursor: "pointer",
      //     x: "88%",
      //     y: "95.5%",
      //     width: 100,
      //     height: 40
      //   }).add();
      // $(".chartLogo").click(function () {window.open("https://ec.europa.eu/eurostat","_self");
      // });
    },
  },
  events: {
    pie: {
      load: function () {
        var chart = this,
          points = chart.series[0].points,
          len = points.length,
          i = 0;

        var legend = this.legend,
          legendGroup = legend.group;

        for (var i = 0; i < len; i++) {
          if (points[i].y < 0) {
            this.renderer
              .text(
                // "<span>" + languageNameSpace.labels["negativeValues"] + "</span>",
                legendGroup.translateX + legend.padding,
                legendGroup.translateY + legend.legendHeight + legend.padding,
                true
              )
              .add();
            break;
          }
        }
      },
    },
  },
};

chartExporting = {
  chart: {
    width: 1000,
    height: (1000 * 9) / 16,
    allowHTML: true,
    events: {
      load: function () {
        this.renderer
          .image(
            "https://ec.europa.eu/eurostat/statistics-explained/images/0/09/Logo_RGB-POS.png",
            900,
            0,
            100,
            35
          )
          .add();
      },
    },
  },
  csv: {
    columnHeaderFormatter: function (item, key) {
      if (!item || item instanceof Highcharts.Axis) {
        return languageNameSpace.labels["YEAR"];
      } else {
        return item.name;
      }
    },
  },
  menuItemDefinitions: function (chartTitle) {
    return {
      viewData: {
        onclick: function () {
          $(".highcharts-data-table").html("");
          if (!this.insertedTable) {
            var div = document.createElement("div");
            div.className = "highcharts-data-table";
            // Insert after the chart container
            this.renderTo.parentNode.insertBefore(
              div,
              this.renderTo.nextSibling
            );
            div.innerHTML = this.getTable();
            this.insertedTable = true;
            var date_str = new Date().getTime().toString();
            var rand_str = Math.floor(Math.random() * 1000000).toString();
            this.insertedTableID = "div_" + date_str + rand_str;
            div.id = this.insertedTableID;
            tableIsOpen = true;
            // $('.highcharts-data-table').wrap("<div class='overlay'>");

            $(".highcharts-data-table").prepend(
              `<div id="tableHeader">
	              <img class='tableLogo' src='https://ec.europa.eu/eurostat/statistics-explained/images/0/09/Logo_RGB-POS.png' alt='' />
	              <a class='print' onclick='chart.downloadXLS()'><i class='fad fa-print'></i></a>
	            </div>`
            );
            $(".highcharts-table-caption").html(
              chartTitle + " <br>" + creditsHTML
            );
            const cells = document.querySelectorAll("td.number");
            cells.forEach(function (cell) {
              cell.innerHTML = Highcharts.numberFormat(cell.innerHTML, 2);
            });
            this.options.exporting.showTable = "true";
            handleTable();
          } else {
            $("#" + this.insertedTableID).toggle();
            tableIsOpen = true;
            // $('.highcharts-data-table').wrap("<div class='overlay'>");
            $(".highcharts-data-table").append(
              "<img class='tableLogo' src='https://ec.europa.eu/eurostat/statistics-explained/images/0/09/Logo_RGB-POS.png' alt='' /><a class='print' onclick='printTable()'><i class='fad fa-print'></i></a>"
            );
            handleTable();
          }
        },
      },
    };
  },
};

$(function () {
  (function (H) {
      H.wrap(H.Chart.prototype, 'getCSV', function (proceed, useLocalDecimalPoint) {
          // Run the original proceed method
          result = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
          result +=
						'\n"' +
						languageNameSpace.labels["EXPORT_FOOTER_TITLE"] +
						' ("' +
						Object.keys(codesEurobase).join("; ") +
						'")"';
          return result;
      });
  }(Highcharts));
});

