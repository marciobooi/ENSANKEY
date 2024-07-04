/*
Definition, mapping and handling of Eurobase codes and auxilliary Sankey diagram codes
*/

const codesEurobase = {
  nrg_bal_c:{
    // dimensions:["nrg_bal","siec","unit","geo","time"],
    siec: ["TOTAL", "C0000X0350-0370", "C0110", "C0121", "C0129", "C0210", "C0220", "C0311", "C0312", "C0320", "C0330", "C0340", "C0350-0370", "C0350", "C0360", "C0371", "C0379", "P1000", "P1100", "P1200", "S2000", "G3000", "O4000XBIO", "O4100_TOT", "O4200", "O4300", "O4400X4410", "O4500", "O4610", "O4620", "O4630", "O4640", "O4651", "O4652XR5210B", "O4653", "O4661XR5230B", "O4669", "O4671XR5220B", "O4680", "O4691", "O4692", "O4693", "O4694", "O4695", "O4699", "RA000", "RA100", "RA200", "RA300", "RA410", "RA420", "RA500", "RA600", "R5110-5150_W6000RI", "R5160", "R5210P", "R5210B", "R5220P", "R5220B", "R5230P", "R5230B", "R5290", "R5300", "W6100", "W6210", "W6220", "W6100_6220", "N900H", "E7000", "H8000", "BIOE", "FE"],
    siec_label: { "TOTAL": "Total", "C0000X0350-0370": "Solid fossil fuels", "C0110": "Anthracite", "C0121": "Coking coal", "C0129": "Other bituminous coal", "C0210": "Sub-bituminous coal", "C0220": "Lignite", "C0311": "Coke oven coke", "C0312": "Gas coke", "C0320": "Patent fuel", "C0330": "Brown coal briquettes", "C0340": "Coal tar", "C0350-0370": "Manufactured gases", "C0350": "Coke oven gas", "C0360": "Gas works gas", "C0371": "Blast furnace gas", "C0379": "Other recovered gases", "P1000": "Peat and peat products", "P1100": "Peat", "P1200": "Peat products", "S2000": "Oil shale and oil sands", "G3000": "Natural gas", "O4000XBIO": "Oil and petroleum products (excluding biofuel portion)", "O4100_TOT": "Crude oil", "O4200": "Natural gas liquids", "O4300": "Refinery feedstocks", "O4400X4410": "Additives and oxygenates (excluding biofuel portion)", "O4500": "Other hydrocarbons", "O4610": "Refinery gas", "O4620": "Ethane", "O4630": "Liquefied petroleum gases", "O4640": "Naphtha", "O4651": "Aviation gasoline", "O4652XR5210B": "Motor gasoline (excluding biofuel portion)", "O4653": "Gasoline-type jet fuel", "O4661XR5230B": "Kerosene-type jet fuel (excluding biofuel portion)", "O4669": "Other kerosene", "O4671XR5220B": "Gas oil and diesel oil (excluding biofuel portion)", "O4680": "Fuel oil", "O4691": "White spirit and special boiling point industrial spirits", "O4692": "Lubricants", "O4693": "Paraffin waxes", "O4694": "Petroleum coke", "O4695": "Bitumen", "O4699": "Other oil products n.e.c.", "RA000": "Renewables and biofuels", "RA100": "Hydro", "RA200": "Geothermal", "RA300": "Wind", "RA410": "Solar thermal", "RA420": "Solar photovoltaic", "RA500": "Tide, wave, ocean", "RA600": "Ambient heat (heat pumps)", "R5110-5150_W6000RI": "Primary solid biofuels", "R5160": "Charcoal", "R5210P": "Pure biogasoline", "R5210B": "Blended biogasoline", "R5220P": "Pure biodiesels", "R5220B": "Blended biodiesels", "R5230P": "Pure bio jet kerosene", "R5230B": "Blended bio jet kerosene", "R5290": "Other liquid biofuels", "R5300": "Biogases", "W6100": "Industrial waste (non-renewable)", "W6210": "Renewable municipal waste", "W6220": "Non-renewable municipal waste", "W6100_6220": "Non-renewable waste", "N900H": "Nuclear heat", "E7000": "Electricity", "H8000": "Heat", "BIOE": "Bioenergy", "FE": "Fossil energy" },
    // unit: ["KTOE", "GWH", "TJ"],
    nrg_bal: [ "PPRD", "RCV_RCY", "IMP", "EXP", "STK_CHG", "GAE", "INTMARB", "GIC", "INTAVI", "NRGSUP", "GIC2020-2030", "PEC2020-2030", "FEC2020-2030", "TI_E", "TI_EHG_E", "TI_EHG_MAPE_E", "TI_EHG_MAPCHP_E", "TI_EHG_MAPH_E", "TI_EHG_APE_E", "TI_EHG_APCHP_E", "TI_EHG_APH_E", "TI_EHG_EDHP", "TI_EHG_EB", "TI_EHG_EPS", "TI_EHG_DHEP", "TI_CO_E", "TI_BF_E", "TI_GW_E", "TI_RPI_E", "TI_RPI_RI_E", "TI_RPI_BPI_E", "TI_RPI_PT_E", "TI_RPI_IT_E", "TI_RPI_DU_E", "TI_RPI_PII_E", "TI_PF_E", "TI_BKBPB_E", "TI_CL_E", "TI_BNG_E", "TI_LBB_E", "TI_CPP_E", "TI_GTL_E", "TI_NSP_E", "TO", "TO_EHG", "TO_EHG_MAPE", "TO_EHG_MAPCHP", "TO_EHG_MAPH", "TO_EHG_APE", "TO_EHG_APCHP", "TO_EHG_APH", "TO_EHG_EDHP", "TO_EHG_EB", "TO_EHG_PH", "TO_EHG_OTH", "TO_CO", "TO_BF", "TO_GW", "TO_RPI", "TO_RPI_RO", "TO_RPI_BKFLOW", "TO_RPI_PT", "TO_RPI_IT", "TO_RPI_PPR", "TO_RPI_PIR", "TO_PF", "TO_BKBPB", "TO_CL", "TO_BNG", "TO_LBB", "TO_CPP", "TO_GTL", "TO_NSP", "NRG_E", "NRG_EHG_E", "NRG_CM_E", "NRG_OIL_NG_E", "NRG_PF_E", "NRG_CO_E", "NRG_BKBPB_E", "NRG_GW_E", "NRG_BF_E", "NRG_PR_E", "NRG_NI_E", "NRG_CL_E", "NRG_LNG_E", "NRG_BIOG_E", "NRG_GTL_E", "NRG_CPP_E", "NRG_NSP_E", "DL", "AFC", "FC_NE", "TI_NRG_FC_IND_NE", "TI_NE", "NRG_NE", "FC_IND_NE", "FC_TRA_NE", "FC_OTH_NE", "FC_E", "FC_IND_E", "FC_IND_IS_E", "FC_IND_CPC_E", "FC_IND_NFM_E", "FC_IND_NMM_E", "FC_IND_TE_E", "FC_IND_MAC_E", "FC_IND_MQ_E", "FC_IND_FBT_E", "FC_IND_PPP_E", "FC_IND_WP_E", "FC_IND_CON_E", "FC_IND_TL_E", "FC_IND_NSP_E", "FC_TRA_E", "FC_TRA_RAIL_E", "FC_TRA_ROAD_E", "FC_TRA_DAVI_E", "FC_TRA_DNAVI_E", "FC_TRA_PIPE_E", "FC_TRA_NSP_E", "FC_OTH_E", "FC_OTH_CP_E", "FC_OTH_HH_E", "FC_OTH_AF_E", "FC_OTH_FISH_E", "FC_OTH_NSP_E", "STATDIFF", "GEP", "GEP_MAPE", "GEP_MAPCHP", "GEP_APE", "GEP_APCHP", "GHP", "GHP_MAPCHP", "GHP_MAPH", "GHP_APCHP", "GHP_APH"],
    // label: { "PPRD": "Primary production", "RCV_RCY": "Recovered and recycled products", "IMP": "Imports", "EXP": "Exports", "STK_CHG": "Change in stock", "GAE": "Gross available energy", "INTMARB": "International maritime bunkers", "GIC": "Gross inland consumption", "INTAVI": "International aviation", "NRGSUP": "Total energy supply", "GIC2020-2030": "Gross inland consumption (Europe 2020-2030)", "PEC2020-2030": "Primary energy consumption (Europe 2020-2030)", "FEC2020-2030": "Final energy consumption (Europe 2020-2030)", "TI_E": "Transformation input - energy use", "TI_EHG_E": "Transformation input - electricity and heat generation - energy use", "TI_EHG_MAPE_E": "Transformation input - electricity and heat generation - main activity producer electricity only - energy use", "TI_EHG_MAPCHP_E": "Transformation input - electricity and heat generation - main activity producer combined heat and power - energy use", "TI_EHG_MAPH_E": "Transformation input - electricity and heat generation - main activity producer heat only - energy use", "TI_EHG_APE_E": "Transformation input - electricity and heat generation - autoproducer electricity only - energy use", "TI_EHG_APCHP_E": "Transformation input - electricity and heat generation - autoproducer combined heat and power - energy use", "TI_EHG_APH_E": "Transformation input - electricity and heat generation - autoproducer heat only - energy use", "TI_EHG_EDHP": "Transformation input - electricity and heat generation - electrically driven heat pumps", "TI_EHG_EB": "Transformation input - electricity and heat generation - electric boilers", "TI_EHG_EPS": "Transformation input - electricity and heat generation - electricity for pumped storage", "TI_EHG_DHEP": "Transformation input - electricity and heat generation - derived heat for electricity production", "TI_CO_E": "Transformation input - coke ovens - energy use", "TI_BF_E": "Transformation input - blast furnaces - energy use", "TI_GW_E": "Transformation input - gas works - energy use", "TI_RPI_E": "Transformation input - refineries and petrochemical industry - energy use", "TI_RPI_RI_E": "Transformation input - refineries and petrochemical industry - refinery intake - energy use", "TI_RPI_BPI_E": "Transformation input - refineries and petrochemical industry - backflows from petrochemical industry - energy use", "TI_RPI_PT_E": "Transformation input - refineries and petrochemical industry - products transferred - energy use", "TI_RPI_IT_E": "Transformation input - refineries and petrochemical industry - interproduct transfers - energy use", "TI_RPI_DU_E": "Transformation input - refineries and petrochemical industry - direct use - energy use", "TI_RPI_PII_E": "Transformation input - refineries and petrochemical industry - petrochemical industry intake - energy use", "TI_PF_E": "Transformation input - patent fuel plants - energy use", "TI_BKBPB_E": "Transformation input - brown coal briquettes and peat briquettes plants - energy use", "TI_CL_E": "Transformation input - coal liquefaction plants - energy use", "TI_BNG_E": "Transformation input - for blended natural gas - energy use", "TI_LBB_E": "Transformation input - liquid biofuels blended - energy use", "TI_CPP_E": "Transformation input - charcoal production plants - energy use", "TI_GTL_E": "Transformation input - gas-to-liquids plants - energy use", "TI_NSP_E": "Transformation input - not elsewhere specified - energy use", "TO": "Transformation output", "TO_EHG": "Transformation output - electricity and heat generation", "TO_EHG_MAPE": "Transformation output - electricity and heat generation - main activity producer electricity only", "TO_EHG_MAPCHP": "Transformation output - electricity and heat generation - main activity producer combined heat and power", "TO_EHG_MAPH": "Transformation output - electricity and heat generation - main activity producer heat only", "TO_EHG_APE": "Transformation output - electricity and heat generation - autoproducer electricity only", "TO_EHG_APCHP": "Transformation output - electricity and heat generation - autoproducer combined heat and power", "TO_EHG_APH": "Transformation output - electricity and heat generation - autoproducer heat only", "TO_EHG_EDHP": "Transformation output - electricity and heat generation - electrically driven heat pumps", "TO_EHG_EB": "Transformation output - electricity and heat generation - electric boilers", "TO_EHG_PH": "Transformation output - electricity and heat generation - pumped hydro", "TO_EHG_OTH": "Transformation output - electricity and heat generation - other sources", "TO_CO": "Transformation output - coke ovens", "TO_BF": "Transformation output - blast furnaces", "TO_GW": "Transformation output - gas works", "TO_RPI": "Transformation output - refineries and petrochemical industry", "TO_RPI_RO": "Transformation output - refineries and petrochemical industry - refinery output", "TO_RPI_BKFLOW": "Transformation output - refineries and petrochemical industry - backflows", "TO_RPI_PT": "Transformation output - refineries and petrochemical industry - products transferred", "TO_RPI_IT": "Transformation output - refineries and petrochemical industry - interproduct transfers", "TO_RPI_PPR": "Transformation output - refineries and petrochemical industry - primary product receipts", "TO_RPI_PIR": "Transformation output - refineries and petrochemical industry - petrochemical industry returns", "TO_PF": "Transformation output - patent fuel plants", "TO_BKBPB": "Transformation output - brown coal briquettes and peat briquettes plants", "TO_CL": "Transformation output - coal liquefaction plants", "TO_BNG": "Transformation output - blended in natural gas", "TO_LBB": "Transformation output - liquid biofuels blended", "TO_CPP": "Transformation output - charcoal production plants", "TO_GTL": "Transformation output - gas-to-liquids plants", "TO_NSP": "Transformation output - not elsewhere specified", "NRG_E": "Energy sector - energy use", "NRG_EHG_E": "Energy sector - electricity and heat generation - energy use", "NRG_CM_E": "Energy sector - coal mines - energy use", "NRG_OIL_NG_E": "Energy sector - oil and natural gas extraction plants - energy use", "NRG_PF_E": "Energy sector - patent fuel plants - energy use", "NRG_CO_E": "Energy sector - coke ovens - energy use", "NRG_BKBPB_E": "Energy sector - brown coal briquettes and peat briquettes plants - energy use", "NRG_GW_E": "Energy sector - gas works - energy use", "NRG_BF_E": "Energy sector - blast furnaces - energy use", "NRG_PR_E": "Energy sector - petroleum refineries (oil refineries) - energy use", "NRG_NI_E": "Energy sector - nuclear industry - energy use", "NRG_CL_E": "Energy sector - coal liquefaction plants - energy use", "NRG_LNG_E": "Energy sector - liquefaction and regasification plants (LNG) - energy use", "NRG_BIOG_E": "Energy sector - gasification plants for biogas - energy use", "NRG_GTL_E": "Energy sector - gas-to-liquids plants - energy use", "NRG_CPP_E": "Energy sector - charcoal production plants - energy use", "NRG_NSP_E": "Energy sector - not elsewhere specified - energy use", "DL": "Distribution losses", "AFC": "Available for final consumption", "FC_NE": "Final consumption - non-energy use", "TI_NRG_FC_IND_NE": "Transformation input, energy sector and final consumption in industry sector - non-energy use", "TI_NE": "Transformation input - non-energy use", "NRG_NE": "Energy sector - non-energy use", "FC_IND_NE": "Final consumption - industry sector - non-energy use", "FC_TRA_NE": "Final consumption - transport sector - non-energy use", "FC_OTH_NE": "Final consumption - other sectors - non-energy use", "FC_E": "Final consumption - energy use", "FC_IND_E": "Final consumption - industry sector - energy use", "FC_IND_IS_E": "Final consumption - industry sector - iron and steel - energy use", "FC_IND_CPC_E": "Final consumption - industry sector - chemical and petrochemical - energy use", "FC_IND_NFM_E": "Final consumption - industry sector - non-ferrous metals - energy use", "FC_IND_NMM_E": "Final consumption - industry sector - non-metallic minerals - energy use", "FC_IND_TE_E": "Final consumption - industry sector - transport equipment - energy use", "FC_IND_MAC_E": "Final consumption - industry sector - machinery - energy use", "FC_IND_MQ_E": "Final consumption - industry sector - mining and quarrying - energy use", "FC_IND_FBT_E": "Final consumption - industry sector - food, beverages and tobacco - energy use", "FC_IND_PPP_E": "Final consumption - industry sector - paper, pulp and printing - energy use", "FC_IND_WP_E": "Final consumption - industry sector - wood and wood products - energy use", "FC_IND_CON_E": "Final consumption - industry sector - construction - energy use", "FC_IND_TL_E": "Final consumption - industry sector - textile and leather - energy use", "FC_IND_NSP_E": "Final consumption - industry sector - not elsewhere specified - energy use", "FC_TRA_E": "Final consumption - transport sector - energy use", "FC_TRA_RAIL_E": "Final consumption - transport sector - rail - energy use", "FC_TRA_ROAD_E": "Final consumption - transport sector - road - energy use", "FC_TRA_DAVI_E": "Final consumption - transport sector - domestic aviation - energy use", "FC_TRA_DNAVI_E": "Final consumption - transport sector - domestic navigation - energy use", "FC_TRA_PIPE_E": "Final consumption - transport sector - pipeline transport - energy use", "FC_TRA_NSP_E": "Final consumption - transport sector - not elsewhere specified - energy use", "FC_OTH_E": "Final consumption - other sectors - energy use", "FC_OTH_CP_E": "Final consumption - other sectors - commercial and public services - energy use", "FC_OTH_HH_E": "Final consumption - other sectors - households - energy use", "FC_OTH_AF_E": "Final consumption - other sectors - agriculture and forestry - energy use", "FC_OTH_FISH_E": "Final consumption - other sectors - fishing - energy use", "FC_OTH_NSP_E": "Final consumption - other sectors - not elsewhere specified - energy use", "STATDIFF": "Statistical differences", "GEP": "Gross electricity production", "GEP_MAPE": "Gross electricity production - main activity producer electricity only", "GEP_MAPCHP": "Gross electricity production - main activity producer combined heat and power", "GEP_APE": "Gross electricity production - autoproducer electricity only", "GEP_APCHP": "Gross electricity production - autoproducer combined heat and power", "GHP": "Gross heat production", "GHP_MAPCHP": "Gross heat production - main activity producer combined heat and power", "GHP_MAPH": "Gross heat production - main activity producer heat only", "GHP_APCHP": "Gross heat production - autoproducer combined heat and power", "GHP_APH": "Gross heat production - autoproducer heat only" }
    // comp : ['PRD', 'IDCO', 'FDCO', 'STK_DRW', 'STK_BLD', 'NTI', 'TI_EHG_EONL_E', 'TI_EHG_CHP_E', 'TI_EHG_HONL_E', 'TI_EHG_OTH', 'TI_RPI_OTH_E', 'TI_OTH', 'NTO', 'TO_EHG_EONL', 'TO_EHG_CHP', 'TO_EHG_HONL', 'TO_EHG_G_OTH', 'TO_RPI_O_OTH', 'TO_OTH', 'TL', 'TL_EHG', 'TL_EHG_EONL', 'TL_EHG_CHP', 'TL_EHG_HONL', 'TL_EHG_L_OTH', 'TL_CO', 'TL_BF', 'TL_GW', 'TL_RPI', 'TL_RPI_RO', 'TL_RPI_PIR', 'TL_RPI_L_OTH', 'TL_BKBPB', 'TL_OTH', 'AAS', 'AAT', 'FC', 'STATDIFF_INFLOW', 'STATDIFF_OUTFLOW', 'TBKFLOW']//prettier-ignore
 
  },
}


/*
ALL ABOUT FUEL CODES
*/
// assign a color to each fuel appearing in the Sankey diagram
// color names mostly in line with: http://www.rapidtables.com/web/color/index.htm
// !!! LOOKUP TABLE for Sankey fuels !!!
fuelColors = {

  // All products aggregate
  "TOTAL": "#32AFAF", // ESTAT theme 8

  // coal family
  "SFF_P1000": "#800000", // maroon: tailormade theme
  "C0121": "#A0522D", // sienna
  "C0129": "#493D26", // mocha
  "C0220": "#D2B48C", // tan
  "C0311": "#F4A460", // sandybrown
  "SFF_OTH": "#D2691E", // chocolate

  // oil family
  "O4000": "#14375A", // ESTAT theme 1 (darker 50 %)
  "O4100_TOT": "#191970", // midnightblue
  "O4200-4500": "#95B9C7", // babyblue
  "O4652XR5210B": " #4169E1", // royalblue
  "O4661XR5230B": "#483D8B", // darkslateblue
  "O4671XR5220B": "#4682B4", // steelblue
  "O4680": "#318F9B", // another blue
  "PP_OTH": "#0000FF", // blue

  // gas family
  "G3000_C0350-370": "#FAA519", // ESTAT theme 3
  "G3000": "#FFA500", // orange
  "C0350-0370": "#FF7F50", // coral

  // renewables family
  "RA000": "#5FB441", // ESTAT theme 5
  "RA100": "#41A317", // limegreen
  "RA300": "#228B22", // forestgreen
  "RA410": "#006400", // darkgreen
  "RA420": "#00FF7F", // springgreen
  "R5110-5150_W6000RI": "#8FBC8F", // darkseagreen
  "R5200": "#20B2AA", // lightseagreen
  "W6210": "#7FFFD4", //Aquamarine
  "R5300": "#556B2F", //DarkOliveGreen
  "RA200": "#8FBC8F", //DarkSeaGreen
  "RA600": "#ADFF2F", //GreenYellow
  "RA500_5160": "#4E8975", // seagreen


  // waste family
  "W6100_6220": "#FFD700", // gold: tailormade theme
  "W6100": "#CCCC00", // dark yellow 1
  "W6220": "#FFE87C", // sunyellow

  // non-aggregate families:
  // nuclear heat
  "N900H": "#C84B96", // ESTAT theme 2


  // derived heat
  "H8000": "#F9C0A6", // ESTAT theme 9 (lighter 60 %)

  // electricity
  "E7000": "#D73C41", // ESTAT theme 6

};

// generic background color for all fuels which are not highlighted (in fuel highlight mode)
fuelColorBackground = "#DCDCDC"; // gainsboro

// generic color for losses
fuelColorLosses = fuelColorBackground;

// ad-hoc fuels: auxiliary Sankey fuel aggregates (subsequenty treated as elementary fuels)
// const adhocFuels = [
//   "SFF_OTH", //"Other solid fuels",
//   "O4200-4500", //"Other primary oil",
//   "PP_OTH", //"Other petroleum products",
//   "C0350-0370", //"Other gas", // code exists, but is not part of the annual energy balance (nrg_bal_c)
//   "R5200", //"Liquid biofuels", // code exists, but is not part of the annual energy balance (nrg_bal_c)
//   "RA500_5160", //"Other renewable energies"
// ];

// derived fuels or fuel families: aggregates of elementary fuels
const aggregateFuels = [
  "SFF_P1000", //"Solid fuels",
  "O4000", //"Oil",
  "G3000_C0350-370", //"Gas",
  "RA000",  //"Renewable energies",
  "W6100_6220", //"Waste",
  "TOTAL", //"All products",
];

// special fuel label for transformation losses
var fuelLossesLabel = "";

const fuelCodeTable = {
  TOTAL: ["SFF_P1000", "O4000", "G3000_C0350-370", "RA000", "W6100_6220", "N900H", "H8000", "E7000"],
  SFF_P1000: ["C0121", "C0129", "C0220", "C0311", "SFF_OTH"],
  O4000: ["O4100_TOT", "O4200-4500", "O4652XR5210B", "O4671XR5220B", "O4661XR5230B", "O4680", "PP_OTH"],
  "G3000_C0350-370": ["G3000", "C0350-0370"],
  RA000: ["RA100", "RA300", "RA410", "RA420", "R5110-5150_W6000RI", "R5200", "W6210", "RA200", "R5300", "RA600", "RA500_5160"],
  W6100_6220: ["W6220", "W6100"],
  SFF_OTH: ["C0110", "C0210", "C0320", "C0312", "C0340", "C0330", "P1100", "P1200", "S2000"],
  "O4200-4500": ["O4200", "O4300", "O4400X4410", "O4500"],
  PP_OTH: ["O4610", "O4620", "O4630", "O4651", "O4653", "O4669", "O4640", "O4691", "O4692", "O4695", "O4694", "O4693", "O4699"],
  R5200: ["R5210P", "R5210B", "R5220P", "R5220B", "R5230P", "R5230B", "R5290"],
  RA500_5160: ["RA500", "R5160"],
};

// CORE FUNCTION: Map each fuel onto an array containing all fuel codes that it consists of
const fuelMap = function (fuel, isDisaggregated = true) {
	return isDisaggregated
  ? fuelCodeTable[fuel] || [fuel]
  : [fuel];
};

/**
 * This function increases the number of fuels in the sankeyDB by adding
 * all fuels that are used in the sankeyDB but not in the nrg_bal_c dataset. 
 * It's because we are dropping the nrg_bal_sd dataset query.
 * This solution increases the sankeyDB size by 2 times.
 * @returns {Array} An array of unique fuel types.
 */
function getExtendedFuelArray() {
  const uniqueSet = new Set();

  // Add keys from fuelColors
  Object.keys(fuelColors).forEach(key => {
    uniqueSet.add(key);
  });

  // Add values from the aggregatedFuelCodeTable
  Object.values(fuelCodeTable).forEach(values => {
    values.forEach(value => {
      uniqueSet.add(value);
    });
  });

  return Array.from(uniqueSet);
}

const fuelListForSankeyDB = getExtendedFuelArray();

const reducedFuelListForDataApi = (function () {
  const uniqueArray = getExtendedFuelArray()
    .filter(fuel => fuel !== "TOTAL")
    .filter(fuel => codesEurobase.nrg_bal_c.siec.includes(fuel));

  return Object.freeze(uniqueArray);
})();


/*
ALL ABOUT FLOW CODES
*/
// dictionary between Sankey and Eurobase flow codes

// Eurobase --> Sankey !!! LOOKUP TABLE !!!
var EurobaseToSankey = {

  // default view:
  "default": {
    "AAS": "N1", //Available from all sources
    "PRD": "F1_1", //Production
    "RCV_RCY": "F1_1_1", //Recovered and recycled products
    "PPRD": "F1_1_2", //Primary production
    "IMP": "F1_2", //Imports
    "STK_DRW": "F1_3", //Stock draw
    "STATDIFF_INFLOW": "F1_4", //Statistical differences - inflow
    "TI_E": "N2_1", //Transformation input - energy use (TI_NE  Transformation input - non-energy use)???
    "NTI": "F2_1", //Net transformation input
    "TO": "N2_2", //Transformation output
    "NTO": "F2_2", //Net transformation output
    "TBKFLOW": "F3", //Transformation backflow
    "TL": "F4", //Transformation losses
    "FDCO": "F5_1", //From direct carry-over
    "IDCO": "F5_2", //Into direct carry-over
    "AAT": "N6", //Available after tranformation
    "FC": "F6_1", //Final consumption
    "FC_E": "F6_1_1",
    "FC_NE": "F6_1_2",
    "STK_BLD": "F6_2", //Stock build
    "EXP": "F6_3", //Exports
    "INTMARB": "F6_4", //Marine bunkers
    "NRG_E": "F6_5", //Consumption of the energy branch
    "DL": "F6_6", //Distribution and transmission losses
    "INTAVI": "F6_7", //international aviation
    "STATDIFF_OUTFLOW": "F6_8" //Statistical differences - outflow
  },

  // transformation disaggregated view:
  "transformation": {


    // inputs to transformation nodes
    "TI_RPI_E": "F2_6_1", //Refinery and petrochemical industry - input
    "TI_BKBPB_E": "F2_7_1", //BKB / PB plants - input
    "TI_CO_E": "F2_8_1", //Coke-ovens - input
    "TI_BF_E": "F2_9_1", //Blast-furnaces - input
    "TI_GW_E": "F2_10_1", //Gas works - input
    "TI_EHG_E": "F2_11_1", //Electricity and heat generation - input
    "TI_OTH": "F2_12_1", //Other transformation - input

    //Refinery disaggregation flows - input
    "TI_RPI_RI_E": "F2_6_1_1",
    "TI_RPI_PII_E": "F2_6_2_1",
    "TI_RPI_OTH_E": "F2_6_3_1",

    //Electricity and heat generation disaggregation flows - input
    "TI_EHG_EONL_E": "F2_11_1_1",
    "TI_EHG_CHP_E": "F2_11_2_1",
    "TI_EHG_HONL_E": "F2_11_3_1",
    "TI_EHG_OTH": "F2_11_4_1",



    // outputs from transformation nodes
    "TO_RPI": "F2_6_2", //Refinery and petrochemical industry - output
    "TO_BKBPB": "F2_7_2", //BKB / PB plants - output
    "TO_CO": "F2_8_2", //Coke-ovens - output
    "TO_BF": "F2_9_2", //Blast-furnaces - output
    "TO_GW": "F2_10_2", //Gas works - output
    "TO_EHG": "F2_11_2", //Electricity and heat generation - output
    "TO_OTH": "F2_12_2", //Other transformation - output

    //Refinery disaggregation flows - output
    "TO_RPI_RO": "F2_6_1_2",
    "TO_RPI_PIR": "F2_6_2_2",
    "TO_RPI_O_OTH": "F2_6_3_2",

    //Electricity and heat generation disaggregation flows - output
    "TO_EHG_EONL": "F2_11_1_2",
    "TO_EHG_CHP": "F2_11_2_2",
    "TO_EHG_HONL": "F2_11_3_2",
    "TO_EHG_G_OTH": "F2_11_4_2",

    // losses from transformation nodes
    "TL_RPI": "F4_6",
    "TL_BKBPB": "F4_7",
    "TL_CO": "F4_8",
    "TL_BF": "F4_9",
    "TL_GW": "F4_10",
    "TL_EHG": "F4_11",
    "TL_OTH": "F4_12",

    //Refinery Transformation losses disaggregation flows
    "TL_RPI_RO": "F4_6_1",
    "TL_RPI_PIR": "F4_6_2",
    "TL_RPI_L_OTH": "F4_6_3",

    //Electricity and heat generation Transformation losses disaggregation flows
    "TL_EHG_EONL": "F4_11_1",
    "TL_EHG_CHP": "F4_11_2",
    "TL_EHG_HONL": "F4_11_3",
    "TL_EHG_L_OTH": "F4_11_4"
  },

  // consumption disaggregated view:
  "consumption": {

    // Consumption of the energy branch
    "NRG_EHG_E": "F6_5_1",
    "NRG_CM_E": "F6_5_2",
    "NRG_OIL_NG_E": "F6_5_3",
    "NRG_PF_E": "F6_5_4",
    "NRG_CO_E": "F6_5_5",
    "NRG_BKBPB_E": "F6_5_6",
    "NRG_GW_E": "F6_5_7",
    "NRG_BF_E": "F6_5_8",
    "NRG_PR_E": "F6_5_9",
    "NRG_NI_E": "F6_5_10",
    "NRG_CL_E": "F6_5_11",
    "NRG_LNG_E": "F6_5_12",
    "NRG_BIOG_E": "F6_5_13",
    "NRG_GTL_E": "F6_5_14",
    "NRG_CPP_E": "F6_5_15",
    "NRG_NSP_E": "F6_5_16",

    // final non-energy consumption
    "TI_NRG_FC_IND_NE": "F6_1_2_1",
    "FC_TRA_NE": "F6_1_2_2",
    "FC_OTH_NE": "F6_1_2_3",

    // final energy consumption - industry
    "FC_IND_E": "F6_1_1_1",
    "FC_IND_IS_E": "F6_1_1_1_1",
    "FC_IND_CPC_E": "F6_1_1_1_2",
    "FC_IND_NFM_E": "F6_1_1_1_3",
    "FC_IND_NMM_E": "F6_1_1_1_4",
    "FC_IND_TE_E": "F6_1_1_1_5",
    "FC_IND_MAC_E": "F6_1_1_1_6",
    "FC_IND_MQ_E": "F6_1_1_1_7",
    "FC_IND_FBT_E": "F6_1_1_1_8",
    "FC_IND_PPP_E": "F6_1_1_1_9",
    "FC_IND_WP_E": "F6_1_1_1_10",
    "FC_IND_CON_E": "F6_1_1_1_11",
    "FC_IND_TL_E": "F6_1_1_1_12",
    "FC_IND_NSP_E": "F6_1_1_1_13",

    // final energy consumption - transport
    "FC_TRA_E": "F6_1_1_2",
    "FC_TRA_RAIL_E": "F6_1_1_2_1",
    "FC_TRA_ROAD_E": "F6_1_1_2_2",
    //"B_101931": "F6_1_1_2_3", International Aviation moved
    "FC_TRA_DAVI_E": "F6_1_1_2_4",
    "FC_TRA_DNAVI_E": "F6_1_1_2_5",
    "FC_TRA_PIPE_E": "F6_1_1_2_6",
    "FC_TRA_NSP_E": "F6_1_1_2_7",

    // final energy consumption - other
    "FC_OTH_E": "F6_1_1_3",
    "FC_OTH_CP_E": "F6_1_1_3_1",
    "FC_OTH_HH_E": "F6_1_1_3_2",
    "FC_OTH_AF_E": "F6_1_1_3_3",
    "FC_OTH_FISH_E": "F6_1_1_3_4",
    "FC_OTH_NSP_E": "F6_1_1_3_5"
  }
};


// invert for Sankey --> Eurobase !!! LOOKUP TABLE !!!
var SankeyToEurobase = {};
for (var level in EurobaseToSankey) {
  SankeyToEurobase[level] = {};
  for (var c in EurobaseToSankey[level]) {
    SankeyToEurobase[level][EurobaseToSankey[level][c]] = c;
  };
};


// bi-directional mapping function
var codeDictionary = function (code) {
  for (var level in EurobaseToSankey) {
    if (code in EurobaseToSankey[level]) return EurobaseToSankey[level][code];
    else if (code in SankeyToEurobase[level]) return SankeyToEurobase[level][code];
  };
  return code;
};


// return an array of Sankey flows needed, depending on the diagram disaggregation state
var flowMap = function (needsT, needsC) {
  var flows = Object.keys(SankeyToEurobase.default);
  if (needsT) flows = flows.concat(Object.keys(SankeyToEurobase.transformation));
  if (needsC) flows = flows.concat(Object.keys(SankeyToEurobase.consumption));
  return flows;
};



// define a generic list of 14 flow colors to be used for the pie charts and time graphs
let flowColors = [ "#1F497D", "#faa519", "#32AFAF", "#F06423", "#C84B96", "#5FB441", "#286EB4", "#802F09", "#D73C41", "#5E620F", "#00A5E6", "#0F243E", "#B9C31E", "#1A5757" ];//prettier-ignore


/*
ALL ABOUT NODE CODES
*/
// Assign a title to each node which is possibly shown in the Sankey diagram !!! LOOKUP TABLE !!!
// 2017-05-22: Labels are now set in the language JSON files in the data folder
sankeyNodes = { "N1": "", "N1_1": "", "E1_1_1": "", "E1_1_2": "", "E1_2": "", "E1_3": "", "E1_4": "", "T2": "", "N2_1": "", "N2_2": "", "T2_6": "", "N2_6_1": "", "N2_6_2": "", "T2_6_1": "", "T2_6_2": "", "T2_6_3": "", "T2_7": "", "T2_8": "", "T2_9": "", "T2_10": "", "T2_11": "", "N2_11_1": "", "N2_11_2": "", "T2_11_1": "", "T2_11_2": "", "T2_11_3": "", "T2_11_4": "", "T2_12": "", "N3": "", "E4": "", "N5": "", "N6": "", "E6_2": "", "E6_3":"", "E6_4": "", "E6_5": "", "E6_5_1": "", "E6_5_2": "", "E6_5_3": "", "E6_5_4": "", "E6_5_5": "", "E6_5_6": "", "E6_5_7": "", "E6_5_8": "", "E6_5_9": "", "E6_5_10": "", "E6_5_11": "", "E6_5_12": "", "E6_5_13": "", "E6_5_14": "", "E6_5_15": "", "E6_5_16": "", "E6_6": "", "E6_7": "", "E6_8": "", "N6_1": "", "N6_1_1": "", "N6_1_1_1": "", "E6_1_1_1_1": "", "E6_1_1_1_2": "", "E6_1_1_1_3": "", "E6_1_1_1_4": "", "E6_1_1_1_5": "", "E6_1_1_1_6": "", "E6_1_1_1_7": "", "E6_1_1_1_8": "", "E6_1_1_1_9": "", "E6_1_1_1_10": "", "E6_1_1_1_11": "", "E6_1_1_1_12": "", "E6_1_1_1_13": "", "N6_1_1_2": "", "E6_1_1_2_1": "", "E6_1_1_2_2": "", "E6_1_1_2_3": "", "E6_1_1_2_4": "", "E6_1_1_2_5": "", "E6_1_1_2_6": "", "E6_1_1_2_7": "", "N6_1_1_3": "", "E6_1_1_3_1": "", "E6_1_1_3_2": "", "E6_1_1_3_3": "", "E6_1_1_3_4": "", "E6_1_1_3_5": "", "N6_1_2": "", "E6_1_2_1": "", "E6_1_2_2": "", "E6_1_2_3": "" }; //prettier-ignore



/*
ALL ABOUT COUNTRY CODES
*/
// List of all countries in Eurobase !!! LOOKUP TABLE !!!
// 2017-05-22: Labels are now set in the language JSON files in the data folder
countriesEB = { "EU27_2020": "", "BE": "", "BG": "", "CZ": "", "DK": "", "DE": "", "EE": "", "IE": "", "EL": "", "ES": "", "FR": "", "HR": "", "IT": "", "CY": "", "LV": "", "LT": "", "LU": "", "HU": "", "MT": "", "NL": "", "AT": "", "PL": "", "PT": "", "RO": "", "SI": "", "SK": "", "FI": "", "SE": "", "IS": "", "NO": "", "ME": "", "MK": "", "AL": "", "RS": "", "TR": "", "XK": "", "UA": "", "MD": "", "BA": "", "GE": "" }; //prettier-ignore



/*
ALL ABOUT UNIT CODES
*/
// convert KTOE to other units !!! LOOKUP TABLE !!!
energyUnits = {
  "KTOE": { "conversionFactor": 1, "label": "Kilotonnes of oil equivalent" },
  "GJ": { "conversionFactor": 41868, "label": "Gigajoules" },
  "TJ": { "conversionFactor": 41.868, "label": "Terajoules" },
  "GWh": { "conversionFactor": 11.63, "label": "Gigawatt hours" },
  //  "TWh":  { "conversionFactor": 0.01163, "label": "Terawatt hours" },
  "Gcal": { "conversionFactor": 238.846, "label": "Gigacalories" },
  "Tcal": { "conversionFactor": 0.238846, "label": "Teracalories" },
  "GBtu": { "conversionFactor": 39.68305120087957, "label": "Giga British thermal unit" }
};



/*
CODE LOOKUP OBJECTS: store (geo,flow,fuel,year) codes to initialize 'sankeyDB'
*/
// all Sankey codes required to draw the Sankey diagram
const codesSankey = {
  "geo": Object.keys(countriesEB),
  "flow": Object.keys(SankeyToEurobase.default).concat(
    Object.keys(SankeyToEurobase.transformation),
    Object.keys(SankeyToEurobase.consumption)),
  "fuel": fuelListForSankeyDB,
  "year": [], // to be queried from Eurobase directly
  nrgBalSd: Object.keys(EurobaseToSankey.default).concat(
    Object.keys(EurobaseToSankey.transformation),
    Object.keys(EurobaseToSankey.consumption)),
};

const flowFormulas = {
  F1_1_1: { operand1: ["RCV_RCY"] },
  F1_1_2: { operand1: ["PPRD"] },
  F1_1: {
    formula: "F1_1_1 + F1_1_2",
    operand1: ["RCV_RCY", "PPRD"]
  },
  F1_2: { operand1: ["IMP"] },
  F1_3: { operand1: ["STK_CHG"] },
  F1_4: { formula: '-Math.min(get("STATDIFF"), 0);', operand1: ["STATDIFF"] },
  N1: {
    formula: "F1_1 + F1_2 + F1_3 + F1_4",
    operand1: ["F1_1", "F1_2", "F1_3", "F1_4"],
  },
  N2_1: { operand1: ["TI_E"] },// N2_1: Transformation input
  N2_2: { operand1: ["TO"] }, // N2_2: Transformation output
  F3: {
    formula: "Math.max(N2_1 - N1, 0);",
    operand1: ["TI_E"],
    operand2: ["N1"],
  },
  F2_1: {
    formula: "N2_1 - F3",// F2_1: Net transformation input
    operand1: ["TI_E"],
    operand2: ["F3"],
  },
  F2_2: {
    formula: "N2_2 - F3", // F2_2: Net transformation output
    operand1: [ "TO"],
    operand2: ["F3"],
  },
  F6_1_1: { operand1: ["FC_E"] },
  F6_1_2: { operand1: ["FC_NE"] },
  F6_1: {
    formula: "F6_1_1 + F6_1_2",
    operand1: ["FC_E", "FC_NE"]
  },
  F6_2: { formula: '-Math.min(get("STK_CHG"), 0);', operand1: ["STK_CHG"] },
  F6_3: { operand1: ["EXP"] },
  F6_4: { operand1: ["INTMARB"] },
  F6_5: { operand1: ["NRG_E"] },
  F6_6: { operand1: ["DL"] },
  F6_7: { operand1: ["INTAVI"] },
  F6_8: { formula: 'Math.max(get("STATDIFF"), 0);', operand1: ["STATDIFF"] },
  N6: {
    operand1: [ "F6_1", "F6_2", "F6_3", "F6_4", "F6_5", "F6_6", "F6_7", "F6_8"]
  },
  F4: {
    operand1: ["TL"]
  },
  F5_1: {
    formula: "N1 - F2_1",
    operand1: [ "N1"],
    operand2: [ "F2_1"],
  },
  F5_2: {
    formula: "N6 - F2_2",
    operand1: [ "N6"],
    operand2: [ "F2_2"],
  },

  F2_6_1: { operand1: ["TI_RPI_E"] },
  F2_7_1: { operand1: ["TI_BKBPB_E"] },
  F2_8_1: { operand1: ["TI_CO_E"] },
  F2_9_1: { operand1: ["TI_BF_E"] },
  F2_10_1: { operand1: ["TI_GW_E"] },
  F2_11_1: { operand1: ["TI_EHG_E"] },
  F2_12_1: {
    formula: "TI_CL_E + TI_BNG_E + TI_LBB_E + TI_CPP_E + TI_GTL_E + TI_NSP_E",
    operand1: [ "TI_CL_E", "TI_BNG_E", "TI_LBB_E", "TI_CPP_E", "TI_GTL_E", "TI_NSP_E", ],
  },
  F2_6_1_1: { operand1: ["TI_RPI_RI_E"] },
  F2_6_2_1: { operand1: ["TI_RPI_PII_E"] },
  F2_6_3_1: {
    formula: "TI_RPI_BPI_E + TI_RPI_PT_E + TI_RPI_IT_E + TI_RPI_DU_E",
    operand1: ["TI_RPI_BPI_E", "TI_RPI_PT_E", "TI_RPI_IT_E", "TI_RPI_DU_E"],
  },
  F2_11_1_1: {
    formula: "TI_EHG_MAPE_E + TI_EHG_APE_E",
    operand1: ["TI_EHG_MAPE_E", "TI_EHG_APE_E"],
  },
  F2_11_2_1: {
    formula: "TI_EHG_MAPCHP_E + TI_EHG_APCHP_E",
    operand1: ["TI_EHG_MAPCHP_E", "TI_EHG_APCHP_E"],
  },
  F2_11_3_1: {
    formula: "TI_EHG_MAPH_E + TI_EHG_APH_E",
    operand1: ["TI_EHG_MAPH_E", "TI_EHG_APH_E"],
  },
  F2_11_4_1: {
    formula: "TI_EHG_EDHP + TI_EHG_EB + TI_EHG_EPS + TI_EHG_DHEP",
    operand1: ["TI_EHG_EDHP", "TI_EHG_EB", "TI_EHG_EPS", "TI_EHG_DHEP"],
  },
  F2_6_2: { operand1: ["TO_RPI"] },
  F2_7_2: { operand1: ["TO_BKBPB"] },
  F2_8_2: { operand1: ["TO_CO"] },
  F2_9_2: { operand1: ["TO_BF"] },
  F2_10_2: { operand1: ["TO_GW"] },
  F2_11_2: { operand1: ["TO_EHG"] },
  F2_12_2: {
    formula: "TO_CL + TO_BNG + TO_LBB + TO_CPP + TO_GTL + TO_NSP",
    operand1: ["TO_CL", "TO_BNG", "TO_LBB", "TO_CPP", "TO_GTL", "TO_NSP"],
  },
  F2_6_1_2: { operand1: ["TO_RPI_RO"] },
  F2_6_2_2: { operand1: ["TO_RPI_PIR"] },
  F2_6_3_2: {
    formula: "TO_RPI_PPR + TO_RPI_PT + TO_RPI_BKFLOW + TO_RPI_IT",
    operand1: ["TO_RPI_PPR", "TO_RPI_PT", "TO_RPI_BKFLOW", "TO_RPI_IT"],
  },
  F2_11_1_2: {
    formula: "TO_EHG_MAPE + TO_EHG_APE",
    operand1: ["TO_EHG_MAPE", "TO_EHG_APE"],
  },
  F2_11_2_2: {
    formula: "TO_EHG_MAPCHP + TO_EHG_APCHP",
    operand1: ["TO_EHG_MAPCHP", "TO_EHG_APCHP"],
  },
  F2_11_3_2: {
    formula: "TO_EHG_MAPH + TO_EHG_APH",
    operand1: ["TO_EHG_MAPH", "TO_EHG_APH"],
  },
  F2_11_4_2: {
    formula: "TO_EHG_EDHP + TO_EHG_EB + TO_EHG_PH + TO_EHG_OTH",
    operand1: ["TO_EHG_EDHP", "TO_EHG_EB", "TO_EHG_PH", "TO_EHG_OTH"],
  },
  F6_5_1: { operand1: ["NRG_EHG_E"] },
  F6_5_2: { operand1: ["NRG_CM_E"] },
  F6_5_3: { operand1: ["NRG_OIL_NG_E"] },
  F6_5_4: { operand1: ["NRG_PF_E"] },
  F6_5_5: { operand1: ["NRG_CO_E"] },
  F6_5_6: { operand1: ["NRG_BKBPB_E"] },
  F6_5_7: { operand1: ["NRG_GW_E"] },
  F6_5_8: { operand1: ["NRG_BF_E"] },
  F6_5_9: { operand1: ["NRG_PR_E"] },
  F6_5_10: { operand1: ["NRG_NI_E"] },
  F6_5_11: { operand1: ["NRG_CL_E"] },
  F6_5_12: { operand1: ["NRG_LNG_E"] },
  F6_5_13: { operand1: ["NRG_BIOG_E"] },
  F6_5_14: { operand1: ["NRG_GTL_E"] },
  F6_5_15: { operand1: ["NRG_CPP_E"] },
  F6_5_16: { operand1: ["NRG_NSP_E"] },
  F6_1_2_1: { operand1: ["TI_NRG_FC_IND_NE"] },
  F6_1_2_2: { operand1: ["FC_TRA_NE"] },
  F6_1_2_3: { operand1: ["FC_OTH_NE"] },
  F6_1_1_1: { operand1: ["FC_IND_E"] },
  F6_1_1_1_1: { operand1: ["FC_IND_IS_E"] },
  F6_1_1_1_2: { operand1: ["FC_IND_CPC_E"] },
  F6_1_1_1_3: { operand1: ["FC_IND_NFM_E"] },
  F6_1_1_1_4: { operand1: ["FC_IND_NMM_E"] },
  F6_1_1_1_5: { operand1: ["FC_IND_TE_E"] },
  F6_1_1_1_6: { operand1: ["FC_IND_MAC_E"] },
  F6_1_1_1_7: { operand1: ["FC_IND_MQ_E"] },
  F6_1_1_1_8: { operand1: ["FC_IND_FBT_E"] },
  F6_1_1_1_9: { operand1: ["FC_IND_PPP_E"] },
  F6_1_1_1_10: { operand1: ["FC_IND_WP_E"] },
  F6_1_1_1_11: { operand1: ["FC_IND_CON_E"] },
  F6_1_1_1_12: { operand1: ["FC_IND_TL_E"] },
  F6_1_1_1_13: { operand1: ["FC_IND_NSP_E"] },
  F6_1_1_2: { operand1: ["FC_TRA_E"] },
  F6_1_1_2_1: { operand1: ["FC_TRA_RAIL_E"] },
  F6_1_1_2_2: { operand1: ["FC_TRA_ROAD_E"] },
  F6_1_1_2_4: { operand1: ["FC_TRA_DAVI_E"] },
  F6_1_1_2_5: { operand1: ["FC_TRA_DNAVI_E"] },
  F6_1_1_2_6: { operand1: ["FC_TRA_PIPE_E"] },
  F6_1_1_2_7: { operand1: ["FC_TRA_NSP_E"] },
  F6_1_1_3: { operand1: ["FC_OTH_E"] },
  F6_1_1_3_1: { operand1: ["FC_OTH_CP_E"] },
  F6_1_1_3_2: { operand1: ["FC_OTH_HH_E"] },
  F6_1_1_3_3: { operand1: ["FC_OTH_AF_E"] },
  F6_1_1_3_4: { operand1: ["FC_OTH_FISH_E"] },
  F6_1_1_3_5: { operand1: ["FC_OTH_NSP_E"] },
};

const reducedNrgBalListForDataApi = new Set();
Object.values(flowFormulas).forEach(formula => {
  if (formula.operand1) {
    formula.operand1.forEach(operand => {
      if (!flowFormulas.hasOwnProperty(operand)) {
        reducedNrgBalListForDataApi.add(operand);
      }
    });
  }
  if (formula.operand2) {
    formula.operand2.forEach(operand => {
      if (!flowFormulas.hasOwnProperty(operand)) {
        reducedNrgBalListForDataApi.add(operand);
      }
    });
  }
});

function getAllFlowOperands(flowCode) {
  const operands = new Set();

  function traverse(operandsList) {
    operandsList.forEach((op) => {
      if (!flowFormulas[op]) operands.add(op);
      if (flowFormulas[op] && flowFormulas[op].operand1) {
        traverse(flowFormulas[op].operand1);
      }
      if (flowFormulas[op] && flowFormulas[op].operand2) {
        traverse(flowFormulas[op].operand2);
      }
    });
  }

  traverse([flowCode]);

  return [...operands];
}

