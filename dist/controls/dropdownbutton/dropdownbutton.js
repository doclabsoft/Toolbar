/**
 * Dropdown block.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.DropdownButton');

goog.require('DD.ui.controls.Button');
goog.require('DD.ui.controls.renderer.DropdownButton');
goog.require('goog.ui.registry');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form.
var button = new DD.ui.controls.DropdownButton({
  caption: 'About the program',
  icon: '/images/about.png',
  content: 'Author: Alex Griboedov 2011<br>All rights reserved (c)'
});

// Short form
var button = new DD.ui.controls.DropdownButton('About the program', 'Author: Alex Griboedov 2011<br>All rights reserved (c)');

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {string=} options.content Popup content.
 *    Ignored if the first parameter is options, not a caption.
 * @todo Make content of type {string|HTMLElement|DD.ui.Component}.
 * @constructor
 * @extends DD.ui.controls.Control
 */
DD.ui.controls.DropdownButton = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isString(arguments[1]))
      tempOptions.content = arguments[1];
    options = tempOptions;
  }

  DD.ui.controls.Button.call(this, options);
};
goog.inherits(DD.ui.controls.DropdownButton, DD.ui.controls.Button);
goog.ui.registry.setDefaultRenderer(
    DD.ui.controls.DropdownButton, DD.ui.controls.renderer.DropdownButton);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.DropdownButton.prototype */
var prototype = DD.ui.controls.DropdownButton.prototype;
var superClass_ = DD.ui.controls.DropdownButton.superClass_;


// ------------------------------
// Properties
// ------------------------------

/**
 * @type {string}
 * @private
 */
prototype.content_ = '';


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.assign = function(options) {

  if (!goog.isObject(options))
    options = {};

  if (!options.caption && !options.icon && !goog.isNumber(options.imageIndex)) {
    options.caption = 'Dropdown button';
  }

  superClass_.assign.call(this, options);

  if (goog.isString(options.content))
    this.setContent(options.content);
};

/**
 * @inheritdoc
 */
prototype.activate = function(opt_originalEvent) {
  superClass_.activate.call(this, opt_originalEvent);
  this.setOpened(!this.isOpened());
};

/**
 * Sets content to the dropdown block.
 * @param {string} content
 * @public
 */
prototype.setContent = function(content) {

  if (content === this.content_)
    return;

  this.content_ = content;

  var renderer = this.getRenderer();
  if (renderer.setContent)
    renderer.setContent(this, content);
};

/**
 * @return {string}
 * @public
 */
prototype.getContent = function() {
  return this.content_;
};


// ------------------------------
// Facade
// ------------------------------

/**
 * @public
 */
prototype.open = function() {
  this.setOpened(true);
};

/**
 * @public
 */
prototype.close = function() {
  this.setOpened(false);
}

}); // goog.scope
