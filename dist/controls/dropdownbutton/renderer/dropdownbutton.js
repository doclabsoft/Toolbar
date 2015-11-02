/**
 * Text edit field renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.DropdownButton');

goog.require('DD.ui.controls.renderer.Button');
goog.require('goog.ui.Popup');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Overflow');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Component
 */
DD.ui.controls.renderer.DropdownButton = function() {
  DD.ui.controls.renderer.Button.call(this);
  this.OPENABLE = true;
  this.POPUP = true;
};
goog.inherits(DD.ui.controls.renderer.DropdownButton, DD.ui.controls.renderer.Button);
goog.addSingletonGetter(DD.ui.controls.renderer.DropdownButton);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.DropdownButton.CSS_CLASS = 'DD-dropdown';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.DropdownButton.prototype */
var prototype = DD.ui.controls.renderer.DropdownButton.prototype;
var superClass_ = DD.ui.controls.renderer.DropdownButton.superClass_;
var AnchoredPosition = goog.positioning.AnchoredPosition;
var Corner = goog.positioning.Corner;
var Overflow = goog.positioning.Overflow;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.DropdownButton.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {

  var element = superClass_.createDom.call(this, component);

  var dom = component.getDomHelper();
  var customClass = component.getCustomCssClass();

  var content = dom.createDom('div', this.getBEMClass(component) + '__popup');
  if (customClass)
    content.className += ' ' + customClass;
  content.style.display = 'none';
  content.style.position = 'absolute';
  component.setContentElement(content);
  this.setContent(component, component.getContent());

  return element;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {

  superClass_.initializeDom.call(this, component);

  var element = component.getElement();
  var content = component.getContentElement();
  if (content) {

    var popup = new goog.ui.Popup(content);
    var position = new AnchoredPosition(component.getElement(),
        Corner.BOTTOM_START, Overflow.ADJUST_X);

    popup.setVisible(false);
    popup.setAutoHide(true);
    popup.setPosition(position);
    popup.setPinnedCorner(Corner.TOP_START);
    popup.addAutoHidePartner(element);

    popup.listen(goog.ui.PopupBase.EventType.HIDE,
        this.onPopupHide_.bind(this, component), false);

    component.$cache('popup', popup);
  }
};

/**
 * @inheritdoc
 */
prototype.uninitializeDom = function(component) {

  var popup = component.$cache('popup');
  if (popup) {
    popup.dispose();
    component.$cache('popup', null);
  }

  superClass_.uninitializeDom.call(this, component);
};

/**
 * @inheritdoc
 */
prototype.setOpened = function(component, enabled) {

  var popup = component.$cache('popup');
  if (!popup)
    return;

  // if (popup.isOrWasRecentlyVisible() == enabled)
  //   return;

  if (popup.isVisible() == enabled)
    return;

  var element = component.$cache('root');
  var content = component.getContentElement();
  if (!element || !content)
    return;

  var popupStrategy = component.$cache('popupStrategy');
  if (!popupStrategy) {
    if (enabled) {
      goog.dom.insertSiblingAfter(content, element);
      content.style.minWidth = element.offsetWidth + 'px';
      if (popup && popup.setVisible)
        popup.setVisible(true);
    } else {
      if (popup && popup.setVisible)
        popup.setVisible(false);
      goog.dom.removeNode(content);
    }
  } else {
    popupStrategy.call(this, component, enabled);
  }
};

/**
 * @param {DD.ui.Component} component
 * @param {Function(component, boolean)} expandStrategy
 * @public
 */
prototype.setPopupStrategy = function(component, expandStrategy) {

  var oldStrategy = component.$cache('popupStrategy');
  if (oldStrategy === expandStrategy)
    return;

  component.$cache('popupStrategy', expandStrategy);
};

/**
 * @inheritdoc
 */
prototype.setHidden = function(component, enabled) {

  superClass_.setHidden.call(this, component, enabled);

  if (enabled) {
    var popup = component.$cache('popup');
    if (!popup)
      return;
    if (popup.isVisible())
      popup.setVisible(false);
  }
};

/**
 * @param {DD.ui.Component} component
 * @param {string} contentValue
 * @public
 */
prototype.setContent = function(component, contentValue) {

  var content = component.getContentElement();
  if (!content)
    return;

  content.innerHTML = contentValue;
};

/**
 * @param {DD.ui.Component} component
 * @param {goog.events.Event} event
 */
prototype.onPopupHide_ = function(component, event) {
  component.setOpened(false);
};

}); // goog.scope
