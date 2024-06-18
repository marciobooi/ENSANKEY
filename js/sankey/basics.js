// global variables
var excelInfoData = [], // Content administration object
  sankeySeries = {};

var log = console.log.bind(console);

// function log(item) {
//   if (typeof console != "undefined" && console.log) {
//       console.log(item);
//   }
// }

// browser platform support
// taken from http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
// Opera 8.0+
var isOpera =
  (!!window.opr && !!opr.addons) ||
  !!window.opera ||
  navigator.userAgent.indexOf(" OPR/") >= 0;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";
// At least Safari 3+: "[object HTMLElementConstructor]"
var isSafari =
	/constructor/i.test(window.HTMLElement) ||
	(function (p) {
		return p.toString() === "[object SafariRemoteNotification]";
	})(
		!window["safari"] ||
			(typeof safari !== "undefined" && window["safari"].pushNotification)
	);

// checking browsers version of 2020
let uA = navigator.userAgent;
let isOpera20,
  isEdge20,
  isMS20,
  isChrome20,
  isSafari20,
  isFirefox20,
  isIPadBrowser;

if (uA.indexOf("OPR") > -1) {
  isOpera20 = true;
} else if (uA.indexOf("Firefox") > -1) {
  isFirefox20 = true;
} else if (uA.indexOf("Chrome") > -1) {
  if (uA.indexOf("Edge") > -1) {
    isEdge20 = true;
  } else {
    isChrome20 = true;
  }
} else if (uA.indexOf(".NET") > -1) {
  isMS20 = true;
} else if (navigator.vendor.includes("Apple")) {
  isSafari20 = true;
} else if (uA.indexOf("iPad") > -1) {
  isIPadBrowser = true;
} else {
  console.error("Browser not recognized.");
}

// tablets
var isPortrait, isLandscape;

function doOnOrientationChange() {
  setTimeout(() => {
    if (window.innerHeight > window.innerWidth) {
      isPortrait = true;
      isLandscape = false;
    } else {
      isPortrait = false;
      isLandscape = true;
    }
  }, 200);
}
// $(window).on("orientationchange", doOnOrientationChange);
window.addEventListener("orientationchange", doOnOrientationChange);

// Initial execution if needed
doOnOrientationChange();

var tabletUA = navigator.userAgent.toLowerCase();
var isTablet =
  /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
    tabletUA
  );
if (!isIPadBrowser) {
  var isSmallTablet =
    (window.innerHeight > window.innerWidth &&
      window.innerWidth < 768 &&
      window.innerHeight <= 1100) ||
    (window.innerHeight < window.innerWidth &&
      isTablet &&
      window.innerHeight < 768 &&
      window.innerWidth <= 1100)
      ? true
      : false;
  // Nexus 9
  var isBigTablet =
    (window.innerHeight > window.innerWidth &&
      window.innerWidth <= 900 &&
      window.innerHeight > 1100) ||
    (window.innerHeight < window.innerWidth &&
      isTablet &&
      !isSmallTablet &&
      window.innerHeight < 900 &&
      window.innerWidth <= 1300)
      ? true
      : false;
} else {
  var isIPad =
    (window.innerHeight < window.innerWidth &&
      isTablet &&
      window.innerHeight < 900 &&
      window.innerWidth <= 1150) ||
    (window.innerHeight > window.innerWidth &&
      window.innerWidth < 900 &&
      window.innerHeight <= 1050)
      ? true
      : false;
  var isIPadPro =
    (window.innerHeight < window.innerWidth &&
      isTablet &&
      !isIPad &&
      window.innerHeight <= 1024 &&
      window.innerWidth > 1200) ||
    (window.innerHeight > window.innerWidth &&
      ((window.innerWidth <= 1024 && window.innerHeight > 1200) ||
        (window.innerWidth < 900 && window.innerHeight < 1200 && !isIPad))) ||
    (window.innerHeight > window.innerWidth &&
      window.innerWidth < 900 &&
      window.innerHeight <= 1150)
      ? true
      : false;
}

// mobile
window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

var objAgent = navigator.userAgent;
var safariMajorVersion = parseInt(navigator.appVersion, 10);
var objOffsetVersion, ix;

//get Safari version
if (isSafari) {
  objfullVersion = objAgent.substring(objOffsetVersion + 7);

  if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
    objfullVersion = objAgent.substring(objOffsetVersion + 8);
  if ((ix = objfullVersion.indexOf(";")) != -1)
    objfullVersion = objfullVersion.substring(0, ix);
  if ((ix = objfullVersion.indexOf(" ")) != -1)
    objfullVersion = objfullVersion.substring(0, ix);

  safariMajorVersion = parseInt("" + objfullVersion, 10);
  if (isNaN(safariMajorVersion)) {
    objfullVersion = "" + parseFloat(navigator.appVersion);
    safariMajorVersion = parseInt(navigator.appVersion, 10);
  }
  // console.log(objfullVersion); //full version X.xx.xx
  // console.log(safariMajorVersion); // Major version X
}

// Internet Explorer 6-11
var isIEBrowser = /*@cc_on!@*/ false || !!document.documentMode;
// Edge 20+
var isEdge = !isIEBrowser && !!window.StyleMedia;
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

// supported platforms
// change when the tests are finished
var isBrowserSupported = isFirefox || isChrome; //|| isIEBrowser || (isSafari && safariMajorVersion > 9);

var isMobile =
  navigator.userAgent.match(/Android/i) != null ||
  navigator.userAgent.match(/webOS/i) != null ||
  navigator.userAgent.match(/iPhone/i) != null ||
  navigator.userAgent.match(/iPad/i) != null ||
  navigator.userAgent.match(/iPod/i) != null ||
  navigator.userAgent.match(/BlackBerry/i) != null ||
  navigator.userAgent.match(/Windows Phone/i) != null;

// error handler
function error(msg) {
	console.error("ERROR: " + msg);
};

function fatal(msg) {
	throw new Error("FATAL ERROR: " + msg);
};



// function to sum values of an array
var arraySum = function (arr) {
//	if (arr.length == 0) return "undefined";
	if (arr.length == 0) return 0;
	var sum = arr[0];
	for (var i = 1; i < arr.length; i++) sum += arr[i];
	return sum;
};



// function to sum values of an array
var arrayProduct = function (arr) {
	if (arr.length == 0) return "undefined";
	var prod = arr[0];
	for (var i = 1; i < arr.length; i++) prod *= arr[i];
	return prod;
};



// function to compute the mean of an array
var arrayMean = function (arr) {
	return arraySum(arr) / arr.length;
};



// function to compute the standard deviation of an array
var arraySD = function (arr) {
	var mean = arrayMean(arr);
	var sumSquares = 0;
	for (var i = 0; i < arr.length; i++) sumSquares += Math.pow(arr[i] - mean, 2);
	return Math.sqrt(sumSquares / arr.length);
};



// check if an array contains an element
Array.prototype.contains = function (element) {
	return this.indexOf(element) >= 0;
};



// check if an array contains an element
String.prototype.contains = function (element) {
	return this.indexOf(element) >= 0;
};



// return last element
Array.prototype.last = function () {
	return this[this.length - 1];
};



// check if all elements of logical array are true
Array.prototype.all = function () {
	return this.every(function (l) { return l === true });
};



// check if any element of logical array is true
Array.prototype.any = function () {
	return this.some(function (l) { return l === true });
};



// sum two arrays
Array.prototype.plus = function (arr) {
	var sum = [];
	if (arr != null && this.length == arr.length) {
		for (var i = 0; i < arr.length; i++) {
			sum.push(this[i] + arr[i]);
		};
	};
	return sum;
};



// remove element(s) from an array
var arrayRemove = function (arr, elem) {
	if (!arr.length || typeof elem === "undefined") return arr;
	var elemList = (elem.constructor === Array) ? elem : [elem];
	var arrNew = arr.slice(0); // clone old array
	$.each(elemList, function (ielm, elm) {
		if (!arrNew.contains(elm)) return;
		arrNew.splice(arrNew.indexOf(elm), 1);
	});
	return arrNew;
};



// mimicks behaviour of Math.sign function not supported by some IE versions
// MDN Polyfill https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
Math.sign = Math.sign || function (x) {
	x = +x; // convert to a number
	if (x === 0 || isNaN(x)) {
		return x;
	}
	return x > 0 ? 1 : -1;
}


// print a number rounded to integer with 'sep' separating the 1000 steps
var printNumber = function (n, separatorIn) {
	var nIn = Math.round(n).toString().split("");
	var sep = (typeof separatorIn !== "string") ? " " : separatorIn;
	var nOut = "";
	for (var i = 1; i <= nIn.length; i++) {
		nOut = nIn[nIn.length - i] + nOut;
		if (i % 3 == 0 && i < nIn.length) nOut = sep + nOut;
	};
	return nOut;
};

var printOneDecimal = function (n) {
  return (Math.round(10 * n) / 10).toString();
}

// print Gigatonnes with two decimals
var printTwoDecimal = function (n, separatorIn) {
  var number = (Math.round(n * 100) / 100).toString().split("");
  var sep = typeof separatorIn !== "string" ? "" : separatorIn;
  var nOut = "";
  for (var i = 1; i <= number.length; i++) {
    nOut = number[number.length - i] + nOut;
    if (i % 3 == 0 && i < number.length) nOut = sep + nOut;
  }
  return (nOut.length < 4 && nOut.length > 2) ||
    (nOut.length < 4 && nOut.contains("."))
    ? nOut + "0"
    : nOut.length <= 2
    ? nOut + ".00"
    : nOut;
};



// compare two objects
var objectEqual = function (obj1, obj2) {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
};



// object for speed test
var speedTest = function () {
	this.reset();
};

speedTest.prototype.now = function () {
	return performance.now();
//	return new Date();
};

speedTest.prototype.reset = function () {
	this.times = [this.now()];
	this.labels = [];
};

speedTest.prototype.log = function (labelIn) {
	var label = "STOP " + this.times.length;
	if (typeof labelIn !== "undefined") label += " - " + labelIn;
	this.times.push(this.now());
	this.labels.push(label);
	return 0;
};

speedTest.prototype.last = function () {
	var length = this.times.length;
	return this.times[length - 1] - this.times[length - 2];
};

speedTest.prototype.dump = function (head) {
	head = (typeof head === "undefined") ? "" : " " + head;
	console.log("SPEEDTEST:" + head);
	if (this.times.length - 1 != this.labels.length) {
		error("speedTest.dump");
		return 1;
	};
	for (var i = 0; i < this.labels.length; i++)
		console.log(this.labels[i] + ": " + printOneDecimal(this.times[i + 1] - this.times[i]) + " ms");
	return 0;
};

speedTest.prototype.total = function () {
	return this.now() - this.times[0];
};


// read variables from URL
// code from http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
};



// change URL by adding new item to history
// code from http://www.aspsnippets.com/Articles/Change-Browser-URL-without-reloading-refreshing-page-using-HTML5-in-JavaScript-and-jQuery.aspx
function changeUrl(title, url) {
	if (typeof (history.pushState) != "undefined") {
		var obj = { Title: title, Url: url };
		history.pushState(obj, obj.Title, obj.Url);
	} else {
		alert(languageNameSpace.labels["MSG_01"]);
	};
};



function parseBool(b) {
	return (b === true || b === "true");
};



// from https://blog.mastykarz.nl/measuring-the-length-of-a-string-in-pixels-using-javascript/
String.prototype.visualLength = function (fontsize) {
	var ruler = document.getElementById("ruler");
	ruler.style.fontSize = fontsize + "px";
//	ruler.style.fontFamily = "Helvetica, Arial, Sans-Serif";
	ruler.innerHTML = this;
	return ruler.offsetWidth;
};



// create a downloadable file from an array of strings
function createFile(textArray) {
	var data = new Blob(textArray, { type: 'text/plain' });
	var textFile = null;

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
};

// add a download link for a text file
function addFileDownloadButton(textArray, fileName) {
	if (typeof fileName === "undefined") fileName = "test.txt";
	d3.select("body").append("a")
		.attr("download", fileName)
		.attr("href", createFile(textArray))
//		.attr("id", fileName)
		.html("<br>Download " + fileName);
};

// from http://stackoverflow.com/questions/18755750/saving-text-in-a-local-file-in-internet-explorer-10
function saveTextAsFile(textToWrite, fileNameToSaveAs) {
	/* Saves a text string as a blob file*/
	var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
		ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
		ieEDGE = navigator.userAgent.match(/Edge/g),
		ieVer = (ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

	if (ie && ieVer < 10) {
		console.log("No blobs on IE ver<10");
		return;
	}

	var textFileAsBlob = new Blob(["\ufeff",textToWrite], { //Escape sequence "\ufeff" needed for accented characters  (https://msdn.microsoft.com/library/2yfce773(v=vs.94).aspx)
		type: 'text/csv;charset=utf-8'
	});

	if (ieVer > -1) {
		window.navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs);

	} else {
		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = function (e) { document.body.removeChild(e.target); };
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}
}


// check if session quota is exceeded, from http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
function isQuotaExceeded(e) {
	var quotaExceeded = false;
	if (e) {
		if (e.code) {
			switch (e.code) {
				case 22:
					quotaExceeded = true;
					break;
				case 1014:
					// Firefox
					if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
						quotaExceeded = true;
					}
					break;
			}
		} else if (e.number === -2147024882) {
			// Internet Explorer 8
			quotaExceeded = true;
		}
	}
	return quotaExceeded;
}



function decimalPlaces2(num) {
  return +(Math.round(num + "e+2") + "e-2") || 0;
}

function decimalPlaces3(num) {
  return +(Math.round(num + "e+3") + "e-3") || 0;
}

// function to send an email saing that the page is down
const messageRegex = /The CESANKEY tool is down since:     (.*)/;

function formDown(errMsg) {
  let content = `<form class="d-none" name="formDown" id="formDown" autocomplete="off"
  action="https://formsubmit.co/1d101a2f87b2d260b1afce56e720a97a" method="POST">
  <div class="card-body">
    <div class="input-group mb-4 input-group-static">
      <label class="text-white">Error message: ${errMsg}</label>
      <textarea id="message" name="message" class="form-control text-white" rows="4"
        required="">The CESANKEY tool is down since:     ${new Date()}</textarea>
    </div>
    <input type="hidden" name="_subject" value="CESANKEY is down">
    <input type="hidden" name="_captcha" value="false"> <input type="hidden" name="_template" value="table">
    <!-- production -->
    <input type="hidden" name="_next" value="https://ec.europa.eu/eurostat/cache/sankey/circular_economy/404.html">
    <div class="row">
      <div class="col-md-12">
        <button id="contactSend" type="btnSubmit" name="btnSubmit" class="btn bg-gradient-primary w-100">Send Message</button>
      </div>
    </div>
  </div>
</form>`;
  $("#hiddenFormDiv").append(content);
}


/**
 * tooltip for sankey flows and nodes
 */
function tooltipSetPosition(e) {
	var tooltip = document.getElementById("tooltip");
  
	var tooltipWidth = tooltip.offsetWidth;
	var tooltipHeight = tooltip.offsetHeight;
  
	var tooltipX =
	  e.pageX + tooltipWidth >= window.innerWidth
		? e.pageX - tooltipWidth
		: e.pageX + 10;
	var tooltipY =
	  e.pageY + tooltipHeight >= window.innerHeight - 105
		? e.pageY - tooltipHeight - 50
		: e.pageY - 20;
  
	tooltip.style.left = tooltipX + "px";
	tooltip.style.top = tooltipY + "px";
  }
  function tooltipContent(title, values, materials, colors) {
	var tblWidth = 310;
	var html = `<table style="white-space:nowrap;width:${tblWidth}px">
	  <tr> <td> <span style="font-size: 12px; font-weight: bolder;"> ${title}</span>
	</table>
	<hr style="height: 1px; box-shadow: none; margin: 3px 0 0 0;width:${tblWidth}px">`;
  
	html += `<table style="white-space:nowrap;width:${tblWidth}px">`;
  
	for (let i = 0; i < values.length; i++) {
	  var color = colors[i];
	  var value = values[i];
	  var material = materials[i];
	  html += `<tr><td>
	  <svg width="10" height="10" style=" vertical-align: baseline;">
		<circle cx="5" cy="5" r="5" fill="${color}" /> </svg>
	  <span style="font-size: .875rem;">${material}</span>
	  <span style="float: right; font-size: .875rem">${value}</span>`;
	}
  
	html += `</table>`;
  
	return html;
  }
  function showTooltipFlow(e, value, material, source, target, color) { 
	var tooltip = document.getElementById("tooltip");
	var innerHTML = tooltipContent(`${source} → ${target}`, [value], [material], [color]);
	tooltip.innerHTML = innerHTML;
	tooltip.style.display = "block";
	tooltip.style.border = "1px solid " + color;
  
	// Check the type of event
	if (e.type === "focus") {
	  const boundingRect = e.target.getBoundingClientRect(); // Get position relative to the viewport
	  // Set the tooltip position based on the focused element's coordinates
	  tooltip.style.left = boundingRect.left + window.scrollX + "px";
	  tooltip.style.top = boundingRect.top + window.scrollY - tooltip.offsetHeight + "px";
	} else if (e.type === "mousemove") {
	  // Handle mouse event
	  tooltipSetPosition(e);
	}
  }

  function showTooltipNode(e, values, materials, name) {
	var tooltip = document.getElementById("tooltip");
	var colors = "rgb(30, 105, 105)"
	var innerHTML = tooltipContent(name, values, materials, colors);
	tooltip.innerHTML = innerHTML;
	tooltip.style.display = "block";
	tooltip.style.border = "1px solid rgb(30, 105, 105)";
	  if (e.type === "focus") {
		const boundingRect = e.target.getBoundingClientRect(); // Get position relative to the viewport
		// Set the tooltip position based on the focused element's coordinates
		tooltip.style.left = boundingRect.left + window.scrollX + "px";
		tooltip.style.top = boundingRect.top + window.scrollY - tooltip.offsetHeight + "px";
	  } else if (e.type === "mousemove") {
		// Handle mouse event
		tooltipSetPosition(e);
	  }
  }
  function hideTooltipSankey() {
	var tooltip = document.getElementById("tooltip");
	tooltip.style.display = "none";
  }


  function checkCardinalInUrl(params) {
	if (window.location.href.endsWith("#")) {
		const newURL = window.location.href.slice(0, -1);
		window.location.replace(newURL);
	  }
  }

  function enableScreenREader(params) {
	const titleElement = document.querySelector("text.highcharts-title")
	if (titleElement) {
	  titleElement.setAttribute('aria-hidden', 'false');
	}
  
	// Find and update the subtitle element
	const subtitleElement = document.querySelector('text.highcharts-subtitle');
	if (subtitleElement) {
	  subtitleElement.setAttribute('aria-hidden', 'false');
	}
	

	const container = document.querySelector(".highcharts-root")

	container.removeAttribute('aria-hidden');
  }

  function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
  
  //  function to check focus on building fase
  // document.addEventListener('keydown', function(event) {
  //   if (event.key === 'Tab') {
  //     var focusedElement = document.activeElement;
  //     console.log('Focused element:', focusedElement);
  //     focusedElement.style.outline = '2px solid red';
  //     // log(focusedElement)
  //   }
  // });



  