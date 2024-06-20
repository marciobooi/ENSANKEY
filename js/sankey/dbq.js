const nsDbq = {
    async Promises() {
        const datasetNames = ["nrg_bal_c"];
        const queries = datasetNames.map(datasetName => {
            const queryFilter = { flow: "all" };
            const query = queryBuilder(datasetName, queryFilter);
            return fetchDataset(query);
        });

        try {
            const data = await Promise.all(queries);
            return data.map(this.parsePromise);
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },

    parsePromise(data) {
        const sankeyDBnew = {
            value: data.value,
            mask: data.value.map(() => true),
            dimension: {
                id: ["geo", "flow", "fuel", "year"],
                size: [
                    data.Dimension("geo").length,
                    data.Dimension("nrg_bal").length,
                    data.Dimension("siec").length,
                    data.Dimension("time").length,
                ],
                geo: {
                    index: data.Dimension("geo").id,
                    label: {},
                },
                flow: {
                    index: data.Dimension("nrg_bal").id,
                    label: {},
                },
                fuel: {
                    index: data.Dimension("siec").id,
                    label: {},
                },
                year: {
                    index: data.Dimension("time").id,
                    label: {},
                },
            },
        };
        return sankeyDBnew;
    },

    async renderChart() {
        await this.clearCache();
        try {
            const data = await this.Promises();
            console.log("Data:", data);
            console.log("Data Dimension Size:", data[0].dimension.size);
        } catch (error) {
            console.error("Error rendering chart:", error);
        }
    },

    async clearCache() {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
    },
};

async function fetchDataset(query) {
    const url = EuroJSONstat.getURL(query);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
        return cachedResponse.json();
    } else {
        const response = await fetch(url);
        cache.put(url, response.clone());
        return response.json();
    }
}

function queryBuilder(datasetName, f) {
    const defaultFilters = {
        fuel: ["TOTAL"],
        flow: ["FC_E"],
        unit: ["KTOE"]
    };

    const filters = { ...defaultFilters, ...f };

    let query = {
        dataset: datasetName,
        lang: "de",
        filter: {
            nrg_bal: filters.flow,
            geo: filters.geo,
            siec: filters.fuel,
            unit: filters.unit,
            time: filters.time,
        },
    };

    if (!filters.geo || filters.geo === "all") {
        query = EuroJSONstat.removeParamQuery(query, ["geo"]);
    }

    if (!filters.flow || filters.flow === "all") {
        query = EuroJSONstat.removeParamQuery(query, ["nrg_bal"]);
    }

    if (!filters.time || filters.time === "all") {
        query = EuroJSONstat.removeParamQuery(query, ["time"]);
        query = EuroJSONstat.addParamQuery(query, { sinceTimePeriod: 1990 });
    }

    if (filters.timeSeries === "latest") {
        query = EuroJSONstat.lastPeriodQuery(query);
    }

    console.log("Query URL:", EuroJSONstat.getURL(query));
    return query;
}

function showCodesFor_c() {
    const codes_NRG_BAL_C = {
        flow: [
            "AAS", "PRD", "PPRD", "IMP", "FC_E", "FC_NE", "EXP", "INTMARB", "NRG_E", "DL", 
            "INTAVI", "TI_NRG_FC_IND_NE", "FC_TRA_NE", "FC_OTH_NE", "FC_IND_E", "FC_IND_IS_E", 
            "FC_IND_CPC_E", "FC_IND_NFM_E", "FC_IND_NMM_E", "FC_IND_TE_E", "FC_IND_MAC_E", 
            "FC_IND_MQ_E", "FC_IND_FBT_E", "FC_IND_PPP_E", "FC_IND_WP_E", "FC_IND_CON_E", 
            "FC_IND_TL_E", "FC_IND_NSP_E", "FC_TRA_E", "FC_TRA_RAIL_E", "FC_TRA_ROAD_E", 
            "FC_TRA_DAVI_E", "FC_TRA_DNAVI_E", "FC_TRA_PIPE_E", "FC_TRA_NSP_E", "FC_OTH_E", 
            "FC_OTH_CP_E", "FC_OTH_HH_E", "FC_OTH_AF_E", "FC_OTH_FISH_E", "FC_OTH_NSP_E", 
            "RCV_RCY", "STK_CHG", "STATDIFF", "TI_E", "TO", "STK_BLD", "AFC", "TO_EHG_MAPCHP", 
            "TI_RPI_E", "TO_RPI", "TI_BKBPB_E", "TO_BKBPB", "TI_CO_E", "TO_CO", "TI_BF_E", 
            "TO_BF", "TI_GW_E", "TO_GW", "TI_EHG_E", "TO_EHG", "TI_OTH", "TI_CL_E", "TI_BNG_E", 
            "TI_LBB_E", "TI_CPP_E", "TI_GTL_E", "TI_NSP_E", "TO_OTH", "TO_CL", "TO_BNG", 
            "TO_LBB", "TO_CPP", "TO_GTL", "TO_NSP",
            // Refinery disaggregation flows
            "TI_RPI_RI_E", "TO_RPI_RO", "TI_RPI_PII_E", "TO_RPI_PIR", "TI_RPI_OTH_E", "TI_RPI_BPI_E", 
            "TI_RPI_PT_E", "TI_RPI_IT_E", "TI_RPI_DU_E", "TO_RPI_O_OTH", "TO_RPI_PPR", "TO_RPI_PT", 
            "TO_RPI_BKFLOW", "TO_RPI_IT",
            // Electricity and heat generation disaggregation flows
            "TI_EHG_EONL_E", "TI_EHG_MAPE_E", "TI_EHG_APE_E", "TO_EHG_EONL", "TO_EHG_MAPE", 
            "TO_EHG_APE", "TI_EHG_CHP_E", "TI_EHG_MAPCHP_E", "TI_EHG_APCHP_E", "TO_EHG_CHP", 
            "TO_EHG_MAPCHP", "TO_EHG_APCHP", "TI_EHG_HONL_E", "TI_EHG_MAPH_E", "TI_EHG_APH_E", 
            "TO_EHG_HONL", "TO_EHG_MAPH", "TO_EHG_APH", "TI_EHG_OTH", "TI_EHG_EDHP", "TI_EHG_EB", 
            "TI_EHG_EPS", "TI_EHG_DHEP", "TO_EHG_G_OTH", "TO_EHG_EDHP", "TO_EHG_EB", "TO_EHG_PH", 
            "TO_EHG_OTH",
            // Energy branch disaggregation flows
            "NRG_EHG_E", "NRG_CM_E", "NRG_OIL_NG_E", "NRG_PF_E", "NRG_CO_E", "NRG_BKBPB_E", 
            "NRG_GW_E", "NRG_BF_E", "NRG_PR_E", "NRG_NI_E", "NRG_CL_E", "NRG_LNG_E", "NRG_BIOG_E", 
            "NRG_GTL_E", "NRG_CPP_E", "NRG_NSP_E",
            // Transformation losses disaggregation flows
            "TL_RPI", "TL_CO", "TL_BF", "TL_GW", "TL_BKBPB", "TL_OTH", "TL_CL", "TL_BNG", "TL_LBB", 
            "TL_CPP", "TL_GTL", "TL_NSP",
            // Refinery Transformation losses disaggregation flows
            "TL_RPI_RO", "TL_RPI_PIR", "TL_RPI_L_OTH", "TL_RPI_BKFLOW", "TL_RPI_PT", "TL_RPI_IT", 
            "TL_RPI_PPR",
            // Electricity and heat generation Transformation losses disaggregation flows
            "TL_EHG_EONL", "TL_EHG_MAPE", "TL_EHG_APE", "TL_EHG_CHP", "TL_EHG_MAPCHP", "TL_EHG_APCHP", 
            "TL_EHG_HONL", "TL_EHG_MAPH", "TL_EHG_APH", "TL_EHG_L_OTH", "TL_EHG_EDHP", "TL_EHG_EB", 
            "TL_EHG_PH", "TL_EHG_EPS_PURE", "TL_EHG_EPS_MIX", "TL_EHG_OTH",
        ],
        fuel: [
            "SFF_P1000", "C0121", "C0129", "C0220", "C0311", "SFF_OTH", "O4000", "O4100_TOT", 
            "O4200-4500", "O4652XR5210B", "O4661XR5230B", "O4671XR5220B", "O4680", "PP_OTH", 
            "G3000_C0350-370", "G3000", "C0350-0370", "RA100", "RA300", "RA410", "RA420", 
            "R5110-5150_W6000RI", "R5200", "RA500_5160", "W6100_6220", "W6100", "W6220", 
            "W6210", "RA200", "R5300", "RA600", "N900H", "H8000", "E7000", "C0110", "C0210", 
            "C0320", "C0312", "C0340", "C0330", "P1100", "P1200", "S2000", "O4200", "O4300", 
            "O4400X4410", "O4500", "O4610", "O4620", "O4630", "O4651", "O4653", "O4669", 
            "O4640", "O4691", "O4692", "O4695", "O4694", "O4693", "O4699", "C0360", "C0350", 
            "C0371", "C0379", "R5210P", "R5210B", "R5220P", "R5220B", "R5230P", "R5230B", 
            "R5290", "RA500", "R5160",
        ],
    };
    console.log(codes_NRG_BAL_C);
}
