	const cacheName = "estat-dataset4";
function fetchDataset(query) {
	const url = EuroJSONstat.getURL(query);
	// cache the response
	return caches.open(cacheName).then((cache) => {
		return cache.match(url).then((response) => {
			if (response) {
				return response.json();
			} else {
				return fetch(url).then((response) => {
					cache.put(url, response.clone());
          return response.json();
				});
			}
		});
	});
}

function getEUDS() {
	let resp = [];
  ["nrg_bal_c"].forEach(function (dsName) {
		const query = queryBuilder(dsName, { flow: "FC_E" });
		const apiResponse = fetchDataset(query);
    console.log("apiResponse", apiResponse);
		apiResponse.then((res) => {
			console.log("res", res);
			// const data =
			// const parsedDs = nsDbq.parsePromise(res);
			// console.log("parsedDs", parsedDs);
			// resp.push(parsedDs);
      resp.push(res);
		});
	});
  return resp;
}
