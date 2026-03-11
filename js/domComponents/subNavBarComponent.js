class SubNavbar {
    constructor() {
      this.subNavbar = document.createElement('nav');
      this.subNavbar = document.createElement('nav');
      this.subNavbar.setAttribute('aria-label', 'Main toolbar');
      this.subNavbar.setAttribute('id', 'mainToolbar');
      this.subNavbar.setAttribute('class', 'navbar navbar-expand-sm navbar-light bg-light');
  

      this.subNavbar.innerHTML = `
             
          <div class="container-fluid">

            <div id="dimension-labels" class="flex-grow-1 data-loading">
              <div class="flex">
                <i class="fas fa-globe" focusable="false"></i>
                <span class="visually-hidden">Selected country</span>
                <span class="sankey-category geo text-wrap"></span>
              </div>
              <div class="flex">
                <i class="fas fa-swatchbook" focusable="false"></i>
                <span class="visually-hidden">Selected unit</span>
                <span class="sankey-category units text-wrap"></span>
              </div>  
            </div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
              aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarScroll">
              <ul id="sankeyToolbox"
                role="toolbar" aria-label="Sankey graph toolbox"
                class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll"
                style="--bs-scroll-height: 50vw;">
                <div id="btnGroup"></div>
              </ul>
            </div>
          </div>`;
        
    }
  
    addToDOM(targetElement) {
      const container = document.querySelector(targetElement);
      container.appendChild(this.subNavbar);
    }
  }





  