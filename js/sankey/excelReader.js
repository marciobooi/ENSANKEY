$(async function () {
  urlPath = "./excelFile/codesInfo.xlsx";
  return new Promise((resolve) => {
		fetch(urlPath)
			.then(function (res) {
				/* get the data as a Blob */
				if (!res.ok) throw new Error("fetch failed");
				return res.arrayBuffer();
			})
			.then(function (ab) {
				/* parse the data when it is received */
				var data = new Uint8Array(ab);
				var workbook = XLSX.read(data, { type: "array" });

				getExcelData();
				setAriaLabel();


        function getExcelData() {
					[0, 1, 2, 3, 4].forEach((i) => {
						const sheet_name = workbook.SheetNames[i],
							worksheet = workbook.Sheets[sheet_name],
							excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
						excelInfoData.push(excelData);
					});
				}

        function setAriaLabel() {
					const sheet_name = workbook.SheetNames[5],
						worksheet = workbook.Sheets[sheet_name],
						excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          excelData.forEach((row) => {
            // console.log(row.CODE, row[REF.language]);
            $(row.CODE).attr("aria-label", row[REF.language]);
          });

				}
			});
	});
});

function testXlsUrl(
	urlPath = "https://ec.europa.eu/eurostat/documents/8105938/8197744/dictionary.xlsx/c2ebbe0a-d83e-ecb1-8cfc-56217c25a032?t=1657286846407"
) {
  return;
	//TODO - add key for cache problem
	var request;
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	request.open("GET", urlPath, false);
	request.send(); // there will be a 'pause' here until the response to come.

	// the object request will be actually modified
	if (request.status === 404) {
		alert("The page you are trying to reach is not available.");
	} else if (request.status === 403) {
		alert("You are not allowed to access this page.");
	} else if (request.status === 200) {
		alert("The page is available.");
	} else {
		alert("The page is available.", request.status);
	}
}
