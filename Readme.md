# trigram-utils [![Build Status](https://img.shields.io/travis/wooorm/trigram-utils.svg?style=flat)](https://travis-ci.org/wooorm/trigram-utils) [![Coverage Status](https://img.shields.io/coveralls/wooorm/trigram-utils.svg?style=flat)](https://coveralls.io/r/wooorm/trigram-utils?branch=master)

Trigram language statistics utility functions, in their own repository to make sure [wooorm/trigrams](https://github.com/wooorm/trigrams) (trigram information for the Universal Declaration of Human Rights) and [wooorm/franc](https://github.com/wooorm/franc) (language detection) use the same cleaning and classification methods.

## Installation

npm:
```sh
$ npm install trigram-utils
```

Component:
```sh
$ component install wooorm/trigram-utils
```

Bower:
```sh
$ bower install trigram-utils
```

## Usage

```js
var trigramUtils = require('trigram-utils');

trigramUtils.clean(' t@rololol '); // 't rololol'

trigramUtils.trigrams(' t@rololol ');
// [ ' t ', 't r', ' ro', 'rol', 'olo', 'lol', 'olo', 'lol', 'ol ' ]

trigramUtils.asDictionary(' t@rololol ');
/*
 * {
 *   'ol ': 1,
 *   'lol': 2,
 *   'olo': 2,
 *   'rol': 1,
 *   ' ro': 1,
 *   't r': 1,
 *   ' t ': 1
 * }
 */

var tuples = trigramUtils.asTuples(' t@rololol ');
/*
 * [
 *   ['ol ': 1],
 *   ['rol': 1],
 *   [' ro': 1],
 *   ['t r': 1],
 *   [' t ': 1],
 *   ['lol': 2],
 *   ['olo': 2]
 * ]
 */

trigramUtils.tuplesAsDictionary(tuples.slice(-3));
/*
 * {
 *   'olo': 2,
 *   'lol': 2,
 *   ' t ': 1
 * }
 */
```

## API

### trigramUtils.clean(string)

Clean a given string: strips [certain](index.js#L26-L59) (for language detection) useless punctuation, symbols, and numbers. Concatenate extraneous white space, trim, lowercase, and pad (with one space on both sides).

### trigramUtils.trigrams(string)

Get clean trigrams (see [wooorm/n-gram](https://github.com/wooorm/n-gram)).

### trigramUtils.asDictionary(string)

Get clean trigrams as a dictionary: keys are trigrams, values are occurrence counts.

### trigramUtils.asTuples(string)

Get clean trigrams with occurrence counts as a tuple: first indice (`0`) the trigram, second (`1`) the occurrence count.

### trigramUtils.tuplesAsDictionary(Array.\<Array.\<string, number\>\>)

Transform an `Array` of trigram–occurrence tuples (as returned by `trigramUtils.asTuples(string)`) as a dictionary (see `trigramUtils.asDictionary(string)`);

## License

MIT © [Titus Wormer](http://wooorm.com)
