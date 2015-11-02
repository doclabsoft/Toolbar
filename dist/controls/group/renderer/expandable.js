/**
 * Toolbar renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Group_Expandable');

goog.require('DD.ui.controls.renderer.Group');
goog.require('DD.ui.controls.renderer.Control');
goog.require('goog.dom.classes');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Group
 */
DD.ui.controls.renderer.Group_Expandable = function() {
  DD.ui.controls.renderer.Group.call(this);
  this.OPENABLE = true;
  this.EXPANDABLE = true;
};
goog.inherits(DD.ui.controls.renderer.Group_Expandable, DD.ui.controls.renderer.Group);
goog.addSingletonGetter(DD.ui.controls.renderer.Group_Expandable);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Group_Expandable.CSS_CLASS = 'DD-group-expandable';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Group_Expandable.prototype */
var prototype = DD.ui.controls.renderer.Group_Expandable.prototype;
var superClass_ = DD.ui.controls.renderer.Group_Expandable.superClass_;
var classes = goog.dom.classes;
var CLICK = goog.events.EventType.CLICK;


// ------------------------------
// Properties
// ------------------------------

prototype.tagName = 'button';


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Group_Expandable.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {

  var element = superClass_.createDom.call(this, component);
  var dom = component.getDomHelper();
  var customClass = component.getCustomCssClass();

  this.addIcon(component, element, dom);
  this.addCaption(component, element, dom);
  this.setIcon(component, component.getIcon());
  this.setCaption(component, component.getCaption());

  var content = dom.createDom('div', this.getBEMClass(component, 'content'));
  if (customClass)
    classes.add(content, customClass);
  component.setContentElement(content);

  classes.add(element, DD.ui.controls.renderer.Control.CSS_CLASS);
  classes.add(element, DD.ui.controls.renderer.Control.CSS_CLASS + '__control');
  classes.add(element, this.getBEMClass(component, 'control'));
  classes.add(content, DD.ui.controls.renderer.Group.CSS_CLASS + '__content');

  var caption = component.$cache('caption');
  if (caption) {
    classes.add(caption, DD.ui.controls.renderer.Group.CSS_CLASS + '__caption');
    classes.add(caption, DD.ui.controls.renderer.Control.CSS_CLASS + '__caption');
  }

  var icon = component.$cache('icon');
  if (icon) {
    classes.add(icon, DD.ui.controls.renderer.Group.CSS_CLASS + '__icon');
    classes.add(icon, DD.ui.controls.renderer.Control.CSS_CLASS + '__icon');
  }

  return element;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {

  superClass_.initializeDom.call(this, component);

  var element = component.getElement();
  var handler = component.$cache('eventHandler');
  handler.listen(element, CLICK, this.onClick_.bind(this, component), false);
};

/**
 * @inheritdoc
 */
prototype.uninitializeDom = function(component) {

  var content = component.getContentElement();
  goog.dom.removeNode(content);

  superClass_.initializeDom.call(this, component);
};

/**
 * @inheritdoc
 */
prototype.setOpened = function(component, enabled) {
  var content = component.getContentElement();
  var expandStrategy = component.$cache('expandStrategy');
  if (!expandStrategy) {
    enabled
      ? goog.dom.insertSiblingAfter(content, component.getElement())
      : goog.dom.removeNode(content);
  } else {
    expandStrategy.call(this, component, enabled);
  }
  component.changed();
};

/**
 * @param {DD.ui.Component} component
 * @param {Function(component, boolean)} expandStrategy
 * @public
 */
prototype.setExpandStrategy = function(component, expandStrategy) {

  var oldStrategy = component.$cache('expandStrategy');
  if (oldStrategy === expandStrategy)
    return;

  component.$cache('expandStrategy', expandStrategy);
  component.forEach(function(child) {
    if (!(child instanceof DD.ui.controls.Group))
      return;
    var renderer = child.getRenderer();
    if (renderer.setExpandStrategy)
      renderer.setExpandStrategy(child, expandStrategy);
  });
};

/**
 * @param {DD.ui.Component} component
 * @param {Event|goog.events.Event} event
 * @private
 */
prototype.onClick_ = function(component, event) {
  component.setOpened(!component.isOpened());
};


// ------------------------------
// Special methods for smart resizing.
// ------------------------------

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

  var element = component.getElement();

  opt_options || (opt_options = {});
  var options = {
    component: component,
    minWidth: opt_options.minWidth,
    maxWidth: element.offsetWidth,
    indent: opt_options.indent,
    wrap: component.isWrap(),
    priority: undefined
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
