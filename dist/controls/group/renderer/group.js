/**
 * Toolbar renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Group');

goog.require('DD.ui.controls.renderer');
goog.require('DD.ui.renderer.List');
goog.require('DD.ui.controls.SizeHelper.ItemSize');
goog.require('DD.ui.controls.SizeHelper.GroupSize');
goog.require('DD.ui.utils');
goog.require('goog.dom.classes');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.renderer.List
 */
DD.ui.controls.renderer.Group = function() {
  DD.ui.renderer.List.call(this);
};
goog.inherits(DD.ui.controls.renderer.Group, DD.ui.renderer.List);
goog.addSingletonGetter(DD.ui.controls.renderer.Group);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Group.CSS_CLASS = 'DD-group';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Group.prototype */
var prototype = DD.ui.controls.renderer.Group.prototype;
var superClass_ = DD.ui.controls.renderer.Group.superClass_;
var classes = goog.dom.classes;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Group.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {

  superClass_.initializeDom.call(this, component);

  var eventHandler = component.$cache('eventHandler');
  eventHandler.listen(component, DD.ui.EventType.CHANGE,
      this.onChange.bind(this, component), false);
};

/**
 * @param {DD.ui.Component} component
 * @param {HTMLElement} element
 * @param {goog.dom.DomHelper} dom
 * @protected
 */
prototype.addCaption = function(component, element, dom) {
  var caption = dom.createDom('span', this.getBEMClass(component, 'caption'));
  element.appendChild(caption);
  component.$cache('caption', caption);
};

/**
 * @param {DD.ui.Component} component
 * @param {string} captionValue
 * @public
 */
prototype.setCaption = function(component, captionValue) {

  var element = component.$cache('root');
  var caption = component.$cache('caption');
  if (!element || !caption)
    return;

  caption.innerHTML = captionValue;
  if (captionValue === '')
    goog.dom.removeNode(caption);
  else {
    var icon = component.$cache('icon');
    if (icon)
      goog.dom.insertChildAt(element, caption, 1);
    else
      goog.dom.insertChildAt(element, caption, 0);
  }

  // var caption = component.$cache('caption');
  // if (!caption)
  //   return;

  // caption.innerHTML = captionValue;
  // caption.style.display = captionValue === '' ? 'none' : '';
};

/**
 * @param {DD.ui.Component} component
 * @param {HTMLElement} element
 * @param {goog.dom.DomHelper} dom
 * @private
 */
prototype.addIcon = function(component, element, dom) {
  var icon = dom.createDom('span', this.getBEMClass(component, 'icon'));
  // goog.dom.insertChildAt(element, icon, 0);
  component.$cache('icon', icon);
};

/**
 * @param {DD.ui.Component} component
 * @param {string} iconValue Image url or css class.
 * @public
 */
prototype.setIcon = function(component, iconValue) {

  var element = component.$cache('root');
  var icon = component.$cache('icon');
  if (!element || !icon)
    return;

  icon.style.backgroundImage = '';

  if (iconValue) {
    if (iconValue.indexOf('.') > -1) {
      // Image url
      icon.style.backgroundImage = 'url(' + iconValue + ')';
    } else {
      // Css class
      iconValue = iconValue + ' ' + this.getBEMClass(component, 'icon', iconValue);
      var iconClass = component.$cache('iconClass');
      if (iconClass)
        goog.dom.classes.remove(icon, iconClass);
      goog.dom.classes.add(icon, iconValue);
      component.$cache('iconClass', iconValue);
    }
    goog.dom.insertChildAt(element, icon, 0);

  } else {
    goog.dom.removeNode(icon);
  }
};

/**
 * @param {DD.ui.Component} component
 * @param {boolean} enabled
 * @public
 */
prototype.setHidden = function(component, enabled) {

  var element = component.$cache('root');
  if (!element)
    return;

  classes.enable(element, 'DD-hidden', enabled);
};

/**
 * @param {DD.ui.Component} component
 * @param {Event|goog.events.Event} event
 * @protected
 */
prototype.onChange = function(component, event) {
  this.clearSize(component, event.target === component);
};


// ------------------------------
// Special methods for smart resizing.
// ------------------------------

/**
 * @param {DD.ui.Component} component
 * @param {Object} opt_options
 * @param {number=} opt_options.minWidth
 * @param {number=} opt_options.indent
 * @return {?DD.ui.controls.SizeHelper.ItemSize}
 * @public
 */
prototype.getSize = function(component, opt_options) {
  var size = component.$cache('size');
  //if (!size) {
    size = this.createSize(component, opt_options);
    component.$cache('size', size);
  //}
  return size;
};

/**
 * @param {DD.ui.Component} component
 * @param {boolean} opt_recursive
 * @public
 */
prototype.clearSize = function(component, opt_recursive) {
  component.$cache('size', null);
  if (opt_recursive) {
    component.forEach(function(item) {
      var renderer = item.getRenderer();
      if (!renderer.clearSize)
        return;
      renderer.clearSize(item);
    });
  }
};

/**
 * @param {DD.ui.Component} component
 * @param {Object=} opt_options
 * @param {number=} opt_options.minWidth
 * @param {number=} opt_options.maxWidth
 * @protected
 */
prototype.resetStyles = function(component, opt_options) {
};

/**
 * @param {DD.ui.Component} component
 * @param {Object=} opt_options
 * @param {number=} opt_options.minWidth
 * @param {number=} opt_options.indent
 * @return {?DD.ui.controls.SizeHelper.ItemSize}
 * @protected
 */
prototype.createSize = function(component, opt_options) {
  return null;
};

/**
 * @param {DD.ui.Component} component
 * @param {DD.ui.controls.SizeHelper.ItemSize} size
 * @public
 */
prototype.applySize = function(component, size) {
};

}); // goog.scope
