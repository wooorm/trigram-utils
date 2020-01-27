# `trigram-utils`

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Trigram language statistics utility functions, in their own repository to make
sure [`trigrams`][trigrams] (trigram info for the universal declaration of
human rights) and [`franc`][franc] (language detection) use the same cleaning
and classification methods.

## Install

[npm][]:

```sh
npm install trigram-utils
```

## Use

```js
var utils = require('trigram-utils')

utils.clean(' t@rololol ') // => 't rololol'

utils.trigrams(' t@rololol ')
// => [ ' t ', 't r', ' ro', 'rol', 'olo', 'lol', 'olo', 'lol', 'ol ' ]

utils.asDictionary(' t@rololol ')
// => { 'ol ': 1, lol: 2, olo: 2, rol: 1, ' ro': 1, 't r': 1, ' t ': 1 }

var tuples = utils.asTuples(' t@rololol ')
// => [ [ 'ol ', 1 ],
//     [ 'rol', 1 ],
//     [ ' ro', 1 ],
//     [ 't r', 1 ],
//     [ ' t ', 1 ],
//     [ 'lol', 2 ],
//     [ 'olo', 2 ] ]

utils.tuplesAsDictionary(tuples)
// => { olo: 2, lol: 2, ' t ': 1, 't r': 1, ' ro': 1, rol: 1, 'ol ': 1 }
```

## API

### `utils.clean(value)`

Clean a given string: strips some (for language detection) useless punctuation,
symbols, and numbers.
Collapses white space, trims, and lowercases.

### `utils.trigrams(value)`

Get clean, padded trigrams (see [`n-gram`][n-gram]).

### `utils.asDictionary(value)`

Get clean trigrams as a dictionary: keys are trigrams, values are occurrence
counts.

### `utils.asTuples(value)`

Get clean trigrams with occurrence counts as a tuple: first index (`0`) the
trigram, second (`1`) the occurrence count.

### `utils.tuplesAsDictionary(tuples)`

Transform an `Array` of trigram–occurrence tuples (as returned by
[`asTuples()`][as-tuples]) as a dictionary (as returned by
[`asDictionary()`][as-dictionary])

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/trigram-utils.svg

[build]: https://travis-ci.org/wooorm/trigram-utils

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/trigram-utils.svg

[coverage]: https://codecov.io/github/wooorm/trigram-utils

[downloads-badge]: https://img.shields.io/npm/dm/trigram-utils.svg

[downloads]: https://www.npmjs.com/package/trigram-utils

[size-badge]: https://img.shields.io/bundlephobia/minzip/trigram-utils.svg

[size]: https://bundlephobia.com/result?p=trigram-utils

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[trigrams]: https://github.com/wooorm/trigrams

[franc]: https://github.com/wooorm/franc

[n-gram]: https://github.com/words/n-gram

[as-tuples]: #utilsastuplesvalue

[as-dictionary]: #utilsasdictionaryvalue
