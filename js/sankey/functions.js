var functionsNameSpace = {
  /**
   * Function created specifically for the extraction of x and y for the flow labels
   * @param {*} str the path of the flow
   */
  getTheXY: function (str) {
    var arr = str.split(" "),
			x = parseFloat(arr[1]) + 40,
			xMoveToRight = x + 160,
			y = parseFloat(arr[2]),
			yMoveUp = y - 50;
    return { x, xMoveToRight, y, yMoveUp };
  },

  /**
   * Sets the flow value to a right position, in case one is on top of the other
   * @param {*} str A string (the path of the flow) to retrieve the  values from
   */
  getTheXYShiftToRight: function (str) {
    var newX, newY;
    var arr = [];
    arr.push(str.split(" "));
    var XY = arr[0][1].split(",");
    for (let index = 1; index < arr[0].length; index++) {
      if (arr[0][index - 1] === "L") {
        var lr = arr[0][index].split(",");
        if (lr[0] != lr[1]) {
          newX = lr[0] / 1.2;
          newY = lr[1];
        }
      }
    }
    var xMoveToRight = newX + 200;
    var yMoveUp = newY - 50;
    return { newX, newY, xMoveToRight, yMoveUp };
  }

};
