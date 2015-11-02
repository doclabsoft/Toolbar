/**
 * Toolbar renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Toolbar_Dropdown');

goog.require('DD.ui.controls.renderer.Toolbar');
goog.require('DD.ui.controls.SizeHelper.GroupSize');
goog.require('goog.ui.Popup');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.style');
goog.require('goog.Throttle');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Toolbar
 */
DD.ui.controls.renderer.Toolbar_Dropdown = function() {
  DD.ui.controls.renderer.Toolbar.call(this);
  this.SCROLLBAR_WIDTH = goog.style.getScrollbarWidth();
  this.POPUP = true;
};
goog.inherits(DD.ui.controls.renderer.Toolbar_Dropdown, DD.ui.controls.renderer.Toolbar);
goog.addSingletonGetter(DD.ui.controls.renderer.Toolbar_Dropdown);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Toolbar_Dropdown.CSS_CLASS = 'DD-toolbar-dropdown';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Toolbar_Dropdown.prototype */
var prototype = DD.ui.controls.renderer.Toolbar_Dropdown.prototype;
var superClass_ = DD.ui.controls.renderer.Toolbar_Dropdown.superClass_;
var AnchoredPosition = goog.positioning.AnchoredPosition;
var Corner = goog.positioning.Corner;
var CLICK = goog.events.EventType.CLICK;


// ------------------------------
// Properties
// ------------------------------

/**
 * @type {number}
 */
prototype.SCROLLBAR_WIDTH = 17;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Toolbar_Dropdown.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.createDom = function(component) {

  var element = superClass_.createDom.call(this, component);
  var dom = component.getDomHelper();
  var customClass = component.getCustomCssClass();

  var popupElement = dom.createDom('div', this.getBEMClass(component, 'popup'));
  goog.dom.classes.add(popupElement, DD.ui.controls.renderer.Toolbar.CSS_CLASS + '__popup');
  if (customClass)
    goog.dom.classes.add(popupElement, customClass);

  var popupContent = dom.createDom('div', this.getBEMClass(component, 'content'));
  goog.dom.classes.add(popupElement, DD.ui.controls.renderer.Toolbar.CSS_CLASS + '__content');
  popupElement.appendChild(popupContent);
  component.$cache('popupContent', popupContent);

  popupElement.style.display = 'none';
  popupElement.style.position = 'absolute';
  popupElement.style.top = 0;
  component.$cache('popupElement', popupElement);

  var btnMore = dom.createDom('button', this.getBEMClass(component, 'button-more'));
  btnMore.style.float = 'right';
  btnMore.style.display = 'none';
  goog.dom.insertSiblingBefore(btnMore, component.getContentElement());
  component.$cache('btnMore', btnMore);

  this.setScrollOrientation(component, component.getScrollOrientation());

  return element;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {

  superClass_.initializeDom.call(this, component);

  var eventHandler = component.$cache('eventHandler');

  var popupElement = component.$cache('popupElement');
  var element = component.getElement();
  var container = element.parentNode;
  container.insertBefore(popupElement, element.nextSibling);
  popupElement.style.overflowX = 'hidden';

  var btnMore = component.$cache('btnMore');
  eventHandler.listen(btnMore, CLICK,
      this.onBtnMoreClick_.bind(this, component), false)

  var popup = new goog.ui.Popup(popupElement);
  popup.setAutoHide(true);
  popup.setHideOnEscape(true);
  popup.setPosition(new AnchoredPosition(component.getElement(), Corner.BOTTOM_END));
  popup.setPinnedCorner(Corner.TOP_END);
  popup.setVisible(false);
  component.$cache('popup', popup);
  eventHandler.listen(popup, goog.ui.PopupBase.EventType.HIDE,
      this.onPopupHide_.bind(this, component), false);

  popup.addAutoHidePartner(component.getElement());
  this.setAutohidePartners_(component);
  this.resize(component);

  if (component.isOpened())
    popup.setVisible(true);
};

/**
 * @inheritdoc
 */
prototype.uninitializeDom = function(component) {

  var popupElement = component.$cache('popupElement');
  if (popupElement)
    goog.dom.removeNode(popupElement);

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
  if (popup.isVisible() === enabled)
    return;
  popup.setVisible(enabled);
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @param {DD.ui.controls.Toolbar.ScrollOrientation} orientation
 * @public
 */
prototype.setScrollOrientation = function(component, orientation) {

  // var popupElement = component.$cache('popupElement');
  // if (!popupElement)
  //   return;

  // var scroll = orientation === DD.ui.controls.Toolbar.ScrollOrientation.VERTICAL;
  // popupElement.style.overflowY = scroll ? 'auto' : 'hidden';
};


// ------------------------------
// Special methods for smart resizing.
// ------------------------------

/**
 * @param {DD.ui.controls.Toolbar} component
 * @protected
 */
prototype.resizeInternal = function(component) {

  if (!component.isInDocument())
    return;
  var element = component.getElement();
  var content = component.getContentElement();

  var openComponent = component.isOpened();
  if (openComponent)
    component.setOpened(false);
  component.$cache('closeOnParentHide', null);
  var canShowPopup = false;
  var btnMore = component.$cache('btnMore');
  btnMore.style.display = 'none';

  DD.ui.utils.hideForDomReading(element, function() {

    var rows = this.calculateRows_(component);
    if (rows.length > 1) {
      canShowPopup = true;
      btnMore.style.display = 'block';
    }
    this.applyRowsSizes_(component, rows);
    this.renderMainRow_(component, rows[0]);
    this.renderPopupRows_(component, rows);

  }.bind(this));

  if (openComponent && canShowPopup) {
    component.setOpened(true);
  }
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @param {Array.<DD.ui.controls.SizeHelper.GroupSize>}
 * @private
 */
prototype.applyRowsSizes_ = function(component, rows) {

  var i, size, group;
  for (i=0; i<rows.length; i++) {
    group = rows[i];
    group.applyIndents();
    group.rootLevelWalk(function(size) {
      var item = size.getComponent();
      if (!item.isInDocument() || !item.isVisible())
        return;
      var renderer = item.getRenderer();
      if (!renderer.applySize)
        return;
      renderer.applySize(item, size);
    });
  }
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @private
 */
prototype.calculateRows_ = function(component) {

  var options = {
    minWidth: component.getItemMinWidth(),
    maxWidth: component.getItemMaxWidth(),
    indent: component.getIndent()
  };
  this.resetStyles(component, options);

  var content = component.getContentElement();
  var popupElement = component.$cache('popupElement');
  var popupContent = component.$cache('popupContent');
  var btnMore = component.$cache('btnMore');
  var scroll = component.getScrollOrientation() === DD.ui.controls.Toolbar.ScrollOrientation.VERTICAL;
  var rowCount = component.getRowCount();

  var mainRowWidth = DD.ui.utils.getContentWidth(content);
  popupElement.style.width = mainRowWidth + 'px';
  popupElement.style.visibility = 'hidden';
  popupElement.style.display = 'block';
  var popupRowWidth = DD.ui.utils.getContentWidth(popupContent);
  var size = this.getSize(component, options);
  var group = size.getGroup();

  var i, widths = [mainRowWidth];
  for (i=1; i<rowCount; i++)
    widths.push(popupRowWidth);

  var rows = null;

  if (scroll) {

    btnMore.style.display = 'block';
    widths[0] = widths[0] - btnMore.offsetWidth - component.getIndent();
    btnMore.style.display = 'none';

    var rows = group.getRows(widths, false);

    if (rows.length === 1) {
      widths[0] = mainRowWidth;
      rows = group.getRows(widths, false);
    } else if (rows.length > widths.length) {
      popupRowWidth -= this.SCROLLBAR_WIDTH;
      for (i=1; i<rowCount; i++)
        widths[i] = popupRowWidth;
      rows = group.getRows(widths, false);
    }

  } else {

    btnMore.style.display = 'block';
    widths[0] = widths[0] - btnMore.offsetWidth - component.getIndent();
    btnMore.style.display = 'none';

    var toCollapse = [];
    rows = group.getRows(widths, true, function(size2) {
      var group1 = size2.getParentGroup() || null;
      var size1 = group1 && group1.getParentSize() || null;
      if (size1.getParentGroup() === group) {
        toCollapse.push(size1.getComponent());
        return false;
      }
    }.bind(this));

    goog.array.removeDuplicates(toCollapse);
    var i, width;
    for (i=0; i<toCollapse.length; i++) {
      this.collapseGroup(component, toCollapse[i]);
      this.clearSize(component, false);
      size = this.getSize(component, options);
      group = size.getGroup();
      rows = group.getRows(widths, true, function(size) {
        if (size.getParentGroup())
          return false;
      });
      if (rows.length <= rowCount)
        break;
    }

    if (rows.length === 1) {
      widths[0] = mainRowWidth;
      rows = group.getRows(widths, true, function(size) {
        if (size.getParentGroup())
          return false;
      });
    }
  }

  popupElement.style.display = 'none';
  popupElement.style.visibility = '';
  return rows;
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @param {Array.<DD.ui.controls.SizeHelper.GroupSize>}
 * @private
 */
prototype.renderMainRow_ = function(component, group) {
  var element = component.getContentElement();
  group.rootLevelWalk(function(size) {
    var item = size.getComponent();
    var el = item.getElement();
    if (el.parentNode !== element)
      element.appendChild(el);
  });
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @param {Array.<DD.ui.controls.SizeHelper.GroupSize>}
 * @private
 */
prototype.renderPopupRows_ = function(component, groups) {

  var element = component.getContentElement();

  this.closeOpenedChildren(component);
  var popupElement = component.$cache('popupElement');
  var popupContent = component.$cache('popupContent');
  goog.dom.removeChildren(popupContent);

  var scroll = component.getScrollOrientation() === DD.ui.controls.Toolbar.ScrollOrientation.VERTICAL;
  var rowElements = [];
  var rowElement = null;
  var dom = component.getDomHelper();
  var closeOnParentHide = [];

  for (i=1; i<groups.length; i++) {
    rowElement = dom.createDom('div', this.getBEMClass(component, 'row'));
    rowElement.style.whiteSpace = 'nowrap';
    groups[i].rootLevelWalk(function(size) {
      var item = size.getComponent();
      var el = item.getElement();
      rowElement.appendChild(el);
      closeOnParentHide.push(item);
    });
    popupContent.appendChild(rowElement);
    rowElements.push(rowElement);
  }

  this.openClosedChildren(component);

  popupElement.style.maxHeight = '';

  if (scroll) {
    popupElement.style.display = 'block';
    var firstInvisible = rowElements[component.getRowCount() - 1];
    if (firstInvisible)
      popupElement.style.maxHeight = firstInvisible.offsetTop + 'px';
    popupElement.style.display = 'none';
  } else {
    for (i=component.getRowCount() - 1; i<rowElements.length; i++) {
      rowElements[i].style.display = 'none';
    }
  }

  component.$cache('closeOnParentHide', closeOnParentHide);
};

/**
 * @param {DD.ui.controls.Toolbar} component
 * @param {goog.events.Event} event
 * @private
 */
prototype.onChange = function(component, event) {
  superClass_.onChange.call(this, component, event);
  this.setAutohidePartners_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {goog.events.Event} event
 */
prototype.onPopupHide_ = function(component, event) {
  component.setOpened(false);
  var closeOnParentHide = component.$cache('closeOnParentHide');
  if (closeOnParentHide) {
    for (var i=0; i<closeOnParentHide.length; i++) {
      if (closeOnParentHide[i].isOpened() && closeOnParentHide[i].getRenderer().POPUP) {
        closeOnParentHide[i].setOpened(false);
      }
    }
  }
};

/**
 * @param {DD.ui.Component} component
 * @param {goog.events.Event} event
 */
prototype.onBtnMoreClick_ = function(component, event) {
  var popup = component.$cache('popup');
  if (!popup)
    return;
  component.setOpened(!popup.isOrWasRecentlyVisible());
};

/**
 * @param {DD.ui.Component} component
 * @private
 */
prototype.setAutohidePartners_ = function(component) {

  var popup = component.$cache('popup');
  if (!popup)
    return;

  var i;

  var partners = component.$cache('autoHidePartners');
  if (partners) {
    for (i=0; i<partners.length; i++) {
      popup.removeAutoHidePartner(partners[i]);
    }
  }

  partners = [];
  component.forEach(function(child) {
    if (child instanceof DD.ui.controls.DropdownButton)
      partners.push(child.getContentElement());
    else if (child instanceof DD.ui.controls.Group) {
      child.forEach(function(subchild) {
        if (subchild instanceof DD.ui.controls.DropdownButton)
          partners.push(subchild.getContentElement());
      });
    }
  });

  for (i=0; i<partners.length; i++) {
    popup.addAutoHidePartner(partners[i]);
  }
  component.$cache('autoHidePartners', partners);
};

}); // goog.scope
