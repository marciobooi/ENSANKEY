const cacheName = "estat-dataset4";

async function fetchDataset(query) {
  const url = EuroJSONstat.getURL(query);

  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(url);

  if (cachedResponse) {
    return cachedResponse.json();
  }

  const networkResponse = await fetch(url);
  cache.put(url, networkResponse.clone());
  return networkResponse.json();
}

async function getEUDS() {
  const resp = [];
  const datasets = ["nrg_bal_c"];

  for (const dsName of datasets) {
    const query = queryBuilder(dsName, { flow: "FC_E" });
    try {
      const res = await fetchDataset(query);
      console.log("res", res);
      // const parsedDs = nsDbq.parsePromise(res);
      // console.log("parsedDs", parsedDs);
      // resp.push(parsedDs);
      resp.push(res);
    } catch (error) {
      console.error(`Failed to fetch dataset ${dsName}:`, error);
    }
  }

  return resp;
}
