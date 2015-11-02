/**
 * Simple button.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.Button');

goog.require('DD.ui.controls.Control');
goog.require('DD.ui.controls.renderer.Button');
goog.require('goog.ui.registry');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @example

// Full form.
var button = new DD.ui.controls.Button({
  caption: 'Open settings',
  click: function() { // show settings },
  id: 'settings',
  //icon: '/images/settings-open.png',
  imageIndex: 511,
  hint: 'Show settings',
  cssClass: 'user-button',
  nodeId: 'settings-button',
  toggle: {
    caption: 'Close settings',
    //icon: 'images/settings-close.png'
    imageIndex: 512
  }
});

// Short form.
var button = new DD.ui.controls.Button('Open settings', function() { // show settings });

 * @param {Object|string=} options Component's options or only a caption.
 *    See other possible options in {@link DD.ui.controls.Control}.
 * @param {Object=} options.toggle Options to toggle on click.
 * @param {string=} options.toggle.icon New icon value.
 * @param {number=} options.toggle.imageIndex New imageIndex value.
 * @param {string=} options.toggle.caption New caption value.
 * @param {eventCallback=} click Click handler.
 *    Ignored if the first parameter is options, not a caption.
 * @constructor
 * @extends DD.ui.controls.Control
 */
DD.ui.controls.Button = function(options) {

  if (!goog.isObject(options)) {
    var tempOptions = {};
    if (goog.isString(arguments[0]))
      tempOptions.caption = arguments[0];
    if (goog.isFunction(arguments[1]))
      tempOptions.click = arguments[1];
    options = tempOptions;
  }

  DD.ui.controls.Control.call(this, options);
};
goog.inherits(DD.ui.controls.Button, DD.ui.controls.Control);
goog.ui.registry.setDefaultRenderer(DD.ui.controls.Button, DD.ui.controls.renderer.Button);


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.Button.prototype */
var prototype = DD.ui.controls.Button.prototype;
var superClass_ = DD.ui.controls.Button.superClass_;
var ACTION = DD.ui.EventType.ACTION;


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
    options.caption = 'Button';
  }

  superClass_.assign.call(this, options);

  if (goog.isObject(options.toggle)) {

    var caption1 = this.getCaption();
    var icon1 = this.getIcon();
    var imageIndex1 = this.getImageIndex();

    var caption2 = options.toggle.caption;
    var icon2 = options.toggle.icon;
    var imageIndex2 = options.toggle.imageIndex;

    var toggled = false;

    this.listen(ACTION, function() {
      toggled = !toggled;
      if (caption2 !== undefined)
        this.setCaption(toggled ? caption2 : caption1);
      if (icon2 !== undefined)
        this.setIcon(toggled ? icon2 : icon1);
      if (imageIndex2 !== undefined)
        this.setImageIndex(toggled ? imageIndex2 : imageIndex1);
    });
  }
};

}); // goog.scope
