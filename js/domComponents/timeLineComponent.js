class HorizontalTimeline {
    constructor() {
      this.horizontalTimeline = document.createElement('div');
      this.horizontalTimeline.className = 'horizontal-timeline';
  
      this.autoplayTimeline = document.createElement('div');
      this.autoplayTimeline.id = 'autoplay-timeline';
      this.autoplayTimeline.className = 'autoplay';
      this.autoplayTimeline.setAttribute('tabindex', '0');
  
      const eventsWrapper = document.createElement('div');
      eventsWrapper.className = 'events-wrapper';
  
      const events = document.createElement('div');
      events.className = 'events';
  
      this.listYears = document.createElement('ol');
      this.listYears.id = 'list-years';
      this.listYears.setAttribute('aria-label', 'Timeline: click to filter the graph by year');
  
      const fillingLine = document.createElement('span');
      fillingLine.className = 'filling-line';
      fillingLine.setAttribute('aria-hidden', 'true');
  
      const timeline = document.createElement('span');
      timeline.className = 'timeline';
  
      events.appendChild(this.listYears);
      events.appendChild(fillingLine);
      events.appendChild(timeline);
  
      eventsWrapper.appendChild(events);
  
      this.horizontalTimeline.appendChild(this.autoplayTimeline);
      this.horizontalTimeline.appendChild(eventsWrapper);
    }
  
    addToDOM(targetElement) {
      // const container = document.querySelector(targetElement);
      // container.appendChild(this.horizontalTimeline);
    }
  }
  