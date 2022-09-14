/**
 * js dom相关操作
 * @author wangyb
 * @createTime 2022-08-25 16:23:42
 */

const NATIVE_TAGS = ['!DOCTYPE', 'A', 'ABBR', 'ACRONYM', 'ADDRESS', 'APPLET', 'AREA', 'ARTICLE', 'ASIDE', 'AUDIO', 'B', 'BASE', 'BASEFONT', 'BDI', 'BDO', 'BIG', 'BLOCKQUOTE', 'BODY', 'BR', 'BUTTON', 'CANVAS', 'CAPTION', 'CENTER', 'CITE', 'CODE', 'COL', 'COLGROUP', 'COMMAND', 'DATALIST', 'DD', 'DEL', 'DETAILS', 'DIR', 'DIV', 'DFN', 'DIALOG', 'DL', 'DT', 'EM', 'EMBED', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FONT', 'FOOTER', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEAD', 'HEADER', 'HR', 'HTML', 'I', 'IFRAME', 'IMG', 'INPUT', 'INS', 'ISINDEX', 'KBD', 'KEYGEN', 'LABEL', 'LEGEND', 'LI', 'LINK', 'MAP', 'MARK', 'MENU', 'META', 'METER', 'NAV', 'NOFRAMES', 'NOSCRIPT', 'OBJECT', 'OL', 'OPTGROUP', 'OPTION', 'OUTPUT', 'P', 'PARAM', 'PRE', 'PROGRESS', 'Q', 'RP', 'RT', 'RUBY', 'S', 'SAMP', 'SCRIPT', 'SECTION', 'SELECT', 'SMALL', 'SOURCE', 'STRIKE', 'STRONG', 'STYLE', 'SUB', 'SUMMARY', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH', 'THEAD', 'TIME', 'TITLE', 'TR', 'TRACK', 'TT', 'U', 'UL', 'VAR', 'VIDEO', 'WBR', 'XMP']

const NATIVE_TAGS_MAP = {}
NATIVE_TAGS.forEach(tag => NATIVE_TAGS_MAP[tag] = true)

/**
 * 判断是否原生标签
 * @param {String} tag 标签名
 */
export function isNativeTag (tag) {
  if (!tag) return false
  tag = tag.toUpperCase()
  return tag in NATIVE_TAGS_MAP
}

/**
 * 给dom元素增加样式
 * 
 * @param {Dom} el dom元素
 * @param  {...any} newClassNames 需要增加的样式
 * @returns 
 */
export function addClass (el, ...newClassNames) {
  if (!el) return
  el.className = (el.className || '').split(/\s+/).filter(item => !newClassNames.includes(item)).concat(newClassNames).join(' ')
}

/**
 * 给dom元素删除样式
 * 
 * @param {*} el dom元素
 * @param  {...any} removeClassNames 需要删除的样式
 */
export function removeClass (el, ...removeClassNames) {
  if (!el) return
  el.className = (el.className || '').split(/\s+/).filter(item => !removeClassNames.includes(item)).join(' ')
}

var R_SPACE = /\s+/g
/**
 * 增加/删除样式
 * 
 * @param {*} el 
 * @param {*} name 
 * @param {*} state 
 */
export function toggleClass (el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name)
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ')
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ')
    }
  }
}

/**
 * 
 * @param {*} src 
 * @param {*} target 
 * @param {*} direction
 * @returns 
 */
export function addNode (src, target, direction) {
  direction === 'top' || direction === 'left' ? addNodeBefore(src, target) : addNodeAfter(src, target)
}

export function addNodeBefore (src, target) {
  var srcContainer = src.parentNode,
    targetContainer = target.parentNode

  if (!targetContainer
    || (srcContainer && srcContainer.isEqualNode(target))
    || targetContainer.isEqualNode(src)) return

  targetContainer.insertBefore(src, target)
}

export function addNodeAfter (src, target) {
  var srcContainer = src.parentNode,
    targetContainer = target.parentNode,
    srcIndex,
    targetIndex
  if (!targetContainer
    || (srcContainer && srcContainer.isEqualNode(target))
    || targetContainer.isEqualNode(src)) return

  if (srcContainer && srcContainer.isEqualNode(targetContainer) && srcIndex < targetIndex) {
    targetIndex++
  }

  if (targetContainer.lastChild === target) {
    targetContainer.append(src)
  } else {
    targetContainer.insertBefore(src, target.nextSibling)
  }
}

/**
 * 匹配dom选择器条件
 * 
 * @param {HTMLElement} el 
 * @param {String} selector 
 * @returns 
 */
export function matches (el, selector) {
  if (!selector) return
  selector[0] === '>' && (selector = selector.substring(1))

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector)
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector)
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector)
      }
    } catch (_) {
      return false
    }
  }

  return false
}

/**
 * 判断元素在父容器的顺序
 * 
 * @param {HTMLElement} el 
 * @param {String} selector 
 * @param  {...HTMLElement} exceptions 需要排除的元素
 * @returns 
 */
export function index (el, selector, ...exceptions) {
  var index = 0
  if (!el || !el.parentNode) {
    return -1
  }
  /* jshint boss:true */
  exceptions = exceptions || []
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && !exceptions.includes(el) && (!selector || matches(el, selector))) {
      index++
    }
  }
  return index
}