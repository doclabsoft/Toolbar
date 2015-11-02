/**
 * Utils for operations with dom and style.
 * @project UI.
 * @author Anna Agte
 * @version 1.0
 */

goog.provide('DD.ui.utils');

/**
 * @param {Function} objClass
 * @param {Array} arguments
 * @return {!Object}
 */
DD.ui.utils.create = function(objClass, args) {
  return new (objClass.bind.apply(objClass, Array.prototype.concat.apply([null], args)));
};

DD.ui.utils.hideForDomChanging = function(element, f, scope) {
  var style = element.style;
  var oldDisplayStyle = style.display;
  style.display = 'none';
  f.call(scope, element);
  style.display = oldDisplayStyle;
};

DD.ui.utils.hideForDomReading = function(element, f, scope) {
  var style = element.style;
  var oldVisibilityStyle = style.display;
  style.visibility = 'hidden';
  f.call(scope, element);
  style.visibility = oldVisibilityStyle;
};

DD.ui.utils.getContentWidth = function(element) {
  var style = getComputedStyle(element);
  var paddingLeft = parseInt(style.paddingLeft, 10) || 0;
  var paddingRight = parseInt(style.paddingRight, 10) || 0;
  var width = element.clientWidth - paddingLeft - paddingRight;
  return width;
};
