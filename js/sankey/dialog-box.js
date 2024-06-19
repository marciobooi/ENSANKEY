//dialog box position object
var dialogBoxPosition = function (x, y) {
	this.x = x;
	this.y = y;
};

//calculate the dialog box position to display it all the time inside the diagram wether for the extrem right and bottom nodes
function calculateDialogBoxPosition(x, y, width, height) {
	var rightSpace = $(window).width() - x;
	var bottomSpace = imgHeight - y;
	var newX,
	newY;

	if (rightSpace < width) {
		newX = x - width;
		if (bottomSpace < height) {
			newY = y - height;
		} else {
			newY = y - 20;
		}
	} else if (bottomSpace < height) {
		newX = x;
		newY = y - height;
	} else {
		newX = x;
		newY = y;
	}
	return new dialogBoxPosition(newX, newY);
}

function closeDialogBox(box) {
	// if (timeGraphs[nodeboxNameSpace.idClickedNode] !== undefined) {
	// 	delete timeGraphs[nodeboxNameSpace.idClickedNode];
	// }
	// box.close();
	// box.destroy();
}