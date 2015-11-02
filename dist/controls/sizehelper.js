goog.provide('DD.ui.controls.SizeHelper.ItemSize');
goog.provide('DD.ui.controls.SizeHelper.GroupSize');

goog.require('goog.array');


// ------------------------------
// Constructor
// ------------------------------

/**
 * Параметры кнопки или группы.
 * @param {*} component
 * @param {Object} options
 * @param {HTMLElement} options.element
 * @param {number} options.minWidth
 * @param {number} options.maxWidth
 * @param {DD.ui.controls.SizeHelper.GroupSize=} options.group
 * @constructor
 */
DD.ui.controls.SizeHelper.ItemSize = function(options) {

  options = options || {};

  var maxWidth = options.maxWidth || 0;
  var minWidth = options.minWidth || 0;
  if (maxWidth < minWidth) {
    maxWidth = minWidth;
  }

  /**
   * @type {DD.ui.controls.Control|DD.ui.controls.Group}
   * @private
   */
  this.component_ = options.component || null;

  /**
   * @type {?DD.ui.controls.SizeHelper.GroupSize}
   * @private
   */
  this.group_ = options.group || null;
  if (this.group_)
    this.group_.setParentSize(this);

  /**
   * @type {?DD.ui.controls.SizeHelper.GroupSize}
   * @private
   */
  this.parent_ = null;

  /**
   * @type {number=}
   * @private
   */
  this.priority_ = options.priority;
  if (this.priority_ && this.priority_ < 0)
    this.priority_ = -1;

  /**
   * @type {number}
   * @private
   */
  this.maxWidth_ = maxWidth;

  /**
   * @type {number}
   * @private
   */
  this.minWidth_ = this.group_
    ? this.maxWidth_ - this.group_.getEconomy()
    : this.priority_ >= 0 ? minWidth : this.maxWidth_;

  /**
   * @type {number}
   * @private
   */
  this.economy_ = this.maxWidth_ - this.minWidth_;

  /**
   * @type {number}
   * @private
   */
  this.width_ = this.maxWidth_;

  /**
   * @type {number}
   * @private
   */
  this.indent_ = 0;

  /**
   * @type {boolean}
   * @private
   */
  this.wrap_ = options.wrap || false;

  /**
   * @type {boolean}
   * @private
   */
  this.hidden_ = false;

  if (this.group_) {
    this.group_.setPaddings(this.maxWidth_ - this.group_.getWidth(undefined, true));
  }
};


// ------------------------------
// Methods
// ------------------------------

/**
 * @return {DD.ui.Component}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getComponent = function() {
  return this.component_;
};

/**
 * @return {DD.ui.controls.SizeHelper.GroupSize}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getGroup = function() {
  return this.group_;
};

/**
 * @param {DD.ui.controls.SizeHelper.GroupSize}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.setParentGroup = function(group) {
  this.parent_ = group;
};

/**
 * @return {?DD.ui.controls.SizeHelper.GroupSize}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getParentGroup = function() {
  return this.parent_;
};

/**
 * @return {number}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getPriority = function() {
  return this.priority_;
};

/**
 * @param {number}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.setWidth = function(value) {
  this.width_ = value;
};

/**
 * @return {number}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getWidth = function() {
  return this.width_;
};

/**
 * @return {number}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getMinWidth = function() {
  return this.minWidth_;
};

/**
 * @return {number}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getEconomy = function() {
  return this.economy_;
};

/**
 * @param {number}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.setIndent = function(indent) {
  this.indent_ = indent;
};

/**
 * @return {number}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.getIndent = function() {
  return this.indent_;
};

/**
 * @return {boolean}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.isWrap = function() {
  return this.wrap_;
};

/**
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.hide = function() {
  this.hidden_ = true;
};

/**
 * @return {boolean}
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.isHidden = function() {
  return this.hidden_;
};

/**
 * Сбрасывает все изменения,
 * произошедшие в ходе вычислений оптимальной ширины кнопки.
 * @public
 */
DD.ui.controls.SizeHelper.ItemSize.prototype.reset = function() {
  this.width_ = this.maxWidth_;
  this.hidden_ = false;
  this.indent_ = 0;
};


// ------------------------------
// Constructor
// ------------------------------

/**
 * Набор параметров группы кнопок, далее - просто "кнопок".
 * @param {Array.<DD.ui.controls.SizeHelper.ItemSize>} opt_sizes
 * @param {Object=} options
 * @param {number=} options.indent
 * @constructor
 */
DD.ui.controls.SizeHelper.GroupSize = function(sizes, options) {

  options = options || {};

  /**
   * Древовидный список кнопок.
   * @type {Array.<DD.ui.controls.SizeHelper.ItemSize>}
   * @private
   */
  this.treeSizes_ = sizes;

  /**
   * Плоский список кнопок.
   * @type {Array.<DD.ui.controls.SizeHelper.ItemSize>}
   * @private
   */
  this.flatSizes_ = DD.ui.controls.SizeHelper.GroupSize.formFlatSizes_(this.treeSizes_);

  /**
   * Массив приоритетов в порядке уменьшения важности.
   * @type {Array.<number>}
   * @private
   */
  this.priorities_ = DD.ui.controls.SizeHelper.GroupSize.formPriorities_(this.treeSizes_);

  /**
   * Поправки на ширину группы.
   * @type {number}
   * @public
   */
  this.paddings_ = 0;

  /**
   * Ширина пробелов между элементами.
   * @type {number}
   * @readonly
   */
  this.indentSize_ = options.indent || 0;

  this.rootLevelWalk(function(size) {
    size.setParentGroup(this);
  }.bind(this));
};


// ------------------------------
// Static methods
// ------------------------------

/**
 * Собирает плоский список кнопок - раскрывает все группы.
 * @param {Array.<DD.ui.controls.SizeHelper.ItemSize>} sizes
 * @return {Array.<DD.ui.controls.SizeHelper.ItemSize>}
 * @private
 */
DD.ui.controls.SizeHelper.GroupSize.formFlatSizes_ = function(treeSizes) {

  var list = [];

  var i, size, group;
  for (i=0; i<treeSizes.length; i++) {
    size = treeSizes[i];
    group = size.getGroup();
    if (group)
      list = goog.array.join(list, group.getFlatSizes());
    else
      list.push(size);
  }

  return list;
};

/**
 * Формирует массив приоритетов в порядке от высшего (-1, 0) до низшего.
 * Только значений приоритетов - ничего более.
 * @param {Array.<DD.ui.controls.SizeHelper.ItemSize>} sizes
 * @return {Array.<number>}
 * @private
 */
DD.ui.controls.SizeHelper.GroupSize.formPriorities_ = function(treeSizes) {

  var list = [];

  var i, size, group;
  for (i=0; i<treeSizes.length; i++) {
    size = treeSizes[i];
    group = size.getGroup();
    if (group)
      list = goog.array.join(list, group.getPriorities());
    else
      list.push(size.getPriority());
  }
  goog.array.removeDuplicates(list);
  list.sort(function(a, b) { return a > b; });

  return list;
};


// ------------------------------
// Methods
// ------------------------------

/**
 * @return {Array.<DD.ui.controls.SizeHelper.ItemSize>}
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getTreeList = function() {
  return this.treeSizes_;
};

/**
 * Возвращает отфильтрованный плоский список элементов.
 * @param {number=} opt_priority
 * @return {Array.<DD.ui.controls.SizeHelper.ItemSize>}
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getFlatSizes = function(opt_priority) {

  if (opt_priority === undefined)
    return this.flatSizes_;

  var list = [];
  this.flatWalk(function(size) {
    list.push(size);
  }, opt_priority);
  return list;
};

/**
 * Возвращает отфильтрованный плоский список видимых элементов.
 * @param {number=} opt_priority
 * @return {Array.<DD.ui.controls.SizeHelper.ItemSize>}
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getVisibleFlatSizes = function(opt_priority) {
  var list = [];
  this.flatWalk(function(size) {
    if (!size.isHidden())
      list.push(size);
  }, opt_priority);
  return list;
};

/**
 * Подсчитывает видимые элементы в группе.
 * @param {number=} opt_priority
 * @return {number}
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.countVisible = function(opt_priority) {
  return this.getVisibleFlatSizes(opt_priority).length;
};

/**
 * @return {Array.<number>}
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getPriorities = function() {
  return this.priorities_;
};

/**
 * @return {boolean}
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.isEmpty = function() {
  return !this.treeSizes_.length;
};

/**
 * @param {number} value
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.setPaddings = function(value) {
  this.paddings_ = value;
};

/**
 * @param {DD.ui.controls.SizeHelper.ItemSize} item
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.setParentSize = function(item) {
  this.parent_ = item;
};

/**
 * @return {DD.ui.controls.SizeHelper.ItemSize}
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getParentSize = function() {
  return this.parent_;
};

/**
 * Считает ширину группы кнопок.
 * Если в расчеты входят все видимые кнопки группы,
 * то к итоговой сумме добавляются и внутренние отступы группы.
 * Расстояние между кнопками тоже добавляется.
 * @param {number=} opt_priority
 * @param {boolean=} opt_onlyContent Если TRUE, то учитывается только
 * ширина кнопок, без промежутков между ними и без внутренних отступов группы.
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getWidth = function(opt_priority, opt_onlyContent) {

  var sizes = this.treeSizes_;
  var width = 0;
  var groupWidth = 0;
  var visibleCount = 0;
  var calculatedCount = 0;

  // Ширины кнопок.
  var i, size = null;
  for (i=0; i<sizes.length; i++) {

    size = sizes[i];
    if (size.hidden)
      continue;

    visibleCount++;

    group = size.getGroup();
    if (group) {
      width += group.getWidth(opt_priority, opt_onlyContent);
      calculatedCount++;
    } else if (opt_priority === undefined || size.getPriority() === opt_priority) {
      width += size.getWidth();
      calculatedCount++;
    }
  }

  // Поправки к ширинам кнопок:
  // пробелы между кнопок и дополнительные отступы группы.
  if (!opt_onlyContent) {
    if (this.indentSize_ && calculatedCount > 1)
      width += this.indentSize_ * (calculatedCount-1);
    if (this.paddings_ && calculatedCount && calculatedCount === visibleCount)
      width += this.paddings_;
  }

  return width;
};

/**
 * Возвращает размер доступного для сжатия пространства.
 * @param {number=} opt_priority
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getEconomy = function(opt_priority) {
  var economy = 0;
  this.flatWalk(function(size) {
    economy += size.getEconomy();
  }, opt_priority);
  return economy;
};

/**
 * Сбрасывает изменения параметров, полученные в ходе предыдущих вычислений.
 * @param {number=} opt_priority
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.reset = function(opt_priority) {

  this.treeWalk(function(size) {
    size.reset();
    var group = size.getGroup();
    if (group && group.isEmpty()) {
      size.hide();
    }
  }, opt_priority);
};

/**
 * Растягивает кнопки, чтобы они максимально покрывали свободное пространство.
 * @param {number} freeSpace Доступное для расширения место.
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.expand = function(freeSpace) {

  if (freeSpace <= 0)
    return;

  var i, priority, economy;
  for (i=0; i<this.priorities_.length; i++) {

    priority = this.priorities_[i];
    if (priority < 0)
      continue;

    economy = this.getEconomy(priority);

    if (economy > freeSpace) {
      this.stretch(priority, freeSpace);
      break;
    } else if (economy > 0) {
      this.reset(priority);
      freeSpace -= economy;
    }
  }
};

/**
 * Растягивает кнопки, соответствующие условию,
 * чтобы они максимально покрывали свободное пространство.
 * @param {number} freeSpace Доступное для расширения место.
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.stretch = function(priority, freeSpace) {

  var sizes = this.getFlatSizes(priority);
  var diff = freeSpace / sizes.length;
  if (diff < 0.5)
    return;

  sizes.sort(function(a, b) {
    return a.getEconomy() > b.getEconomy();
  });

  var i, size = null;
  for (i=0; i<sizes.length; i++) {
    size = sizes[i];

    if (size.isHidden())
      continue;

    if (size.getEconomy() <= diff) {
      size.reset();
      freeSpace -= size.getEconomy();
      diff = freeSpace / (sizes.length - i - 1);
    } else {
      size.setWidth(size.getWidth() + diff);
      freeSpace -= diff;
    }
  }
};

/**
 * Разбивает набор кнопок на несколько наборов, умещающихся в заданные ширины.
 * Возвращает массив массивов кнопок.
 * Получишихся рядов может быть больше, чем было задано ширин.
 * @param {Array.<number>} Массив ширин рядов.
 * @return {Array.<Array.<DD.ui.controls.SizeHelper.ItemSize>>}
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.split = function(widths) {

  var rows = [[]];
  var currentRow = 0;
  var rowWidth = 0;
  var maxWidth = widths[currentRow];

  var nextRow = function() {
    currentRow++;
    rowWidth = width;
    maxWidth = currentRow < widths.length
      ? widths[currentRow]
      : widths[widths.length-1];
    rows[currentRow] = [];
  };

  var i, size, width;
  for (i=0; i<this.treeSizes_.length; i++) {
    size = this.treeSizes_[i];
    group = size.getGroup();

    if (!size.isHidden()) {
      width = group ? group.getWidth() : size.getWidth();

      if (maxWidth && rowWidth + this.indentSize_ + width > maxWidth) {
        nextRow();
        rows[currentRow].push(size);
      } else {
        rows[currentRow].push(size);
        rowWidth += this.indentSize_ + width;
        if (size.isWrap()) {
          nextRow();
        }
      }
    }
  }

  return rows;
};

/**
 * Обходит плоский список кнопок и выполнят с каждой переданную фукнцию.
 * @param {Function} f
 * @param {number=} opt_priority
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.flatWalk = function(f, opt_priority) {
  var i, size, result = true;
  for (i=0; i<this.flatSizes_.length; i++) {
    size = this.flatSizes_[i];
    if (opt_priority === undefined || size.getPriority() === opt_priority) {
      result = f.call(this, size);
      if (result === false)
        break;
    }
  }
  return result;
};

/**
 * Обходит дерево кнопок и выполнят с каждой переданную фукнцию.
 * @param {Function} f
 * @param {number=} opt_priority
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.treeWalk = function(f, opt_priority) {

  var i, size, group, result = true;
  for (i=0; i<this.treeSizes_.length; i++) {
    size = this.treeSizes_[i];
    group = size.getGroup();

    if (group) {
      if (opt_priority === undefined) {
        result = f.call(this, size);
        if (result === false)
          break;
      }
      result = group.treeWalk(f, opt_priority);
      if (result === false)
        break;

    } else if (opt_priority === undefined || size.getPriority() === opt_priority) {
      result = f.call(this, size);
      if (result === false)
        break;
    }
  }
  return result;
};

/**
 * Обходит дерево кнопок и выполнят с каждой переданную фукнцию.
 * @param {Function} f
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.rootLevelWalk = function(f) {
  var i, size, result = true;
  for (i=0; i<this.treeSizes_.length; i++) {
    size = this.treeSizes_[i];
    result = f.call(this, size);
    if (result === false)
      break;
  }
  return result;
};

/**
 * Сжимает все кнопки, соответствующие условию, до минимального размера.
 * @param {number=} opt_priority
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.minify = function(opt_priority) {
  this.flatWalk(function(size) {
    var group = size.getGroup();
    var priority = size.getPriority();
    if (!group && priority !== undefined && priority >= 0)
      size.setWidth(size.getMinWidth());
  }, opt_priority);
};

/**
 * Скрывает кнопки, соответствующие условиям.
 * @param {!number} priority
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.hide = function(priority, opt_onHide) {

  var i, size, group, result = true;

  for (i=0; i<this.treeSizes_.length; i++) {
    size = this.treeSizes_[i];

    if (size.isHidden())
      continue;

    group = size.getGroup();

    if (group) {
      group.hide(priority, opt_onHide);
      if (group.countVisible() === 0) {
        if (opt_onHide) {
          result = opt_onHide.call(this, size);
          if (result !== false)
            size.hide();
        } else {
          size.hide();
        }
      }

    } else if (size.getPriority() === priority)
      if (opt_onHide) {
        result = opt_onHide.call(this, size);
        if (result !== false)
          size.hide();
      } else {
        size.hide();
      }
  }
};

/**
 * Вписывает набор кнопок в заданную ширину.
 * @param {number} maxWidth В эту ширину надо уместить набор кнопок.
 * @param {boolean=} opt_hide Скрывать ли малоприоритетные кнопки,
 *    если не хватит места даже после сжатия. Default to FALSE.
 * @return {number} Получившаяся ширина кнопок.
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.compact = function(maxWidth, opt_hide, opt_onHide) {

  this.reset();
  this.minify();
  var overflow = this.getWidth() - maxWidth;

  if (overflow > 0 && opt_hide) {
    for (var i=this.priorities_.length-1; i>0; i--) {
      this.hide(this.priorities_[i], opt_onHide);
      overflow = this.getWidth() - maxWidth;
      if (overflow <= 0)
        break;
    }
  }

  if (overflow < 0) {
    this.expand(-overflow);
  }

  return this.getWidth();
};

/**
 * Разбивает набор кнопок на несколько наборов, умещающихся в заданные ширины.
 * @param {Array.<number>} Массив ширин рядов.
 * @return {Array.<DD.ui.controls.SizeHelper.GroupSize>}
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.getRows = function(widths, opt_hide, opt_onHide) {

  if (widths.length === 0)
    return;

  this.reset();
  this.minify();

  var groups = this.split(widths);
  var i;

  if (opt_hide && groups.length > widths.length) {
    for (i=this.priorities_.length-1; i>0; i--) {
      this.hide(this.priorities_[i], opt_onHide);
      groups = this.split(widths);
      if (groups.length <= widths.length)
        break;
    }
  }

  var rows = [];
  var maxWidth = 0;
  for (i=0; i<groups.length; i++) {
    maxWidth = i<widths.length ? widths[i] : widths[widths.length-1];
    rows[i] = new DD.ui.controls.SizeHelper.GroupSize(groups[i], {indent: this.indentSize_});
    rows[i].expand(maxWidth - rows[i].getWidth());
  }

  return rows;
};

/**
 * Расставляет пробелы между кнопками.
 * @protected
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.applyIndents = function() {
  var i, size, lastIndex = this.treeSizes_.length - 1;
  for (i=0; i<=lastIndex; i++) {
    size = this.treeSizes_[i];
    if (size.isHidden())
      continue;
    size.setIndent(i === lastIndex ? 0 : this.indentSize_);
  }
};

/**
 * @return {boolean}
 * @public
 */
DD.ui.controls.SizeHelper.GroupSize.prototype.hasBreaks = function() {
  var i, size;
  for (i=0; i<this.treeSizes_.length; i++) {
    size = this.treeSizes_[i];
    if (!size.isHidden() && size.isWrap()) {
      return true;
    }
  }
  return false;
};