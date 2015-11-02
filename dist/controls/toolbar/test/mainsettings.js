goog.provide('DD.ui.test.ToolbarMainSettings');

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


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @ignore
 */
DD.ui.test.ToolbarMainSettings = function(toolbar, opt_customClass) {

  if (!(toolbar instanceof DD.ui.controls.Toolbar))
    throw Error('Not a toolbar instance');

  DD.ui.Component.call(this, {cssClass: opt_customClass});

  this.toolbar_ = toolbar;

  this.addNoWrap_();
  this.addRowCount_();
  this.addScrollOrientation_();
  this.addMinMaxValue_();
  this.addIndent_();
  //this.addChangeWidth_();
};
goog.inherits(DD.ui.test.ToolbarMainSettings, DD.ui.Component);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

var prototype = DD.ui.test.ToolbarMainSettings.prototype;
var superClass_ = DD.ui.test.ToolbarMainSettings.superClass_;
var ACTION = DD.ui.EventType.ACTION;
var CHECK = DD.ui.EventType.CHECK;
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
 * @private
 */
prototype.addNoWrap_ = function() {

  var A = new DD.ui.controls.Checkbox({cssClass: 'setting'});
  A.setCaption('Без переносов');
  A.setChecked(this.toolbar_.isNoWrap());

  A.listen(CHECK, function(event) { 
    this.toolbar_.setNoWrap(!!event.target.isChecked());
  }.bind(this));

  this.addChild(A, true);
};

/**
 * @private
 */
prototype.addRowCount_ = function() {

  var A = new DD.ui.controls.Spinner({cssClass: 'setting'});
  A.setCaption('Количество рядов');
  A.setMinValue(1);
  A.setMaxValue(6);
  A.setValue(this.toolbar_.getRowCount());

  A.listen(VALUE_CHANGED, function(event) {
    this.toolbar_.setRowCount(+event.target.getValue());
  }.bind(this), false);

  this.addChild(A, true);
};

/**
 * @private
 */
prototype.addScrollOrientation_ = function() {

  var A = new DD.ui.controls.RadioGroup({cssClass: 'setting'});
  A.setCaption('Наличие скроллбара');
  A.setName('scroll');

  var variants = [];
  variants.push({
    value: DD.ui.controls.Toolbar.ScrollOrientation.NONE,
    caption: 'Нет'
  });
  variants.push({
    value: DD.ui.controls.Toolbar.ScrollOrientation.VERTICAL,
    caption: 'Вертикальный'
  });
  variants.push({
    value: DD.ui.controls.Toolbar.ScrollOrientation.HORIZONTAL,
    caption: 'Горизонтальный'
  });
  A.setVariants(variants);
  A.setValue(this.toolbar_.getScrollOrientation());

  A.listen(DD.ui.EventType.VALUE_CHANGED, function(event) {
    if (event.target === A)
      this.toolbar_.setScrollOrientation(A.getValue());
  }.bind(this));

  this.addChild(A, true);
};

/**
 * @private
 */
prototype.addIndent_ = function() {

  var A = new DD.ui.controls.Slider({cssClass: 'setting'});
  A.setCaption('Промежутки');
  A.setRangeSlider(false);
  A.setMinValue(0);
  A.setMaxValue(10);
  A.setIncrement(1);
  A.setValue(this.toolbar_.getIndent());

  A.listen(DD.ui.EventType.VALUE_CHANGED, function(event) {
    this.toolbar_.setIndent(event.target.getValue());
  }.bind(this), false);

  this.addChild(A, true);
};

/**
 * @private
 */
prototype.addMinMaxValue_ = function() {

  var A = new DD.ui.controls.Slider({cssClass: 'setting'});
  A.setCaption('Предельные размеры элементов');
  A.setRangeSlider(true);
  A.setMinValue(30);
  A.setMaxValue(300);
  A.setIncrement(30);
  A.setStartValue(this.toolbar_.getItemMinWidth());
  A.setEndValue(this.toolbar_.getItemMaxWidth());

  A.listen(DD.ui.EventType.VALUE_CHANGED, function(event) {
    this.toolbar_.setItemMinWidth(+event.target.getStartValue());
    this.toolbar_.setItemMaxWidth(+event.target.getEndValue());
  }.bind(this), false);

  this.addChild(A, true);
};

/**
 * @private
 */
prototype.addChangeWidth_ = function() {

  var A = new DD.ui.controls.Button({cssClass: 'setting'});
  A.setCaption('Именить ширину тулбара');

  A.listen(DD.ui.EventType.ACTION, function() {
    this.toolbar_.getElement().parentNode.style.width =
        Math.floor(Math.random() * (800 - 200)) + 200 + 'px';
    this.toolbar_.resize();
  }.bind(this));

  this.addChild(A, true);
};

}); // goog.scope
