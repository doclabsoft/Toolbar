goog.provide('DD.ui.test.ToolbarControlSettings');

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

DD.ui.test.ToolbarControlSettings = function(control, opt_customClass) {

  if (!(control instanceof DD.ui.controls.Control))
    throw Error('Not a control instance');

  DD.ui.Component.call(this, {cssClass: opt_customClass});

  this.createDom();
  this.type_ = this.getDomHelper().createDom('h3');
  for (var i in DD.ui.test.ToolbarControlTypes) {
    if (control instanceof DD.ui.test.ToolbarControlTypes[i]) {
      this.type_.innerHTML = i;
    }
  }
  this.getElement().appendChild(this.type_);

  this.control_ = control;

  this.addCaption_();
  this.addImageIndex_();
  this.addValue_();
  this.addPriority_();
  if (this.control_.setName)
    this.addName_();

  if ((control instanceof DD.ui.controls.Checkbox) || (control instanceof DD.ui.controls.RadioButton)) {
    this.addChecked_();
  }

  this.addDisabled_();
  this.addWrap_();
  this.addVisible_();

  if (control instanceof DD.ui.controls.Checkbox) {
    this.addAllowedIndeterminate_();
    this.addIndeterminate_();
  }

  if (control instanceof DD.ui.controls.TextEdit) {
    this.addReadonly_();
    this.addDisplayStyle_();
    this.addMaxLength_();
    this.addModified_();
  }

  if (control instanceof DD.ui.controls.Label) {
    this.addWordWrap_();
  }

  this.addHint_();

  if (this.control_ instanceof DD.ui.controls.DropdownButton)
    this.addContent_();

  if (control instanceof DD.ui.controls.Scale) {
    this.addMinValue_();
    this.addMaxValue_();
    this.addIncrement_();
  }
  if (control instanceof DD.ui.controls.Spinner) {
    this.addLooped_();
  }
  if (control instanceof DD.ui.controls.Slider) {
    this.addRangeSlider_();
    this.addStartValue_();
    this.addEndValue_();
    this.addDraggerVisible_();
  }

  this.addDelete_();
};
goog.inherits(DD.ui.test.ToolbarControlSettings, DD.ui.Component);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

var prototype = DD.ui.test.ToolbarControlSettings.prototype;
var superClass_ = DD.ui.test.ToolbarControlSettings.superClass_;
var CHANGED = DD.ui.EventType.CHANGED;
var CHECK = DD.ui.EventType.CHECK;
var ACTION = DD.ui.EventType.ACTION;
var VALUE_CHANGED = DD.ui.EventType.VALUE_CHANGED;
var KEY_PRESS = DD.ui.controls.TextEdit.EventType.KEY_PRESS;


// ------------------------------
// Properties
// ------------------------------

/**
 * @type {?DD.ui.controls.Control}
 * @private
 */
prototype.control_ = null;


// ------------------------------
// Methods
// ------------------------------

/**
 * @private
 */
prototype.addAllowedIndeterminate_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Allowed indeterminate');
  component.setChecked(this.control_.isAllowedIndeterminate());

  component.listen(CHECK, function(event) {
    this.control_.setAllowedIndeterminate(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addCaption_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Caption');
  component.setValue(this.control_.getCaption());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setCaption(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addChecked_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Checked');
  component.setChecked(this.control_.isChecked());

  component.listen(CHECK, function(event) {
    this.control_.setChecked(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addContent_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});

  component.setCaption('Content');
  component.setValue(this.control_.getContent());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setContent(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addDisabled_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Disabled');
  component.setChecked(this.control_.isDisabled());

  component.listen(CHECK, function(event) {
    this.control_.setDisabled(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addDisplayStyle_ = function() {

  var component = new DD.ui.controls.RadioGroup({cssClass: 'setting'});
  component.setCaption('Display style');
  component.setName('display');

  var text = {};
  text.value = DD.ui.controls.TextEdit.DisplayStyle.NORMAL;
  text.caption = 'Текст';

  var password = {};
  password.value = DD.ui.controls.TextEdit.DisplayStyle.PASSWORD;
  password.caption = 'Пароль';

  component.setVariants([text, password]);
  component.setValue(this.control_.getDisplayStyle());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setDisplayStyle(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addDraggerVisible_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Dragger visible');
  component.setChecked(this.control_.isDraggerVisible());

  component.listen(CHECK, function(event) {
    this.control_.setDraggerVisible(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addEndValue_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('End value');
  component.setValue(this.control_.getEndValue());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setEndValue(event.target.getValue());
    component.setValue(this.control_.getEndValue());
  }.bind(this));

  component.getHandler().listen(this.control_, VALUE_CHANGED, function(event) {
    component.setValue(this.control_.getEndValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addHint_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Hint');
  component.setValue(this.control_.getHint());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setHint(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addImageIndex_ = function() {

  var component = new DD.ui.controls.Spinner({cssClass: 'setting'});
  component.setCaption('Image index');
  component.setMinValue(-1);
  component.setMaxValue(2);
  component.setLooped(true);
  component.setValue(this.control_.getImageIndex());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setImageIndex(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addIncrement_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Increment');
  component.setValue(this.control_.getIncrement());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setIncrement(event.target.getValue());
    component.setValue(this.control_.getIncrement());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addIndeterminate_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Indeterminate');
  component.setChecked(this.control_.isIndeterminate());

  component.listen(CHECK, function(event) {
    this.control_.setIndeterminate(event.target.isChecked());
  }.bind(this));
  component.getHandler().listen(this.control_, CHANGED, function(event) {
    component.setChecked(this.control_.isIndeterminate());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addLooped_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Looped');
  component.setChecked(this.control_.isLooped());

  component.listen(CHECK, function(event) {
    this.control_.setLooped(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addMaxLength_ = function() {

  var component = new DD.ui.controls.Spinner({cssClass: 'setting'});
  component.setCaption('Max length');
  component.setMinValue(0);
  component.setMaxValue(255);
  component.setValue(this.control_.getMaxLength());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setMaxLength(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addMaxValue_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Max value');
  component.setValue(this.control_.getMaxValue());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setMaxValue(event.target.getValue());
    component.setValue(this.control_.getMaxValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addMinValue_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Min value');
  component.setValue(this.control_.getMinValue());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setMinValue(event.target.getValue());
    component.setValue(this.control_.getMinValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addModified_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Modified');
  component.setChecked(this.control_.isModified());
  component.setReadonly(true);

  component.getHandler().listen(this.control_, DD.ui.controls.TextEdit.EventType.VALUE_MODIFIED, function(event) {
    component.setChecked(this.control_.isModified());
  }.bind(this), false);

  component.getHandler().listen(this.control_, DD.ui.EventType.VALUE_CHANGED, function(event) {
    component.setChecked(this.control_.isModified());
  }.bind(this), false);

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addName_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Name');
  component.setValue(this.control_.getName());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setName(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addPriority_ = function() {

  var component = new DD.ui.controls.Spinner({cssClass: 'setting'});
  component.setCaption('Priority');
  component.setMinValue(-1);
  component.setMaxValue(10);
  component.setValue(this.control_.getPriority());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setPriority(event.target.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addRangeSlider_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Range slider');
  component.setChecked(this.control_.isRangeSlider());

  component.listen(CHECK, function(event) {
    this.control_.setRangeSlider(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};


/**
 * @private
 */
prototype.addReadonly_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Readonly');
  component.setChecked(this.control_.isReadonly());

  component.listen(CHECK, function(event) {
    this.control_.setReadonly(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addStartValue_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Start value');
  component.setValue(this.control_.getStartValue());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setStartValue(event.target.getValue());
    component.setValue(this.control_.getStartValue());
  }.bind(this));

  component.getHandler().listen(this.control_, VALUE_CHANGED, function(event) {
    component.setValue(this.control_.getStartValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addValue_ = function() {

  var component = new DD.ui.controls.TextEdit({cssClass: 'setting'});
  component.setCaption('Value');
  component.setValue(this.control_.getValue());

  component.listen(VALUE_CHANGED, function(event) {
    this.control_.setValue(event.target.getValue());
    component.setValue(this.control_.getValue());
  }.bind(this));

  component.getHandler().listen(this.control_, VALUE_CHANGED, function(event) {
    component.setValue(this.control_.getValue());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addVisible_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Visible');
  component.setChecked(this.control_.isVisible());

  component.listen(CHECK, function(event) {
    this.control_.setVisible(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addWrap_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Wrap');
  component.setChecked(this.control_.isWrap());

  component.listen(CHECK, function(event) {
    this.control_.setWrap(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addWordWrap_ = function() {

  var component = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  component.setCaption('Word wrap');
  component.setChecked(this.control_.isWordWrap());

  component.listen(CHECK, function(event) {
    this.control_.setWordWrap(event.target.isChecked());
  }.bind(this));

  this.addChild(component, true);
};

/**
 * @private
 */
prototype.addDelete_ = function() {

  var component = new DD.ui.controls.Button({cssClass: 'setting'});

  component.setCaption('Удалить');

  component.listen(ACTION, function(event) {
    this.control_.getParent().remove(this.control_);
  }.bind(this));

  this.addChild(component, true);
};

}); // goog.scope
