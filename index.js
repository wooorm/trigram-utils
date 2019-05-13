'use strict'

var trigram = require('n-gram').trigram
var collapse = require('collapse-white-space')
var trim = require('trim')

var has = {}.hasOwnProperty

exports.clean = clean
exports.trigrams = getCleanTrigrams
exports.asDictionary = getCleanTrigramsAsDictionary
exports.asTuples = getCleanTrigramsAsTuples
exports.tuplesAsDictionary = getCleanTrigramTuplesAsDictionary

// Clean `value`/
// Removed general non-important (as in, for language detection) punctuation
// marks, symbols, and numbers.
function clean(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return trim(
    collapse(String(value).replace(/[\u0021-\u0040]+/g, ' '))
  ).toLowerCase()
}

// Get clean, padded, trigrams.
function getCleanTrigrams(value) {
  return trigram(' ' + clean(value) + ' ')
}

// Get an `Object` with trigrams as its attributes, and their occurence count as
// their values.
function getCleanTrigramsAsDictionary(value) {
  var trigrams = getCleanTrigrams(value)
  var index = trigrams.length
  var dictionary = {}
  var trigram

  while (index--) {
    trigram = trigrams[index]

    if (has.call(dictionary, trigram)) {
      dictionary[trigram]++
    } else {
      dictionary[trigram] = 1
    }
  }

  return dictionary
}

// Get an `Array` containing trigram--count tuples from a given value.
function getCleanTrigramsAsTuples(value) {
  var dictionary = getCleanTrigramsAsDictionary(value)
  var tuples = []
  var trigram

  for (trigram in dictionary) {
    tuples.push([trigram, dictionary[trigram]])
  }

  tuples.sort(sort)

  return tuples
}

// Get an `Array` containing trigram--count tuples from a given value.
function getCleanTrigramTuplesAsDictionary(tuples) {
  var index = tuples.length
  var dictionary = {}
  var tuple

  while (index--) {
    tuple = tuples[index]
    dictionary[tuple[0]] = tuple[1]
  }

  return dictionary
}

// Deep regular sort on item at `1` in both `Object`s.
function sort(a, b) {
  return a[1] - b[1]
}
