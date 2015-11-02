/**
 * Text edit field renderer.
 * @project UI controls.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.controls.renderer.Slider_noUiSlider');

goog.require('DD.ui.controls.renderer.Control');


// ------------------------------
// Constructor
// ------------------------------

/**
 * @constructor
 * @extends DD.ui.controls.renderer.Component
 */
DD.ui.controls.renderer.Slider_noUiSlider = function() {

  if (!window.jQuery)
    throw Error('DD.ui.controls.renderer.Slider_noUiSlider requires jQuery plugin');

  if (!jQuery.fn.noUiSlider)
    throw Error('DD.ui.controls.renderer.Slider_noUiSlider requires "noUiSlider" plugin');

  if (!jQuery.fn.noUiSlider_pips)
    throw Error('DD.ui.controls.renderer.Slider_noUiSlider requires "noUiSlider_pips" add-on');

  DD.ui.controls.renderer.Control.call(this);
};
goog.inherits(DD.ui.controls.renderer.Slider_noUiSlider, DD.ui.controls.renderer.Control);
goog.addSingletonGetter(DD.ui.controls.renderer.Slider_noUiSlider);


// ------------------------------
// Constants
// ------------------------------

/**
 * @inheritdoc
 */
DD.ui.controls.renderer.Slider_noUiSlider.CSS_CLASS = 'DD-noUiSlider';


// ------------------------------
// Prototype
// ------------------------------

goog.scope(function() {

/** @alias DD.ui.controls.renderer.Slider_noUiSlider.prototype */
var prototype = DD.ui.controls.renderer.Slider_noUiSlider.prototype;
var superClass_ = DD.ui.controls.renderer.Slider_noUiSlider.superClass_;


// ------------------------------
// Methods
// ------------------------------

/**
 * @inheritdoc
 */
prototype.getCssClass = function() {
  return DD.ui.controls.renderer.Slider_noUiSlider.CSS_CLASS;
};

/**
 * @inheritdoc
 */
prototype.initializeDom = function(component) {
  superClass_.initializeDom.call(this, component);
  this.initPlugin_(component);
  component.$cache('$slider').on('set', this.onChange_.bind(this, component));
};

/**
 * @inheritdoc
 */
prototype.uninitializeDom = function(component) {
  component.$cache('$slider').off('set');
  this.destroyPlugin_(component);
  superClass_.uninitializeDom.call(this, component);
};

/**
 * @inheritdoc
 */
prototype.setValue = function(component, value) {

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;

  if (!component.isRangeSlider())
    $slider.val([value]);
};

/**
 * @inheritdoc
 */
prototype.addControlElement = function(component, element, dom) {

  var control = dom.createDom('input', {type: 'hidden'});
  var slider = dom.createDom('div', this.getBEMClass(component, 'slider'));

  component.$cache('control', control);
  component.$cache('slider', slider);
  component.$cache('$slider', $(slider));

  goog.dom.classes.add(control, this.getBEMClass(component, 'control'));

  element.appendChild(control);
  element.appendChild(slider);
};

/**
 * @param {DD.ui.Component} component
 * @param {number} value
 * @public
 */
prototype.setMinValue = function(component, value) {
  this.refreshPlugin_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {number} value
 * @public
 */
prototype.setMaxValue = function(component, value) {
  this.refreshPlugin_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {number} value
 * @public
 */
prototype.setIncrement = function(component, value) {
  this.refreshPlugin_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {boolean} rangeMode
 * @public
 */
prototype.setRangeSlider = function(component, rangeMode) {
  this.refreshPlugin_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {number} value
 * @public
 */
prototype.setStartValue = function(component, value) {

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;

  if (component.isRangeSlider())
    $slider.val([value, component.getEndValue()]);
};

/**
 * @param {DD.ui.Component} component
 * @param {number} value
 * @public
 */
prototype.setEndValue = function(component, value) {

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;

  if (component.isRangeSlider())
    $slider.val([component.getStartValue(), value]);
};

/**
 * @param {DD.ui.Component} component
 * @param {number} frequency
 * @public
 */
prototype.setFrequency = function(component, frequency) {
  this.refreshPlugin_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {DD.ui.controls.Slider.Orientation} orientation
 * @public
 */
prototype.setOrientation = function(component, orientation) {
  this.refreshPlugin_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {boolean} visible
 * @public
 */
prototype.setDraggerVisible = function(component, visible) {

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;

  if (visible)
    $slider.find('.noUi-handle').show();
  else
    $slider.find('.noUi-handle').hide();
};

/**
 * @param {DD.ui.Component} component
 * @param {number} length
 * @public
 */
prototype.setDraggerLength = function(component, length) {

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;

  if (visible)
    $slider.find('.noUi-handle').show();
  else
    $slider.find('.noUi-handle').hide();
};

/**
 * @param {DD.ui.Component} component
 * @param {DD.ui.controls.Slider.PipsPosition} position
 * @public
 */
prototype.setPipsPosition = function(component, position) {
  this.refreshPlugin_(component);
};

/**
 * @param {DD.ui.Component} component
 * @param {DD.ui.controls.Slider.PipsStyle} style
 * @public
 */
prototype.setPipsStyle = function(component, style) {
  this.refreshPlugin_(component);
};

/**
 * Initializes jQuery plugin.
 * @param {DD.ui.Component} component
 * @param {boolean} rebuild
 * @private
 */
prototype.initPlugin_ = function(component) {

  if (!component.isInDocument())
    return;

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;
  var element = component.getElement();

  var rangeMode = component.isRangeSlider();

  var startPosition = rangeMode
    ? [component.getStartValue(), component.getEndValue()]
    : [component.getValue()];

  var orientation =
      component.getOrientation() === DD.ui.controls.Slider.Orientation.HORIZONTAL
    ? 'horizontal'
    : 'vertical';

  var prefix = this.getBEMClass(component);
  if (orientation === 'vertical') {
    element.style.height = '100%';
    $slider[0].style.height = '100%';
    goog.dom.classes.addRemove(element, prefix + '_h', prefix + '_v');
  } else {
    element.style.height = '';
    $slider[0].style.height = '';
    goog.dom.classes.addRemove(element, prefix + '_v', prefix + '_h');
  }

  var options = {
    start: startPosition,
    connect: rangeMode,
    step: component.getIncrement(),
    orientation: orientation,
    range: {
      'min': [component.getMinValue()],
      'max': [component.getMaxValue()]
    }
  };
  $slider.noUiSlider(options);

  if (!component.isDraggerVisible()) {
    $slider.find('.noUi-handle').hide();
  }

  var freq = component.getFrequency();
  var step = -1;
  if (component.getPipsStyle() === DD.ui.controls.Slider.PipsStyle.AUTO) {
    $slider.noUiSlider_pips({
      mode: 'steps',
      density: 100,
      filter: function(value, type) {
        step++;
        if (type === 1)
          return 1;
        return step % freq === 0 ? 2 : 0;
      }
    });
  }
};

/**
 * Rebuilds jQuery plugin with new options.
 * @param {DD.ui.Component} component
 * @private
 */
prototype.refreshPlugin_ = function(component) {

  if (!component.isInDocument())
    return;

  this.destroyPlugin_(component);
  this.initPlugin_(component);
};

/**
 * Destroys jQuery plugin.
 * @param {DD.ui.Component} component
 * @private
 */
prototype.destroyPlugin_ = function(component) {

  if (!component.isInDocument())
    return;

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;

  if ($slider[0].destroy)
    $slider[0].destroy();
};

/**
 * Triggers when user move the slider.
 * @param {DD.ui.Component} component
 * @return {boolean}
 * @private
 */
prototype.onChange_ = function(component, event) {

  var $slider = component.$cache('$slider');
  if (!$slider)
    return;

  var value = $slider.val();

  if (value.length === 2) {
    component.setStartValueInternal(value[0]);
    component.setEndValueInternal(value[1]);
  } else {
    component.setValueInternal(value);
  }

  component.valueChanged();
};

}); // goog.scope
