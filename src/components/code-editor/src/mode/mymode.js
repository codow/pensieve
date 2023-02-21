// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * freemarker
 */
import CodeMirror from 'codemirror'

CodeMirror
  .defineMode('mymode', function (config) {
    'use strict'

    // our default settings; check to see if they're overridden
    var settings = {
      leftDelimiter: '<', rightDelimiter: '>', tagSyntax: 1
      // 1 angle_bracket,2 square_bracket
    }

    const keys = ['var']

    // the public API for CodeMirror
    return {
      startState: function () {
        return {
          mode: 'mymode'
        }
      },
      token: function (stream, state) {
        // 判断stream的处理方式
        console.log('stream', stream)
        for (let key of keys) {
          // true 跳过匹配的长度
          if (stream.match(key, true)) {
            return 'keyword'
          } else if (stream.match(/\w+/, true)) {
            return 'propeties'
          }
        }
        stream.next()
        return null
      },
      electricChars: ''
    }
  })

CodeMirror.defineMIME('text/mymode', 'mymode')
