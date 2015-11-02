/**
 * Text edit field.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.TextEdit');

goog.require('DD.ui.controls.Control');
goog.require('DD.ui.controls.renderer.TextEdit');
goog.require('goog.ui.registry');
goog.require('goog.object');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form.
var input = new DD.ui.controls.TextEdit({
  caption: 'Search',
  value: '',
  display: 'text', // 'text' | 'password'
  change: function() { // do search },
  keyPress: function(event) { // check event.char }
});

// Short form.
var input = new DD.ui.controls.TextEdit('Search', '');

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {'text'|'password'=} options.display Type of text perfomance.
 * @param {number=} options.maxLength Maximum value string length.
 * @param {eventCallback=} options.change Handler for text change.
 * @param {eventCallback=} options.keyPress Key press handler.
 * @param {string=} value Component's value.
 *    Ignored if the first parameter is options, not a caption.
 * @constructor
 * @extends DD.ui.controls.Control
 */
DD.ui.controls.TextEdit = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isString(arguments[1]))
      tempOptions.value = arguments[1];
    options = tempOptions;
  }

  DD.ui.controls.Control.call(this, options);

  if (this.getValue() === null)
    this.setValueInternal('');
  this.originalValue_ = this.getValue();
};
goog.inherits(DD.ui.controls.TextEdit, DD.ui.controls.Control);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.TextEdit, DD.ui.controls.renderer.TextEdit);


// ------------------------------
// Constants
// ------------------------------

/**
 * @enum {string}
 */
DD.ui.controls.TextEdit.EventType = {
  VALUE_CHANGED: DD.ui.EventType.VALUE_CHANGED,
  KEY_PRESS: 'TextEdit__keyPress',
  VALUE_MODIFIED: 'TextEdit__valueModified'
};

/**
 * @enum {number}
 */
DD.ui.controls.TextEdit.DisplayStyle = {
  NORMAL: 'text',
  PASSWORD: 'password'
};


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @memberof DD.ui.controls.TextEdit */
var prototype = DD.ui.controls.TextEdit.prototype;
var superClass_ = DD.ui.controls.TextEdit.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * Original value set by "setValue". Used to register modification.
 * @type {string}
 * @private
 */
prototype.originalValue_ = '';

/**
 * Maximum text length.
 * @type {number}
 * @private
 */
prototype.maxLength_ = 0;

/**
 * Display mode: text or password or something else.
 * @type {DD.ui.controls.TextEdit.DisplayStyle}
 * @private
 */
prototype.displayStyle_ = DD.ui.controls.TextEdit.DisplayStyle.NORMAL;


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

  if (goog.isDefAndNotNull(options.display))
    this.setDisplayStyle(options.display);

  if (goog.isNumber(options.maxLength))
    this.setMaxLength(options.maxLength);

  if (goog.isFunction(options.keyPress))
    this.listen(KEY_PRESS, options.keyPress);
};

/**
 * @inheritdoc
 */
prototype.setValue = function(value) {
  superClass_.setValue.call(this, value);
  this.originalValue_ = this.getValue();
};

/**
 * Sets maximum text length.
 * @param {number} maxLength
 * @public
 */
prototype.setMaxLength = function(maxLength) {

  maxLength = +maxLength;
  if (maxLength === this.maxLength_)
    return;

  this.maxLength_ = maxLength;

  var renderer = this.getRenderer();
  if (renderer.setMaxLength)
    renderer.setMaxLength(this, this.maxLength_);

  this.changed();
};

/**
 * Gets maximum text length.
 * @return {number}
 * @public
 */
prototype.getMaxLength = function() {
  return this.maxLength_;
};

/**
 * Checks if the text was modified.
 * @return {boolean}
 * @public
 */
prototype.isModified = function() {
  return this.getValue() !== this.originalValue_;
};

/**
 * Sets the component to password mode.
 * @param {DD.ui.controls.TextEdit.DisplayStyle} style
 * @public
 */
prototype.setDisplayStyle = function(style) {

  if (!goog.object.contains(DD.ui.controls.TextEdit.DisplayStyle, style))
    return;
  if (this.displayStyle_ === style)
    return;

  this.displayStyle_ = style;

  var renderer = this.getRenderer();
  if (renderer.setDisplayStyle)
    renderer.setDisplayStyle(this, style);

  this.changed();
};

/**
 * @return {DD.ui.controls.TextEdit.DisplayStyle}
 * @public
 */
prototype.getDisplayStyle = function() {
  return this.displayStyle_;
};

/**
 * Clears the text.
 * @public
 */
prototype.clear = function() {
  this.setValue('');
};

/**
 * Triggers when a key was pressed.
 * @param {string} charcode Pressed symbol
 * @return {boolean} If FALSE then the original event will be stopped.
 * @public
 */
prototype.keyPressed = function(charcode) {
  return this.dispatchEvent({
    'type': DD.ui.controls.TextEdit.EventType.KEY_PRESS,
    'char': charcode
  });
};

/**
 * Triggers when a key was pressed and value was changed.
 * @param {string} char Pressed symbol
 * @public
 */
prototype.valueModified = function() {
  this.dispatchEvent(DD.ui.controls.TextEdit.EventType.VALUE_MODIFIED);
};

}); // goog.scope
