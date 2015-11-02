/**
 * Toolbar.
 * @project UI controls
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Toolbar');

goog.require('DD.ui.controls.Group');
goog.require('DD.ui.controls.renderer.Toolbar_Flat');
goog.require('DD.ui.controls.renderer.Toolbar_Dropdown');
goog.require('goog.ui.registry');
goog.require('goog.object');
goog.require('goog.dom');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Classic form.
var toolbar = new DD.ui.controls.Toolbar();
var profileButton = new DD.ui.controls.Button();
profileButton.setCaption('Profile');
profileButton.listen(DD.ui.EventType.ACTION, function() { // open profile });
toolbar.add(profileButton);

// Short form.
var toolbar = new DD.ui.controls.Toolbar({
  indent: 4,
  minItemWidth: 30,
  maxItemWidth: 120,
  scroll: 'horizontal', // 'horizontal' | 'vertical' | 'none'
  items: [{
    id: 'profile',
    caption: 'Profile',
    click: function() { // open profile }
  }, {
    id: 'settings',
    caption: 'Settings',
    click: function() { // show settings }
  }, {
    id: 'search',
    caption: 'Search',
    type: 'textinput',
    value: '',
    hint: 'search in the document',
    change: function() { // do search  }
  }]
});

 * @param {Object=} options Component's options or items.
 *    See other possible options in {@link DD.ui.controls.Group}.
 * @param {boolean=} options.noWrap Simple or multilined toolbar.
 * @param {number=} options.rowCount If the toolbar is multilined,
 *    so rowCount defines the number of rows.
 * @param {DD.ui.controls.Toolbar.ScrollOrientation=} options.scroll
 *    Scroll position. By default no scrolls at all.
 * @param {boolean=} [options.autoResize=false]
 *    Do resize when window resizes or not.
 * @constructor
 * @extends DD.ui.controls.Group
 */
DD.ui.controls.Toolbar = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isArray(arguments[0]))
      tempOptions.items = arguments[0];
    options = tempOptions;
  }
  DD.ui.controls.Group.call(this, options);
};
goog.inherits(DD.ui.controls.Toolbar, DD.ui.controls.Group);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Toolbar, DD.ui.controls.renderer.Toolbar_Flat);


// ------------------------------
// Constants
// ------------------------------

/**
 * @enum {string}
 */
DD.ui.controls.Toolbar.ScrollOrientation = {
  NONE: 'none',
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Toolbar.prototype */
var prototype = DD.ui.controls.Toolbar.prototype;
var superClass_ = DD.ui.controls.Toolbar.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * Display all items in one row? Yes if TRUE.
 * @type {boolean}
 * @default
 * @private
 */
prototype.noWrap_ = true;

/**
 * Max row number. It can't be less then 1.
 * @type {number}
 * @default
 * @private
 */
prototype.rowCount_ = 1;

/**
 * How to show hidden controls.
 * @type {DD.ui.controls.Toolbar.ScrollOrientation}
 * @default DD.ui.controls.Toolbar.ScrollOrientation.NONE
 * @private
 */
prototype.scrollOrientation_ = DD.ui.controls.Toolbar.ScrollOrientation.NONE;

/**
 * Resize on window resize.
 * @type {boolean}
 * @default
 * @private
 */
prototype.autoResize_ = false;


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

  if (goog.isBoolean(options.noWrap))
    this.setNoWrap(options.noWrap);

  if (goog.isDefAndNotNull(options.scroll))
    this.setScrollOrientation(options.scroll);

  if (goog.isNumber(options.rowCount))
    this.setRowCount(options.rowCount);

  if (goog.isBoolean(options.autoResize))
    goog.events.listen(window, 'resize', this.resize, false, this);
};

/**
 * @param {boolean} enabled
 * @public
 */
prototype.setNoWrap = function(enabled) {

  enabled = !!enabled;
  if (enabled === this.noWrap_)
    return;

  this.noWrap_ = enabled;

  var renderer = enabled
    ? DD.ui.controls.renderer.Toolbar_Flat.getInstance()
    : DD.ui.controls.renderer.Toolbar_Dropdown.getInstance();
  this.changeRenderer(renderer);
  this.changed();
};

/**
 * @return {boolean}
 * @public
 */
prototype.isNoWrap = function() {
  return this.noWrap_;
};

/**
 * @param {number} value
 * @public
 */
prototype.setRowCount = function(value) {

  value = +value;
  if (value < 1)
    value = 1;

  if (value === this.rowCount_)
    return;

  var oldValue = this.rowCount_;
  this.rowCount_ = value;

  if (value === 1) {
    this.changeRenderer(DD.ui.controls.renderer.Toolbar_Flat.getInstance());
    this.changed();
  } else if (oldValue === 1 && !this.isNoWrap()) {
    this.changeRenderer(DD.ui.controls.renderer.Toolbar_Dropdown.getInstance());
    this.changed();
  } else {
    var renderer = this.getRenderer();
    if (renderer.setRowCount)
      renderer.setRowCount(this, value);
    this.changed();
  }
};

/**
 * @return {number}
 * @public
 */
prototype.getRowCount = function() {
  return this.rowCount_;
};

/**
 * @param {DD.ui.controls.Toolbar.ScrollOrientation} orientation
 * @public
 */
prototype.setScrollOrientation = function(orientation) {

  if (orientation === this.scrollOrientation_)
    return;
  if (!goog.object.contains(DD.ui.controls.Toolbar.ScrollOrientation, orientation))
    return;

  this.scrollOrientation_ = orientation;

  var renderer = this.getRenderer();
  if (renderer.setScrollOrientation)
    renderer.setScrollOrientation(this, orientation);
  this.changed();
};

/**
 * @return {DD.ui.controls.Toolbar.ScrollOrientation}
 * @public
 */
prototype.getScrollOrientation = function() {
  return this.scrollOrientation_;
};

/**
 * @inheritdoc
 */
prototype.setItemMinWidthInternal = function(value) {

  superClass_.setItemMinWidthInternal.call(this, value);

  var minWidth = this.getItemMinWidth();
  this.forEach(function(child) {
    if (child instanceof DD.ui.controls.Group)
      child.setItemMinWidthInternal(minWidth);
  }.bind(this));
};

/**
 * @inheritdoc
 */
prototype.setItemMaxWidthInternal = function(value) {

  superClass_.setItemMaxWidthInternal.call(this, value);

  var maxWidth = this.getItemMaxWidth();
  this.forEach(function(child) {
    if (child instanceof DD.ui.controls.Group)
      child.setItemMaxWidthInternal(maxWidth);
  }.bind(this));
};

/**
 * @inheritdoc
 */
prototype.setIndentInternal = function(value) {

  superClass_.setIndentInternal.call(this, value);

  var indent = this.getIndent();
  this.forEach(function(child) {
    if (child instanceof DD.ui.controls.Group)
      child.setIndentInternal(indent);
  }.bind(this));
};

/**
 * @inheritdoc
 */
prototype.add = function(item, index) {

  this.beginUpdate();

  if (item instanceof DD.ui.controls.Group) {
    item.setIndentInternal(this.getIndent());
    item.setItemMinWidthInternal(this.getItemMinWidth());
    item.setItemMaxWidthInternal(this.getItemMaxWidth());
  }
  superClass_.add.call(this, item, index);

  this.endUpdate();
};

/**
 * @public
 */
prototype.resize = function() {

  if (!this.isInDocument())
    return;

  var renderer = this.getRenderer();
  if (renderer.resize)
    renderer.resize(this);
};

/**
 * Удаляет кнопку из тулбара по переданному ID или самому компоненту.
 * Кнопка ищется как в самом тулбаре, так и в его дочерних группах.
 * @param {string|DD.ui.controls.Control} control
 * @public
 */
prototype.removeControl = function(control) {

  if (goog.isObject(control) && control instanceof DD.ui.controls.Control) {
    control.remove();
    return control;
  }

  if (goog.isString(control)) {
    control = this.getControl(control);
    if (control)
      control.remove();
    return control;
  }
};

/**
 * Удаляет переданные кнопки или их ID из тулбара.
 * Кнопки ищутся как в самом тулбаре, так и в его дочерних группах.
 * @param {string} id
 * @public
 */
prototype.removeControls = function(controls) {

  this.beginUpdate();

  if (!goog.isArray(controls)) {
    control.remove();
  } else if (controls.length > 0) {
    for (var i=0; i<controls.length; i++)
      this.removeControl(controls[i]);
  }

  this.endUpdate();
};

}); // goog.scope
