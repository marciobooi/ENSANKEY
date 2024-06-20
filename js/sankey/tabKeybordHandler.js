class TabsAutomatic {
  constructor(groupNode) {
    this.tablistNode = groupNode;
    this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
    this.tabpanels = this.tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

    this.firstTab = this.tabs[0];
    this.lastTab = this.tabs[this.tabs.length - 1];

    this.tabs.forEach((tab, index) => {
      tab.tabIndex = -1;
      tab.setAttribute('aria-selected', 'false');
      this.tabpanels[index].classList.add('is-hidden');

      tab.addEventListener('keydown', this.onKeydown);
      tab.addEventListener('click', this.onClick);
    });

    this.setSelectedTab(this.firstTab, false);
  }

  setSelectedTab = (currentTab, setFocus = true) => {
    this.tabs.forEach((tab, index) => {
      if (currentTab === tab) {
        tab.setAttribute('aria-selected', 'true');
        tab.removeAttribute('tabindex');
        this.tabpanels[index].classList.remove('is-hidden');
        if (setFocus) {
          tab.focus();
        }
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.tabIndex = -1;
        this.tabpanels[index].classList.add('is-hidden');
      }
    });
  }

  setSelectedToPreviousTab = (currentTab) => {
    const currentIndex = this.tabs.indexOf(currentTab);
    const previousTab = currentTab === this.firstTab ? this.lastTab : this.tabs[currentIndex - 1];
    this.setSelectedTab(previousTab);
  }

  setSelectedToNextTab = (currentTab) => {
    const currentIndex = this.tabs.indexOf(currentTab);
    const nextTab = currentTab === this.lastTab ? this.firstTab : this.tabs[currentIndex + 1];
    this.setSelectedTab(nextTab);
  }

  /* EVENT HANDLERS */

  onKeydown = (event) => {
    const currentTab = event.currentTarget;
    let flag = false;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        this.setSelectedToPreviousTab(currentTab);
        flag = true;
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        this.setSelectedToNextTab(currentTab);
        flag = true;
        break;

      case 'Home':
        this.setSelectedTab(this.firstTab);
        flag = true;
        break;

      case 'End':
        this.setSelectedTab(this.lastTab);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onClick = (event) => {
    this.setSelectedTab(event.currentTarget);
  }
}
