goog.provide('DD.ui.test.ToolbarPage');

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
goog.require('DD.ui.test.ToolbarMainSettings');
goog.require('DD.ui.test.ToolbarCollectionSettings');
goog.require('DD.ui.test.ToolbarControlSettings');


// ------------------------------
// Constructor
// ------------------------------

DD.ui.test.ToolbarPage = function() {

  DD.ui.Component.call(this);

  /**
   * @type {DD.ui.controls.Toolbar}
   * @readonly
   * @public
   */
  this.toolbar_ = new DD.ui.controls.Toolbar();

  this.toolbar_.setItemMinWidth(30);
  this.toolbar_.setItemMaxWidth(300);
  this.toolbar_.setIndent(4);
  this.toolbar_.setScrollOrientation(DD.ui.controls.Toolbar.ScrollOrientation.NONE);
  this.toolbar_.setNoWrap(true);
  this.toolbar_.setRowCount(3);

  this.mainSettings_ = new DD.ui.test.ToolbarMainSettings(this.toolbar_, 'settings');
  this.collectionSettings_ = new DD.ui.test.ToolbarCollectionSettings(this.toolbar_, 'settings');
  this.controlSettings_ = null;

};
goog.inherits(DD.ui.test.ToolbarPage, DD.ui.Component);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

var prototype = DD.ui.test.ToolbarPage.prototype;
var superClass_ = DD.ui.test.ToolbarPage.superClass_;
var ACTION = DD.ui.EventType.ACTION;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.createDom = function() {

  var dom = this.getDomHelper();;
  var prefix = 'DD-test-toolbarpage';

  var element = goog.dom.createDom('div', prefix);
  this.setElementInternal(element);

  var toolbar = dom.createDom('article', prefix + '-toolbar');
  element.appendChild(toolbar);
  this.$cache('toolbar', toolbar);

  var settings = dom.createDom('aside', prefix + '-settings');
  element.appendChild(settings);
  this.$cache('settings', settings);
};

/**
 * @inheritdoc
 */
prototype.enterDocument = function() {

  superClass_.enterDocument.call(this);

  this.toolbar_.render(this.$cache('toolbar'));
  this.getHandler().listen(this.toolbar_, 'testClick',
      this.onToolbarControlClick_.bind(this), true);

  var settings = this.$cache('settings');
  this.mainSettings_.render(settings);
  this.collectionSettings_.render(settings);

  this.getHandler().listen(window, 'resize', function() {
    this.toolbar_.resize();
  }.bind(this));
};

/**
 * @param {DD.ui.controls.Control}
 * @protected
 */
prototype.chooseControl = function(control) {
  var settings = this.$cache('settings');
  if (this.controlSettings_)
    this.controlSettings_.dispose();
  this.controlSettings_ = new DD.ui.test.ToolbarControlSettings(control, 'settings');
  this.controlSettings_.render(settings);
};

/**
 * @private
 */
prototype.onToolbarControlClick_ = function(event) {

  if (!(event.target instanceof DD.ui.controls.Control))
    return;

  if (this.currentControl_) {
    this.currentControl_.getElement().classList.remove('focused');
  }
  this.currentControl_ = event.target;
  this.currentControl_.getElement().classList.add('focused');
  this.chooseControl(event.target);
};

}); // goog.scope
