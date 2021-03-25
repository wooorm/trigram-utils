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

This package is ESM only: Node 12+ is needed to use it and it must be `import`ed
instead of `require`d.

[npm][]:

```sh
npm install trigram-utils
```

## Use

```js
import {clean, trigrams, asDictionary, asTuples, tuplesAsDictionary} from 'trigram-utils'

clean(' t@rololol ') // => 't rololol'

trigrams(' t@rololol ')
// => [' t ', 't r', ' ro', 'rol', 'olo', 'lol', 'olo', 'lol', 'ol ']

asDictionary(' t@rololol ')
// => {'ol ': 1, lol: 2, olo: 2, rol: 1, ' ro': 1, 't r': 1, ' t ': 1}

var tuples = asTuples(' t@rololol ')
// => [
//   ['ol ', 1],
//   ['rol', 1],
//   [' ro', 1],
//   ['t r', 1],
//   [' t ', 1],
//   ['lol', 2],
//   ['olo', 2]
// ]

tuplesAsDictionary(tuples)
// => {olo: 2, lol: 2, ' t ': 1, 't r': 1, ' ro': 1, rol: 1, 'ol ': 1}
```

## API

This package exports the following identifiers: `clean`, `trigrams`,
`asDictionary`, `asTuples`, tuplesAsDictionary.
There is no default export.

### `clean(value)`

Clean a given string: strips some (for language detection) useless punctuation,
symbols, and numbers.
Collapses white space, trims, and lowercases.

### `trigrams(value)`

Get clean, padded trigrams (see [`n-gram`][n-gram]).

### `asDictionary(value)`

Get clean trigrams as a dictionary (`Object<string, number>`): keys are
trigrams, values are occurrence counts.

### `asTuples(value)`

Get clean trigrams with occurrence counts as a tuple (`[string, number][]`):
first index (`0`) the trigram, second (`1`) the occurrence count.

### `tuplesAsDictionary(tuples)`

Transform an `Array` of trigram–occurrence tuples (as returned by
[`asTuples()`][as-tuples]) to a dictionary (as returned by
[`asDictionary()`][as-dictionary])

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/wooorm/trigram-utils/workflows/main/badge.svg

[build]: https://github.com/wooorm/trigram-utils/actions

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

[as-tuples]: #astuplesvalue

[as-dictionary]: #asdictionaryvalue
