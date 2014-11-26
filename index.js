'use strict';

var getTrigrams,
    EXPRESSION_SYMBOLS,
    has;

/**
 * Dependencies.
 */

getTrigrams = require('n-gram').trigram;

/**
 * Cache.
 */

has = Object.prototype.hasOwnProperty;

/**
 * An expression matching general non-important (as in, for
 * language detection) punctuation marks, symbols, and numbers.
 *
 * | Unicode | Character | Name               |
 * | ------: | :-------: | :----------------- |
 * |  \u0021 |     !     | EXCLAMATION MARK   |
 * |  \u0022 |     "     | QUOTATION MARK     |
 * |  \u0023 |     #     | NUMBER SIGN        |
 * |  \u0024 |     $     | DOLLAR SIGN        |
 * |  \u0025 |     %     | PERCENT SIGN       |
 * |  \u0026 |     &     | AMPERSAND          |
 * |  \u0027 |     '     | APOSTROPHE         |
 * |  \u0028 |     (     | LEFT PARENTHESIS   |
 * |  \u0029 |     )     | RIGHT PARENTHESIS  |
 * |  \u002A |     *     | ASTERISK           |
 * |  \u002B |     +     | PLUS SIGN          |
 * |  \u002C |     ,     | COMMA              |
 * |  \u002D |     -     | HYPHEN-MINUS       |
 * |  \u002E |     .     | FULL STOP          |
 * |  \u002F |     /     | SOLIDUS            |
 * |  \u0030 |     0     | DIGIT ZERO         |
 * |  \u0031 |     1     | DIGIT ONE          |
 * |  \u0032 |     2     | DIGIT TWO          |
 * |  \u0033 |     3     | DIGIT THREE        |
 * |  \u0034 |     4     | DIGIT FOUR         |
 * |  \u0035 |     5     | DIGIT FIVE         |
 * |  \u0036 |     6     | DIGIT SIX          |
 * |  \u0037 |     7     | DIGIT SEVEN        |
 * |  \u0038 |     8     | DIGIT EIGHT        |
 * |  \u0039 |     9     | DIGIT NINE         |
 * |  \u003A |     :     | COLON              |
 * |  \u003B |     ;     | SEMICOLON          |
 * |  \u003C |     <     | LESS-THAN SIGN     |
 * |  \u003D |     =     | EQUALS SIGN        |
 * |  \u003E |     >     | GREATER-THAN SIGN  |
 * |  \u003F |     ?     | QUESTION MARK      |
 * |  \u0040 |     @     | COMMERCIAL AT      |
 */

EXPRESSION_SYMBOLS = /[\u0021-\u0040]+/g;

/**
 * Clean `value`.
 *
 * @example
 *   > clean('Some dirty  text.')
 *   // 'some dirty text'
 *
 * @param {string} value
 * @return {string}
 */

function clean(value) {
    if (value === null || value === undefined) {
        value = '';
    }

    return String(value)
        .replace(EXPRESSION_SYMBOLS, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

/**
 * Deep regular sort on item at `1` in both `Object`s.
 *
 * @example
 *   > [[0, 20], [0, 1], [0, 5]].sort(sort);
 *   // [[0, 1], [0, 5], [0, 20]]
 *
 * @param {{1: number}} a
 * @param {{1: number}} b
 */

function sort(a, b) {
    return a[1] - b[1];
}

/**
 * Get clean, padded, trigrams.
 *
 * @param {string} value
 * @return {Array.<string>}
 */

function getCleanTrigrams(value) {
    return getTrigrams(' ' + clean(value) + ' ');
}

/**
 * Get an `Object` with trigrams as its attributes, and
 * their occurence count as their values
 *
 * @param {string} value
 * @return {Object.<string, number>} - `Object` containing
 *   weighted trigrams.
 */

function getCleanTrigramsAsDictionary(value) {
    var trigrams,
        dictionary,
        index,
        trigram;

    trigrams = getCleanTrigrams(value);
    dictionary = {};
    index = trigrams.length;

    while (index--) {
        trigram = trigrams[index];

        if (has.call(dictionary, trigram)) {
            dictionary[trigram]++;
        } else {
            dictionary[trigram] = 1;
        }
    }

    return dictionary;
}

/**
 * Get an `Array` containing trigram--count tuples from a
 * given value.
 *
 * @param {string} value
 * @return {Array.<Array.<string, number>>} `Array`
 *   containing trigram--count tupples, sorted by
 *   count (low to high).
 */

function getCleanTrigramsAsTuples(value) {
    var dictionary,
        tuples,
        trigram;

    dictionary = getCleanTrigramsAsDictionary(value);
    tuples = [];

    for (trigram in dictionary) {
        tuples.push([trigram, dictionary[trigram]]);
    }

    tuples.sort(sort);

    return tuples;
}

/**
 * Get an `Array` containing trigram--count tuples from a
 * given value.
 *
 * @param {Array.<Array.<string, number>>} tuples - Tuples
 *   to transform into a dictionary.
 * @return {Object.<string, number>}
 */

function getCleanTrigramTuplesAsDictionary(tuples) {
    var dictionary,
        index,
        tuple;

    dictionary = {};
    index = tuples.length;

    while (index--) {
        tuple = tuples[index];
        dictionary[tuple[0]] = tuple[1];
    }

    return dictionary;
}

/**
 * Expose utilities.
 */

module.exports = {
    'clean': clean,
    'trigrams': getCleanTrigrams,
    'asDictionary': getCleanTrigramsAsDictionary,
    'asTuples': getCleanTrigramsAsTuples,
    'tuplesAsDictionary': getCleanTrigramTuplesAsDictionary
};
