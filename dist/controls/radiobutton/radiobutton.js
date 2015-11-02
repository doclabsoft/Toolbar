/**
 * Radio button.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.RadioButton');

goog.require('DD.ui.controls.Control');
goog.require('DD.ui.controls.renderer.RadioButton');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form
var button = new DD.ui.controls.RadioButton({
  caption: 'Align left',
  click: function() { // use left align },
  checked: false,
  name: 'align'
});

// Short form
var button = new DD.ui.controls.RadioButton('Align left', false);

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {boolean=} checked Checked state.
 *    Ignored if the first parameter is options, not a caption.
 * @constructor
 * @extends DD.ui.controls.Control
 */
DD.ui.controls.RadioButton = function(options) {

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
goog.inherits(DD.ui.controls.RadioButton, DD.ui.controls.Control);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.RadioButton, DD.ui.controls.renderer.RadioButton);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.RadioButton.prototype */
var prototype = DD.ui.controls.RadioButton.prototype;
var superClass_ = DD.ui.controls.RadioButton.superClass_;


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
    options.caption = 'Radio button';
  }

  superClass_.assign.call(this, options);

  if (goog.isFunction(options.check))
    this.listen(DD.ui.EventType.CHECK, options.check);
};

/**
 * @inheritdoc
 */
prototype.activate = function(opt_originalEvent) {

  if (this.isChecked())
    return false;

  if (superClass_.activate.call(this, opt_originalEvent) === false)
    return false;

  if (this.setChecked(true) === false)
    return false;

  return true;
};

}); // goog.scope
