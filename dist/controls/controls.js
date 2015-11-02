/**
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 * @namespace DD.ui.controls
 */

/**
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 * @namespace DD.ui.controls.renderer
 */

goog.provide('DD.ui.controls');
goog.provide('DD.ui.controls.Type');
goog.provide('DD.ui.controls.renderer');

/**
 * @enum {string}
 */
DD.ui.controls.Type = {
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  RADIOBUTTON: 'radiobutton',
  DROPDOWNBUTTON: 'dropdownbutton',
  TEXTEDIT: 'textedit',
  SPINNER: 'spinner',
  SLIDER: 'slider',
  LABEL: 'label',
  GROUP: 'group',
  RADIOGROUP: 'radiogroup',
  TOOLBAR: 'toolbar',
  MENU: 'menu'
};