/**
 * Label renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Label');

goog.require('DD.ui.controls.renderer.Control');
goog.require('goog.style');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Control
 */
DD.ui.controls.renderer.Label = function() {
  DD.ui.controls.renderer.Control.call(this);
};
goog.inherits(DD.ui.controls.renderer.Label, DD.ui.controls.renderer.Control);
goog.addSingletonGetter(DD.ui.controls.renderer.Label);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Label.CSS_CLASS = 'DD-label';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Label.prototype */
var prototype = DD.ui.controls.renderer.Label.prototype;
var superClass_ = DD.ui.controls.renderer.Label.superClass_;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Label.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {

  var element = superClass_.createDom.call(this, component);

  this.setWordWrap(component, component.isWordWrap());
  element.style.overflow = 'hidden';

  return element;
};

/**
 * @param {boolean} enable
 * @public
 */
prototype.setWordWrap = function(component, enable) {

  var element = component.$cache('root');
  if (!element)
    return;

  element.style.whiteSpace = enable ? 'normal' : 'nowrap';
};

}); // goog.scope
