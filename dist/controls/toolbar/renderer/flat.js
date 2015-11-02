/**
 * Toolbar renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Toolbar_Flat');

goog.require('DD.ui.controls.renderer.Toolbar');
goog.require('DD.ui.controls.SizeHelper.GroupSize');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Toolbar
 */
DD.ui.controls.renderer.Toolbar_Flat = function() {
  DD.ui.controls.renderer.Toolbar.call(this);
};
goog.inherits(DD.ui.controls.renderer.Toolbar_Flat, DD.ui.controls.renderer.Toolbar);
goog.addSingletonGetter(DD.ui.controls.renderer.Toolbar_Flat);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Toolbar_Flat.CSS_CLASS = 'DD-toolbar-flat';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Toolbar_Flat.prototype */
var prototype = DD.ui.controls.renderer.Toolbar_Flat.prototype;
var superClass_ = DD.ui.controls.renderer.Toolbar_Flat.superClass_;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Toolbar_Flat.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {
  var element = superClass_.createDom.call(this, component);
  this.setScrollOrientation(component, component.getScrollOrientation());
  return element;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {
  superClass_.initializeDom.call(this, component);
  this.resize(component);
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @param {DD.ui.controls.Toolbar.ScrollOrientation} orientation
 * @public
 */
prototype.setScrollOrientation = function(component, orientation) {

  var element = component.getContentElement();
  if (!element)
    return;

  var scroll = orientation === DD.ui.controls.Toolbar.ScrollOrientation.HORIZONTAL;
  element.style.overflowX = scroll ? 'auto' : 'hidden';
};


// ------------------------------
// Special methods for smart resizing.
// ------------------------------

/**
 * @param {DD.ui.controls.Toolbar} component
 * @protected
 */
prototype.resizeInternal = function(component) {

  if (!component.isInDocument())
    return;
  var element = component.getElement();
  var content = component.getContentElement();
  var scroll = component.getScrollOrientation() === DD.ui.controls.Toolbar.ScrollOrientation.HORIZONTAL;

  DD.ui.utils.hideForDomReading(element, function() {

    this.closeOpenedChildren(component);

    var options = {
      minWidth: component.getItemMinWidth(),
      maxWidth: component.getItemMaxWidth(),
      indent: component.getIndent()
    };
    this.resetStyles(component, options);
    var size = this.getSize(component, options);
    var group = size.getGroup();
    var maxWidth = DD.ui.utils.getContentWidth(content);

    if (scroll) {
      group.compact(width, false);

    } else {
      var toCollapse = [];

      group.compact(maxWidth, true, function(size2) {
        var group1 = size2.getParentGroup() || null;
        var size1 = group1 && group1.getParentSize() || null;
        if (size1.getParentGroup() === group) {
          toCollapse.push(size1.getComponent());
          return false;
        }
      }.bind(this));

      goog.array.removeDuplicates(toCollapse);
      var i, width;
      for (i=0; i<toCollapse.length; i++) {
        this.collapseGroup(component, toCollapse[i]);
        this.clearSize(component, false);
        size = this.getSize(component, options);
        group = size.getGroup();
        width = group.compact(maxWidth, true, function(size) {
          if (size.getParentGroup())
            return false;
        });
        if (width <= maxWidth)
          break;
      }

    }

    DD.ui.utils.hideForDomChanging(element, function() {
      this.applySize(component, size);
    }.bind(this));

    this.openClosedChildren(component);

  }.bind(this));
};

}); // goog.scope
