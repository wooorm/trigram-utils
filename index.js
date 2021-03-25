import {trigram} from 'n-gram'
import {collapseWhiteSpace} from 'collapse-white-space'

var own = {}.hasOwnProperty

// Clean `value`.
// Removed general non-important (as in, for language detection) punctuation
// marks, symbols, and digits.
export function clean(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return collapseWhiteSpace(String(value).replace(/[\u0021-\u0040]+/g, ' '))
    .trim()
    .toLowerCase()
}

// Get clean, padded, trigrams.
export function trigrams(value) {
  return trigram(' ' + clean(value) + ' ')
}

// Get an `Object` with trigrams as its attributes, and their occurence count as
// their values.
export function asDictionary(value) {
  var values = trigrams(value)
  var dictionary = {}
  var index = -1

  while (++index < values.length) {
    if (own.call(dictionary, values[index])) {
      dictionary[values[index]]++
    } else {
      dictionary[values[index]] = 1
    }
  }

  return dictionary
}

// Get an `Array` containing trigram--count tuples from a given value.
export function asTuples(value) {
  var dictionary = asDictionary(value)
  var tuples = []
  var trigram

  for (trigram in dictionary) {
    tuples.push([trigram, dictionary[trigram]])
  }

  tuples.sort(sort)

  return tuples
}

// Get an `Array` containing trigram--count tuples from a given value.
export function tuplesAsDictionary(tuples) {
  var dictionary = {}
  var index = -1

  while (++index < tuples.length) {
    dictionary[tuples[index][0]] = tuples[index][1]
  }

  return dictionary
}

// Deep regular sort on item at `1` in both `Object`s.
function sort(a, b) {
  return a[1] - b[1]
}
