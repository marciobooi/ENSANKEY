var exportImageNameSpace = {  
	exportDiagramAsPNG: function () {
			  var p = {
				title: "Information",
				body: languageNameSpace.labels["MSG_29"], 
				footer: false,
				ssKey: "info-MSG_30",
				checkbox: false,
				launcherId: "tb-export-btn",
			  };
		  
			  messageboxNameSpace.messageModalBs(p);
		  
			  sankeyToolsNameSpace.resetZoomOnExport();
		  
			  sankeyToolsNameSpace.resetZoom();
		  
			  const svgContainer = document.getElementById('svg-container');
		  
			  const originalFontSize = '10.34';
		  
			  const fontSize = 13; // Adjust the font size as needed
		  
			  // Update the font size for labels
			  d3.select(svgContainer)
				.selectAll('.labelNode')
				.style('font-size', fontSize + 'px');  
		  
			  // Get the dimensions of the SVG container
			  const { width, height } = svgContainer.getBoundingClientRect();
		  
			  // Create a new canvas element to render the SVG and legend as an image
			  const canvas = document.createElement('canvas');
			  canvas.width = width;
			  canvas.height = height;
		  
			  // Get the SVG content as a string
			  const svgString = new XMLSerializer().serializeToString(svgContainer);
		  
			  // Create an SVG image element
			  const svgImage = new Image();
			  svgImage.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
		  
			  // Wait for the SVG image to load
			  svgImage.onload = function () {
				// Render the SVG image onto the canvas
				const context = canvas.getContext('2d');
				context.drawImage(svgImage, 0, 0, width, height);
		  
				// Create a new canvas element for the legend, pretitle, title, and subtitle
				const fullCanvas = document.createElement('canvas');
				fullCanvas.width = width;
				fullCanvas.height = height;
		  
				const fullContext = fullCanvas.getContext('2d');
		  
				// Get the pretitle, title, and subtitle
				var preTitle = languageNameSpace.labels["EXPORT_HEADER_TITLE"];
				var title = document.querySelector("#dimension-labels > i.fas.fa-globe > span.sankey-category.geo.text-wrap").innerText;
				var subtitle = document.querySelector("#dimension-labels > i.fas.fa-swatchbook > span.sankey-category.units.text-wrap").innerText;
		  
				// Set the font styles for pretitle, title, and subtitle
				const preTitleFont = 'bold 12px Arial';
				const titleFont = '10px Arial';
				const subtitleFont = '10px Arial';
		  
				// Calculate the dimensions for pretitle, title, and subtitle
				const preTitleWidth = fullContext.measureText(preTitle).width;
				const preTitleX = (fullCanvas.width - preTitleWidth) / 2;
				const preTitleY = 7;
		  
				const titleWidth = fullContext.measureText(title).width;
				const titleX = (fullCanvas.width - titleWidth) / 2;
				const titleY = 12;
		  
				const subtitleWidth = fullContext.measureText(subtitle).width;
				const subtitleX = (fullCanvas.width - subtitleWidth) / 2;
				const subtitleY = 17;
		  
				// Render the pretitle, title, and subtitle onto the full canvas
				fullContext.font = preTitleFont;
				fullContext.fillStyle = 'black';
				fullContext.fillText(preTitle, preTitleX, preTitleY);
		  
				fullContext.font = titleFont;
				fullContext.fillText(title, titleX, titleY);
		  
				fullContext.font = subtitleFont;
				fullContext.fillText(subtitle, subtitleX, subtitleY);
		  
				// Draw the SVG image onto the full canvas
				fullContext.drawImage(svgImage, 0, 0, width, height);
		  
				// Get the legend container element
				const legendContainer = document.querySelector('#legend-box-modal > div');
		  
				// Create a new canvas element for the legend
				const legendCanvas = document.createElement('canvas');
		  
				// Set the dimensions of the legend canvas
				legendCanvas.width = legendContainer.offsetWidth;
				legendCanvas.height = legendContainer.offsetHeight;
		  
				// Render the legend content onto the canvas
				const legendContext = legendCanvas.getContext('2d');
				legendContext.fillStyle = null; // Set the background color of the legend
				legendContext.fillRect(0, 0, legendCanvas.width, legendCanvas.height);
		  
				// Convert the legend container element to an image and draw it on the canvas
				html2canvas(legendContainer).then(function (legendImage) {
				  legendContext.drawImage(legendImage, 0, 0);
		  
				  // Draw the legend image onto the full canvas
				  const legendX = 10; // Adjust the X-coordinate as needed
				  const legendY = fullCanvas.height - legendImage.height - 10; // Adjust the Y-coordinate as needed
				  fullContext.drawImage(legendCanvas, legendX, legendY);
		  
				  // Load the logo image
				  var logoImage = new Image();
				  logoImage.src = 'img/eurostat-logo.png';
		  
				  logoImage.onload = function () {
					var logoWidth = 25; // Adjust the logo width as needed
					var logoHeight = (logoImage.height * logoWidth) / logoImage.width;
		  
					// Calculate the x-coordinate for the bottom right position
					var logoX = fullCanvas.width - logoWidth - 5; // Adjust the margin as needed
		  
					// Calculate the y-coordinate for the bottom right position
					var logoY = fullCanvas.height - logoHeight - 5; // Adjust the margin as needed
		  
					// Draw the logo image onto the full canvas
					fullContext.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
		  
					// Convert the full canvas to a base64-encoded PNG image
					const fullImageData = fullCanvas.toDataURL('image/png');
		  
					// Create a new canvas for the final image with pretitle, title, subtitle, SVG, legend, and logo
					const finalCanvas = document.createElement('canvas');
					finalCanvas.width = fullCanvas.width;
					finalCanvas.height = fullCanvas.height;
		  
					const finalContext = finalCanvas.getContext('2d');
		  
					// Draw the full canvas onto the final canvas
					finalContext.drawImage(fullCanvas, 0, 0);
		  
					// Save the final canvas as a PNG image
					const downloadLink = document.createElement('a');
					downloadLink.href = finalCanvas.toDataURL('image/png');
					downloadLink.download = 'eurostat-sankey-diagram.png';
					downloadLink.click();
				  };
				});
		  
				// Reset the font size for labels
				d3.select(svgContainer)
				  .selectAll('.labelNode')
				  .style('font-size', originalFontSize + 'px');
		  
				setTimeout(() => {
				  $("sankey-secondary-modal").modal("hide");
				  $("#sankey-secondary-modal").hide();
				  $('.modal-backdrop').hide();
				  $("body").removeClass("modal-open");  
				}, 1500);
			  };
			},
		  };
		  
		  