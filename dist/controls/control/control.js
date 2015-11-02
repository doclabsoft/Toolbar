/**
 * Base control component.
 * Similar to goog.ui.Control. Foundation for buttons, checkboxes, etc.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Control');

goog.require('DD.ui.controls');
goog.require('DD.ui.Item');
goog.require('DD.ui.controls.renderer.Control');
goog.require('DD.ui.Component');
goog.require('goog.ui.registry');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @param {Object=} options Component's properties and event handlers.
 *    See other possible options in {@link DD.ui.Component}.
 * @param {string=} options.caption Component's caption.
 * @param {string=} options.icon Image url refering to an image or cssClass.
 *    Ignored if imageIndex is set.
 * @param {number=} options.imageIndex "Index of an image in a sprite sheet".
 *    Css class suffix. Creates class like "DD-sprite-index-<imageIndex>".
 * @param {string=} options.hint Element's popup hint.
 * @param {boolean=} options.wrap If TRUE, component will break the row
 *    in a parent toolbar. Useless if component is used without a toolbar.
 * @param {number=} options.priority Component's priority in a toolbar.
 *    If priority>=0 component's element will be collapsed by toolbar.
 * @param {string=} options.name Component's name. Used mostly by radiobuttons.
 * @param {*=} options.value Component's value.
 *    Used mostly by TextEdit and Spinner/Slider.
 * @param {eventCallback=} options.click Triggers when user clicks
 *    on the component's element.
 *    Handles event DD.ui.EventType.ACTION.
 * @param {eventCallback=} options.change Triggers when
 *    the component's value is changed.
 *    Handles event DD.ui.EventType.VALUE_CHANGED.
 * @constructor
 * @extends DD.ui.Item
 */
DD.ui.controls.Control = function(options) {
  DD.ui.Item.call(this, options);
};
goog.inherits(DD.ui.controls.Control, DD.ui.Item);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Control, DD.ui.controls.renderer.Control);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Control.prototype */
var prototype = DD.ui.controls.Control.prototype;
var superClass_ = DD.ui.controls.Control.superClass_;
var ACTION = DD.ui.EventType.ACTION;
var VALUE_CHANGED = DD.ui.EventType.VALUE_CHANGED;


// ------------------------------
// Properties
// ------------------------------

/**
 * Reference to an action. Action implements pattern COMMAND (ACTION).
 * @type {?DD.Action}
 * @private
 */
prototype.action_ = null;

/**
 * Native control name.
 * @type {string}
 * @private
 */
prototype.name_ = '';

/**
 * Hidden only if no empty space left. Visible if there is enough space.
 * @type {boolean}
 * @private
 */
prototype.hidden_ = false;

/**
 * The hint like an HTML title.
 * @type {string}
 * @private
 */
prototype.hint_ = '';

/**
 * Image sprite index.
 * @type {number}
 * @private
 */
prototype.imageIndex_ = -1;

/**
 * Priority to resize.
 * @type {number}
 * @private
 */
prototype.priority_ = 0;

/**
 * If TRUE the control interrupts the current row of controls.
 * @type {boolean}
 * @private
 */
prototype.wrap_ = false;


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

  if (goog.isNumber(options.imageIndex))
    this.setImageIndex(options.imageIndex);

  if (goog.isString(options.hint))
    this.setHint(options.hint);

  if (goog.isBoolean(options.wrap))
    this.setWrap(options.wrap);

  if (goog.isNumber(options.priority))
    this.setPriority(options.priority);

  if (goog.isString(options.name))
    this.setName(options.name);

  if (goog.isDefAndNotNull(options.value))
    this.setValue(options.value);

  if (goog.isFunction(options.click))
    this.listen(ACTION, options.click);

  if (goog.isFunction(options.change))
    this.listen(VALUE_CHANGED, options.change);
};

/**
 * @inheritdoc
 */
prototype.resize = function() {

  if (!this.isInDocument())
    return;

  var renderer = this.getRenderer();
  if (renderer.resize)
    renderer.resize(this);
};

/**
 * @param {?DD.Action} action
 * @public
 */
prototype.setAction = function(action) {
  this.action_ = action;
};

/**
 * @param {?DD.Action} action
 * @public
 */
prototype.getAction = function() {
  return this.action_;
};

/**
 * Sets the name.
 * @param {string} name
 * @public
 */
prototype.setName = function(name) {

  if (name === this.name_)
    return;

  this.name_ = name;

  var renderer = this.getRenderer();
  if (renderer.setName)
    renderer.setName(this, this.name_);
  this.changed();
};

/**
 * Gets the name.
 * @return {string}
 * @public
 */
prototype.getName = function() {
  return this.name_;
};

/**
 * Sets the "canFocus".
 * @param {boolean} canFocus
 * @public
 */
prototype.setCanFocus = function(canFocus) {
  this.setSupportedState(DD.ui.Component.State.FOCUSED, canFocus);
};

/**
 * Checks if the component can be focused.
 * @return {boolean}
 * @public
 */
prototype.canFocus = function() {
  return this.isSupportedState(DD.ui.Component.State.FOCUSED);
};

/**
 * Makes the component hidden.
 * No CHANGE event! setHidden is used during resize by renderers only.
 * @param {boolean} hidden
 * @public
 */
prototype.setHidden = function(hidden) {

  hidden = !!hidden;
  if (hidden === this.hidden_)
    return;

  this.hidden_ = hidden;

  var renderer = this.getRenderer();
  if (renderer.setHidden)
    renderer.setHidden(this, hidden);
};

/**
 * Checks if the component is hidden.
 * @return {boolean}
 * @public
 */
prototype.isHidden = function() {
  return this.hidden_;
};

/**
 * Sets the hint.
 * @param {string} hint
 * @public
 */
prototype.setHint = function(hint) {

  if (hint === this.hint_)
    return;

  this.hint_ = hint;

  var renderer = this.getRenderer();
  if (renderer.setHint)
    renderer.setHint(this, this.hint_);
  this.changed();
}

/**
 * Gets the hint.
 * @return {string}
 * @public
 */
prototype.getHint = function() {
  return this.hint_;
};

/**
 * @param {number} index
 * @public
 * @see {DD.ui.Item.prototype.setIcon}
 */
prototype.setImageIndex = function (index) {

  index = +index;
  if (index === this.imageIndex_)
    return;

  index === -1
    ? this.setIcon('')
    : this.setIcon('DD-sprite-index-' + index);

  this.imageIndex_ = index;
  this.changed();
};

/**
 * @return {number}
 * @public
 */
prototype.getImageIndex = function() {
  return this.imageIndex_;
};

/**
 * Sets the priority.
 * @param {number} priority
 * @public
 */
prototype.setPriority = function(priority) {

  priority = +priority;
  if (priority === this.priority_)
    return;

  this.priority_ = priority;
  this.changed();
};

/**
 * Gets the priority.
 * @return {number}
 * @public
 */
prototype.getPriority = function() {
    return this.priority_;
};

/**
 * Makes the control last in the row if wrap = TRUE.
 * @param {boolean} wrap
 * @public
 */
prototype.setWrap = function(wrap) {

  wrap = !!wrap;
  if (wrap === this.wrap_)
    return;

  this.wrap_ = !!wrap;
  this.changed();
};

/**
 * Checks if the control is breaking row.
 * @return {boolean}
 * @public
 */
prototype.isWrap = function() {
  return this.wrap_;
};

/**
 * Click, keydown and touch emulation.
 * Facade for method "activate".
 * Айрат просил метод именно с таким названием.
 * Так что просто сделаем фасад для уже существующего метода.
 * @return {boolean} FALSE if the click was stopped.
 * @public
 */
prototype.click = function() {
  return this.activate();
};

}); // goog.scope
