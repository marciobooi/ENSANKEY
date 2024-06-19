class ZoomControls {
    constructor() {
      this.zoomControls = document.createElement('div');
      this.zoomControls.id = 'zoomControls';
      this.zoomControls.className = 'zoomControls d-flex';
  
      this.zoomContent = document.createElement('div');
      this.zoomContent.id = 'zoom-content';
      this.zoomContent.className = 'ui-widget-content';
  
      this.zoomInButton = this.createZoomButton('btn-zoom ecl-button ecl-button--primary', 'in', 'Zoom in', '<i class="fas fa-plus"></i>');
      this.zoomResetButton = this.createZoomButton('btn-zoom ecl-button ecl-button--primary px-1 my-0', 'reset', '100% - reset zoom', '<span id="zoom-reset" style="font-size: x-small;">100%</span>');
      this.zoomOutButton = this.createZoomButton('btn-zoom ecl-button ecl-button--primary', 'out', 'Zoom out', '<i class="fas fa-minus"></i>');
  
      this.zoomContent.appendChild(this.zoomInButton);
      this.zoomContent.appendChild(this.zoomResetButton);
      this.zoomContent.appendChild(this.zoomOutButton);
  
      this.zoomControls.appendChild(this.zoomContent);
    }
  
    createZoomButton(className, rel, label, content) {
      const button = document.createElement('button');
      button.className = className;
      button.setAttribute('rel', rel);
      button.setAttribute('aria-label', label);
      button.setAttribute('type', 'button');
      button.innerHTML = content;
      return button;
    }
  
    addToDOM(targetElement) {
      const container = document.querySelector(targetElement);
      container.appendChild(this.zoomControls);
    }
  }
  

