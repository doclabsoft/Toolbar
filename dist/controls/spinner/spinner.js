/**
 * Spinner.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Spinner');

goog.require('DD.ui.controls.Scale');
goog.require('DD.ui.controls.renderer.Spinner');
goog.require('goog.ui.registry');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form.
var spinner = new DD.ui.controls.Spinner({
  caption: 'Guests',
  increment: 1,
  value: 5,
  limits: [2, 10],
  looped: true,
  change: function() { // calculate price }
});

// Short form
var spinner = new DD.ui.controls.Spinner('Guests', 5);

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {number=} options.increment Step of value changing.
 * @param {Array.<number>=} options.limits Two numbers: minValue and maxValue.
 * @param {boolean=} looped If TRUE the spinner's values will be looped.
 * @param {number=} value Component's value.
 *    Ignored if the first parameter is options, not a caption.
 * @constructor
 * @extends DD.ui.controls.Scale
 */
DD.ui.controls.Spinner = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isNumber(arguments[1]))
      tempOptions.value = arguments[1];
    options = tempOptions;
  }

  DD.ui.controls.Scale.call(this, options);

  var value = this.getValue();
  if (value < this.getMinValue())
    this.setValueInternal(this.getMinValue());
  else if (value > this.getMaxValue())
    this.setValueInternal(this.getMaxValue());
};
goog.inherits(DD.ui.controls.Spinner, DD.ui.controls.Scale);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Spinner, DD.ui.controls.renderer.Spinner);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Spinner.prototype */
var prototype = DD.ui.controls.Spinner.prototype;
var superClass_ = DD.ui.controls.Spinner.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * Loop mode. If user selects more that max value
 * the spinner turns to minValue and vice versa.
 * @type {boolean}
 * @default false
 * @private
 */
prototype.looped_ = false;


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

  if (goog.isBoolean(options.looped))
    thi.setLooped(options.looped);
};

/**
 * @inheritdoc
 */
prototype.decrease = function() {

  if (this.looped_) {
    var value = this.getValue();
    var newValue = value - this.increment_;
    if (newValue < this.getMinValue())
      newValue = value + (this.getMaxValue() - this.getMinValue());
    this.setValue(newValue);

  } else {
    superClass_.decrease.call(this);
  }
};

/**
 * @inheritdoc
 */
prototype.increase = function() {

  if (this.looped_) {
    var value = this.getValue();
    var newValue = value + this.increment_;
    if (newValue > this.getMaxValue())
      newValue = value - (this.getMaxValue() - this.getMinValue());
    this.setValue(newValue);

  } else {
    superClass_.increase.call(this);
  }
};

/**
 * Sets the loop mode.
 * @param {boolean} looped
 * @public
 */
prototype.setLooped = function(looped) {

  looped = !!looped;
  if (looped === this.looped)
    return;

  this.looped_ = looped;

  var renderer = this.getRenderer();
  if (renderer.setLooped)
    renderer.setLooped(this, looped);
}

/**
 * Checks if the spinner is looped.
 * @return {boolean}
 * @public
 */
prototype.isLooped = function() {
  return this.looped_;
};

}); // goog.scope
