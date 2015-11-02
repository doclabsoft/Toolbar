/**
 * @overview Toolbar renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 2.0
 */

goog.provide('DD.ui.controls.renderer.Toolbar');

goog.require('DD.ui.controls.Group');
goog.require('DD.ui.controls.renderer.Group_Flat');
goog.require('DD.ui.controls.renderer.Group_Expandable');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Group_Flat
 */
DD.ui.controls.renderer.Toolbar = function() {
  DD.ui.controls.renderer.Group_Flat.call(this);
};
goog.inherits(DD.ui.controls.renderer.Toolbar, DD.ui.controls.renderer.Group_Flat);
goog.addSingletonGetter(DD.ui.controls.renderer.Toolbar);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Toolbar.CSS_CLASS = 'DD-toolbar';

/**
 * @enum {DD.ui.controls.renderer.Group}
 */
DD.ui.controls.renderer.Toolbar.GroupRenderer = {
  FLAT: DD.ui.controls.renderer.Group_Flat.getInstance(),
  EXPANDABLE: DD.ui.controls.renderer.Group_Expandable.getInstance()
  // DROPDOWN: DD.ui.controls.renderer.Group_Dropdown.getInstance()
};


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Toolbar.prototype */
var prototype = DD.ui.controls.renderer.Toolbar.prototype;
var superClass_ = DD.ui.controls.renderer.Toolbar.superClass_;
var FLAT = DD.ui.controls.renderer.Toolbar.GroupRenderer.FLAT;
var EXPANDABLE = DD.ui.controls.renderer.Toolbar.GroupRenderer.EXPANDABLE;
var DisplayMode = DD.ui.controls.Group.DisplayMode;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Toolbar.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {

  var element = superClass_.createDom.call(this, component);

  var content = component.getContentElement();
  goog.dom.classes.add(element, DD.ui.controls.renderer.Toolbar.CSS_CLASS);
  goog.dom.classes.add(content, DD.ui.controls.renderer.Toolbar.CSS_CLASS + '__content');
  this.setScrollOrientation(component, component.getScrollOrientation());

  return element;
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @param {DD.ui.controls.Toolbar.ScrollOrientation} orientation
 * @public
 */
prototype.setScrollOrientation = function(component, orientation) {
};

/**
 * @inheritdoc
 */
prototype.onChange = function(component, event) {
  superClass_.onChange.call(this, component, event);

  component.forEach(function(child) {

    var renderer = child.getRenderer();

    if (renderer.POPUP && renderer.setPopupStrategy) {
      renderer.setPopupStrategy(child,
          this.popupStrategyInsideToolbar.bind(renderer, component));
    }

    if (renderer.EXPANDABLE && renderer.setExpandStrategy) {
      if (child.getDisplayMode && child.getDisplayMode() === DisplayMode.AUTO)
        renderer.setExpandStrategy(child, this.expandStrategyNextRow);
    }
  }.bind(this));

  this.resize(component);
};


// ------------------------------
// Special methods for smart resizing.
// ------------------------------

/**
 * @inheritdoc
 */
prototype.resize = function(component) {
  var resizeThrottle = component.$cache('resizeThrottle');
  if (!resizeThrottle) {
    resizeThrottle = new goog.Throttle(this.resizeInternal.bind(this, component), 150);
    component.$cache(resizeThrottle);
  }
  resizeThrottle.fire();
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @protected
 */
prototype.resizeInternal = function(component) {
};

/**
 * @inheritdoc
 */
prototype.resetStyles = function(component, opt_options) {
  this.resetGroupRenderers(component);
  superClass_.resetStyles.call(this, component, opt_options);
};

/**
 * @inheritdoc
 */
prototype.createSize = function(component, opt_options) {
  var size = superClass_.createSize.call(this, component, opt_options);
  size.getGroup().setPaddings(0);
  return size;
};

/**
 * @param {DD.ui.controls.Toolbar} toolbar
 * @param {DD.ui.controls.Group} toolbar
 * @protected
 */
prototype.collapseGroup = function(component, group) {

  group.beginUpdate();

  var renderer = group.getRenderer();
  if (renderer === FLAT) {
    renderer.clearSize(group, true);
    group.changeRenderer(EXPANDABLE);
    group.getRenderer().setExpandStrategy(group, this.expandStrategyNextRow);
  }

  group.endUpdate(false);
};

/**
 * @param {DD.ui.Component} component
 * @protected
 */
prototype.closeOpenedChildren = function(component) {

  var openedChildren = [];
  component.forEach(function(child) {

    if (!child.isOpened())
      return;
    openedChildren.push(child);
    child.beginUpdate();
    child.setOpened(false);
    child.endUpdate(false);

  });
  component.$cache('openedChildren', openedChildren);
};

/**
 * @param {DD.ui.Component} component
 * @protected
 */
prototype.openClosedChildren = function(component) {

  var openedChildren = component.$cache('openedChildren');
  if (!openedChildren || !openedChildren.length)
    return;

  for (i=0; i<openedChildren.length; i++) {
    openedChildren[i].beginUpdate();
    openedChildren[i].setOpened(true);
    openedChildren[i].endUpdate(false);
  }
};

/**
 * @param {DD.ui.Component} component
 * @protected
 */
prototype.resetGroupRenderers = function(component) {

  var element = component.getElement();
  DD.ui.utils.hideForDomChanging(element, function(element) {
    component.forEach(function(item) {

      if (!(item instanceof DD.ui.controls.Group))
        return;
      if (item.getDisplayMode() !== DisplayMode.AUTO)
        return;

      if (item.getRenderer() !== FLAT) {
        item.beginUpdate();
        item.changeRenderer(FLAT);
        item.endUpdate(false);
      }
    });
  });
};

/**
 * @param {DD.ui.controls.Group} group
 * @param {boolean} open
 * @protected
 */
prototype.expandStrategyNextRow = function(group, open) {
  var element = group.getElement();
  var container = element.parentNode;
  var content = group.getContentElement();
  if (open) {
    if (content.parentNode !== container)
      container.appendChild(content);
  } else {
    if (content.parentNode === container)
      container.removeChild(content);
  }
};

/**
 * @param {DD.ui.controls.Group} group
 * @param {boolean} open
 * @protected
 */
prototype.expandStrategyBreakRow = function(group, open) {
  var element = group.getElement();
  var content = group.getContentElement();
  open
    ? goog.dom.insertSiblingAfter(content, element)
    : goog.dom.removeNode(content);
};

/**
 * @param {DD.ui.controls.Toolbar} toolbar
 * @param {DD.ui.controls.Component} component
 * @param {boolean} open
 * @protected
 */
prototype.popupStrategyInsideToolbar = function(toolbar, component, open) {

  var element = component.getElement();
  var content = component.getContentElement();
  var popup = component.$cache('popup');

  if (open) {
    toolbar.getElement().appendChild(content);
    content.style.minWidth = element.offsetWidth + 'px';
    if (popup && popup.setVisible)
      popup.setVisible(true);
  } else {
    if (popup && popup.setVisible)
      popup.setVisible(false);
    goog.dom.removeNode(content);
  }
};

}); // goog.scope
