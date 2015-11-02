/**
 * Controls group renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Group_Flat');

goog.require('DD.ui.controls.renderer.Group');
goog.require('DD.ui.utils');
goog.require('goog.dom.classes');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Group
 */
DD.ui.controls.renderer.Group_Flat = function() {
  DD.ui.controls.renderer.Group.call(this);
};
goog.inherits(DD.ui.controls.renderer.Group_Flat, DD.ui.controls.renderer.Group);
goog.addSingletonGetter(DD.ui.controls.renderer.Group_Flat);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Group_Flat.CSS_CLASS = 'DD-group-flat';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Group_Flat.prototype */
var prototype = DD.ui.controls.renderer.Group_Flat.prototype;
var superClass_ = DD.ui.controls.renderer.Group_Flat.superClass_;
var classes = goog.dom.classes;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Group_Flat.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {

  var element = superClass_.createDom.call(this, component);
  var dom = component.getDomHelper();

  this.addIcon(component, element, dom);
  this.addCaption(component, element, dom);
  this.setIcon(component, component.getIcon());
  this.setCaption(component, component.getCaption());
  this.setHidden(component, component.isHidden());

  var content = dom.createDom('div', this.getBEMClass(component, 'content'));
  content.style.whiteSpace = 'nowrap';
  element.appendChild(content);
  component.setContentElement(content);

  classes.add(element, DD.ui.controls.renderer.Group.CSS_CLASS);
  classes.add(content, DD.ui.controls.renderer.Group.CSS_CLASS + '__content');

  var caption = component.$cache('caption');
  if (caption)
    classes.add(caption, DD.ui.controls.renderer.Group.CSS_CLASS + '__caption');

  var icon = component.$cache('icon');
  if (icon)
    classes.add(icon, DD.ui.controls.renderer.Group.CSS_CLASS + '__icon');

  return element;
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
    element.style.marginRight = 0 + 'px';
    component.forEach(function(item) {
      var renderer = item.getRenderer();
      if (!renderer.resetStyles)
        return;
      renderer.resetStyles(item, opt_options);
    });
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

  opt_options || (opt_options = {});
  var options = {
    component: component,
    minWidth: opt_options.minWidth,
    maxWidth: component.getElement().offsetWidth,
    indent: opt_options.indent,
    wrap: component.isWrap(),
    priority: component.getPriority ? component.getPriority() : undefined
  };

  var groupSizes = [];
  component.forEach(function(item) {
    if (!item.isInDocument() || !item.isVisible())
      return;
    var renderer = item.getRenderer();
    if (!renderer.getSize)
      return;
    var size = renderer.getSize(item, opt_options);
    if (size)
      groupSizes.push(size);
  });
  options.group = new DD.ui.controls.SizeHelper.GroupSize(groupSizes, opt_options);

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

    element.style.marginRight = size.getIndent() + 'px';
    var group = size.getGroup();
    if (!group) {
      debugger;
    }
    group.applyIndents();
    group.rootLevelWalk(function(size) {
      var item = size.getComponent();
      if (!item.isInDocument() || !item.isVisible())
        return;
      var renderer = item.getRenderer();
      if (!renderer.applySize)
        return;
      renderer.applySize(item, size);
    });
  });
};

}); // goog.scope
