// var countrylistBoxNameSpace = {
// 	countryDialogBox: null,
// 	selectedCountries: [],
// 	selectedCountryFlag: "",
// 	minWidthCountryBox: 0,
// 	minWidthCountryBoxClass: 0,

// 	countryListBox: function () {
// 		var width = 385;
// 		var height = 516;

// 		if (!dataNameSpace.isLargeRes) {
// 			width = 385;
// 			height = 216;
// 		}
		
// 		countrylistBoxNameSpace.minWidthCountryBoxClass = width;
		
// 		//Empty selection when opening the country list window
// 		countrylistBoxNameSpace.selectedCountries = [];

// 		if (countrylistBoxNameSpace.countryDialogBox !== null) {
// 			closeDialogBox(countrylistBoxNameSpace.countryDialogBox);
// 		}

// 		countrylistBoxNameSpace.countryDialogBox = new jBox('Modal', {
// 			addClass: 'check-style-modal position-box-modal',
// 			id: 'country-list-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: 'left',
// 				y: 'center'
// 			},
// 			title: countrylistBoxNameSpace.fillCountryModalTitle(),
// 			blockScroll: false,
// 			overlay: false,
// 			closeOnClick: 'body',
// 			closeOnEsc: true,
// 			closeButton: 'box',
// 			draggable: 'title',
// 			content: countrylistBoxNameSpace.fillCountryModalContent(),
// 			repositionOnOpen: true,
// 			repositionOnContent: true,
// 			preventDefault: true,
// 			width: width,
// 			height: height,
// 			footer: countrylistBoxNameSpace.fillCountryModalFooter(),
// 			// Once jBox is closed, detroy it
// 			onCloseComplete: function () {
// 				$( "#countrySelection" ).addClass("hideButton");
// 				this.destroy();
// 			}
// 		});
// 		countrylistBoxNameSpace.countryDialogBox.open();
// 		$( "#countrySelection" ).hide();
// 	},
	
// 	fillCountryModalTitle: function () {
// 		var title = "<div class=\"titleStyle\" id=\"titleSelection\">" 
// 			+"<span>"+languageNameSpace.labels["BOX_COUNTRY_TITLE"]+"</span>"
// 			+ "</div>";
		
// 		return title;
// 	},
	
// 	fillCountryModalFooter: function () {
// 		var footer = "<div id=\"countryListFooter\" class=\"footerStyle\">" 
// 			+ "<div id=\"countrySelection\" class=\"goStyle\">" 
// 			+"<input type=\"button\" class=\"\" onclick=\"countrylistBoxNameSpace.drawSankeyByCountries()\">"
// 			+ "</div>";
// 			+ "</div>";
		
// 		return footer;
// 	},
	
// 	fillCountryModalContent: function () {
// 		var content = "";
// 		var tooltip = "";


// 		//marcio to add EU27_2020
// 		$.each(countriesEB, function (idx, obj) {	
// 			if(idx != 'EU28' && idx != 'EA19' && idx !='EU27_2020')
// 				tooltip = languageNameSpace.labels["BOX_COUNTRY_TOOLTIP"];

// 			var fontSize = !dataNameSpace.isLargeRes ? "small-font-style" : "";
// 			var buttonWidth = !dataNameSpace.isLargeRes ? "80%" : "90%";
// 			var country = "<div title=\"" + tooltip + "\" id=\"Tooltip-"+ idx +"\" class=\"buttonStyle countrie" + fontSize + "\"  >" //style=\"width:100%\"
// 				 + "<img class=\"country-flag\" src=\"img/country_flags/" + idx + ".PNG\">"
// 				 + "<input type=\"checkbox\" name=\"radio\"  id=\"_" + idx + "\" class=\"radio\" onclick=\"countrylistBoxNameSpace.buildSelectedCountryList('" + idx + "','" + obj + "')\" >"
// 				 + "<label style=\"width:" + buttonWidth + "\" for=\"_" + idx + "\">" + obj + "</label>"
// 				 + "</div>";
			
// 			content = content + country;
// 			var i = 0;
// 		});

// 		return content;
// 	},
	
// 	//draw diagram for multi countries
// 	drawSankeyByCountries: function () {
// 		var t = new speedTest();
// 		t.log("init drawSankeyByCountries");
		
// 		closeDialogBox(countrylistBoxNameSpace.countryDialogBox);
// 		dataNameSpace.dataLoaded = false;
// 		REF.geos = countrylistBoxNameSpace.selectedCountries.toString();
		

// 		//reset animation when changing country
// 		if(timelineNameSpace.isAutoplayLoaded) {
// 			timelineNameSpace.resetAutoplayTimeline();
// 		} else {
// 			if(isEdge) {
// 				//delay of 1 second to avoid freezing of the country selection window 
// 				setTimeout(function(){ sankeyNameSpace.drawDiagram(); }, 200);
// 			} else {
// 				sankeyNameSpace.drawDiagram();
// 			}
			
// 		}
		
// 		//set country header title font size
// 		sankeyNameSpace.adaptCountryTitle();
		
// 		//if( REF.year <= timeSeries.last() ) {
// 		  //$( "#"+REF.year ).trigger( "click" ); 
// 		//}
		
// 		t.log("end drawSankeyByCountries");
		
// 		t.dump("drawSankeyByCountries");

// 	},
	
// 	buildSelectedCountryList: function (id, obj) {

// 		var countryFlagTooltip = languageNameSpace.labels["MSG_02"];
		
// 		if(id == "EU28") {
// 			if(jQuery.inArray( id, countrylistBoxNameSpace.selectedCountries ) > -1) { //if EU28 in list of selected country 
// 				countrylistBoxNameSpace.removeCountry(id);	//Remove EU28 from the country list
// 				countrylistBoxNameSpace.manageAggregatedCountryList(countriesEU28,false);	//Enable EU28 countries
// 			} else { //if EU28 not in list of selected country 
// 				countrylistBoxNameSpace.addCountry(id,obj,countryFlagTooltip);	//Add EU28 in the country list
// 				countrylistBoxNameSpace.manageAggregatedCountryList(countriesEU28,true);	//Disable EU28 countries
// 				if(jQuery.inArray( "EA19", countrylistBoxNameSpace.selectedCountries ) > -1) 
// 					countrylistBoxNameSpace.removeCountry("EA19");

// 					//Marcio to add and remove EU27_2020
// 					if(jQuery.inArray( "EU27_2020", countrylistBoxNameSpace.selectedCountries ) > -1) 
// 					countrylistBoxNameSpace.removeCountry("EU27_2020");
// 			}

// 			//Marcio to add and remove EU27_2020
// 		} else if(id == "EU27_2020"){


// 			if(jQuery.inArray( id, countrylistBoxNameSpace.selectedCountries ) > -1) { //if EU28 in list of selected country 
// 				countrylistBoxNameSpace.removeCountry(id);	//Remove EU28 from the country list
// 				countrylistBoxNameSpace.manageAggregatedCountryList(countriesEU27_2020,false);	//Enable EU28 countries
// 			} else { //if EU28 not in list of selected country 
// 				countrylistBoxNameSpace.addCountry(id,obj,countryFlagTooltip);	//Add EU28 in the country list
// 				countrylistBoxNameSpace.manageAggregatedCountryList(countriesEU27_2020,true);	//Disable EU28 countries
// 				if(jQuery.inArray( "EA19", countrylistBoxNameSpace.selectedCountries ) > -1) 
// 					countrylistBoxNameSpace.removeCountry("EA19");

// 					//Marcio to add and remove EU27_2020
// 					if(jQuery.inArray( "EU28", countrylistBoxNameSpace.selectedCountries ) > -1) 
// 					countrylistBoxNameSpace.removeCountry("EU28");
					
// 			}
// 		} else if(id == "EA19") {
// 			if(jQuery.inArray( id, countrylistBoxNameSpace.selectedCountries ) > -1) { //if EA19 in list of selected country 
// 				countrylistBoxNameSpace.removeCountry(id);	//Remove EA19 from the country list
// 				countrylistBoxNameSpace.manageAggregatedCountryList(countriesEA19,false);	//Enable EA19 countries
// 			} else { //if EA19 not in list of selected country 
// 				countrylistBoxNameSpace.addCountry(id,obj,countryFlagTooltip);	//Add EA19 in the country list
// 				countrylistBoxNameSpace.manageAggregatedCountryList(countriesEU28,false);	//Enable EU28 countries
// 				countrylistBoxNameSpace.manageAggregatedCountryList(countriesEA19,true);	//Disable EA19 countries
// 				if(jQuery.inArray( "EU28", countrylistBoxNameSpace.selectedCountries ) > -1) 
// 					countrylistBoxNameSpace.removeCountry("EU28");

// 					//Marcio to add and remove EU27_2020
// 					if(jQuery.inArray( "EU27_2020", countrylistBoxNameSpace.selectedCountries ) > -1) 
// 					countrylistBoxNameSpace.removeCountry("EU27_2020");
// 			}
// 		} else {
// 			if(jQuery.inArray( id, countrylistBoxNameSpace.selectedCountries ) > -1) {
// 				countrylistBoxNameSpace.removeCountry(id);	//Remove country from the selected list
// 			} else {
// 				countrylistBoxNameSpace.addCountry(id,obj,countryFlagTooltip);	//Add country from the selected list
// 			}
// 		}
// 		countrylistBoxNameSpace.manageCountryFlagButton();
		
// 		//set width of the country box
// 		$('#country-list-box-modal .jBox-content').css({ "min-width": countrylistBoxNameSpace.minWidthCountryBoxClass });
// 		$('#country-list-box-modal .jBox-content').width('100%');
// 	},
	
	
// 	removeSelectedCountryFlag: function (id,obj) {
// 		countrylistBoxNameSpace.buildSelectedCountryList(id,obj);
// 	},
	
// 	//Enable or disable aggregated countries when EU28 or EA19 selected/unselected
// 	manageAggregatedCountryList: function (countryList,disable) {
// 		if(disable){
// 			$.each(countryList, function (idx, obj) {
// 				document.getElementById('_'+obj).disabled = true;
// 				document.getElementById('_'+obj).checked = false;
// 				$("#countryFlag_"+obj).remove();
				
// 				if(jQuery.inArray( obj, countrylistBoxNameSpace.selectedCountries ) > -1)
// 					countrylistBoxNameSpace.selectedCountries.splice(countrylistBoxNameSpace.selectedCountries.indexOf(obj),1);
// 			});
// 		} else {
// 			$.each(countryList, function (idx, obj) {
// 				document.getElementById('_'+obj).disabled = false;
// 				$("#countryFlag_"+obj).remove();
// 			});
// 		}
// 	},
	
// 	manageCountryFlagButton: function () {
//   //if no country selected => hide OK button else show OK button and the country selection bar
//   if (countrylistBoxNameSpace.selectedCountries.length == 0) {
// 	$("#countrySelection").fadeOut();
// 	$("#countryListFooter").css('display', 'none')
//   } else {
// 	$("#countrySelection").fadeIn();
// 	$("#countryListFooter").css('display', 'block')
//   }
// 	},
	
// 	removeCountry: function (id) {
// 		countrylistBoxNameSpace.selectedCountries.splice(countrylistBoxNameSpace.selectedCountries.indexOf(id),1);
// 		document.getElementById('_'+id).checked = false;
// 		//$("#countryFlag_"+id).remove();
// 		$("#countryFlag_"+id).hide();
// 	},
	
// 	addCountry: function (id,obj,countryFlagTooltip) {
// 		countrylistBoxNameSpace.selectedCountries.push(id);
// 		$("#countryFlag_"+id).remove();
// 		$("#countryListFooter").append($("<img onclick=\"javascript:countrylistBoxNameSpace.removeSelectedCountryFlag('"+id.toString()+"','"+obj.toString()+"')\" id='countryFlag_"+id+"' title='" + obj + " - " + countryFlagTooltip + "' class='countryFlagFooterStyle' src='img/country_flags/" + id + ".PNG'/>").fadeIn());
// 	}

// };
