/**
 * Button renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Button');

goog.require('DD.ui.controls.renderer.Control');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Control
 */
DD.ui.controls.renderer.Button = function() {
  DD.ui.controls.renderer.Control.call(this);
};
goog.inherits(DD.ui.controls.renderer.Button, DD.ui.controls.renderer.Control);
goog.addSingletonGetter(DD.ui.controls.renderer.Button);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Button.CSS_CLASS = 'DD-button';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Button.prototype */
var prototype = DD.ui.controls.renderer.Button.prototype;
var superClass_ = DD.ui.controls.renderer.Button.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * @inheritdoc
 */
prototype.tagName = 'button';


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Button.CSS_CLASS;
};

}); // goog.scope
