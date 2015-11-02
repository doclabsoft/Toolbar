/**
 * Abstract class for spinner and slider. Do not use directly!
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Scale');

goog.require('DD.ui.controls.Control');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @param {Object|goog.dom.DomHelper=} arg
 * @constructor
 * @extends DD.ui.controls.Control
 */
DD.ui.controls.Scale = function(arg) {
  DD.ui.controls.Control.call(this, arg);
};
goog.inherits(DD.ui.controls.Scale, DD.ui.controls.Control);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Scale.prototype */
var prototype = DD.ui.controls.Scale.prototype;
var superClass_ = DD.ui.controls.Scale.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * Left limit.
 * @type {?number}
 * @default 0
 * @private
 */
prototype.minValue_ = 0;

/**
 * Right limit.
 * @type {?number}
 * @default 10
 * @private
 */
prototype.maxValue_ = 10;

/**
 * Incerement value.
 * @type {number}
 * @default 1
 * @private
 */
prototype.increment_ = 1;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.assign = function(options) {

  if (!goog.isObject(options))
    return;

  superClass_.assign.call(this, options);

  if (goog.isArray(options.limits) && options.limits.length === 2) {
    this.setMinValue(options.limits[0]);
    this.setMaxValue(options.limits[1]);
  }

  if (goog.isNumber(options.increment))
    this.setIncrement(options.increment);
};

/**
 * @inheritdoc
 */
prototype.setValue = function(value) {
  value = +value;
  value = Math.min(value, this.maxValue_);
  value = Math.max(value, this.minValue_);
  superClass_.setValue.call(this, value);
};

/**
 * @param {number} minValue
 * @public
 */
prototype.setMinValue = function(minValue) {

  minValue = +minValue;
  // if (minValue >= this.maxValue_)
  //   minValue = this.maxValue_ - this.increment_;

  this.minValue_ = minValue;
  if (this.getValue() < this.minValue_)
    this.setValue(this.minValue_);

  var renderer = this.getRenderer();
  if (renderer.setMinValue)
    renderer.setMinValue(this, minValue);
};

/**
 * @return {number}
 * @public
 */
prototype.getMinValue = function() {
  return this.minValue_;
};

/**
 * @param {number} maxValue
 * @public
 */
prototype.setMaxValue = function(maxValue) {

  maxValue = +maxValue;
  // if (maxValue <= this.minValue_)
  //   maxValue = this.minValue_ + this.increment_;

  this.maxValue_ = maxValue;
  if (this.getValue() > this.maxValue_)
    this.setValue(this.maxValue_);

  var renderer = this.getRenderer();
  if (renderer.setMaxValue)
    renderer.setMaxValue(this, maxValue);

};

/**
 * @return {number}
 * @public
 */
prototype.getMaxValue = function() {
  return this.maxValue_;
};

/**
 * @param {number} increment
 * @public
 */
prototype.setIncrement = function(increment) {

  increment = +increment;
  if (increment === this.increment_)
    return;

  if (increment <= 0)
    return;
  if (increment > this.maxValue_ - this.minValue_)
    return;

  this.increment_ = increment;

  var renderer = this.getRenderer();
  if (renderer.setIncrement)
    renderer.setIncrement(this, increment);
}

/**
 * @return {number}
 * @public
 */
prototype.getIncrement = function() {
  return this.increment_;
};

/**
 * Decrements the value.
 * @public
 */
prototype.decrease = function() {
  this.setValue(this.getValue() - this.increment_);
};

/**
 * Increments the value.
 * @public
 */
prototype.increase = function() {
  this.setValue(this.getValue() + this.increment_);
};

}); // goog.scope
