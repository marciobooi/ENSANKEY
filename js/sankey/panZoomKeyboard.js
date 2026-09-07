window.addEventListener("DOMContentLoaded", () => {
  let translateX = 0, translateY = 0, scale = 1;

  // The zoom group is appended once the diagram is built, and during autoplay its
  // id carries the frame suffix ("zoom", "zoom202400", ...), so resolve the current
  // one on every interaction instead of caching a node that does not exist yet.
  const getZoomGroup = () => {
    if (typeof sankeyNameSpace !== "undefined" && sankeyNameSpace.svgSankey) {
      const node = sankeyNameSpace.svgSankey.node();
      if (node) return node;
    }
    const id = typeof containerId === "string" ? containerId : "";
    return document.getElementById("zoom" + id) || document.getElementById("zoom");
  };

  const updateTransformValues = () => {
    const gElement = getZoomGroup();
    if (!gElement) return false;

    const transformAttr = gElement.getAttribute("transform") || "";
    const translateMatch = transformAttr.match(/translate\((-?\d+\.?\d*),(-?\d+\.?\d*)\)/);
    const scaleMatch = transformAttr.match(/scale\((-?\d+\.?\d*)\)/);

    translateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
    translateY = translateMatch ? parseFloat(translateMatch[2]) : 0;
    scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    return true;
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
    const gElement = getZoomGroup();
    if (!gElement) return;

    gElement.setAttribute("transform", `translate(${translateX},${translateY})scale(${scale})`);

    // keep d3's zoom behaviour in sync, otherwise the next drag or zoom click
    // snaps the diagram back to the position it had before the keyboard pan
    if (typeof sankeyNameSpace !== "undefined" && sankeyNameSpace.zoom) {
      sankeyNameSpace.zoom.translate([translateX, translateY]).scale(scale);
    }
  };

  const isFormField = (target) =>
    !!target &&
    (/^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName) || target.isContentEditable);

  const handleKeyDown = (event) => {
    if (!(event.key in actions) || isFormField(event.target)) return;

    // zoom buttons live in sankey-tools.js, which may not be loaded yet
    if ((event.key === "+" || event.key === "-") && typeof sankeyToolsNameSpace === "undefined") return;

    // nothing to pan until the diagram has been drawn
    if (!updateTransformValues()) return;

    actions[event.key]();
    applyTransform();
    updateTransformValues();
    event.preventDefault();
  };

  document.addEventListener("keydown", handleKeyDown);
});
