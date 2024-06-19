var filteredAgregates = false;

class ChartControls {
	constructor(idChart, node) {
		if (typeof node === "undefined") {
			return;
		}

		this.controls = document.createElement("div");

		this.flowState(node);

		const selectTemplate = /*html*/ `
			
				<select class="ecl-select" id="${idChart}" name="country" aria-label="Select flow" required data-ecl-auto-init="Select">
				</select>
				`;
	  
	  const wrapper = document.createElement('div');
	  wrapper.innerHTML = selectTemplate;
	  const select = wrapper.querySelector('select');
	  
	  let flagOptionSelected = false;
	  
	  this.trendMap.forEach((value, option) => {
		const optionElement = document.createElement("option");
		optionElement.value = option;
		optionElement.textContent = languageNameSpace.getFlowLabel(option);
	  
		if (!value.visible) {
		  optionElement.classList.add("d-none");
		} else if (value.disabled) {
		  optionElement.setAttribute("disabled", true);
		}
	  
		const optionSelected = value.visible && !value.disabled && !flagOptionSelected;
		if (optionSelected) { 
		  optionElement.setAttribute("selected", true);
		  flagOptionSelected = true;
		}
	  
		select.appendChild(optionElement);
	  });

		this.controls.innerHTML = `
      <div class="container-fluid">
        <nav aria-label="Chart controls" id="chartControls" class="navbar navbar-expand-sm navbar-light bg-light navChartControls">
          <div class="container-fluid">
			<div class="ecl-select__container">
				${select.outerHTML}
				<div class="ecl-select__icon">
					<button class="ecl-button ecl-button--ghost ecl-button--icon-only" type="button" tabindex="-1">
						<span class="ecl-button__container">
							<span class="ecl-button__label" data-ecl-label="true">Toggle dropdown</span>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ecl-icon ecl-icon--s ecl-button__icon" focusable="false" aria-hidden="true">
							<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
							</svg>
						</span>
					</button>
				</div>
			</div>            
            <ul id="chartBtns" role="menubar" aria-label="pie graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
              ${
								idChart === "barChartCombo"
									? `
              <li class="nav-item dropdown px-1" id="ChartTogle" role="none">
                <a href="#" class="ecl-button ecl-button--primary" data-bs-toggle="dropdown" role="menuitem" title="Toggle percentage" aria-haspopup="true" aria-expanded="true" id="tb-togle-percentage">
                  <i class="fas fa-percentage"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="stackingToggleDropdown">
                  <li>
                    <a class="dropdown-item stacking-option ${
											this.stackingOption === "normal" ? "active" : ""
										}" role="menuitem" href="#" data-option="normal">${
											languageNameSpace.labels["NUMBER"]
									  }</a>
                  </li>
                  <li>
                    <a class="dropdown-item stacking-option ${
											this.stackingOption === "percentage" ? "active" : ""
										}" role="menuitem" href="#" data-option="percentage">${
											languageNameSpace.labels["PERCENTAGE"]
									  }</a>
                  </li>
                </ul>
              </li>
              <li><button id="toggleAgregates" class="ecl-button ecl-button--primary" title="${
								languageNameSpace.labels["TOGGLEAGREGATES"]
							}">${languageNameSpace.labels["TOGGLEAGREGATES"]}</button></li>`
									: ""
							}
              <li class="nav-item button px-1" id="printChart" role="none">
                <button id="printBtn" title="Print chart" class="ecl-button ecl-button--primary" type="button" class="me-2" aria-label="print chart" onclick="chartObject.print()">
                  <i class="fas fa-print"></i>
                </button>
              </li>
              <li class="nav-item button px-1" id="downloadChart" role="none">
                <button id="downloadBtn" title="Download chart image" type="button" class="ecl-button ecl-button--primary" aria-label="download chart image" onclick="chartObject.exportChart()">
                  <i class="fas fa-download"></i>
                </button>
              </li>
              <li class="nav-item button px-1" id="downloadExcel" role="none">
                <button id="excelBtn" title="Download chart data" type="button" class="ecl-button ecl-button--primary" aria-label="download chart data" onclick="chartObject.downloadXLS()">
                  <i class="fas fa-file-excel"></i>
                </button>
              </li>
              <li class="nav-item button px-1" id="closeChart" role="none">
                <button id="btnCloseModalChart" title="Close chart" type="button" class="ecl-button ecl-button--primary" aria-label="Close" onclick="nsCharts.initChartState('close')">
                  <i class="fas fa-times"></i>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>`;

		if (chart === "barChartCombo") {
			this.controls.querySelector(".stacking-option").classList.add("active");
		}

		const toggleStacking = () => {
			const targetChart = chartObject;
			console.log(targetChart);
			if (targetChart) {
				const currentStacking = targetChart.options.plotOptions.series.stacking;
				const newStacking = currentStacking === "normal" ? "percent" : "normal";
				targetChart.update({
					plotOptions: {
						series: {
							stacking: newStacking,
						},
					},
				});
			}
		};

		const handleDropdownOptionClick = (event) => {
			const dropdownOption = event.target;
			const selectedOption = dropdownOption.getAttribute("data-option");
			if (selectedOption === "normal" || selectedOption === "percentage") {
				toggleStacking();

				const dropdownOptions = this.controls.querySelectorAll(
					".dropdown-item.stacking-option"
				);
				dropdownOptions.forEach((option) => {
					option.classList.remove("active");
				});

				dropdownOption.classList.add("active");
			}
		};

		const dropdownOptions = this.controls.querySelectorAll(".stacking-option");
		dropdownOptions.forEach((option) => {
			option.addEventListener("click", handleDropdownOptionClick);
		});

		// Add an event listener to the EU toggle button if the chart is barchart
		if (idChart === "barChartCombo") {
			const toggleAgregates = this.controls.querySelector("#toggleAgregates");

			toggleAgregates.addEventListener("click", function () {
				filteredAgregates = !filteredAgregates;

				nsBarChart.renderChart(node);
			});
		}
	}

	addToDOM(targetElement) {
		const container = document.querySelector(targetElement);
		container.insertBefore(this.controls, container.firstChild);
	}

	removeFromDOM() {
		const navElement = document.querySelector("div > nav.navChartControls");
		if (navElement) {
			const parentContainer = navElement.closest(".container-fluid");
			if (parentContainer) {
				parentContainer.parentNode.removeChild(parentContainer);
			}
		}
	}

	flowState(node) {
		const transformations = node.code.substring(0, 2) === "T2";
		const disaggregated = fuelMap(REF.fuels, REF.flowDisagg).length > 1;
		const inFlowsCount = node.nodeIn.filter((el) => el[1] > 0).length;
		const outFlowsCount = node.nodeOut.filter((el) => el[1] > 0).length;

		this.trendMap = new Map([
			[
				"inFuel",
				{
					visible: transformations,
					disabled: disaggregated ? inFlowsCount <= 1 : true,
				},
			],
			[
				"outFuel",
				{
					visible: transformations,
					disabled: disaggregated ? outFlowsCount <= 1 : true,
				},
			],
			[
				"throughFuel",
				{
					visible: !transformations,
					disabled: !disaggregated,
				},
			],
			[
				"inFlow",
				{
					visible: true,
					disabled: inFlowsCount <= 1,
				},
			],
			[
				"outFlow",
				{
					visible: true,
					disabled: outFlowsCount <= 1,
				},
			],
		]);
	}
}
