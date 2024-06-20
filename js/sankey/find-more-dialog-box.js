// var findmoreboxNameSpace = {
// 	titleOnly: true,
// 	valueOnly: true,
// 	findMoreBox: null,

// 	drawFindMoreDialogBox: function () {
// 		if (findmoreboxNameSpace.findMoreBox !== null) {
// 			closeDialogBox(findmoreboxNameSpace.findMoreBox);
// 		}
// 		findmoreboxNameSpace.findMoreBox = new jBox('Modal', {
// 			addClass: 'check-style-modal position-box-modal',
// 			id: 'find-more-box-modal',
// 			constructOnInit: true,
// 			position: {
// 				x: 'left',
// 				y: 'center'
// 			},
// 			title: languageNameSpace.labels["BOX_MORE_TITLE"],
// 			blockScroll: false,
// 			overlay: false,
// 			closeOnClick: 'body',
// 			closeOnEsc: true,
// 			closeButton: 'box',
// 			draggable: 'title',
// 			repositionOnOpen: true,
// 			repositionOnContent: true,
// 			preventDefault: true,
// 			width: 230,
// 			height: 'auto',
// 			content: findmoreboxNameSpace.fillFindMoreModalContent(),
// 			// Once jBox is closed, destroy it
// 			onCloseComplete: function () {
// 				this.destroy();
// 			}
// 		});
// 		findmoreboxNameSpace.findMoreBox.open();
// 	},

// 	openContact: function () {
// 		document.location = "mailto:ESTAT-ENERGY@ec.europa.eu?subject=SANKEY%20CONTACT&body="+encodeURIComponent(window.location.href);
// 	},
	
// 	fillFindMoreModalContent: function () {

// 		console.log(REF.language.toLowerCase())
// 		var content = 
// 			"<div id=\"dialog-find-more-content\">"
// 				+"<div class=\"buttonStyle\" onclick=\"$('.jBox-closeButton').click();StartMainTour();\">"+languageNameSpace.labels["TUTORIAL"]+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 				+"<a href=\"https://ec.europa.eu/eurostat/statistics-explained/index.php/Sankey_diagrams_for_energy_balance\" target=\"_blank\">"+languageNameSpace.labels["SANKEY_EXPLAINED"]+"</a>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 				+"<a href=\"http://ec.europa.eu/eurostat/ramon/nomenclatures/index.cfm?TargetUrl=LST_NOM_DTL_GLOSSARY&StrNom=CODED2&StrLanguageCode=EN\" target=\"_blank\">"+languageNameSpace.labels["DEFINITIONS"]+"</a>"
// 				+"</div>"
				
// 				// +"<div class=\"buttonStyle\">"
// 				// +"<a href=\"https://ec.europa.eu/info/cookies_"+ REF.language.toLowerCase() +"\" target=\"_blank\">"+languageNameSpace.labels["COOKIES"]+"</a>"
// 				// +"</div>"
// 				// +"<div class=\"buttonStyle\">"
// 				// +"<a href=\"https://ec.europa.eu/info/privacy-policy_"+ REF.language.toLowerCase() +"\" target=\"_blank\">"+languageNameSpace.labels["PRIVACY"]+"</a>"
// 				// +"</div>"
// 				// +"<div class=\"buttonStyle\">"
// 				// +"<a href=\"https://ec.europa.eu/info/legal-notice_"+ REF.language.toLowerCase() +"\" target=\"_blank\">"+languageNameSpace.labels["LEGAL"]+"</a>"
// 				// +"</div>"

// 				+"<div class=\"buttonStyle\">"
// 				+"<a href=\"https://ec.europa.eu/eurostat/cache/metadata/en/nrg_bal_esms.htm\" target=\"_blank\">"+languageNameSpace.labels["METADATA"]+"</a>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 				+"<a href=\"http://appsso.eurostat.ec.europa.eu/nui/show.do?dataset=nrg_bal_sd&lang=en\" target=\"_blank\">"+languageNameSpace.labels["SANKEY_DATASET"]+"</a>"
// 				+"</div>"
// 				+"<div class=\"buttonStyle\">"
// 				+"<a id=\"contact-us\">"+languageNameSpace.labels["CONTACT"]+"</a>"
// 				+"</div>"
// 			+"</div>"
		
// 			+"<script>document.getElementById(\"contact-us\").href = \"mailto:ESTAT-ENERGY@ec.europa.eu?subject=SANKEY%20CONTACT&body=\" + encodeURIComponent(window.location.href);</script>";
// 		return content;
// 	}

// };
