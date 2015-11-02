/**
 * @overview Checkbox simple renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Checkbox');

goog.require('DD.ui.controls.renderer.Control');
goog.require('goog.dom');
goog.require('goog.events');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Control
 */
DD.ui.controls.renderer.Checkbox = function() {
  DD.ui.controls.renderer.Control.call(this);
};
goog.inherits(DD.ui.controls.renderer.Checkbox, DD.ui.controls.renderer.Control);
goog.addSingletonGetter(DD.ui.controls.renderer.Checkbox);


/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Checkbox.CSS_CLASS = 'DD-checkbox';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Checkbox.prototype */
var prototype = DD.ui.controls.renderer.Checkbox.prototype;
var superClass_ = DD.ui.controls.renderer.Checkbox.superClass_;
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
  return DD.ui.controls.renderer.Checkbox.CSS_CLASS;
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
  if (element.tagName === 'INPUT' && element.type === 'checkbox')
    return true;
  if (element.tagName === 'LABEL' && element.control && element.control.type === 'checkbox')
    return true;
  return false;
};

/**
 * @inheritdoc
 */
prototype.setChecked = function(component, enabled) {

  var control = component.$cache('control');
  if (!control)
    return;

  control.checked = enabled;
};

/**
 * @inheritdoc
 */
prototype.setIndeterminate = function(component, enabled) {

  var control = component.$cache('control');
  if (!control)
    return;

  control.indeterminate = enabled;
};

/**
 * @inheritdoc
 */
prototype.addControlElement = function(component, element, dom) {

  var control = dom.createDom('input', {
    type: 'checkbox',
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

}); // goog.scope
