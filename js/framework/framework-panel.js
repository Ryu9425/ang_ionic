(function(window, document, framework) {

  var 
  x,
  lockInWidthStyles,
  isLockInWidthSet,
  isPanelOpen,
  panelReferences = {},
  timeout,
  className,

  PANEL_ACTIVE = "panel-active",
  PANEL_OPENED = "panel-opened";


  function click(e) {
    if(e.target.dataset.togglePanel) {
      logEvent("click");
      if(isPanelOpen) {
        // there's a panel open, close it if the page location changed
        closePanel();
      } else {
        openPanel(e.target.dataset.togglePanel);
      }
      return true;
    }
  }

  function touchEnd(e) {
    if(click(e)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function autoClose() {
    if(isPanelOpen) {
      logEvent("autoClose");
      // there's a panel open, close it if the page location changed
      closePanel();
    }
  }

  function openPanel(panelId) {
    logEvent("openPanel: " + panelId);

    // see if there is an element with this id
    var panel = getPanelElement(panelId);
    if(panel) {
      // this element is a panel, open it!

      // find all the panels that are or were active
      var panelsActive = document.getElementsByClassName(PANEL_ACTIVE);

      // remove the panel-active css classes from each of the previously opened panels
      for(x=0; x<panelsActive.length; x++) {
        className = panelsActive[x].className.replace(PANEL_ACTIVE, "").trim();
        panelsActive[x].className = className;
      }

      // open the panel we want open by adding the panel-active css classes
      panel.className += " " + PANEL_ACTIVE;

      // manually lock in all the widths of the page which the panel will slide over
      // do all of this in one DOM manipulation
      // This makes it easy to modify all of the elements in one call, 
      // and also undo all of the element widths in one call
      // the css added below makes something like:  #my-panel ~ * {width: 420px !important}
      // basically any sibling elements to the panel should lock in the document width
      setLockInWidthStyles();

      // add to <body> that a panel is open
      document.body.className += " " + PANEL_OPENED;

      // remember that a panel is currently open
      isPanelOpen = true;
    }
  }

  function closePanel() {
    logEvent("closePanel");

    // there is a panel already open, so close it
    isPanelOpen = false;

    // note: do not remove the panel-active class from panel
    // the panel should stay displayed as it panel closes
    // find the element with panel-open class
    var openedPanels = document.getElementsByClassName(PANEL_OPENED);

    // remove the panel-opened css classes from each of the previously opened panels
    for(x=0; x<openedPanels.length; x++) {
      // if this panel is the same last opened panel then don't remove the css class yet
      className = openedPanels[x].className.replace(PANEL_OPENED, "").trim();
      openedPanels[x].className = className;
    }

    // remove from <body> that no panels should be open
    className = document.body.className.replace(PANEL_OPENED, "").trim();
    document.body.className = className;

    // remove the locked in widths
    timeout = setTimeout(removeLockInWidthStyles, 300);
  }

  function setLockInWidthStyles() {
    if(isLockInWidthSet) return;

    clearTimeout(timeout);

    var styles = "section>header,section>main,section>footer {width:" + document.width + "px !important}";

    if(!lockInWidthStyles) {
      lockInWidthStyles = document.createElement("style");
      lockInWidthStyles.innerHTML = styles;
      document.head.appendChild(lockInWidthStyles);
    } else {
      lockInWidthStyles.innerHTML = styles;
    }
    isLockInWidthSet = true;
  }

  function removeLockInWidthStyles() {
    lockInWidthStyles.innerHTML = "";
    isLockInWidthSet = false;
  }

  function getPanelElement(panelId) {
    // used to minimize DOM lookups
    if( !panelReferences[panelId] ) {
      panelReferences[panelId] = document.querySelector( "[data-panel='" + panelId + "']" );
    }
    return panelReferences[panelId];
  }

  var logEvent = function(data) {
    var e = document.getElementById('event-log');
    var l = document.createElement('div');
    l.innerHTML = data;
    if(e.childNodes.length > 10) {
      e.innerHTML = "";
    }
    e.appendChild(l);
  }

  window.addEventListener('click', click, false);
  window.addEventListener('touchend', touchEnd, false);

  window.addEventListener("resize", autoClose, false);
  window.addEventListener("popstate", autoClose, false);

})(this, document, FM = this.FM || {});
