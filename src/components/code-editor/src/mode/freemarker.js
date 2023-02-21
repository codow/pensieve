// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * freemarker
 */
import CodeMirror from 'codemirror'

CodeMirror
  .defineMode('freemarker', function (config) {
    'use strict'

    // our default settings; check to see if they're overridden
    var settings = {
      leftDelimiter: '<', rightDelimiter: '>', tagSyntax: 1
      // 1 angle_bracket,2 square_bracket
    }
    if (config.hasOwnProperty('tagSyntax')) {
      if (config.tagSyntax === 2) {
        settings.tagSyntax = 2
        settings.leftDelimiter = '['
        settings.rightDelimiter = ']'
      }
    }

    var keyFunctions = [ 'assign', 'attempt', 'autoesc', 'break', 'case', 'compress', 'default', 'else',
      'elseif', 'escape', 'fallback', 'function', 'flush', 'ftl', 'global', 'if', 'import',
      'include', 'items', 'list', 'local', 'lt', 'macro', 'nested', 'noautoesc', 'noescape', 'noparse', 'nt', 'outputformat',
      'recover', 'recurse', 'return', 'rt', 'sep', 'setting', 'stop', 'switch', 't', 'visit' ]
    var specialVariables = [ 'auto_esc', 'caller_template_name', 'current_template_name', 'data_model', 'error', 'get_optional_template', 'globals', 'lang', 'locale',
      'locale_object', 'locals', 'main', 'main_template_name', 'namespace', 'node', 'now',
      'output_encoding', 'output_format', 'template_name', 'time_zone', 'url_escaping_charset', 'vars', 'version' ]

    var freemarkerStartTagArray = [ '#', '@' ]

    var freemarkerEndTagArray = [ '/#', '/@', '/>' ]

    var last
    var freemarkerMode
    var regs = {
      operatorChars: /[+\-*&%=<>!?:;,|&]/, validIdentifier: /[a-zA-Z0-9_]/, stringChar: /['"]/
    }

    var helpers = {
      cont: function (style, lastType, lastFreemarkerMode) {
        last = lastType
        freemarkerMode = lastFreemarkerMode
        return style
      },
      chain: function (stream, state, parser) {
        state.tokenize = parser
        return parser(stream, state)
      }
    }

    // our various parsers
    var parsers = {

      // the main tokenizer
      tokenizer: function (stream, state) {
        if (stream.match(settings.leftDelimiter, true)) {
          if (stream.match('#--', true)) {
            return helpers.chain(stream, state, parsers.inBlock('comment', '--' +
                                      settings.rightDelimiter))
          } else {
            for (var freemarkerStartTag of freemarkerStartTagArray) {
              if (stream.match(freemarkerStartTag, false)) {
                state.tokenize = parsers.freemarkerTemplate
                if (freemarkerStartTag === '@') {
                  freemarkerMode = 'macro'
                } else {
                  freemarkerMode = 'tag'
                }
                last = 'startTag'
                return 'tag'
              }
            }
            for (var freemarkerEndTag of freemarkerEndTagArray) {
              if (stream.match(freemarkerEndTag, false)) {
                state.tokenize = parsers.freemarkerTemplate
                if (freemarkerEndTag === '/@') {
                  freemarkerMode = 'macro'
                } else {
                  freemarkerMode = 'tag'
                }
                last = 'endTag'
                return 'tag'
              }
            }
          }
        } else if (stream.match('${', false)) {
          state.tokenize = parsers.freemarkerTemplate
          last = 'startTag'
          freemarkerMode = 'echo'
          return 'keyword'
        }
        stream.next()
        return null
      },

      // parsing freemarker content
      freemarkerTemplate: function (stream, state) {
        if (stream.match(settings.rightDelimiter, true)) {
          state.depth--
          if (state.depth <= 0) {
            state.tokenize = parsers.tokenizer
          }
          return helpers.cont('tag', null, null)
        } else if (state.freemarkerMode === 'echo' && stream.match('}', true)) {
          state.depth--
          if (state.depth <= 0) {
            state.tokenize = parsers.tokenizer
          }
          return helpers.cont('keyword', null, null)
        }

        if (stream.match(settings.leftDelimiter, true)) {
          for (var freemarkerStartTag of freemarkerStartTagArray) {
            if (stream.match(freemarkerStartTag, false)) {
              state.depth++
              if (freemarkerStartTag === '@') {
                return helpers.cont('tag', 'startTag', 'macro')
              } else {
                return helpers.cont('tag', 'startTag', 'tag')
              }
            }
          }
          for (var freemarkerEndTag of freemarkerEndTagArray) {
            if (stream.match(freemarkerEndTag, false)) {
              state.depth++
              if (freemarkerEndTag === '/@') {
                return helpers.cont('tag', 'endTag', 'macro')
              } else {
                return helpers.cont('tag', 'endTag', 'tag')
              }
            }
          }
        } else if (stream.match('${', true)) {
          state.depth++
          return helpers.cont('keyword', 'startTag', 'echo')
        }
        var ch = stream.next()
        if (ch === '.') {
          if (state.freemarkerMode === 'echo' || state.last === 'whitespace' || state.last === 'operator') {
            for (var specialVariable of specialVariables) {
              if (stream.match(specialVariable, true)) {
                return helpers.cont('keyword', 'variable', state.freemarkerMode)
              }
            }
          }
          if (state.last === 'keyword' && stream.eatWhile(regs.validIdentifier)) {
            return helpers.cont('keyword', null, state.freemarkerMode)
          } else {
            return helpers.cont('operator', 'childVariable', state.freemarkerMode)
          }
        } else if (regs.stringChar.test(ch)) {
          state.tokenize = parsers.inAttribute(ch)
          return helpers.cont('string', 'string', state.freemarkerMode)
        } else if (regs.operatorChars.test(ch)) {
          if (ch === '?') {
            return helpers.cont('operator', 'builtin', state.freemarkerMode)
          } else {
            return helpers.cont('operator', 'operator', state.freemarkerMode)
          }
        } else if (ch === '[' || ch === '{' || ch === '(') {
          return helpers.cont('bracket', 'bracket', state.freemarkerMode)
        } else if (ch === ']' || ch === '}' || ch === ')') {
          return helpers.cont('bracket', 'variable', state.freemarkerMode)
        } else if (ch === '/') {
          return helpers.cont('tag', 'endTag', state.freemarkerMode)
        } else if (ch === '@' && state.freemarkerMode === 'macro') {
          stream.eatWhile(regs.validIdentifier)
          return helpers.cont('keyword', 'keyword', state.freemarkerMode)
        } else if (/\d/.test(ch)) {
          stream.eat(/x/i)
          stream.eatWhile(/\d/)
          return helpers.cont('number', 'number', state.freemarkerMode)
        } else if (state.freemarkerMode === 'tag' && state.last === 'whitespace' && (stream.match('as', true) || stream.match('in', true) || stream.match('using', true))) {
          return helpers.cont('keyword', 'operator', state.freemarkerMode)
        } else if (state.freemarkerMode === 'tag' && state.last === 'whitespace' && (stream.match('gte', true) || stream.match('lte', true) || stream.match('gt', true) || stream.match('lt', true))) {
          return helpers.cont('operator', 'operator', state.freemarkerMode)
        } else {
          if (state.last === 'builtin') {
            stream.eat('?')
            stream.eatWhile(regs.validIdentifier)
            return helpers.cont('builtin', 'variable', state.freemarkerMode)
          } else if (state.last === 'whitespace' || state.last === 'bracket') {
            if (state.freemarkerMode === 'macro') {
              stream.eatWhile(regs.validIdentifier)
              return helpers.cont('attribute', 'attribute', state.freemarkerMode)
            } else {
              stream.eatWhile(regs.validIdentifier)
              return helpers.cont('variable-2', 'variable', state.freemarkerMode)
            }
          } else if (state.last === 'operator') {
            stream.eatWhile(regs.validIdentifier)
            return helpers.cont('variable-2', 'variable', state.freemarkerMode)
          } else if (state.last === 'childVariable') {
            stream.eatWhile(regs.validIdentifier)
            return helpers.cont('variable-3', 'variable', state.freemarkerMode)
          } else if (/\s/.test(ch)) {
            last = 'whitespace'
            return null
          } else if (state.last === 'string') {
            stream.eatWhile(regs.validIdentifier)
            return helpers.cont('attribute', 'attribute', state.freemarkerMode)
          } else {
            if (state.last === 'startTag' || state.last === 'endTag') {
              if (state.freemarkerMode === 'echo') {
                stream.eatWhile(regs.validIdentifier)
                return helpers.cont('variable-2', 'variable', state.freemarkerMode)
              }
            }
            if (state.freemarkerMode === 'tag') {
              var str = ''
              if (ch !== '/') {
                str += ch
              }
              var c = null
              while (c = stream.eat(regs.validIdentifier)) {
                str += c
              }
              for (var keyFunction of keyFunctions) {
                if ('#' + keyFunction === str) {
                  return helpers.cont('keyword', 'keyword', state.freemarkerMode)
                }
              }
            }
          }
          return helpers.cont('error', 'tag', state.freemarkerMode)
        }
      },

      inAttribute: function (quote) {
        return function (stream, state) {
          var prevChar = null
          var currChar = null
          while (!stream.eol()) {
            currChar = stream.peek()
            if (stream.next() === quote && prevChar !== '\\') {
              state.tokenize = parsers.freemarkerTemplate
              break
            }
            prevChar = currChar
          }
          return 'string'
        }
      },

      inBlock: function (style, terminator) {
        return function (stream, state) {
          while (!stream.eol()) {
            if (stream.match(terminator)) {
              state.tokenize = parsers.tokenizer
              break
            }
            stream.next()
          }
          return style
        }
      }
    }

    // the public API for CodeMirror
    return {
      startState: function () {
        return {
          tokenize: parsers.tokenizer,
          mode: 'freemarker',
          last: null,
          freemarkerMode: null,
          depth: 0
        }
      },
      token: function (stream, state) {
        state.last = last
        state.freemarkerMode = freemarkerMode
        return state.tokenize(stream, state)
      },
      electricChars: ''
    }
  })

CodeMirror.defineMIME('text/freemarker', 'freemarker')
