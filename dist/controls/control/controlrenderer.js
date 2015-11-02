/**
 * Control renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Control');

goog.require('DD.ui.controls.renderer');
goog.require('DD.ui.renderer.Item');
goog.require('DD.ui.controls.SizeHelper.ItemSize');
goog.require('DD.ui.controls.SizeHelper.GroupSize');
goog.require('DD.ui.utils');
goog.require('goog.dom.classes');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.renderer.Item
 */
DD.ui.controls.renderer.Control = function() {
  DD.ui.renderer.Item.call(this);
};
goog.inherits(DD.ui.controls.renderer.Control, DD.ui.renderer.Item);
goog.addSingletonGetter(DD.ui.controls.renderer.Control);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Control.CSS_CLASS = 'DD-control';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Control */
var prototype = DD.ui.controls.renderer.Control.prototype;
var superClass_ = DD.ui.controls.renderer.Control.superClass_;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Control.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {

  var element = superClass_.createDom.call(this, component);
  var dom = component.getDomHelper();

  this.addControlElement(component, element, dom);
  this.setHidden(component, component.isHidden());
  this.setHint(component, component.getHint());
  this.setName(component, component.getName());
  this.setValue(component, component.getValue());

  goog.dom.classes.add(element, DD.ui.controls.renderer.Control.CSS_CLASS);

  var icon = component.$cache('icon');
  if (icon)
    goog.dom.classes.add(icon, DD.ui.controls.renderer.Control.CSS_CLASS+'__icon');

  var caption = component.$cache('caption');
  if (caption)
    goog.dom.classes.add(caption, DD.ui.controls.renderer.Control.CSS_CLASS+'__caption');

  var control = component.$cache('control');
  if (control)
    goog.dom.classes.add(control, DD.ui.controls.renderer.Control.CSS_CLASS+'__control');

  return element;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {

  superClass_.initializeDom.call(this, component);

  var element = this.getActionTarget(component);
  var handler = component.$cache('eventHandler');
  handler.listen(element, goog.events.EventType.FOCUS,
      component.setFocused.bind(component, true), false);
  handler.listen(element, goog.events.EventType.BLUR,
      component.setFocused.bind(component, false), false);
  handler.listen(component, DD.ui.EventType.CHANGE,
      this.onChange.bind(this, component), false);
};

/**
 * @inheritdoc
 */
prototype.setFocused = function(component, enable) {

  if (!component.isInDocument())
    return;

  var element = this.getActionTarget(component);
  if (enable)
    element.focus();
  else
    element.blur();
};

/**
 * @inheritdoc
 */
prototype.setReadonly = function(component, value) {

  var control = component.$cache('control');
  if (!control)
    return;

  control.readonly = !!value;

  // value
  // ? control.setAttribute('readonly', true)
  // : control.removeAttribute('readonly');
};

/**
 * @inheritdoc
 */
prototype.setDisabled = function(component, value) {

  var control = component.$cache('control');
  if (!control)
    return;

  control.disabled = !!value;

  // value
  // ? control.setAttribute('disabled', true)
  // : control.removeAttribute('disabled');
};

/**
 * @inheritdoc
 */
prototype.setValue = function(component, value) {

  var control = component.$cache('control');
  if (!control)
    return;

  control.value = value;
};

/**
 * Sets the name.
 * @param {DD.ui.Component} component
 * @param {string} name
 * @public
 */
prototype.setName = function(component, name) {

  var control = component.$cache('control');
  if (!control)
    return;

  if (name)
    control.setAttribute('name', name);
  else
    control.removeAttribute('name');
};

/**
 * Sets the hint as a title.
 * @param {DD.ui.Component} component
 * @param {string} hint
 * @public
 */
prototype.setHint = function(component, hint) {

  var element = component.$cache('root');
  if (!element)
    return;

  if (hint)
    element.setAttribute('title', hint);
  else
    element.removeAttribute('title');
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

  goog.dom.classes.enable(element, 'DD-hidden', enabled);
};

/**
 * Override this in descendants.
 * @param {DD.ui.Component} component
 * @param {goog.dom.DomHelper} dom
 * @protected
 */
prototype.addControlElement = function(component, element, dom) {
  component.$cache('control', element);
  goog.dom.classes.add(element, this.getBEMClass(component, 'control'));
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
 * @param {Object=} opt_options
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
};

/**
 * @param {DD.ui.Component} component
 * @param {Object=} opt_options
 * @param {number=} opt_options.minWidth
 * @param {number=} opt_options.maxWidth
 * @protected
 */
prototype.resetStyles = function(component, opt_options) {

  var element = component.getElement();
  if (!element)
    return;

  DD.ui.utils.hideForDomChanging(element, function(element) {
    component.setHidden(false);
    opt_options = opt_options || {};
    var minWidth = opt_options.minWidth || 0;
    var maxWidth = opt_options.maxWidth || 0;
    element.style.width = '';
    element.style.maxWidth = maxWidth ? maxWidth+'px' : '';
    element.style.minWidth = minWidth ? minWidth+'px' : '';
    element.style.marginRight = 0;
  });
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

  if (!component.isInDocument() || !component.isVisible())
    return null;

  var element = component.getElement();

  opt_options || (opt_options = {});
  var options = {
    component: component,
    minWidth: opt_options.minWidth,
    maxWidth: element.offsetWidth,
    indent: opt_options.indent,
    wrap: component.isWrap(),
    priority: component.getPriority()
  };

  return new DD.ui.controls.SizeHelper.ItemSize(options);
};


/**
 * @param {DD.ui.Component} component
 * @param {DD.ui.controls.SizeHelper.ItemSize} size
 * @public
 */
prototype.applySize = function(component, size) {

  var element = component.getElement();
  if (!element)
    return;

  DD.ui.utils.hideForDomChanging(element, function(element) {
    if (size.isHidden()) {
      component.setHidden(true);
      return;
    }
    var style = element.style;
    style.marginRight = size.getIndent() + 'px';
    style.width = size.getWidth() + 'px';
  });
};

}); // goog.scope
