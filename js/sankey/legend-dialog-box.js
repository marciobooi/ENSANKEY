var legendBoxNameSpace = {
    legendDialogBox: null,
    isLegendDisplayed: true,
    displayLegendByDefault: true,
    modalPosition: { bottom: '14%', left: '1%' }, // Default positions
    navbarHeight: 150, // Adjust this value according to your navbar height

    legendBox: function () {
        // Destroy existing modal if it exists
        destroyModal();

        // Create the modal content
        const modalContent = `
        <dialog id="legend-box-modal" aria-modal="true" class="ecl-modal draggable-modal" aria-labelledby="legend-modal-header" open>
                <div class="ecl-modal__content legend_container">
                    <header class="ecl-modal__header draggable-handle">
                        <div class="ecl-modal__header-content" id="legend-modal-header">${languageNameSpace.labels["LEGEND_TITLE"]}</div>
                    </header>
                    <div class="ecl-modal__body">
                        ${legendBoxNameSpace.fillLegendContent().outerHTML}
                    </div>
                </div>
        </dialog>`;

        // Append modal content to the body
        document.body.insertAdjacentHTML('beforeend', modalContent);

        // Ensure the modal is always open
        const modal = document.getElementById('legend-box-modal');
        if (modal) {
            modal.setAttribute('open', 'true'); // Ensures the dialog is always open

            // Apply the saved position or default
            modal.style.position = 'absolute';
            modal.style.bottom = legendBoxNameSpace.modalPosition.bottom;
            modal.style.left = legendBoxNameSpace.modalPosition.left;

            makeElementDraggable(modal);
        }

        // Adjust display settings
        legendBoxNameSpace.displayLegendByDefault = false;

        // Move the modal after the diagramContainer
        const div1 = document.getElementById('diagramContainer');
        const div2 = document.getElementById('legend-box-modal');
        if (div1 && div2) {
            insertAfter(div2, div1);
        }
    },

    fillLegendContent: function () {
        const content = document.createElement("ol");
        var fuelList = [];
        $.each(fuelMap(REF.fuels, REF.flowDisagg), function (idx, obj) {
            if (dataNameSpace.fuelListDrawn.contains(obj)) {
                fuelList.push(obj);
            }
        });
        content.className = "list-unstyled";
        content.id = "graph-legend-box-content";

        $.each(fuelList, function (idx, obj) {
            const elIcon = mkIconElement();
            const elText = mkFuelTextElement();
            const elAnchor = mkAnchorElement(obj);
            const elLegendItem = mkLegendElement();

            elAnchor.appendChild(elIcon);
            elAnchor.appendChild(elText);
            elLegendItem.appendChild(elAnchor);
            content.appendChild(elLegendItem);

            function mkLegendElement() {
                const el = document.createElement("li");
                el.className = "button-legend";
                return el;
            }
            function mkAnchorElement(obj) {
            
                const i = getFuelIdx(); // Ensure getFuelIdx is correctly defined
                const el = document.createElement("a");
                el.setAttribute("role", "button");
                el.className = "link-dark legend-text";
                el.href = "#";
                el.id = "legend-" + obj.toLowerCase();

                el.setAttribute("onclick", `nsMainModal.legendDialogBox('${obj}', ${i}, 'legend-box-modal'); return false;`);

                return el;
            }
            
            // Ensure getFuelIdx is defined and returns an appropriate index
            function getFuelIdx() {
                // Your logic to get the fuel index
                return 0; // Placeholder, replace with actual logic
            }
            
            // Example usage
            document.body.appendChild(mkAnchorElement('TOTAL'));
            

            function mkFuelTextElement() {
                const fuelTextEl = document.createElement("span");
                fuelTextEl.className = "title";
                fuelTextEl.innerHTML = getFuelName(obj);
                return fuelTextEl;
            }

            function mkIconElement() {
                const legendIcon = document.createElement("span");
                legendIcon.className = "icon-legend-color";
                if (!REF.flowDisagg) {
                    legendIcon.classList.add("icon-legend-color__total");
                }
                if (!dataNameSpace.isFuelFamilySelected) {
                    const elIconImage = mkIconImgElement();
                    legendIcon.appendChild(elIconImage);
                }
                legendIcon.style.backgroundColor = getFuelColor();
                return legendIcon;
            }

            function mkIconImgElement() {
                const fuelImg = document.createElement("img");
                fuelImg.className = "icon-legend";
                fuelImg.alt = "";
                fuelImg.src = "img/fuel-family/" + obj + ".png";
                return fuelImg;
            }

            function getFuelColor() {
                const i = getFuelIdx();
                let colour =
                    REF.highlight !== "_" && !REF.highlight.contains(i.toString())
                        ? "rgb(150, 176, 176)"
                        : fuelColors[obj];
                colour = REF.flowDisagg ? colour : fuelColors["TOTAL"];
                return colour;
            }

            function getFuelIdx() {
                return fuelMap(REF.fuels, dataNameSpace.isAllFlowsDisaggregated).indexOf(obj);
            }
        });

        return content;
    },

    drawFuelFamily: function (idFuel) {
        if (idFuel.toString() == "TOTAL") {
            dataNameSpace.isAllFlowsDisaggregated = true;
        } else {
            dataNameSpace.isFuelFamilySelected = true;
        }
        REF.fuels = idFuel.toString();
        REF.highlight = "_";

        if (timelineNameSpace.isAutoplayLoaded) {
            timelineNameSpace.resetAutoplayTimeline();
        } else {
            sankeyNameSpace.drawDiagram();
        }
    },

    reduceLegendSize: function () {
        // $('#legend-box-modal .button-legend .icon-legend-color').css({ "height": "20px", "width": "20px" });
        // $('#legend-box-modal .button-legend .icon-legend').css({ "height": "15px", "margin-left": "3px", "margin-top": "3px" });
        // $('#legend-box-modal .button-legend .title').css({ "font-size": "10px" });
        // $('#legend-box-modal .button-legend').css({ "height": "20px" });
    }
};

// Helper function to insert an element after another element
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Helper function to destroy the modal if it exists
function destroyModal() {
    const modal = document.getElementById('legend-box-modal');
    if (modal) {
        // Save the current position
        legendBoxNameSpace.modalPosition.bottom = modal.style.bottom;
        legendBoxNameSpace.modalPosition.left = modal.style.left;

        modal.close(); // Close the modal
        modal.remove(); // Remove the modal from the DOM
    }
}

// Helper function to make the modal draggable
function makeElementDraggable(element) {
    const header = element.querySelector('.draggable-handle');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = window.innerHeight - e.clientY - parseInt(window.getComputedStyle(element).bottom);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.bottom = `${window.innerHeight - e.clientY - offsetY}px`;
            element.style.position = 'absolute';
        }
    }

    function onMouseUp() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
    
            // Get the viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
    
            // Get the modal dimensions
            const modalRect = element.getBoundingClientRect();
    
            // Adjust the position if it's outside the viewport
            let bottom = parseInt(element.style.bottom);
            let left = parseInt(element.style.left);
    
            if (modalRect.left < 0) {
                left = 15;
            } else if (modalRect.right > viewportWidth) {
                left = (viewportWidth - modalRect.width)- 100;
            } else {
                left = modalRect.left;
            }
    
            if (modalRect.bottom > viewportHeight) {
                bottom = 100;              
            } else if (modalRect.top < legendBoxNameSpace.navbarHeight) {
                bottom = viewportHeight - modalRect.height - legendBoxNameSpace.navbarHeight;
            } else {
                bottom = viewportHeight - modalRect.bottom;
            }
    
            // Convert the positions to percentages
            left = (left / viewportWidth) * 100;
            bottom = (bottom / viewportHeight) * 100;
    
            // Apply the new position
            element.style.bottom = `${bottom}%`;
            element.style.left = `${left}%`;
    
            // Save the updated position
            legendBoxNameSpace.modalPosition.bottom = `${bottom}%`;
            legendBoxNameSpace.modalPosition.left = `${left}%`;
        }
    }
    
}

