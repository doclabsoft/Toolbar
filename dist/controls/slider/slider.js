/**
 * Slider.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Slider');

goog.require('DD.ui.controls.Scale');
goog.require('DD.ui.controls.renderer.Slider_noUiSlider');
goog.require('goog.ui.registry');
goog.require('goog.object');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form.
var slider = new DD.ui.controls.Slider({
  caption: 'House price',
  range: true,
  increment: 100000,
  limits: [100000, 5000000],
  value: [600000, 2000000],
  change: function() { // do search }
});

// Short form.
var slider = new DD.ui.controls.Slider('House price', [600000, 2000000]);

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {number=} options.increment Step of value changing.
 * @param {Array.<number>=} options.limits Two numbers: minValue and maxValue.
 * @param {boolean=} options.range Type of slider.
 *    If TRUE - slider will show a range, not a single value.
 *    Ignored if value is set. Then the type is detected by value type.
 * @param {number|Array.<number>=} options.value
 *    Single value for a simple slider, or two numbers for a range slider.
 * @param {boolean=} options.showScale Show or not a scale below the slider.
 * @param {number=} options.frequency Scale marks frequency.
 * @param {DD.ui.controls.Slider.Orientation=} options.orientation
 *    Vertical or horizontal slider.
 * @param {boolean=} options.hideDragger Visibility of a dragger.
 * @param {number=} options.draggerLength Size of a dragger.
 * @param {DD.ui.controls.Slider.PipsPosition} options.pipsPosition
 * @param {number=} value Component's value.
 *    Ignored if the first parameter is options, not a caption.
 * @constructor
 * @extends DD.ui.controls.Scale
 */
DD.ui.controls.Slider = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isNumber(arguments[1]) || goog.isArray(arguments[1]))
      tempOptions.value = arguments[1];
    options = tempOptions;
  }

  DD.ui.controls.Scale.call(this, options);

  var value = this.getValue();
  var minValue = this.getMinValue();
  var maxValue = this.getMaxValue();

  if (value < minValue)
    this.setValueInternal(minValue);
  else if (value > maxValue)
    this.setValueInternal(maxValue);

  if (this.startValue_ < minValue)
    this.setStartValueInternal(minValue);
  else if (this.startValue_ > maxValue)
    this.setStartValueInternal(maxValue);

  if (this.endValue_ < minValue)
    this.setEndValueInternal(minValue);
  else if (this.endValue_ > maxValue)
    this.setEndValueInternal(maxValue);
};
goog.inherits(DD.ui.controls.Slider, DD.ui.controls.Scale);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Slider, DD.ui.controls.renderer.Slider_noUiSlider);


// ------------------------------
// Constants
// ------------------------------

/**
 * Pips position.
 * @enum {number}
 */
DD.ui.controls.Slider.PipsPosition = {

  /** Before the slider - at the left or top side. */
  BEFORE: 0x01,

  /** After the slider - at the right or bottom side. */
  AFTER: 0x02,

  /** Around the slider - at both sides. */
  BOTH: 0x03
};

/**
 * Slider orientation.
 * @enum {string}
 */
DD.ui.controls.Slider.Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};

/**
 * Pips style.
 * @enum {number}
 */
DD.ui.controls.Slider.PipsStyle = {

  /** Don't show */
  NONE: 0x00,

  /** Show */
  AUTO: 0x01

};


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Slider.prototype */
var prototype = DD.ui.controls.Slider.prototype;
var superClass_ = DD.ui.controls.Slider.superClass_;
var PipsStyle = DD.ui.controls.Slider.PipsStyle;


// ------------------------------
// Properties
// ------------------------------

/**
 * One or two handles.
 * @type {boolean}
 * @private
 */
prototype.rangeSlider_ = false;

/**
 * Start value of the range.
 * @type {number}
 * @private
 */
prototype.startValue_ = 0;

/**
 * End value of the range.
 * @type {number}
 * @private
 */
prototype.endValue_ = 0;

/**
 * Number of step between two tick marks.
 * @type {number}
 * @private
 */
prototype.frequency_ = 1;

/**
 * Slider orientation.
 * @type {DD.ui.controls.Slider.Orientation}
 * @private
 */
prototype.orientation_ = DD.ui.controls.Slider.Orientation.HORIZONTAL;

/**
 * Handle visibility.
 * @type {boolean}
 * @private
 */
prototype.draggerVisible_ = true;

/**
 * Handle length
 * (width for the horizontal slider or height for the vertical one).
 * @type {number}
 * @private
 */
prototype.draggerLength_ = 1;

/**
 * @type {DD.ui.controls.Slider.PipsPosition}
 * @private
 * @todo Not implemented. Remove this functionality?
 */
prototype.pipsPosition_ = DD.ui.controls.Slider.PipsPosition.BEFORE;

/**
 * @type {DD.ui.controls.Slider.PipsStyle}
 * @private
 */
prototype.pipsStyle_ = DD.ui.controls.Slider.PipsStyle.AUTO;


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

  if (goog.isArray(options.value) && options.value.length === 2) {
    this.setStartValue(options.value[0]);
    this.setEndValue(options.value[1]);
    options.range = true;
  } else if (goog.isNumber(options.value)) {
    options.range = false;
  }

  if (goog.isBoolean(options.range))
    this.setRangeSlider(options.range);

  if (goog.isBoolean(options.showScale))
    this.setPipsStyle(options.showScale ? PipsStyle.AUTO : PipsStyle.NONE);

  if (goog.isNumber(options.frequency))
    this.setFrequency(options.frequency);

  if (goog.isDefAndNotNull(options.orientation))
    this.setOrientation(options.orientation);

  if (goog.isBoolean(options.hideDragger))
    this.setDraggerVisible(!options.hideDragger);

  if (goog.isBoolean(options.draggerLength))
    this.setDraggerLength(options.draggerLength);

  if (goog.isDefAndNotNull(options.pipsPosition))
    this.setPipsPosition(options.pipsPosition);
};

/**
 * @param {boolean} rangeMode
 * @public
 */
prototype.setRangeSlider = function(rangeMode) {

  rangeMode = !!rangeMode;
  if (this.rangeSlider_ === rangeMode)
    return;

  this.rangeSlider_ = rangeMode;

  var renderer = this.getRenderer();
  if (renderer.setRangeSlider)
    renderer.setRangeSlider(this, rangeMode);
};

/**
 * @return {boolean}
 * @public
 */
prototype.isRangeSlider = function() {
  return this.rangeSlider_;
};

/**
 * @param {number} value
 * @public
 */
prototype.setStartValue = function(value) {

  value = +value;
  value = Math.min(value, this.getMaxValue());
  value = Math.max(value, this.getMinValue());
  if (this.startValue_ === value)
    return;

  this.setStartValueInternal(value);
  this.setValueInternal(value);

  var renderer = this.getRenderer();
  if (renderer.setStartValue)
    renderer.setStartValue(this, value);

  this.valueChanged();
};

/**
 * Only for renderers!
 * @param {number} value
 * @public
 */
prototype.setStartValueInternal = function(value) {
  this.startValue_ = value;
  this.setValueInternal(value);
};

/**
 * @return {number}
 * @public
 */
prototype.getStartValue = function() {
  return this.rangeSlider_ ? this.startValue_ : this.getValue();
};

/**
 * @param {number} value
 * @public
 */
prototype.setEndValue = function(value) {

  value = +value;
  value = Math.min(value, this.getMaxValue());
  value = Math.max(value, this.getMinValue());
  if (this.endValue_ === value)
    return;

  this.setEndValueInternal(value);

  var renderer = this.getRenderer();
  if (renderer.setEndValue)
    renderer.setEndValue(this, value);

  this.valueChanged();
};

/**
 * Only for renderers!
 * @param {number} value
 * @public
 */
prototype.setEndValueInternal = function(value) {
  this.endValue_ = value;
};

/**
 * @return {number}
 * @public
 */
prototype.getEndValue = function() {
  return this.rangeSlider_ ? this.endValue_ : this.getValue();
};

/**
 * Pips frequency. Steps number between the two pips.
 * @param {number} frequency
 * @public
 */
prototype.setFrequency = function(frequency) {

  frequency = +frequency;
  if (this.frequency_ === frequency)
    return;

  this.frequency_ = frequency;

  var renderer = this.getRenderer();
  if (renderer.setOrientation)
    renderer.setOrientation(this, frequency);
};

/**
 * @return {number}
 * @public
 */
prototype.getFrequency = function() {
  return this.frequency_;
};

/**
 * Slider orientation.
 * @param {DD.ui.controls.Slider.Orientation} orientation
 * @public
 */
prototype.setOrientation = function(orientation) {

  if (!goog.object.contains(DD.ui.controls.Slider.Orientation, orientation))
    return;
  if (this.orientation_ === orientation)
    return;

  this.orientation_ = orientation;

  var renderer = this.getRenderer();
  if (renderer.setOrientation)
    renderer.setOrientation(this, orientation);
};

/**
 * @return {DD.ui.controls.Slider.Orientation}
 * @public
 */
prototype.getOrientation = function() {
  return this.orientation_;
};


/**
 * @param {boolean} visible
 * @public
 */
prototype.setDraggerVisible = function(visible) {

  visible = !!visible;
  if (this.draggerVisible_ === visible)
    return;

  this.draggerVisible_ = visible;

  var renderer = this.getRenderer();
  if (renderer.setDraggerVisible)
    renderer.setDraggerVisible(this, visible);
};

/**
 * @return {boolean}
 * @public
 */
prototype.isDraggerVisible = function() {
  return this.draggerVisible_;
};

/**
 * @param {number} length
 * @public
 */
prototype.setDraggerLength = function(length) {

  length = +length;
  if (this.draggerLength_ === length)
    return;

  this.draggerLength_ = length;

  var renderer = this.getRenderer();
  if (renderer.setDraggerLength)
    renderer.setDraggerLength(this, length);
};

/**
 * @return {number}
 * @public
 */
prototype.getDraggerLength = function() {
  return this.draggerLength_;
};

/**
 * @param {DD.ui.controls.Slider.PipsPosition} value
 * @public
 */
prototype.setPipsPosition = function(position) {

  if (!goog.object.contains(DD.ui.controls.Slider.PipsPosition, position))
    return;
  if (this.pipsPosition_ === position)
    return;

  this.pipsPosition_ = position;

  var renderer = this.getRenderer();
  if (renderer.setPipsPosition)
    renderer.setPipsPosition(this, position);
};

/**
 * @return {DD.ui.controls.Slider.PipsPosition}
 * @public
 */
prototype.getPipsPosition = function() {
  return this.pipsPosition_;
};

/**
 * @param {DD.ui.controls.Slider.PipsStyle} style
 * @public
 */
prototype.setPipsStyle = function(style) {

  if (!goog.object.contains(DD.ui.controls.Slider.PipsStyle, style))
    return;
  if (this.pipsStyle_ === style)
    return;

  this.pipsStyle_ = style;

  var renderer = this.getRenderer();
  if (renderer.setPipsStyle)
    renderer.setPipsStyle(this, style);
};

/**
 * @return {DD.ui.controls.Slider.PipsStyle}
 * @public
 */
prototype.getPipsStyle = function() {
  return this.pipsStyle_;
};

/**
 * Adds a pip.
 * @param {number} value
 * @public
 * @todo ???
 */
prototype.setTick = function(value) {

  value = +value;

  var renderer = this.getRenderer();
  if (renderer.setTick)
    renderer.setTick(this, value);
};

}); // goog.scope
