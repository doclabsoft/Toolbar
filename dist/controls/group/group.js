/**
 * Group of control elements.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Group');

goog.require('DD.ui.controls');
goog.require('DD.ui.List');
goog.require('DD.ui.controls.renderer.Group_Flat');
goog.require('DD.ui.controls.renderer.Group_Expandable');
goog.require('DD.ui.controls.Type');
goog.require('DD.ui.controls.Button');
goog.require('DD.ui.controls.Checkbox');
goog.require('DD.ui.controls.RadioButton');
goog.require('DD.ui.controls.DropdownButton');
goog.require('DD.ui.controls.TextEdit');
goog.require('DD.ui.controls.Spinner');
goog.require('DD.ui.controls.Slider');
goog.require('DD.ui.controls.Label');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

var buttons = [{
  id: 'b',
  type: 'checkbox',
  caption: 'Bold',
  imageIndex: 12,
  checked: false
}, {
  id: 'i',
  type: 'checkbox',
  caption: 'Italic',
  imageIndex: 13,
  checked: false
}, {
  id: 'u',
  type: 'checkbox',
  caption: 'Underlined',
  imageIndex: 14,
  checked: false
}];

// Full form.
var group = new DD.ui.controls.Group({
  caption: 'Font style',
  cssClass: 'font-group',
  items: buttons
});

// Short form.
var group = new DD.ui.controls.Group('Font style', items: buttons);

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.Component}.
 * @param {string} options.caption Component's caption.
 * @param {string} options.icon Image url refering to an image or cssClass.
 *    Ignored if imageIndex is set.
 * @param {number} options.imageIndex Index of image in a sprite sheet.
 * @param {boolean} options.wrap If TRUE, component will break the row
 *    in a parent toolbar. Useless if component is used without a toolbar.
 * @param {number} options.itemMinWidth Minimal width (pixels) for each item
 *    in a group.
 * @param {number} options.itemMaxWidth Maximal width (pixels) for each item
 *    in a group.
 * @param {number} options.indent Space (pixels) between items in the group.
 * @param {Array.<Object>=} items Array of items, described by
 *    JSON objects of their options. See example.
 *    Format of each JSON object depends on the control's type. See
 *    {@link DD.ui.controls.Button}, {@link DD.ui.controls.Checkbox}, {@link DD.ui.controls.RadioButton},
 *    {@link DD.ui.controls.DropdownButton}, {@link DD.ui.controls.TextEdit},
 *    {@link DD.ui.controls.Spinner}, {@link DD.ui.controls.Slider}, {@link DD.ui.controls.Label}.
 *    Will be ignored if the first argument is options, not a caption.
 * @param {DD.ui.controls.Type=} [items[].type='button'] Type of a control.
 *    'button', 'checkbox', 'radiobutton', 'label' etc.
 * @constructor
 * @extends DD.ui.List
 */
DD.ui.controls.Group = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isArray(arguments[1]))
      tempOptions.items = arguments[1];
    options = tempOptions;
  }

  DD.ui.List.call(this, options);
};
goog.inherits(DD.ui.controls.Group, DD.ui.List);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Group,
    DD.ui.controls.renderer.Group_Flat);


// ------------------------------
// Constants
// ------------------------------

/**
 * @enum {string}
 */
DD.ui.controls.Group.DisplayMode = {

  /** Ruled by a parent component. Starts from 'flat' mode. */
  AUTO: 'auto',

  /** Horizontal list of items. The simpliest display mode. */
  FLAT: 'flat',

  /**
   * Button with expandable content block.
   * Content block is embeded. Items arranged in a row.
   */
  EXPANDABLE: 'expandable',

  /**
   * Not implemented yet.
   * Content block is absolute positioned. Items arranged in a column.
   */
  DROPDOWN: 'dropdown'
};


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Group.prototype */
var prototype = DD.ui.controls.Group.prototype;
var superClass_ = DD.ui.controls.Group.superClass_;
var Type = DD.ui.controls.Type;


// ------------------------------
// Properties
// ------------------------------

/**
 * @type {string}
 * @private
 */
prototype.caption_ = '';

/**
 * Icon css class or image url or image sprite index.
 * @type {string}
 * @private
 */
prototype.icon_ = '';

/**
 * Image sprite index.
 * @type {number}
 * @private
 */
prototype.imageIndex_ = -1;

/**
 * Hidden only if no empty space left. Visible if there is enough space.
 * @type {boolean}
 * @private
 */
prototype.hidden_ = false;

/**
 * If TRUE the control interrupts the current row of controls.
 * @type {boolean}
 * @private
 */
prototype.wrap_ = false;

/**
 * Minimal width for each item.
 * @type {number}
 * @default 0
 * @private
 */
prototype.itemMinWidth_ = 0;

/**
 * Maximal width for each item.
 * @type {number}
 * @default 0
 * @private
 */
prototype.itemMaxWidth_ = 0;

/**
 * Space between the two elements.
 * @type {number}
 * @default 0
 * @private
 */
prototype.indent_ = 0;

/**
 * Display mode.
 * @type {DD.ui.controls.Group.DisplayMode}
 * @default DD.ui.controls.Group.DisplayMode.AUTO
 * @private
 */
prototype.displayMode_ = DD.ui.controls.Group.DisplayMode.AUTO;


// ------------------------------
// Methods
// ------------------------------

/**
 * Назначает группе новые свойства и кнопки.
 * @param {Object=} opt_options
 * @param {Array.<Object>=} opt_options.items
 * @public
 */
prototype.assign = function(options) {

  if (!goog.isObject(options))
    return;

  superClass_.assign.call(this, options);

  if (goog.isString(options.caption))
    this.setCaption(options.caption);

  if (goog.isString(options.icon))
    this.setIcon(options.icon);

  if (goog.isNumber(options.imageIndex))
    this.setImageIndex(options.imageIndex);

  if (goog.isBoolean(options.wrap))
    this.setWrap(options.wrap);

  if (goog.isNumber(options.minItemWidth))
    this.setItemMinWidth(options.minItemWidth);

  if (goog.isNumber(options.maxItemWidth))
    this.setItemMaxWidth(options.maxItemWidth);

  if (goog.isNumber(options.indent))
    this.setIndent(options.indent);

  this.addControls(options.items);
};

/**
 * @param {Array.<Object>} controls
 * @public
 */
prototype.addControls = function(controls) {
  if (!goog.isArray(controls) || controls.length === 0)
    return;
  this.beginUpdate();
  for (var i=0; i<controls.length; i++)
    this.addControl(controls[i]);
  this.endUpdate();
};

/**
 * Создает контрол из массива свойств.
 * @param {Object} options
 * @return {?DD.ui.controls.Control}
 * @protected
 */
prototype.addControl = function(options) {

  if (!goog.isObject(options))
    return null;

  var type = options.type || (options.items ? Type.GROUP : Type.BUTTON);

  switch (type) {

    case Type.BUTTON:
      return this.addButton(options);

    case Type.CHECKBOX:
      return this.addCheckbox(options);

    case Type.RADIOBUTTON:
      return this.addRadioButton(options);

    case Type.DROPDOWNBUTTON:
      return this.addDropdownButton(options);

    case Type.TEXTEDIT:
      return this.addTextEdit(options);

    case Type.SPINNER:
      return this.addSpinner(options);

    case Type.SLIDER:
      return this.addSlider(options);

    case Type.LABEL:
      return this.addLabel(options);

    case Type.GROUP:
      return this.addGroup(options);

    case Type.RADIOGROUP:
      return this.addRadioGroup(options);

    case Type.TOOLBAR:
      return this.addToolbar(options);

    case type.MENU:
      return this.addMenu(options);

    default:
      return null;
  }
};

/**
 * @param {Object} options See all parameters in {@link DD.ui.controls.Button}.
 * @return {DD.ui.controls.Button}
 * @public
 */
prototype.addButton = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Button, arguments);
  this.add(control);
  return control;
};

/**
 * @param {Object} options See options in {@link DD.ui.controls.Checkbox}.
 * @return {DD.ui.controls.Checkbox}
 * @public
 */
prototype.addCheckbox = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Checkbox, arguments);
  this.add(control);
  return control;
};

/**
 * @param {Object} options See options in {@link DD.ui.controls.RadioButton}.
 * @return {DD.ui.controls.RadioButton}
 * @public
 */
prototype.addRadioButton = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.RadioButton, arguments);
  this.add(control);
  return control;
};

/**
 * @param {Object} options See options in {@link DD.ui.controls.DropdownButton}.
 * @return {DD.ui.controls.DropdownButton}
 * @public
 */
prototype.addDropdownButton = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.DropdownButton, arguments);
  this.add(control);
  return control;
};

/**
 * @param {Object} options See options in {@link DD.ui.controls.TextEdit}.
 * @return {DD.ui.controls.TextEdit}
 * @public
 */
prototype.addTextEdit = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.TextEdit, arguments);
  this.add(control);
  return control;
};

/**
 * @param {Object} options See options in {@link DD.ui.controls.Spinner}.
 * @return {DD.ui.controls.Spinner}
 * @public
 */
prototype.addSpinner = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Spinner, arguments);
  this.add(control);
  return control;
};

/**
 * @param {Object} options See options in {@link DD.ui.controls.Slider}.
 * @return {DD.ui.controls.Slider}
 * @public
 */
prototype.addSlider = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Slider, arguments);
  this.add(control);
  return control;
};

/**
 * @param {Object} options See options in {@link DD.ui.controls.Label}.
 * @return {DD.ui.controls.Label}
 * @public
 */
prototype.addLabel = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Label, arguments);
  this.add(control);
  return control;
};

/**
 * Adds an auto-displayed group.
 * @param {Object} options See options in {@link DD.ui.controls.Group}.
 * @return {DD.ui.controls.Group}
 * @public
 */
prototype.addGroup = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Group, arguments);
  this.add(control);
  return control;
};

/**
 * Adds an expandable group.
 * @param {Object} options See options in {@link DD.ui.controls.Group}.
 * @return {DD.ui.controls.Group}
 * @public
 */
prototype.addToolbar = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Group, arguments);
  control.setDisplayMode(DD.ui.controls.Group.DisplayMode.EXPANDABLE);
  this.add(control);
  return control;
};

/**
 * Adds a dropdown group.
 * @param {Object} options See options in {@link DD.ui.controls.Group}.
 * @return {DD.ui.controls.Group}
 * @public
 */
prototype.addMenu = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.Group, arguments);
  control.setDisplayMode(DD.ui.controls.Group.DisplayMode.DROPDOWN);
  this.add(control);
  return control;
};

/**
 * @example
    var group = toolbar.addRadioGroup({
      caption: 'Text align',
      name: 'align',
      items: [{
        caption: 'Left',
        value: 'left'
      }, {
        caption: 'Right',
        value: 'right'
      }, {
        caption: 'Middle',
        value: 'center'
      }],
      value: 'left',
      change: function(event) { // use event.target.getValue() }
    });
 * @param {Object} options
 * @return {DD.ui.controls.Group}
 * @public
 */
prototype.addRadioGroup = function(options) {
  var control = DD.ui.utils.create(DD.ui.controls.RadioGroup, arguments);
  this.add(control);
  return control;
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
 * @param {DD.ui.controls.Group.DisplayMode} mode
 * @public
 */
prototype.setDisplayMode = function(mode) {

  if (!goog.object.contains(DD.ui.controls.Group.DisplayMode, mode))
    return;
  this.displayMode_ = mode;

  if (this.displayMode_ === DD.ui.controls.Group.DisplayMode.EXPANDABLE)
    this.changeRenderer(DD.ui.controls.renderer.Group_Expandable.getInstance());
  else if (this.displayMode_ === DD.ui.controls.Group.DisplayMode.FLAT)
    this.changeRenderer(DD.ui.controls.renderer.Group_Flat.getInstance());
};

/**
 * @return {DD.ui.controls.Group.DisplayMode}
 * @public
 */
prototype.getDisplayMode = function() {
  return this.displayMode_;
};

/**
 * Sets the caption.
 * @param {string} caption
 * @public
 */
prototype.setCaption = function(caption) {

  if (caption === this.caption_)
    return;

  this.caption_ = caption;

  var renderer = this.getRenderer();
  if (renderer.setCaption) {
    renderer.setCaption(this, caption);
  }

  this.changed();
};

/**
 * Returns the caption.
 * @return {string}
 * @public
 */
prototype.getCaption = function() {
  return this.caption_;
};

/**
 * Sets the icon.
 * @param {string|number} image Css class or image url or image sprite index.
 * @public
 */
prototype.setIcon = function(icon) {

  if (icon === this.icon_)
    return;

  this.icon_ = icon;

  var renderer = this.getRenderer();
  if (renderer.setIcon)
    renderer.setIcon(this, icon);

  this.changed();
};

/**
 * Returns the icon.
 * @return {String}
 * @public
 */
prototype.getIcon = function() {
  return this.icon_;
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
 * @param {number} value
 * @public
 */
prototype.setItemMinWidth = function(value) {

  var oldValue = this.itemMinWidth_;
  this.setItemMinWidthInternal(value);
  if (this.itemMinWidth_ === oldValue)
    return;

  var renderer = this.getRenderer(renderer);
  if (renderer.setItemMinWidth)
    renderer.setItemMinWidth(this, this.getMinWidth());
  this.changed();
};

/**
 * @param {number} value
 * @public
 */
prototype.setItemMinWidthInternal = function(value) {

  value = +value;
  if (value < 0)
    value = 0;

  if (this.itemMaxWidth_ && value >= this.itemMaxWidth_)
    return;
  if (value === this.itemMinWidth_)
    return;

  this.itemMinWidth_ = value;
};

/**
 * @return {number}
 * @public
 */
prototype.getItemMinWidth = function() {
  return this.itemMinWidth_;
};

/**
 * @param {number} value
 * @public
 */
prototype.setItemMaxWidth = function(value) {

  var oldValue = this.itemMaxWidth_;
  this.setItemMaxWidthInternal(value);
  if (this.itemMaxWidth_ === oldValue)
    return;

  var renderer = this.getRenderer();
  if (renderer.setItemMaxWidth)
    renderer.setItemMaxWidth(this, this.getItemMaxWidth());
  this.changed();
};

/**
 * @param {number} value
 * @public
 */
prototype.setItemMaxWidthInternal = function(value) {

  value = +value;
  if (value < 0)
    value = 0;

  if (this.itemMinWidth_ && value <= this.itemMinWidth_)
    return;
  if (value === this.itemMaxWidth_)
    return;

  this.itemMaxWidth_ = value;
};

/**
 * @return {number}
 * @public
 */
prototype.getItemMaxWidth = function() {
  return this.itemMaxWidth_;
};

/**
 * @param {number} value
 * @public
 */
prototype.setIndent = function(value) {

  this.setIndentInternal(value);

  var renderer = this.getRenderer();
  if (renderer.setIndent)
    renderer.setIndent(this, this.getIndent());
  this.changed();
};

/**
 * @param {number} value
 * @public
 */
prototype.setIndentInternal = function(value) {

  value = +value;
  if (value < 0)
    value = 0;

  if (value === this.indent_)
    return;

  this.indent_ = value;
};

/**
 * @return {number}
 * @public
 */
prototype.getIndent = function() {
  return this.indent_;
};

/**
 * Ищет кнопку в группе по ее ID.
 * Кнопка ищется как в самом тулбаре, так и в его дочерних группах.
 * @param {string} id
 * @return {DD.ui.controls.Control}
 * @public
 */
prototype.getControl = function(id) {

  var control = this.getChild(id);

  if (!control) {
    this.forEach(function(child) {
      if (child instanceof DD.ui.controls.Group) {
        control = child.getControl(id);
        if (control)
          return false;
      }
    });
  }

  return control;
};

}); // goog.scope
