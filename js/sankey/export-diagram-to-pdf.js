var exportToPDFNameSpace = {
  /*
   this is used on the click on Save diagram as pdf
   create an image and then use the jspdf library to generate the pdf
   */
  exportDiagramAsPDF: function () {
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

    // Create a new jsPDF instance
    const doc = new jsPDF('landscape');

    var preTitle = languageNameSpace.labels["EXPORT_HEADER_TITLE"];
    var title = document.querySelector("#dimension-labels > i.fas.fa-globe > span.sankey-category.geo.text-wrap").innerText;
    var subtitle = document.querySelector("#dimension-labels > i.fas.fa-swatchbook > span.sankey-category.units.text-wrap").innerText;

    // Add the title and subtitle to the PDF
    doc.setFontSize(12);
    doc.setFontStyle('bold');
    var preTitleWidth = doc.getStringUnitWidth(preTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    var preTitleX = (doc.internal.pageSize.getWidth() - preTitleWidth) / 2;
    doc.text(preTitle, preTitleX, 7);

    doc.setFontSize(10);
    doc.setFontStyle('normal');
    var titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    var titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(title, titleX, 12);

    var subtitleWidth = doc.getStringUnitWidth(subtitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    var subtitleX = (doc.internal.pageSize.getWidth() - subtitleWidth) / 2;
    doc.text(subtitle, subtitleX, 17);

    // Create a canvas element to render the SVG
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

      // Convert the canvas to a base64-encoded PNG image
      const image = canvas.toDataURL('image/png');

      // Calculate the dimensions to fit the entire chart on a single page
      const chartWidth = doc.internal.pageSize.getWidth();
      const chartHeight = chartWidth * (height / width);

      // Calculate the horizontal center position
      const chartX = (doc.internal.pageSize.getWidth() - chartWidth) / 2;

      // Add the image to the PDF document, centering it horizontally
      doc.addImage(image, 'PNG', chartX, 40, chartWidth, chartHeight);

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

    // Convert the legend canvas to a base64-encoded PNG image
    const legendImageData = legendCanvas.toDataURL('image/png');

    // Add the legend image to the PDF document
    
  // Calculate the dimensions to fit the entire legend on a single page
  const legendWidth = 35;
  const legendHeight = (legendImage.height * legendWidth) / legendImage.width;


  const legendX = 10; // Adjust the X-coordinate as needed
  const legendY = doc.internal.pageSize.getHeight() - legendHeight - 10; // Adjust the Y-coordinate as needed


// Add the legend image to the PDF document
doc.addImage(legendImageData, 'PNG', legendX, legendY, legendWidth, legendHeight);

    // Load the logo image
    var logoImage = new Image();
    logoImage.src = 'img/eurostat-logo.png';
    
    logoImage.onload = function () {
      var logoWidth = 25; // Adjust the logo width as needed
      var logoHeight = (logoImage.height * logoWidth) / logoImage.width;
    
      // Calculate the x-coordinate for the bottom right position
      var logoX = doc.internal.pageSize.getWidth() - logoWidth - 5; // Adjust the margin as needed
    
      // Calculate the y-coordinate for the bottom right position
      var logoY = doc.internal.pageSize.getHeight() - logoHeight - 5; // Adjust the margin as needed
    
      // Add the logo image to the PDF
      doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
    
      // Save the PDF document
      doc.save('eurostat-sankey-diagram.pdf');
    };


    // Update the font size for labels
    d3.select(svgContainer)
    .selectAll('.labelNode')
    .style('font-size', originalFontSize + 'px');


    
    setTimeout(() => {
        $("sankey-secondary-modal").modal("hide");
        $("#sankey-secondary-modal").hide();
        $('.modal-backdrop').hide();
        $("body").removeClass("modal-open");  
    }, 1500);

  });
};
},
};


