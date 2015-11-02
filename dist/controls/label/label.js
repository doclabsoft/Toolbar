/**
 * Toolbar label.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Label');

goog.require('DD.ui.controls.Control');
goog.require('DD.ui.controls.renderer.Label');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form.
var label = new DD.ui.controls.Label({
  id: 'username'
  caption: 'Long John Tale',
  wordWrap: true
});

// Short form.
var label = new DD.ui.controls.Label('Long John Tale');

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {boolean=} options.wordWrap If TRUE text will wrap when necessary,
 *    otherwise text will never wrap to the next line
 *    and continues on the same line until a <br> tag is encountered.
 * @constructor
 * @extends DD.ui.controls.Control
 */
DD.ui.controls.Label = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    options = tempOptions;
  }

  DD.ui.controls.Control.call(this, options);
};
goog.inherits(DD.ui.controls.Label, DD.ui.controls.Control);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Label, DD.ui.controls.renderer.Label);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Label.prototype */
var prototype = DD.ui.controls.Label.prototype;
var superClass_ = DD.ui.controls.Label.superClass_;


// ------------------------------
// Properties
// ------------------------------

prototype.wordWrap_ = false;


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

  if (goog.isBoolean(options.wordWrap))
    this.setWordWrap(options.wordWrap);
};

/**
 * @param {boolean} enable
 * @public
 */
prototype.setWordWrap = function(enable) {
  this.wordWrap_ = !!enable;
  var renderer = this.getRenderer();
  if (renderer.setWordWrap)
    renderer.setWordWrap(this, this.wordWrap_);
};

/**
 * @return {boolean}
 * @public
 */
prototype.isWordWrap = function() {
  return this.wordWrap_;
};

}); // goog.scope
