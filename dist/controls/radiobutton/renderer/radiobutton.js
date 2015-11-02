/**
 * Radio button renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.RadioButton');

goog.require('DD.ui.controls.renderer.Control');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Control
 */
DD.ui.controls.renderer.RadioButton = function() {
  DD.ui.controls.renderer.Control.call(this);
};
goog.inherits(DD.ui.controls.renderer.RadioButton, DD.ui.controls.renderer.Control);
goog.addSingletonGetter(DD.ui.controls.renderer.RadioButton);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.RadioButton.CSS_CLASS = 'DD-radiobutton';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @memberof DD.ui.controls.renderer.RadioButton */
var prototype = DD.ui.controls.renderer.RadioButton.prototype;
var superClass_ = DD.ui.controls.renderer.RadioButton.superClass_;
var Control = DD.ui.controls.renderer.Control;


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
  return DD.ui.controls.renderer.RadioButton.CSS_CLASS;
};

/**
 * Can decorate a single input[type=checkbox]
 *    or a label with a related input[type=checkbox].
 * @param {DD.ui.controls.Checkbox} component
 * @param {HTMLElement} an input[type=checkbox]
 *    or a label with a related input[type=checkbox].
 */
prototype.decorate = function(component, element) {

  component.beginUpdate();

  var dom = component.getDomHelper();
  var element, control;
  if (element.tagName === 'INPUT') {
    control = element;
    element = dom.createDom(this.tagName);
    control.parentNode.replaceChild(element, control);
  } else if (element.tagName === 'LABEL') {
    control = element.control;
    control.parentNode.removeChild(control);
    var text = element.innerHTML.trim();
    if (text)
      component.setCaption(text);
    element.innerHTML = '';
  }

  component.$cache('root', element);

  if (!component.isChecked() && control.checked)
    component.setChecked(true);
  if (!component.isReadonly() && control.readonly)
    component.setReadonly(true);
  if (!component.isDisabled() && control.disabled)
    component.setDisabled(true);
  if (!component.getName() && control.name !== '')
    component.setName(control.name);
  if (!component.getValue() && control.value !== '')
    component.setValue(control.value);

  this.setStates(component);

  component.endUpdate(false);

  element = superClass_.decorate.call(this, component, element);
  goog.dom.classes.add(element, Control.CSS_CLASS);

  this.addIcon(component, element, dom);
  this.setIcon(component, component.getIcon());

  component.$cache('control', control);
  goog.dom.classes.add(control, this.getBEMClass(component, 'control'));
  goog.dom.classes.add(control, Control.CSS_CLASS+'__control');
  element.appendChild(control);

  this.addCaption(component, element, dom);
  this.setCaption(component, component.getCaption());

  this.setHidden(component, component.isHidden());
  this.setHint(component, component.getHint());
  this.setName(component, component.getName());
  this.setValue(component, component.getValue());

  var icon = component.$cache('icon');
  if (icon)
    goog.dom.classes.add(icon, Control.CSS_CLASS+'__icon');

  var caption = component.$cache('caption');
  if (caption)
    goog.dom.classes.add(caption, Control.CSS_CLASS+'__caption');

  return element;
};

/**
 * @inheritdoc
 */
prototype.canDecorate = function(element) {
  if (element.tagName === 'INPUT' && element.type === 'radio')
    return true;
  if (element.tagName === 'LABEL' && element.control && element.control.type === 'radio')
    return true;
  return false;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {

  superClass_.initializeDom.call(this, component);

  var control = component.$cache('control');
  if (control) {
    var eventHandler = component.$cache('eventHandler');
    eventHandler.listen(control, 'uncheck', function(event) {
      component.setChecked(false);
    }, false);
  }
};

/**
 * @inheritdoc
 */
prototype.setChecked = function(component, enabled) {
debugger;
  var control = component.$cache('control');
  if (!control)
    return;

  control.checked = enabled;
  if (enabled) {
    var name = component.getName();
    if (name)
      this.synchronizeRadiogroup_(name);
  }
};

/**
 * @inheritdoc
 */
prototype.addControlElement = function(component, element, dom) {

  var control = dom.createDom('input', {
    type: 'radio',
    name: component.getName()
  });

  goog.dom.insertChildAt(element, control, 0);
  component.$cache('control', control);
  goog.dom.classes.add(control, this.getBEMClass(component, 'control'));
};

/**
 * @inheritdoc
 */
prototype.getActionTarget = function(component) {
  return component.$cache('control') || component.getElement();
};

/**
 * Detecting radiobitton deselecting.
 * @param {string} name Radio buttons name.
 * @private
 */
prototype.synchronizeRadiogroup_ = function(name) {

  var elements = document.getElementsByName(name);

  var element, i, length = elements.length;
  for (i=0; i<length; i++) {
    element = elements[i];
    if (element.type === 'radio' && !element.checked) {
      this.triggerUncheck_(element);
    }
  }
};

/**
 * @param {HTMLElement} control
 * @private
 */
prototype.triggerUncheck_ = function(control) {

  if (window.Event) {
    var event = new Event('uncheck');
    control.dispatchEvent(event);

  } else {
    var event = control.createEvent('Event');
    event.initEvent('uncheck', false, false);
    control.dispatchEvent(event);
  }
};

}); // goog.scope
