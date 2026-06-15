/**
 * insights.js
 * Computes energy statistics from the global sankeyDB and selected options,
 * renders a modern full-screen modal, and displays interactive charts.
 * 
 * Complies with ECU/ECL light styling guidelines, includes number spacing formatting,
 * combined values notice, and summary card with translations.
 */

const insightsNameSpace = {

  POPULATION: {
    "EU27_2020": 447000000,
    "BE": 11500000, "BG": 6900000, "CZ": 10700000, "DK": 5800000,
    "DE": 83200000, "EE": 1300000, "IE": 5000000, "EL": 10700000,
    "ES": 47300000, "FR": 67400000, "HR": 4000000, "IT": 59600000,
    "CY": 900000, "LV": 1900000, "LT": 2800000, "LU": 630000,
    "HU": 9700000, "MT": 500000, "NL": 17400000, "AT": 8900000,
    "PL": 37800000, "PT": 10300000, "RO": 19200000, "SI": 2100000,
    "SK": 5400000, "FI": 5500000, "SE": 10400000, "IS": 360000,
    "NO": 5400000, "ME": 620000, "MK": 2000000, "AL": 2800000,
    "RS": 6900000, "TR": 83600000, "XK": 1800000, "UA": 41000000,
    "MD": 2600000, "BA": 3300000, "GE": 3700000
  },

  getLang: function() {
    return (REF?.language || 'EN').toUpperCase();
  },

  getLabels: function() {
    return languageNameSpace.labels;
  },

  // Number formatting with spaces helper
  formatValWithSpaces: function(v, decimals = 0) {
    if (v == null || isNaN(v)) return "0";
    const num = Number(v);
    const parts = num.toFixed(decimals).split(".");
    // Use the global printNumber function for integer part spacing
    const integerPart = printNumber(Number(parts[0]), " ");
    return parts[1] ? (integerPart + "." + parts[1]) : integerPart;
  },

  // Helper to extract values for multiple countries
  getVal: function(flow, fuel = "TOTAL", year = Number(REF.year)) {
    const geos = REF.geos.split(",");
    const unit = REF.unit;
    return getValueForCountries(geos, flow, fuel, year, unit);
  },

  getGaeForFuel: function(fuel, year = Number(REF.year)) {
    const imp = this.getVal("F1_2", fuel, year);
    const exp = this.getVal("F6_3", fuel, year);
    const pprd = this.getVal("F1_1_2", fuel, year);
    const rcv = this.getVal("F1_1_1", fuel, year);
    const stkDraw = this.getVal("F1_3", fuel, year);
    const stkBuild = this.getVal("F6_2", fuel, year);
    return pprd + rcv + imp - exp + (stkDraw - stkBuild);
  },

  calculateMetricsForYear: function(y) {
    const imp = this.getVal("F1_2", "TOTAL", y);
    const exp = this.getVal("F6_3", "TOTAL", y);
    const pprd = this.getVal("F1_1_2", "TOTAL", y);
    const rcv = this.getVal("F1_1_1", "TOTAL", y);
    const stkDraw = this.getVal("F1_3", "TOTAL", y);
    const stkBuild = this.getVal("F6_2", "TOTAL", y);

    const stockChange = stkDraw - stkBuild;
    const gae = pprd + rcv + imp - exp + stockChange;
    const impDep = gae !== 0 ? ((imp - exp) / gae) * 100 : 0;

    const impRen = this.getVal("F1_2", "RA000", y);
    const expRen = this.getVal("F6_3", "RA000", y);
    const pprdRen = this.getVal("F1_1_2", "RA000", y);
    const rcvRen = this.getVal("F1_1_1", "RA000", y);
    const stkDrawRen = this.getVal("F1_3", "RA000", y);
    const stkBuildRen = this.getVal("F6_2", "RA000", y);
    const gaeRen = pprdRen + rcvRen + impRen - expRen + (stkDrawRen - stkBuildRen);
    const renShare = gae !== 0 ? (gaeRen / gae) * 100 : 0;

    const fec = this.getVal("F6_1_1", "TOTAL", y);

    return { gae, fec, impDep, renShare };
  },

  openInsightsModal: function() {
    const langLabels = this.getLabels();
    const currentYear = Number(REF.year);
    const prevYear = currentYear - 1;
    const unit = REF.unit;

    // Primary values
    const imp = this.getVal("F1_2");
    const exp = this.getVal("F6_3");
    const pprd = this.getVal("F1_1_2");
    const rcv = this.getVal("F1_1_1");
    const stkDraw = this.getVal("F1_3");
    const stkBuild = this.getVal("F6_2");

    const netImports = imp - exp;
    const stockChanges = stkDraw - stkBuild;
    const gae = pprd + rcv + imp - exp + stockChanges;

    // KPI Calculations
    const importDependency = gae !== 0 ? (netImports / gae) * 100 : 0;
    const selfSufficiency = gae !== 0 ? ((pprd + rcv) / gae) * 100 : 0;

    // Renewable GAE
    const impRen = this.getVal("F1_2", "RA000");
    const expRen = this.getVal("F6_3", "RA000");
    const pprdRen = this.getVal("F1_1_2", "RA000");
    const rcvRen = this.getVal("F1_1_1", "RA000");
    const stkDrawRen = this.getVal("F1_3", "RA000");
    const stkBuildRen = this.getVal("F6_2", "RA000");
    const gaeRen = pprdRen + rcvRen + impRen - expRen + (stkDrawRen - stkBuildRen);
    const renewableShare = gae !== 0 ? Math.max(0, Math.min(100, (gaeRen / gae) * 100)) : 0;

    // Fossil share
    const fossilGae = this.getGaeForFuel("SFF_P1000") + this.getGaeForFuel("O4000") + this.getGaeForFuel("G3000_C0350-370");
    const fossilFuelShare = gae !== 0 ? Math.max(0, Math.min(100, (fossilGae / gae) * 100)) : 0;

    // Low carbon share
    const lowCarbonGae = this.getGaeForFuel("RA000") + this.getGaeForFuel("N900H");
    const lowCarbonShare = gae !== 0 ? Math.max(0, Math.min(100, (lowCarbonGae / gae) * 100)) : 0;

    // Electrification
    const electricityFEC = this.getVal("F6_1_1", "E7000");
    const totalFEC = this.getVal("F6_1_1", "TOTAL");
    const electrificationRate = totalFEC > 0 ? (electricityFEC / totalFEC) * 100 : 0;

    // Losses
    const transLosses = this.getVal("F4");
    const distLosses = this.getVal("F6_6");
    const totalLosses = transLosses + distLosses;
    const energyLossesPct = gae !== 0 ? (totalLosses / gae) * 100 : 0;

    // Largest Loss Source
    const lossFlows = [
      { code: "F4_6", name: "Refineries" },
      { code: "F4_7", name: "Coal briquette & peat briquette plants" },
      { code: "F4_8", name: "Coke ovens" },
      { code: "F4_9", name: "Blast furnaces" },
      { code: "F4_10", name: "Gas works" },
      { code: "F4_11", name: "Electricity and heat generation" },
      { code: "F4_12", name: "Other transformation" }
    ];
    let maxLossValue = -1;
    let largestLossSource = "N/A";
    lossFlows.forEach(flow => {
      const val = this.getVal(flow.code);
      if (val > maxLossValue) {
        maxLossValue = val;
        largestLossSource = flow.name;
      }
    });

    // Consumption by Sector
    const ind = this.getVal("F6_1_1_1");
    const tra = this.getVal("F6_1_1_2");
    const hh = this.getVal("F6_1_1_3_2");
    const cp = this.getVal("F6_1_1_3_1");
    const af = this.getVal("F6_1_1_3_3");
    const fishing = this.getVal("F6_1_1_3_4");
    const nsp = this.getVal("F6_1_1_3_5");
    const otherSectors = fishing + nsp;

    const sectorConsumption = [
      { name: "Industry", val: ind, share: totalFEC > 0 ? (ind / totalFEC) * 100 : 0 },
      { name: "Transport", val: tra, share: totalFEC > 0 ? (tra / totalFEC) * 100 : 0 },
      { name: "Households", val: hh, share: totalFEC > 0 ? (hh / totalFEC) * 100 : 0 },
      { name: "Commercial & Public Services", val: cp, share: totalFEC > 0 ? (cp / totalFEC) * 100 : 0 },
      { name: "Agriculture & Forestry", val: af, share: totalFEC > 0 ? (af / totalFEC) * 100 : 0 },
      { name: "Other", val: otherSectors, share: totalFEC > 0 ? (otherSectors / totalFEC) * 100 : 0 }
    ];

    let largestConsumingSector = "N/A";
    let largestSectorShare = 0;
    sectorConsumption.forEach(sector => {
      if (sector.share > largestSectorShare) {
        largestSectorShare = sector.share;
        largestConsumingSector = sector.name;
      }
    });

    // Fuel Mix Details
    const fuelMix = [
      { code: "SFF_P1000", name: "Solid Fossil Fuels", val: this.getGaeForFuel("SFF_P1000") },
      { code: "O4000", name: "Oil and Petroleum Products", val: this.getGaeForFuel("O4000") },
      { code: "G3000_C0350-370", name: "Natural Gas", val: this.getGaeForFuel("G3000_C0350-370") },
      { code: "RA000", name: "Renewables and Biofuels", val: this.getGaeForFuel("RA000") },
      { code: "N900H", name: "Nuclear Heat", val: this.getGaeForFuel("N900H") },
      { code: "W6100_6220", name: "Non-Renewable Waste", val: this.getGaeForFuel("W6100_6220") },
      { code: "H8000", name: "Derived Heat", val: this.getGaeForFuel("H8000") },
      { code: "E7000", name: "Electricity", val: this.getGaeForFuel("E7000") }
    ];

    let largestEnergySource = "N/A";
    let largestSourceShare = 0;
    fuelMix.forEach(fuel => {
      const share = gae > 0 ? (fuel.val / gae) * 100 : 0;
      fuel.share = share;
      if (share > largestSourceShare) {
        largestSourceShare = share;
        largestEnergySource = fuel.name;
      }
    });

    // Advanced Insights
    const transportOil = this.getVal("F6_1_1_2", "O4000");
    const transportTotal = this.getVal("F6_1_1_2", "TOTAL");
    const transportOilDependency = transportTotal > 0 ? (transportOil / transportTotal) * 100 : 0;

    const renInputEhg = this.getVal("F2_11_1", "RA000");
    const totalInputEhg = this.getVal("F2_11_1", "TOTAL");
    const renewableElectricityShare = totalInputEhg > 0 ? (renInputEhg / totalInputEhg) * 100 : 0;

    const industryShare = totalFEC > 0 ? (ind / totalFEC) * 100 : 0;
    const householdShare = totalFEC > 0 ? (hh / totalFEC) * 100 : 0;

    // Strategic Insights & Indicators Calculations
    // 1. Transformation Efficiency
    const transInput = this.getVal("F2_1");
    const transOutput = this.getVal("F2_2");
    const transformationEfficiency = transInput > 0 ? (transOutput / transInput) * 100 : 0;

    // 2. Sectoral Grid Electrification
    const indElec = this.getVal("F6_1_1_1", "E7000");
    const indTotal = this.getVal("F6_1_1_1", "TOTAL");
    const industryElectrification = indTotal > 0 ? (indElec / indTotal) * 100 : 0;

    const traElec = this.getVal("F6_1_1_2", "E7000");
    const traTotal = this.getVal("F6_1_1_2", "TOTAL");
    const transportElectrification = traTotal > 0 ? (traElec / traTotal) * 100 : 0;

    // 3. Renewable Mix Breakdown
    const totalRenewables = this.getGaeForFuel("RA000");
    const windRen = this.getGaeForFuel("RA300");
    const solarRen = this.getGaeForFuel("RA410") + this.getGaeForFuel("RA420");
    const hydroRen = this.getGaeForFuel("RA100");
    const otherRen = Math.max(0, totalRenewables - (windRen + solarRen + hydroRen));

    const windShareOfRenewables = totalRenewables > 0 ? (windRen / totalRenewables) * 100 : 0;
    const solarShareOfRenewables = totalRenewables > 0 ? (solarRen / totalRenewables) * 100 : 0;
    const hydroShareOfRenewables = totalRenewables > 0 ? (hydroRen / totalRenewables) * 100 : 0;
    const otherShareOfRenewables = totalRenewables > 0 ? (otherRen / totalRenewables) * 100 : 0;

    // 4. Import Risk (Geopolitical Concentration)
    const gasImports = this.getVal("F1_2", "G3000_C0350-370");
    const oilImports = this.getVal("F1_2", "O4000");
    const coalImports = this.getVal("F1_2", "SFF_P1000");

    const gasImportRisk = gae > 0 ? (gasImports / gae) * 100 : 0;
    const oilImportRisk = gae > 0 ? (oilImports / gae) * 100 : 0;
    const coalImportRisk = gae > 0 ? (coalImports / gae) * 100 : 0;

    // 5. Non-Energy Use Footprint
    const nonEnergyConsumption = this.getVal("F6_1_2", "TOTAL");
    const finalEnergyConsumption = this.getVal("F6_1_1", "TOTAL");
    const nonEnergyFootprint = finalEnergyConsumption > 0 ? (nonEnergyConsumption / finalEnergyConsumption) * 100 : 0;

    // Per capita calculations
    let totalPopulation = 0;
    REF.geos.split(",").forEach(geo => {
      totalPopulation += this.POPULATION[geo] || 0;
    });

    let perCapitaEnergyUse = "N/A";
    if (totalPopulation > 0) {
      if (unit === "KTOE") {
        perCapitaEnergyUse = this.formatValWithSpaces((totalFEC * 1000) / totalPopulation, 3) + " toe / capita";
      } else if (unit === "GWh") {
        perCapitaEnergyUse = this.formatValWithSpaces((totalFEC * 1000000) / totalPopulation, 0) + " kWh / capita";
      } else {
        perCapitaEnergyUse = this.formatValWithSpaces(totalFEC / totalPopulation, 5) + " " + unit + " / capita";
      }
    }

    // Top Flows Listing
    const flowsToCompare = [
      { code: "F1_1_2", source: "Primary production", target: "Available from all sources" },
      { code: "F1_1_1", source: "Recovered and recycled", target: "Available from all sources" },
      { code: "F1_2", source: "Imports", target: "Available from all sources" },
      { code: "F6_3", source: "Available after transformation", target: "Exports" },
      { code: "F1_3", source: "Stock draw", target: "Available from all sources" },
      { code: "F6_2", source: "Available after transformation", target: "Stock build" },
      { code: "F2_1", source: "Available from all sources", target: "Transformation" },
      { code: "F2_2", source: "Transformation", target: "Available after transformation" },
      { code: "F4", source: "Transformation", target: "Transformation losses" },
      { code: "F6_1_1", source: "Available after transformation", target: "Final energy consumption" },
      { code: "F6_1_2", source: "Available after transformation", target: "Final non-energy consumption" },
      { code: "F6_5", source: "Available after transformation", target: "Energy sector consumption" },
      { code: "F6_6", source: "Available after transformation", target: "Distribution losses" }
    ];

    const topFlows = flowsToCompare.map(f => {
      const val = this.getVal(f.code);
      return {
        source: f.source,
        target: f.target,
        value: this.formatValWithSpaces(val, 2) + " " + unit,
        numericVal: val
      };
    })
    .sort((a, b) => b.numericVal - a.numericVal)
    .slice(0, 10);

    // Formatted absolute values with space separators
    const stockChangesAbs = this.formatValWithSpaces(stockChanges, 2) + " " + unit;
    const importsAbs = this.formatValWithSpaces(imp, 2) + " " + unit;
    const domesticProductionAbs = this.formatValWithSpaces(pprd + rcv, 2) + " " + unit;

    // Build Trends
    const trends = [];
    if (timeSeries.contains(String(prevYear))) {
      const currentMetrics = this.calculateMetricsForYear(currentYear);
      const prevMetrics = this.calculateMetricsForYear(prevYear);

      // GAE Trend
      const gaeChange = prevMetrics.gae > 0 ? ((currentMetrics.gae - prevMetrics.gae) / prevMetrics.gae) * 100 : 0;
      trends.push({
        metric: "Gross Available Energy",
        previous: this.formatValWithSpaces(prevMetrics.gae, 2) + " " + unit,
        current: this.formatValWithSpaces(currentMetrics.gae, 2) + " " + unit,
        change: (gaeChange >= 0 ? "+" : "") + this.formatValWithSpaces(gaeChange, 1) + "%",
        positive: gaeChange < 0
      });

      // FEC Trend
      const fecChange = prevMetrics.fec > 0 ? ((currentMetrics.fec - prevMetrics.fec) / prevMetrics.fec) * 100 : 0;
      trends.push({
        metric: "Final Energy Consumption",
        previous: this.formatValWithSpaces(prevMetrics.fec, 2) + " " + unit,
        current: this.formatValWithSpaces(currentMetrics.fec, 2) + " " + unit,
        change: (fecChange >= 0 ? "+" : "") + this.formatValWithSpaces(fecChange, 1) + "%",
        positive: fecChange < 0
      });

      // Renewable Share Trend
      const renChange = currentMetrics.renShare - prevMetrics.renShare;
      trends.push({
        metric: "Renewable Share",
        previous: this.formatValWithSpaces(prevMetrics.renShare, 1) + "%",
        current: this.formatValWithSpaces(currentMetrics.renShare, 1) + "%",
        change: (renChange >= 0 ? "+" : "") + this.formatValWithSpaces(renChange, 1) + " pp",
        positive: renChange >= 0
      });

      // Import Dependency Trend
      const impChange = currentMetrics.impDep - prevMetrics.impDep;
      trends.push({
        metric: "Import Dependency",
        previous: this.formatValWithSpaces(prevMetrics.impDep, 1) + "%",
        current: this.formatValWithSpaces(currentMetrics.impDep, 1) + "%",
        change: (impChange >= 0 ? "+" : "") + this.formatValWithSpaces(impChange, 1) + " pp",
        positive: impChange < 0
      });
    }

    // Modal data compilation
    const data = {
      importDependency: this.formatValWithSpaces(importDependency, 1),
      renewableShare: this.formatValWithSpaces(renewableShare, 1),
      energyLosses: this.formatValWithSpaces(energyLossesPct, 1),
      largestConsumingSector: largestConsumingSector,
      largestEnergySource: largestEnergySource,
      fossilFuelShare: this.formatValWithSpaces(fossilFuelShare, 1),
      electrificationRate: this.formatValWithSpaces(electrificationRate, 1),
      selfSufficiency: this.formatValWithSpaces(selfSufficiency, 1),
      keyTakeaways: {
        largestEnergySource: `The largest energy source is <strong>${largestEnergySource}</strong>, representing <strong>${this.formatValWithSpaces(largestSourceShare, 1)}%</strong> of the total Gross Available Energy.`,
        largestConsumingSector: `The largest energy consumer is the <strong>${largestConsumingSector}</strong> sector, representing <strong>${this.formatValWithSpaces(largestSectorShare, 1)}%</strong> of the final energy consumption.`,
        importDependency: importDependency >= 0 
          ? `The dependency on energy imports is <strong>${this.formatValWithSpaces(importDependency, 1)}%</strong>. Net imports supply the major share of energy needs.`
          : `The region is a net exporter of energy, with an import dependency rate of <strong>${this.formatValWithSpaces(importDependency, 1)}%</strong>.`,
        transformationLosses: `Transformation and distribution losses represent <strong>${this.formatValWithSpaces(energyLossesPct, 1)}%</strong> of Gross Available Energy, with the most significant losses occurring in <strong>${largestLossSource}</strong>.`
      },
      sources: {
        imports: importsAbs,
        domesticProduction: domesticProductionAbs,
        stockChanges: stockChangesAbs
      },
      fuelMix: fuelMix.map(f => ({
        name: f.name,
        share: this.formatValWithSpaces(f.share, 1),
        change: "0.0"
      })),
      losses: {
        total: this.formatValWithSpaces(energyLossesPct, 1),
        transformation: gae > 0 ? this.formatValWithSpaces(transLosses / gae * 100, 1) : "0.0",
        distribution: gae > 0 ? this.formatValWithSpaces(distLosses / gae * 100, 1) : "0.0",
        largestSource: largestLossSource
      },
      consumptionBySector: sectorConsumption.map(s => ({
        name: s.name,
        share: this.formatValWithSpaces(s.share, 1)
      })),
      energyMix: {
        fossil: this.formatValWithSpaces(fossilFuelShare, 1),
        lowCarbon: this.formatValWithSpaces(lowCarbonShare, 1),
        renewables: this.formatValWithSpaces(renewableShare, 1)
      },
      trends: trends,
      topFlows: topFlows,
      transportOilDependency: this.formatValWithSpaces(transportOilDependency, 1),
      renewableElectricityShare: this.formatValWithSpaces(renewableElectricityShare, 1),
      industryShare: this.formatValWithSpaces(industryShare, 1),
      householdShare: this.formatValWithSpaces(householdShare, 1),
      perCapitaEnergyUse: perCapitaEnergyUse,
      transformationEfficiency: this.formatValWithSpaces(transformationEfficiency, 1),
      industryElectrification: this.formatValWithSpaces(industryElectrification, 1),
      transportElectrification: this.formatValWithSpaces(transportElectrification, 1),
      windRenMix: this.formatValWithSpaces(windShareOfRenewables, 1),
      solarRenMix: this.formatValWithSpaces(solarShareOfRenewables, 1),
      hydroRenMix: this.formatValWithSpaces(hydroShareOfRenewables, 1),
      otherRenMix: this.formatValWithSpaces(otherShareOfRenewables, 1),
      gasImportRisk: this.formatValWithSpaces(gasImportRisk, 1),
      oilImportRisk: this.formatValWithSpaces(oilImportRisk, 1),
      coalImportRisk: this.formatValWithSpaces(coalImportRisk, 1),
      nonEnergyFootprint: this.formatValWithSpaces(nonEnergyFootprint, 1)
    };

    // Render Modal DOM
    const modal = document.createElement("div");
    modal.className = "energy-modal";
    modal.id = "energy-insights-modal";

    // Handle more than one country selected (Combined values indicator)
    const geosCount = REF.geos.split(",").length;
    const combinedIndicator = geosCount > 1 ? langLabels.COMBINED_VALUES_FOR : "";

    let trendsHtml = "";
    if (data.trends && data.trends.length > 0) {
      trendsHtml = `
      <section>
        <h2>${langLabels.YOY_TRENDS} (${prevYear} → ${currentYear})</h2>
        <p class="section-desc">${langLabels.DESC_YOY_TRENDS || ""}</p>
        <div id="trend-chart" class="insights-chart-container"></div>
        <table>
          <thead>
            <tr>
              <th>${langLabels.METRIC}</th>
              <th>${langLabels.PREVIOUS} (${prevYear})</th>
              <th>${langLabels.CURRENT} (${currentYear})</th>
              <th>${langLabels.CHANGE}</th>
            </tr>
          </thead>
          <tbody>
            ${data.trends.map(trend => `
              <tr>
                <td>${trend.metric}</td>
                <td>${trend.previous}</td>
                <td>${trend.current}</td>
                <td class="${trend.positive ? 'trend-positive' : 'trend-negative'}"><strong>${trend.change}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </section>
      `;
    }

    modal.innerHTML = `
      <div class="energy-modal-content">
        <button class="energy-modal-close-btn" id="energy-modal-close-btn" aria-label="${langLabels.CLOSE_BUTTON}">
          <i class="fas fa-times"></i>
        </button>

        <header class="hero">
          <h1>${langLabels.MODAL_TITLE}</h1>
          <div class="hero-subtitle">
            <strong>${combinedIndicator}</strong>${REF.geos.split(",").map(c => countriesEB[c] || c).join(" + ")} | ${REF.year} | ${energyUnits[unit].label}
          </div>

          <!-- Top Summary Card explaining the purpose -->
          <div class="insights-summary-card">
            <h3>${langLabels.SUMMARY_TITLE}</h3>
            <p>${langLabels.SUMMARY_TEXT}</p>
          </div>

          <div class="kpi-grid">
            ${this.renderKPI(langLabels.IMPORT_DEP, data.importDependency + "%", "IMPORT_DEP")}
            ${this.renderKPI(langLabels.RENEWABLE_SHARE, data.renewableShare + "%", "RENEWABLE_SHARE")}
            ${this.renderKPI(langLabels.ENERGY_LOST, data.energyLosses + "%", "ENERGY_LOST")}
            ${this.renderKPI(langLabels.LARGEST_CONSUMER, data.largestConsumingSector, "LARGEST_CONSUMER")}
            ${this.renderKPI(langLabels.LARGEST_SOURCE, data.largestEnergySource, "LARGEST_SOURCE")}
            ${this.renderKPI(langLabels.FOSSIL_DEP, data.fossilFuelShare + "%", "FOSSIL_DEP")}
            ${this.renderKPI(langLabels.ELECTRIFICATION, data.electrificationRate + "%", "ELECTRIFICATION")}
            ${this.renderKPI(langLabels.SELF_SUFFICIENCY, data.selfSufficiency + "%", "SELF_SUFFICIENCY")}
          </div>
        </header>

        <section>
          <h2>${langLabels.KEY_TAKEAWAYS}</h2>
          <p class="section-desc">${langLabels.DESC_KEY_TAKEAWAYS || ""}</p>
          <ul>
            <li>${data.keyTakeaways.largestEnergySource}</li>
            <li>${data.keyTakeaways.largestConsumingSector}</li>
            <li>${data.keyTakeaways.importDependency}</li>
            <li>${data.keyTakeaways.transformationLosses}</li>
          </ul>
        </section>

        <section>
          <h2>${langLabels.SOURCE_BREAKDOWN}</h2>
          <p class="section-desc">${langLabels.DESC_SOURCE_BREAKDOWN || ""}</p>
          <div id="source-breakdown-chart" class="insights-chart-container"></div>
          <ul>
            <li><strong>${langLabels.IMPORTS}:</strong> ${data.sources.imports}</li>
            <li><strong>${langLabels.DOMESTIC_PROD}:</strong> ${data.sources.domesticProduction}</li>
            <li><strong>${langLabels.STOCK_CHANGES}:</strong> ${data.sources.stockChanges}</li>
          </ul>
        </section>

        <section>
          <h2>${langLabels.FUEL_MIX}</h2>
          <p class="section-desc">${langLabels.DESC_FUEL_MIX || ""}</p>
          <div id="fuel-mix-chart" class="insights-chart-container"></div>
          <table>
            <thead>
              <tr>
                <th>Fuel</th>
                <th>Share (%)</th>
              </tr>
            </thead>
            <tbody>
              ${data.fuelMix.map(fuel => `
                <tr>
                  <td>${fuel.name}</td>
                  <td><strong>${fuel.share}%</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </section>

        <section>
          <h2>${langLabels.ENERGY_LOSSES}</h2>
          <p class="section-desc">${langLabels.DESC_ENERGY_LOSSES || ""}</p>
          <div id="energy-losses-chart" class="insights-chart-container"></div>
          <ul>
            <li><strong>Total Losses:</strong> ${data.losses.total}%</li>
            <li><strong>Transformation Losses:</strong> ${data.losses.transformation}%</li>
            <li><strong>Distribution Losses:</strong> ${data.losses.distribution}%</li>
            <li><strong>Largest Loss Source:</strong> ${data.losses.largestSource}</li>
          </ul>
        </section>

        <section>
          <h2>${langLabels.CONS_BY_SECTOR}</h2>
          <p class="section-desc">${langLabels.DESC_CONS_BY_SECTOR || ""}</p>
          <div id="sector-chart" class="insights-chart-container"></div>
          <table>
            <thead>
              <tr>
                <th>Sector</th>
                <th>Share (%)</th>
              </tr>
            </thead>
            <tbody>
              ${data.consumptionBySector.map(sector => `
                <tr>
                  <td>${sector.name}</td>
                  <td><strong>${sector.share}%</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </section>

        <section>
          <h2>${langLabels.FOSSIL_VS_LOW}</h2>
          <p class="section-desc">${langLabels.DESC_FOSSIL_VS_LOW || ""}</p>
          <div id="fossil-mix-chart" class="insights-chart-container"></div>
          <ul>
            <li><strong>${langLabels.FOSSIL_FUELS}:</strong> ${data.energyMix.fossil}%</li>
            <li><strong>${langLabels.LOW_CARBON}:</strong> ${data.energyMix.lowCarbon}%</li>
            <li><strong>${langLabels.RENEWABLES} (subcategory):</strong> ${data.energyMix.renewables}%</li>
          </ul>
        </section>

        ${trendsHtml}

        <section>
          <h2>${langLabels.TOP_FLOWS}</h2>
          <p class="section-desc">${langLabels.DESC_TOP_FLOWS || ""}</p>
          <ol>
            ${data.topFlows.map(flow => `
              <li>
                <strong>${flow.source}</strong> &rarr; <strong>${flow.target}</strong>
                <span style="color: var(--insights-accent); font-weight: 600;">(${flow.value})</span>
              </li>
            `).join("")}
          </ol>
        </section>
        <section>
          <h2>${langLabels.STRATEGIC_INSIGHTS}</h2>
          <p class="section-desc">${langLabels.DESC_STRATEGIC_INSIGHTS || ""}</p>
          <div class="strategic-grid">
            <!-- Transformation Efficiency -->
            <div class="strategic-card">
              <div class="strategic-card-header">
                <h3>${langLabels.TRANS_EFF_TITLE}</h3>
                <span class="strategic-val">${data.transformationEfficiency}%</span>
              </div>
              <p class="strategic-desc">
                <strong>${langLabels.WHAT_IT_IS}:</strong> ${langLabels.TRANS_EFF_WHAT}<br>
                <strong>${langLabels.WHY_IT_MATTERS}:</strong> ${langLabels.TRANS_EFF_WHY}
              </p>
            </div>

            <!-- Sectoral Grid Electrification -->
            <div class="strategic-card">
              <div class="strategic-card-header">
                <h3>${langLabels.SECTOR_ELEC_TITLE}</h3>
                <span class="strategic-val">Ind: ${data.industryElectrification}% / Tra: ${data.transportElectrification}%</span>
              </div>
              <p class="strategic-desc">
                <strong>${langLabels.WHAT_IT_IS}:</strong> ${langLabels.SECTOR_ELEC_WHAT}<br>
                <strong>${langLabels.WHY_IT_MATTERS}:</strong> ${langLabels.SECTOR_ELEC_WHY}
              </p>
            </div>

            <!-- Renewable Mix Breakdown -->
            <div class="strategic-card">
              <div class="strategic-card-header">
                <h3>${langLabels.REN_MIX_TITLE}</h3>
                <span class="strategic-val">Wind: ${data.windRenMix}% / Solar: ${data.solarRenMix}%</span>
              </div>
              <p class="strategic-desc">
                <strong>${langLabels.WHAT_IT_IS}:</strong> ${langLabels.REN_MIX_WHAT}<br>
                <strong>${langLabels.WHY_IT_MATTERS}:</strong> ${langLabels.REN_MIX_WHY}<br>
                <strong>Breakdown:</strong> Wind: ${data.windRenMix}%, Solar: ${data.solarRenMix}%, Hydro: ${data.hydroRenMix}%, Others: ${data.otherRenMix}%
              </p>
            </div>

            <!-- Import Risk (Geopolitical Concentration) -->
            <div class="strategic-card">
              <div class="strategic-card-header">
                <h3>${langLabels.IMPORT_RISK_TITLE}</h3>
                <span class="strategic-val">Gas: ${data.gasImportRisk}% / Oil: ${data.oilImportRisk}%</span>
              </div>
              <p class="strategic-desc">
                <strong>${langLabels.WHAT_IT_IS}:</strong> ${langLabels.IMPORT_RISK_WHAT}<br>
                <strong>${langLabels.WHY_IT_MATTERS}:</strong> ${langLabels.IMPORT_RISK_WHY}<br>
                <strong>GAE Share:</strong> Oil & Petroleum: ${data.oilImportRisk}%, Natural Gas: ${data.gasImportRisk}%, Solid Fuels (Coal): ${data.coalImportRisk}%
              </p>
            </div>

            <!-- Non-Energy Use Footprint -->
            <div class="strategic-card">
              <div class="strategic-card-header">
                <h3>${langLabels.NON_ENERGY_TITLE}</h3>
                <span class="strategic-val">${data.nonEnergyFootprint}%</span>
              </div>
              <p class="strategic-desc">
                <strong>${langLabels.WHAT_IT_IS}:</strong> ${langLabels.NON_ENERGY_WHAT}<br>
                <strong>${langLabels.WHY_IT_MATTERS}:</strong> ${langLabels.NON_ENERGY_WHY}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>${langLabels.ADVANCED_INSIGHTS}</h2>
          <p class="section-desc">${langLabels.DESC_ADVANCED_INSIGHTS || ""}</p>
          <ul>
            <li><strong>${langLabels.TRANS_OIL_DEP}:</strong> ${data.transportOilDependency}%</li>
            <li><strong>${langLabels.REN_ELEC_SHARE}:</strong> ${data.renewableElectricityShare}%</li>
            <li><strong>${langLabels.IND_SHARE}:</strong> ${data.industryShare}%</li>
            <li><strong>${langLabels.HOUSEHOLD_SHARE}:</strong> ${data.householdShare}%</li>
            <li><strong>${langLabels.PER_CAPITA}:</strong> ${data.perCapitaEnergyUse}</li>
          </ul>
        </section>

      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden"; // Disable background scrolling

    // Event handler for closing modal
    const closeModal = () => {
      const modalEl = document.getElementById("energy-insights-modal");
      if (modalEl) {
        modalEl.remove();
        document.body.style.overflow = ""; // Restore scrolling
        document.removeEventListener("keydown", handleKeyDown);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.getElementById("energy-modal-close-btn").addEventListener("click", closeModal);
    document.addEventListener("keydown", handleKeyDown);

    // Render Highcharts
    this.renderCharts(data);
  },

  renderKPI: function(label, value, key) {
    const langLabels = languageNameSpace.labels;
    const what = langLabels["KPI_" + key + "_WHAT"] || "";
    const why = langLabels["KPI_" + key + "_WHY"] || "";
    let descHtml = "";
    if (what && why) {
      descHtml = `
        <div class="kpi-desc">
          <strong>${langLabels.WHAT_IT_IS || "What it is"}:</strong> ${what}<br>
          <strong>${langLabels.WHY_IT_MATTERS || "Why it matters"}:</strong> ${why}
        </div>
      `;
    }
    return `
      <div class="kpi-card">
        <div>
          <div class="kpi-label">${label}</div>
          <div class="kpi-value">${value}</div>
        </div>
        ${descHtml}
      </div>
    `;
  },

  renderCharts: function(data) {
    if (typeof Highcharts === "undefined") {
      console.warn("Highcharts not loaded, skipping chart rendering.");
      return;
    }

    // Highcharts global styles for ECL light theme
    const chartThemeOptions = {
      chart: {
        backgroundColor: "transparent",
        style: {
          fontFamily: "'Inter', sans-serif",
          color: "#1e293b"
        }
      },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      // Remove Highcharts burger context menu from the modal charts
      exporting: {
        enabled: false
      },
      legend: {
        itemStyle: {
          color: "#576575"
        },
        itemHoverStyle: {
          color: "#1e293b"
        }
      },
      tooltip: {
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        style: {
          color: "#1e293b"
        }
      }
    };

    // 1. Source Breakdown Chart
    const sourceData = [];
    const prodVal = parseFloat(data.sources.domesticProduction.replace(/\s/g, ''));
    const impVal = parseFloat(data.sources.imports.replace(/\s/g, ''));
    const stockVal = parseFloat(data.sources.stockChanges.replace(/\s/g, ''));
    if (!isNaN(prodVal) && prodVal > 0) sourceData.push({ name: "Domestic Production", y: prodVal, color: "#10b981" });
    if (!isNaN(impVal) && impVal > 0) sourceData.push({ name: "Imports", y: impVal, color: "#0e47cb" });
    if (!isNaN(stockVal) && stockVal > 0) sourceData.push({ name: "Stock Draw", y: stockVal, color: "#f59e0b" });

    Highcharts.chart("source-breakdown-chart", Highcharts.merge(chartThemeOptions, {
      chart: {
        type: "pie"
      },
      plotOptions: {
        pie: {
          innerSize: "60%",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f}%",
            color: "#1e293b"
          }
        }
      },
      series: [{
        name: "Value",
        data: sourceData
      }]
    }));

    // 2. Fuel Mix Chart
    const getFuelColor = (name) => {
      const map = {
        "Solid Fossil Fuels": fuelColors["SFF_P1000"] || "#AA5F18",
        "Oil and Petroleum Products": fuelColors["O4000"] || "#2644A7",
        "Natural Gas": fuelColors["G3000"] || "#C6AF5D",
        "Renewables and Biofuels": fuelColors["RA000"] || "#33A033",
        "Nuclear Heat": fuelColors["N900H"] || "#B656BD",
        "Non-Renewable Waste": fuelColors["W6100_6220"] || "#FBC11D",
        "Derived Heat": fuelColors["H8000"] || "#003399",
        "Electricity": fuelColors["E7000"] || "#AF155C"
      };
      return map[name] || "#7D8088";
    };

    const fuelMixData = data.fuelMix
      .filter(f => parseFloat(f.share) > 0)
      .map(f => ({
        name: f.name,
        y: parseFloat(f.share),
        color: getFuelColor(f.name)
      }));

    Highcharts.chart("fuel-mix-chart", Highcharts.merge(chartThemeOptions, {
      chart: {
        type: "pie"
      },
      plotOptions: {
        pie: {
          innerSize: "50%",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.y}%",
            color: "#1e293b"
          }
        }
      },
      series: [{
        name: "Share",
        data: fuelMixData
      }]
    }));

    // 3. Energy Losses Chart
    const lossesData = [
      { name: "Useful / Delivered Energy", y: 100 - parseFloat(data.losses.total), color: "#10b981" },
      { name: "Transformation Losses", y: parseFloat(data.losses.transformation), color: "#f43f5e" },
      { name: "Distribution Losses", y: parseFloat(data.losses.distribution), color: "#f59e0b" }
    ].filter(item => item.y > 0);

    Highcharts.chart("energy-losses-chart", Highcharts.merge(chartThemeOptions, {
      chart: {
        type: "pie"
      },
      plotOptions: {
        pie: {
          innerSize: "60%",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.y:.1f}%",
            color: "#1e293b"
          }
        }
      },
      series: [{
        name: "Share of GAE",
        data: lossesData
      }]
    }));

    // 4. Consumption by Sector Chart
    const sectorCategories = data.consumptionBySector.map(s => s.name);
    const sectorShares = data.consumptionBySector.map(s => parseFloat(s.share));

    Highcharts.chart("sector-chart", Highcharts.merge(chartThemeOptions, {
      chart: {
        type: "bar"
      },
      xAxis: {
        categories: sectorCategories,
        labels: {
          style: {
            color: "#576575"
          }
        }
      },
      yAxis: {
        title: {
          text: "Percentage (%)",
          style: {
            color: "#576575"
          }
        },
        labels: {
          style: {
            color: "#576575"
          }
        },
        gridLineColor: "#e2e8f0"
      },
      series: [{
        name: "Sector Share (%)",
        data: sectorShares,
        color: "#0e47cb",
        showInLegend: false
      }]
    }));

    // 5. Fossil vs Low Carbon Chart
    Highcharts.chart("fossil-mix-chart", Highcharts.merge(chartThemeOptions, {
      chart: {
        type: "pie"
      },
      plotOptions: {
        pie: {
          innerSize: "60%",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.y}%",
            color: "#1e293b"
          }
        }
      },
      series: [{
        name: "Share",
        data: [
          { name: "Fossil Fuels", y: parseFloat(data.energyMix.fossil), color: "#ef4444" },
          { name: "Low Carbon (Renewables + Nuclear)", y: parseFloat(data.energyMix.lowCarbon), color: "#10b981" }
        ]
      }]
    }));

    // 6. Year-over-Year Trends Chart
    if (data.trends && data.trends.length > 0) {
      const trendCategories = data.trends.map(t => t.metric);
      const prevVals = data.trends.map(t => parseFloat(t.previous.replace(/\s/g, '')));
      const currVals = data.trends.map(t => parseFloat(t.current.replace(/\s/g, '')));

      Highcharts.chart("trend-chart", Highcharts.merge(chartThemeOptions, {
        chart: {
          type: "column"
        },
        xAxis: {
          categories: trendCategories,
          labels: {
            style: {
              color: "#576575"
            }
          }
        },
        yAxis: {
          title: {
            text: "Value",
            style: {
              color: "#576575"
            }
          },
          labels: {
            style: {
              color: "#576575"
            }
          },
          gridLineColor: "#e2e8f0"
        },
        series: [
          {
            name: "Previous Year",
            data: prevVals,
            color: "#94a3b8"
          },
          {
            name: "Current Year",
            data: currVals,
            color: "#0e47cb"
          }
        ]
      }));
    }
  }
};
