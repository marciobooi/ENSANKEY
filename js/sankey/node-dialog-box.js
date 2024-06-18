var nodeboxNameSpace = {
	nodeDialogBox: function (node) {
		const	ssKey = "barChartDisclaimerAccepted",
		params = {
			title: getNodeName(node.code),
			targetId: node.code,
			modalType: "node",
			pieChartHidden: node.nodeIn.length < 2 && node.nodeOut.length < 2,
			showDisclaimer: this.showDisclaimer(ssKey),
			ssKey: ssKey,
			flowCodes: [...node.nodeIn, ...node.nodeOut].map((flow) => {	return flow[2]}),
		};
		document
			.getElementById("page")
			.addEventListener("mouseup", this.drawNodeDialogBox(params), false);
	},

	showDisclaimer: function (params) {
		if (sessionStorage.getItem(params.ssKey) !== null) {
			return false;
		}
		return true;
	},

	//construct the node Dialog box
	//it is created on the first click on a node then it is hidden or shown
	// an over lay is added to close the dialog box while clicking out of the dialog box
	drawNodeDialogBox: function (params) {
		// create modal
		const modal = document.getElementById("sankey-primary-modal");
		modal.innerHTML = nsSankeyModal.modalEnvelopeHtml(params);
		this.setStateDisaggBtn(params);

		if (params.pieChartHidden) this.pieChartHidden(params);

		// add event listeners
		document.getElementById("time-chart").addEventListener("click", () => {
			// $("#loader").show();
			nsSankeyModal.closeModal();
			composeAndCacheYearsOfGeo(true);

			const geos = REF.geos.split(",");

			const waitDataAvailability = setInterval(() => {
				// check if all geos have data for the selected year
				if (geos.every((geo) => sankeyDB.isTimeDownloaded[geo])) {
					clearInterval(waitDataAvailability); // Stop the loop
					nsTimeChart.chartBox(params);
					$("#loader").fadeOut(1000);
				}
			}, 500); // Check every 500 milliseconds
		});
		
		document.getElementById("pie-chart").addEventListener("click", () => {
			nsSankeyModal.closeModal();
			nsPieChart.chartBox(params);
		});
		
		document.getElementById("bar-chart").addEventListener("click", () => {
			nsSankeyModal.closeModal();
			const nrgBalListUnique = getDataApiBalances();
			// console.log("nrgBalListUnique", nrgBalListUnique);
			composeAndCacheGeosOfYear(true, null, nrgBalListUnique);

			const waitDataAvailability = setInterval(() => {
				let allDataAvailable = true;

				for (const bal of nrgBalListUnique) {
					if (
						!sankeyDB.isYearBalancesDownloaded.hasOwnProperty(REF.year) ||
						!sankeyDB.isYearBalancesDownloaded[REF.year].hasOwnProperty(bal)
					) {
						allDataAvailable = false;
						break;
					}
				}

				if (allDataAvailable) {
					clearInterval(waitDataAvailability); // Stop the loop
					nsBarChart.chartBox(params);
					$("#loader").fadeOut(800);
				}
			}, 500); // Check every 500 milliseconds
		});

		document.getElementById("btn-node-toggle").addEventListener("click", () => {
			this.disaggregateNode(params);
		});

		function getDataApiBalances() {
			// console.log("params.flowCodes", params.flowCodes);	
			const nrgBalSet = new Set();
			params.flowCodes.forEach((flow) => {
				const balances = getAllFlowOperands(flow);
				balances.forEach((nrg_bal) => {
					nrgBalSet.add(nrg_bal);
				});
			});
			return Array.from(nrgBalSet);
		}

		function disableKeyboardEvents() {
			document.addEventListener("keydown", preventEvent, true);
			document.addEventListener("keypress", preventEvent, true);
			document.addEventListener("keyup", preventEvent, true);
		  }

		  // Enable keyboard events for all elements
		  function enableKeyboardEvents() {
			document.removeEventListener("keydown", preventEvent, true);
			document.removeEventListener("keypress", preventEvent, true);
			document.removeEventListener("keyup", preventEvent, true);
		  }

		  // Prevent the default behavior of keyboard events
		  function preventEvent(event) {
			event.stopPropagation();
			event.preventDefault();
		  }		
		
		function showModal() {
			if (!modal.hasAttribute('open')) {
			  if (modal.showModal) {
				modal.showModal();
			  } else {
				// Fallback for browsers that do not support the dialog element
				modal.setAttribute('open', 'true');
			  }
			}
		  }
	  
		  // Function to close the modal
		  function closeModal() {
			if (modal.hasAttribute('open')) {
			  modal.close();
			}
		  }



		ECL.autoInit();
		showModal();

	
		  const closeButton = modal.querySelector('.ecl-modal__close');
		  const closeButtonMenu = modal.querySelector('.modalCloseBtn');

		  closeButton.addEventListener('click', closeModal);
		  closeButtonMenu.addEventListener('click', closeModal);

		var tablists = document.querySelectorAll('[role=tablist].automatic');
		for (var i = 0; i < tablists.length; i++) {
		  new TabsAutomatic(tablists[i]);
		}
	},

	disaggregateNode: function (params) {
		nsSankeyModal.closeModal();

		//reset animation when changing node disaggregation
		if (timelineNameSpace.isAutoplayLoaded) {
			timelineNameSpace.resetAutoplayTimeline();
		}

		sankeyNameSpace.drawDiagram(params.targetId);
	},

	// get the status of the node whether on/off button is disaggregated or aggregated
	getDisaggStatus: function (idNode) {
		var isChecked = false;
		switch (idNode) {
			case "N1_1":
				isChecked = dataNameSpace.isProductionDisaggregated;
				break;
			case "N1":
				isChecked = dataNameSpace.isAllSourcesDisaggregated;
				break;
			case "T2": case "N2_1": case "N2_2":
				isChecked = dataNameSpace.isTransformationDisaggregated;
				break;
			case "N6":
				isChecked = dataNameSpace.isAfterTransformationDisaggregated;
				break;
			case "E6_5":
				isChecked = dataNameSpace.isConsumptionForEnergyBranchDisaggregated;
				break;
			case "N6_1":
				isChecked = dataNameSpace.isFinalConsumptionDisaggregated;
				break;
			case "N6_1_2":
				isChecked = dataNameSpace.isNonEnergyConsumptionDisaggregated;
				break;
			case "N6_1_1":
				isChecked = dataNameSpace.isEnergyConsumptionDisaggregated;
				break;
			case "N6_1_1_1":
				isChecked = dataNameSpace.isIndustryDisaggregated;
				break;
			case "N6_1_1_2":
				isChecked = dataNameSpace.isTransportDisaggregated;
				break;
			case "N6_1_1_3":
				isChecked = dataNameSpace.isOtherSectorsDisaggregated;
				break;
			case "T2_6": case "N2_6_1": case "N2_6_2":
				isChecked = dataNameSpace.isRPITransformationDisaggregated;
				break;
			case "T2_11": case "N2_11_1": case "N2_11_2":
				isChecked = dataNameSpace.isEHGTransformationDisaggregated;
				break;
		};
		return isChecked;
	},

	pieChartHidden: function (params) {
		const deactivate = function () {
			$("#pie-chart").css("display", "none");
			$("#pie-chart").attr("tabindex", "-1");
		};

		let noPiesNodes = []; // prettier-ignore
		if (!REF.flowDisagg) {
			if (noPiesNodes.indexOf(params.targetId) > -1) deactivate();
			if (REF.nodeDisagg.charAt(0) == 0 && params.targetId == "E1")
				deactivate();
			if (REF.nodeDisagg.charAt(5) == 0 && params.targetId == "O1")
				deactivate();
			if (REF.nodeDisagg.charAt(6) == 0 && params.targetId == "O4")
				deactivate();
		}
	},

	setStateDisaggBtn: function (params) {
		var title;
		var extendableNodes = [
			"E1_4",
			"E6_5",
			"F3_1_1",
			"F3_1_2",
			"F3_1_3",
			"F3_1_4",
			"N1",
			"N1_1",
			"N2_11_1",
			"N2_11_2",
			"N2_1",
			"N2_2",
			"N2_6_1",
			"N2_6_2",
			"N6",
			"N6_1",
			"N6_1_1",
			"N6_1_1_1",
			"N6_1_1_2",
			"N6_1_1_3",
			"N6_1_2",
			"T2",
			"T2_11",
			"T2_6",
		];

		if (!extendableNodes.includes(params.targetId)) {
			$("#btn-node-toggle").hide();
		}

		var checkedDisaggregation = this.getDisaggStatus(params.targetId);
		if (!checkedDisaggregation) {
			// recovery
			switch (params.targetId) {
				// recycle and backfilling
				case "N2_3":
				case "N2_4":
				case "N3": // processed material n3
				case "F3_1_1":
				case "F3_1_2":
				case "F3_1_3":
				case "F3_1_4":
					title = languageNameSpace.labels["COLLAPSE_NODE"];
					break;
				default:
					title = languageNameSpace.labels["EXPAND_NODE"];
					break;
			}
		} else {
			switch (params.targetId) {
				case "F6_3":
					title = languageNameSpace.labels["EXPAND_NODE"];
					break;
				default:
					// case "E1": case "N2": case "O1":case "O4":
					title = languageNameSpace.labels["COLLAPSE_NODE"];
					break;
			}
		}

		span = document.createElement("span");
		span.innerHTML = title;
		$("#btn-node-toggle").append(span);
	},
};
