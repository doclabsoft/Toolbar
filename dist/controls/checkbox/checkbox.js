/**
 * @overview Checkbox class.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Checkbox');

goog.require('DD.ui.controls.Control');
goog.require('DD.ui.controls.renderer.Checkbox');
goog.require('DD.ui.Component');
goog.require('goog.ui.registry');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form
var button = new DD.ui.controls.Checkbox({
  caption: 'Bold',
  click: function() { // apply bold to a text fragment },
  checked: true,
  allowIndeterminate: false
});

// Short form
var button = new DD.ui.controls.Checkbox('Bold', true);

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {boolean=} options.allowIndeterminate If FALSE
 *    then the checkbox can't be indeterminate. By default it can.
 * @param {boolean=} checked Checked state.
 *    Ignored if the first parameter is options, not a caption.
 * @param {eventCallback=} options.check Check handler.
 *    Triggers after a checkbox turned into checked state.
 * @param {eventCallback=} options.click Alias for "options.check" parameter.
 * @constructor
 * @extends DD.ui.controls.Control
 */
DD.ui.controls.Checkbox = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isBoolean(arguments[1]))
      tempOptions.checked = arguments[1];
    options = tempOptions;
  }

  if (options.click) {
    options.check = options.click;
    delete options.click;
  }

  DD.ui.controls.Control.call(this, options);
};
goog.inherits(DD.ui.controls.Checkbox, DD.ui.controls.Control);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Checkbox, DD.ui.controls.renderer.Checkbox);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Checkbox.prototype */
var prototype = DD.ui.controls.Checkbox.prototype;
var superClass_ = DD.ui.controls.Checkbox.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * @type {boolean}
 * @private
 */
prototype.allowIndeterminate_ = false;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.assign = function(options) {

  if (!goog.isObject(options))
    options = {};

  if (!options.caption && !options.icon && !goog.isNumber(options.imageIndex)) {
    options.caption = 'Checkbox';
  }

  superClass_.assign.call(this, options);

  if (goog.isBoolean(options.allowIndeterminate))
    this.setAllowedIndeterminate(options.allowIndeterminate);

  if (goog.isFunction(options.check))
    this.listen(DD.ui.EventType.CHECK, options.check);
};

/**
 * @inheritdoc
 */
prototype.activate = function(opt_originalEvent) {

  if (superClass_.activate.call(this, opt_originalEvent) === false)
    return false;

  if (this.setChecked(!this.isChecked()) === false)
    return false;

  this.setIndeterminate(false); // Not important
  return true;
};

/**
 * Allows or disallows indeterminate state.
 * @param {boolean} allow
 * @public
 */
prototype.setAllowedIndeterminate = function(allow) {
  this.setSupportedState(DD.ui.Component.State.INDETERMINATE, allow);
};

/**
 * Checks if the indeterminate state is allowed.
 * @return {boolean}
 * @public
 */
prototype.isAllowedIndeterminate = function() {
  return this.isSupportedState(DD.ui.Component.State.INDETERMINATE);
};

}); // goog.scope
