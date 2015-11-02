/**
 * Text edit field renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Spinner');

goog.require('DD.ui.controls.renderer.Control');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyCodes');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Component
 */
DD.ui.controls.renderer.Spinner = function() {
  DD.ui.controls.renderer.Control.call(this);
};
goog.inherits(DD.ui.controls.renderer.Spinner, DD.ui.controls.renderer.Control);
goog.addSingletonGetter(DD.ui.controls.renderer.Spinner);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Spinner.CSS_CLASS = 'DD-spinner';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Spinner.prototype */
var prototype = DD.ui.controls.renderer.Spinner.prototype;
var superClass_ = DD.ui.controls.renderer.Spinner.superClass_;
var KeyHandler = goog.events.KeyHandler;
var KeyCodes = goog.events.KeyCodes;
var CLICK = goog.events.EventType.CLICK;


// ------------------------------
// Properties
// ------------------------------

/**
 * @inheritdoc
 */
prototype.tagName = 'div';

// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Spinner.CSS_CLASS;
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

  var keyHandler = new KeyHandler(control, false);
  component.$cache('keyHandler', keyHandler);

  eventHandler.listen(keyHandler, KeyHandler.EventType.KEY,
      this.onKeyPress_.bind(this, component), false);

  var btnLess = component.$cache('btnLess');
  if (btnLess)
    eventHandler.listen(btnLess, CLICK, this.onLessClick_.bind(this, component), false);

  var btnMore = component.$cache('btnMore');
  if (btnMore)
    eventHandler.listen(btnMore, CLICK, this.onMoreClick_.bind(this, component), false);
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
prototype.setReadonly = function(component, enabled) {

  superClass_.setReadonly.call(this, component, enabled);

  enabled = !!enabled;

  var control = component.$cache('control');
  if (!control)
    return;
  control.setAttribute('readonly', true);

  var btnLess = component.$cache('btnLess');
  if (btnLess) {
    enabled
      ? btnLess.setAttribute('disabled', true)
      : btnLess.removeAttribute('disabled');
  }

  var btnMore = component.$cache('btnMore');
  if (btnMore) {
    enabled
      ? btnMore.setAttribute('disabled', true)
      : btnMore.removeAttribute('disabled');
  }
};

/**
 * @inheritdoc
 */
prototype.setDisabled = function(component, enabled) {

  superClass_.setDisabled.call(this, component, enabled);

  enabled = !!enabled;

  var btnLess = component.$cache('btnLess');
  if (btnLess) {
    enabled
      ? btnLess.setAttribute('disabled', true)
      : btnLess.removeAttribute('disabled');
  }

  var btnMore = component.$cache('btnMore');
  if (btnMore) {
    enabled
      ? btnMore.setAttribute('disabled', true)
      : btnMore.removeAttribute('disabled');
  }
};

/**
 * @inheritdoc
 */
prototype.addControlElement = function(component, element, dom) {

  var control = dom.createDom('input', {
    type: 'text'
  });
  control.setAttribute('readonly', true);
  var btnLess = dom.createDom('button', this.getBEMClass(component, 'btn-less'));
  var btnMore = dom.createDom('button', this.getBEMClass(component, 'btn-more'));

  component.$cache('control', control);
  component.$cache('btnLess', btnLess);
  component.$cache('btnMore', btnMore);

  goog.dom.classes.add(control, this.getBEMClass(component, 'control'));

  element.appendChild(btnLess);
  element.appendChild(control);
  element.appendChild(btnMore);
};

/**
 * @param {DD.ui.Component} component
 * @param {goog.events.Event} event
 * @private
 */
prototype.onKeyPress_ = function(component, event) {

  // Detect only special keys to optimize.
  if (event.keyCode > 46)
    return;

  switch (event.keyCode) {

    case KeyCodes.LEFT:
    case KeyCodes.DOWN:
      component.decrease();
      break;

    case KeyCodes.RIGHT:
    case KeyCodes.UP:
      component.increase();
      break;

    case KeyCodes.HOME:
      component.setValue(component.getMinValue());
      break;

    case KeyCodes.END:
      component.setValue(component.getMaxValue());
      break;

    default:
      return;
  }
};

/**
 * @param {DD.ui.Component} component
 * @param {goog.events.Event} event
 * @private
 */
prototype.onLessClick_ = function(component, event) {
  component.decrease();
};

/**
 * @param {DD.ui.Component} component
 * @param {goog.events.Event} event
 * @private
 */
prototype.onMoreClick_ = function(component, event) {
  component.increase();
};

}); // goog.scope
