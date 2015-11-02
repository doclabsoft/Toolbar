/**
 * Text edit field renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.TextEdit');

goog.require('DD.ui.controls.renderer.Control');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyHandler');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Component
 */
DD.ui.controls.renderer.TextEdit = function() {
  DD.ui.controls.renderer.Control.call(this);
};
goog.inherits(DD.ui.controls.renderer.TextEdit, DD.ui.controls.renderer.Control);
goog.addSingletonGetter(DD.ui.controls.renderer.TextEdit);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.TextEdit.CSS_CLASS = 'DD-textedit';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.TextEdit.prototype */
var prototype = DD.ui.controls.renderer.TextEdit.prototype;
var superClass_ = DD.ui.controls.renderer.TextEdit.superClass_;
var KeyHandler = goog.events.KeyHandler;
var CHANGE = goog.events.EventType.CHANGE;


// ------------------------------
// Properties
// ------------------------------

/**
 * @inheritdoc
 */
prototype.tagName = 'label';


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.TextEdit.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {

  superClass_.initializeDom.call(this, component);

  var control = component.$cache('control');
  if (!control)
    return;

  var eventHandler = component.$cache('eventHandler');
  eventHandler.listen(control, CHANGE, this.onChange_.bind(this, component), false);

  var keyHandler = new KeyHandler(control, false);
  component.$cache('keyHandler', keyHandler);

  eventHandler.listen(keyHandler, KeyHandler.EventType.KEY,
      this.onKeyPress_.bind(this, component), false);
};

/**
 * @inheritdoc
 */
prototype.uninitializeDom = function(component) {

  var keyHandler = component.$cache('keyHandler');
  if (keyHandler)
    keyHandler.dispose();

  superClass_.uninitializeDom.call(this, component);
};

/**
 * @inheritdoc
 */
prototype.addControlElement = function(component, element, dom) {

  var control = dom.createDom('input', {
    type: 'text',
    name: component.getName()
  });

  element.appendChild(control);
  component.$cache('control', control);
  goog.dom.classes.add(control, this.getBEMClass(component, 'control'));
};

/**
 * Uppdate max length of the text field.
 * @param {DD.ui.Component} component
 * @param {number} maxLength
 * @public
 */
prototype.setMaxLength = function(component, maxLength) {

  var control = component.$cache('control');
  if (!control)
    return;

  maxLength
    ? control.setAttribute('maxlength', maxLength)
    : control.removeAttribute('maxlength');
};

/**
 * @param {DD.ui.controls.TextEdit.DisplayStyle}
 */
prototype.setDisplayStyle = function(component, style) {

  var control = component.$cache('control');
  if (!control)
    return;

  if (style === DD.ui.controls.TextEdit.DisplayStyle.PASSWORD)
    control.type = 'password';
  else if (style === DD.ui.controls.TextEdit.DisplayStyle.NORMAL)
    control.type = 'text';
};

/**
 * Triggers when user changes the text.
 * @param {DD.ui.Component} component
 * @param {goog.events.BrowserEvent} event
 * @return {boolean}
 * @private
 */
prototype.onChange_ = function(component, event) {
  component.setValueInternal(event.target.value);
  component.valueChanged();
};

/**
 * Triggers when user press the key.
 * @param {DD.ui.Component} component
 * @param {goog.events.BrowserEvent} event
 * @return {boolean}
 * @private
 */
prototype.onKeyPress_ = function(component, event) {

  var success = component.keyPressed(String.fromCharCode(event.keyCode));
  if (success === false) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  } else {
    setTimeout(function() {
      component.setValueInternal(event.target.value);
      component.valueModified();
    }, 0);
  }
};

}); // goog.scope
