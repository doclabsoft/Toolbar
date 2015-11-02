goog.provide('DD.ui.test.ToolbarCollectionSettings');

goog.require('DD.ui.Component');
goog.require('DD.ui.controls.Toolbar');
goog.require('DD.ui.controls.Group');
goog.require('DD.ui.controls.Button');
goog.require('DD.ui.controls.Checkbox');
goog.require('DD.ui.controls.RadioButton');
goog.require('DD.ui.controls.RadioGroup');
goog.require('DD.ui.controls.DropdownButton');
goog.require('DD.ui.controls.TextEdit');
goog.require('DD.ui.controls.Spinner');
goog.require('DD.ui.controls.Slider');
goog.require('DD.ui.controls.Label');
goog.require('DD.ui.test.ToolbarControlTypes');


// ------------------------------
// Constructor
// ------------------------------

DD.ui.test.ToolbarCollectionSettings = function(toolbar, opt_customClass) {

  if (!(toolbar instanceof DD.ui.controls.Toolbar))
    throw Error('Not a toolbar instance');

  DD.ui.Component.call(this, {cssClass: opt_customClass});

  this.toolbar_ = toolbar;

  this.controlCount_ = 0;
  this.groupCount_ = 0;
  this.groupList_ = [];

  this.addAddControl_();
  this.addAddGroup_();

  this.groups_ = this.createGroups_();
  this.addChild(this.groups_, true);

  this.addReset_();
};
goog.inherits(DD.ui.test.ToolbarCollectionSettings, DD.ui.Component);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

var prototype = DD.ui.test.ToolbarCollectionSettings.prototype;
var superClass_ = DD.ui.test.ToolbarCollectionSettings.superClass_;
var ACTION = DD.ui.EventType.ACTION;
var VALUE_CHANGED = DD.ui.EventType.VALUE_CHANGED;


// ------------------------------
// Properties
// ------------------------------

/**
 * @type {?DD.ui.controls.Toolbar}
 * @private
 */
prototype.toolbar_ = null;


// ------------------------------
// Methods
// ------------------------------

/**
 * @param {string} type
 * @param {string} opt_groupName Name of a group which a control to add to.
 * @public
 */
prototype.addControl = function(type) {

  if (!DD.ui.test.ToolbarControlTypes[type]) {
    alert('Нет такого типа элементов');
    return;
  }

  this.controlCount_++;

  var control = new DD.ui.test.ToolbarControlTypes[type]({cssClass: 'toolbar-item'});
  control.setCaption('default '+ this.controlCount_);

  var id = this.groups_.getValue();
  var group = null;
  if (id) {
    group = this.toolbar_.getChild(id);
  }
  group
    ? group.add(control)
    : this.toolbar_.add(control);

  control.getElement().addEventListener('click', function() {
    this.dispatchEvent('testClick');
  }.bind(control));

  if (control.setPipsStyle)
    control.setPipsStyle(DD.ui.controls.Slider.PipsStyle.NONE);
};

/**
 * @private
 */
prototype.addGroup = function() {

  this.groupCount_++;

  var group = new DD.ui.controls.Group({cssClass: 'toolbar-item'});
  var id = 'group_'+this.groupCount_;
  group.setId(id);
  group.setCaption('Группа');
  this.toolbar_.add(group);
  this.groupList_.push({value: id, caption: id});
  this.groups_.setVariants(this.groupList_);
  this.groups_.setValue(id);
};

/**
 * @private
 */
prototype.addAddControl_ = function() {

  var variants = [
    { value: 'Button', caption: 'Button'},
    { value: 'Checkbox', caption: 'Checkbox'},
    { value: 'RadioButton', caption: 'Radio button'},
    { value: 'DropdownButton', caption: 'Dropdown button'},
    { value: 'TextEdit', caption: 'Text edit field'},
    { value: 'Spinner', caption: 'Spinner'},
    { value: 'Slider', caption: 'Slider'},
    { value: 'Label', caption: 'Label'}
  ];

  var type = new DD.ui.controls.RadioGroup({cssClass: 'setting types'});
  type.setCaption('Добавить элемент');
  type.setName('type');
  type.setVariants(variants);
  type.setValue('Button');
  this.addChild(type, true);

  var submit = new DD.ui.controls.Button({cssClass: 'setting add-control'});
  submit.setCaption('Добавить элемент');
  submit.listen(ACTION, function(event) {
    this.addControl(type.getValue());
  }.bind(this));
  this.addChild(submit, true);
};

/**
 * @private
 */
prototype.addAddGroup_ = function() {

  var submit = new DD.ui.controls.Button({cssClass: 'setting add-group'});
  submit.setCaption('Добавить группу');
  submit.listen(ACTION, function(event) {
    this.addGroup();
  }.bind(this));
  this.addChild(submit, true);
};

/**
 * @private
 */
prototype.createGroups_ = function() {
  var groups = new DD.ui.controls.RadioGroup({cssClass: 'setting groups'});
  groups.setCaption('Группы');
  groups.setName('group');
  this.groupList_.push({
    value: '0',
    caption: 'Без группы'
  });
  groups.setVariants(this.groupList_);
  groups.setValue('0');
  return groups;
};

/**
 * @private
 */
prototype.addReset_ = function() {

  var submit = new DD.ui.controls.Button({cssClass: 'setting reset'});
  submit.setCaption('Сбросить состояния');
  submit.listen(ACTION, function(event) {
    this.toolbar_.forEach(function(item) {
      item.setVisible(true);
      item.setDisabled(false);
      item.setReadonly(false);
      item.setChecked(false);
      item.setWrap(false);
    });
  }.bind(this));
  this.addChild(submit, true);
};

}); // goog.scope
