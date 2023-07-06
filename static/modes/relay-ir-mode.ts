// Copyright (c) 2018, Compiler Explorer Authors
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import * as monaco from 'monaco-editor';

// This definition is based on the official LLVM vim syntax:
// http://llvm.org/svn/llvm-project/llvm/trunk/utils/vim/syntax/llvm.vim
// For VIM regex syntax, see: http://vimdoc.sourceforge.net/htmldoc/pattern.html
export function definition(): monaco.languages.IMonarchLanguage {
    return {
        // tvmType
        types: ['float32', 'int8', 'int16', 'int32', 'int64', 'uint8', 'uint16', 'uint32', 'uint64'],
        // tvmStatement
        statements: ['add'],
        // tvmKeyword
        keywords: ['Tensor', 'ty', 'def'],

        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
            root: [
                [/[,(){}<>[\]]/, 'delimiters'],
                [/i\d+\**/, 'type'], // llvmType

                // Misc syntax.
                [/[%@!]\d+/, 'variable.name'], // llvmNoName
                [/-?\d+\.\d*(e[+-]\d+)?/, 'number.float'], // llvmFloat
                [/0[xX][0-9A-Fa-f]+/, 'number.hex'], // llvmFloat
                [/-?\d+/, 'number'], // llvmNumber
                [/\b(true|false)\b/, 'keyword'], // llvmBoolean
                [/\b(zeroinitializer|undef|null|none)\b/, 'constant'], // llvmConstant
                [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
                [/"/, 'string', '@string'], // push to string state
                // slightly modified to support demangled function signatures as labels for llvm ir control flow graphs
                [/[-a-zA-Z$._][-a-zA-Z$._0-9]*(?:\([^:]+\))?:/, 'tag'], // llvmLabel
                [/[%@][-a-zA-Z$._][-a-zA-Z$._0-9]*/, 'variable.name'], // llvmIdentifier

                // Named metadata and specialized metadata keywords.
                [/![-a-zA-Z$._][-a-zA-Z$._0-9]*(?=\s*)$/, 'identifier'], // llvmIdentifier
                [/![-a-zA-Z$._][-a-zA-Z$._0-9]*(?=\s*[=!])/, 'identifier'], // llvmIdentifier
                [/![A-Za-z]+(?=\s*\()/, 'type'], // llvmType

                // Syntax-highlight lit test commands and bug numbers.
                [/;.*$/, 'comment'],
                [/[*#=!]/, 'operators'],
                [
                    /[a-z_$][\w$]*/,
                    {
                        cases: {
                            '@statements': 'operators',
                            '@keywords': 'keyword',
                            '@types': 'type',
                            '@default': 'identifier',
                        },
                    },
                ],
                [/[ \t\r\n]+/, 'white'],
            ],
            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, 'string', '@pop'],
            ],
        },
    };
}

monaco.languages.register({id: 'relay-ir'});
monaco.languages.setMonarchTokensProvider('relay-ir', definition());

export {};
