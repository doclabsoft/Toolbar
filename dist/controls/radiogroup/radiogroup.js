/**
 * Group of control elements.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.RadioGroup');

goog.require('DD.ui.controls.Group');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

var buttons = [{
  caption: 'Left',
  imageIndex: 4,
  value: 'left'
}, {
  caption: 'Center',
  imageIndex: 5,
  value: 'center'
}, {
  caption: 'Right',
  imageIndex: 6,
  value: 'right'
}];

// Full form.
var group = new DD.ui.controls.RadioGroup({
  caption: 'Text align',
  cssClass: 'align-group',
  items: buttons,
  value: 'left'
});

// Short form.
var group = new DD.ui.controls.RadioGroup('Font style', items: buttons);

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Group}.
 * @param {string=} value All elements in a radiogroup have same name,
 *    so the group looks and behave like a single control.
 *    Value of a group - is the value of the checked children radiobutton.
 *    Will be ignored if the first argument is options, not a caption.
 * @param {Array.<Object>=} items Array of items, described by
 *    JSON objects of their options. See example. Type of all controls
 *    will be idnored and forced to 'radiobutton'. Name of all items will be
 *    ignored and forced to the group's name. Checked state of all items
 *    will be ignored and determined by the group.
 *    Format of JSON objects see in {@link DD.ui.controls.RadioButton}.
 *    Will be ignored if the first argument is options, not a caption.
 * @constructor
 * @extends DD.ui.controls.Group
 */
DD.ui.controls.RadioGroup = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isString(arguments[1]))
      tempOptions.value = arguments[1];
    if (goog.isArray(arguments[2]))
      tempOptions.items = arguments[2];
    options = tempOptions;
  }

  if (!goog.isString(options.name))
    options.name = this.getId();

  DD.ui.controls.Group.call(this, options);
};
goog.inherits(DD.ui.controls.RadioGroup, DD.ui.controls.Group);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.RadioGroup.prototype */
var prototype = DD.ui.controls.RadioGroup.prototype;
var superClass_ = DD.ui.controls.RadioGroup.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * @type {string}
 * @private
 */
prototype.name_ = '';


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.enterDocument = function() {

  superClass_.enterDocument.call(this);

  this.getHandler().listen(this, DD.ui.EventType.CHECK,
      this.onButtonAction_.bind(this));
};

/**
 * @param {string} name
 * @public
 */
prototype.setName = function(name) {

  if (name === this.name_)
    return;

  this.name_ = name;

  this.beginUpdate();
  this.forEach(function(item) {
    item.setName(name);
  });
  this.endUpdate();
};

/**
 * @return {string}
 * @public
 */
prototype.getName = function() {
  return this.name_;
};

/**
 * @inheritdoc
 */
prototype.setValue = function(value) {

  if (value === superClass_.getValue.call(this))
    return;

  this.beginUpdate();

  this.forEach(function(item) {
    if (value === item.getValue()) {
      item.setChecked(true);
      return false;
    }
  });

  this.endUpdate();
  this.valueChanged();
};

/**
 * @return {string}
 * @public
 */
prototype.getValue = function() {

  var value = null;

  this.forEach(function(item) {
    if (item.isChecked()) {
      value = item.getValue();
      return false;
    }
  });

  return value;
};

/**
 * @inheritdoc
 */
prototype.add = function(item, index) {

  if (!(item instanceof DD.ui.controls.RadioButton))
    throw Error('Not a radio button');

  var name = this.getName();
  if (item.getName() !== name) {
    item.beginUpdate();
    item.setName(name);
    item.endUpdate(false);
  }

  superClass_.add.call(this, item, index);
};

/**
 * @param {Array.<Object>} variants Array of "{value: xxx, caption: xxx}".
 * @todo Remove it. Use addControls.
 * @public
 */
prototype.setVariants = function(variants) {

  if (!variants.length)
    return;

  this.clear();
  this.beginUpdate();

  var name = this.getName();
  for (var i=0; i<variants.length; i++) {
    variants[i].name = name;
    this.addRadioButton(variants[i]);
  }

  this.endUpdate();
};

/**
 * @param {goog.events.Event} event
 * @private
 */
prototype.onButtonAction_ = function(event) {
  if (event.target instanceof DD.ui.controls.RadioButton) {
    this.setValue(event.target.getValue());
  }
};

}); // goog.scope
