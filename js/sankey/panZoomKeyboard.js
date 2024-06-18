window.addEventListener("DOMContentLoaded", () => {
  const gElement = document.getElementById("zoom");
  let translateX = 0, translateY = 0, scale = 1;

  const updateTransformValues = () => {
    const transformAttr = gElement.getAttribute("transform") || "";
    const translateMatch = transformAttr.match(/translate\((-?\d+\.?\d*),(-?\d+\.?\d*)\)/);
    const scaleMatch = transformAttr.match(/scale\((-?\d+\.?\d*)\)/);

    translateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
    translateY = translateMatch ? parseFloat(translateMatch[2]) : 0;
    scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
  };

  const moveAmount = 10;

  const actions = {
    ArrowUp: () => (translateY -= moveAmount),
    ArrowDown: () => (translateY += moveAmount),
    ArrowLeft: () => (translateX -= moveAmount),
    ArrowRight: () => (translateX += moveAmount),
    "+": () => sankeyToolsNameSpace.initZoom("in"),
    "-": () => sankeyToolsNameSpace.initZoom("out"),
  };

  const applyTransform = () => {
    gElement.setAttribute("transform", `translate(${translateX},${translateY})scale(${scale})`);
  };

  const handleKeyDown = (event) => {
    updateTransformValues();

    if (event.key in actions) {
      actions[event.key]();
      applyTransform();
      updateTransformValues();
      event.preventDefault();
    }
  };

  updateTransformValues();
  applyTransform();

  document.addEventListener("keydown", handleKeyDown);
});
