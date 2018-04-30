'use strict'

var test = require('tape')
var utils = require('.')

test('.clean', function(t) {
  var blacklist = '!"#$%&\'()*+,-./0123456789:;<=>?@'.split('')

  t.equal(typeof utils.clean('test'), 'string', 'should return a string')
  t.equal(utils.clean(), '', 'should accept a missing value')
  t.equal(utils.clean(null), '', 'should accept `null`')
  t.equal(utils.clean(undefined), '', 'should accept `undefined`')

  blacklist.forEach(function(character) {
    t.equal(utils.clean(character), '', 'should remove `' + character + '`')
  })

  t.equal(utils.clean('a  b'), 'a b', 'should collapse multiple spaces to one')
  t.equal(
    utils.clean('a\n b'),
    'a b',
    'should collapse newlines and spaces to a space'
  )
  t.equal(
    utils.clean('a \tb'),
    'a b',
    'should collapse tabs and spaces to a space'
  )

  t.equal(utils.clean('\n\ta'), 'a', 'should trim initial white-space')
  t.equal(utils.clean('a \f'), 'a', 'should trim final white-space')
  t.equal(utils.clean('\ta \f'), 'a', 'should trim surrounding white-space')
  t.equal(utils.clean('\t\n \f'), '', 'should trim white-space only input')

  t.equal(utils.clean('AlPHA'), 'alpha', 'should lowercase mixed-case')
  t.equal(utils.clean('BRAVO'), 'bravo', 'should lowercase uppercase')
  t.equal(utils.clean('Charlie'), 'charlie', 'should lowercase sentence-case')

  t.end()
})

test('.trigrams', function(t) {
  t.ok(Array.isArray(utils.trigrams('test')), 'should return an array')
  t.equal(
    utils.trigrams('test').join(),
    ' te,tes,est,st ',
    'should return trigrams'
  )
  t.equal(
    utils.trigrams('te@st').join(),
    ' te,te ,e s, st,st ',
    'should return cleaned trigrams (1)'
  )
  t.equal(
    utils.trigrams('\nte\tst ').join(),
    ' te,te ,e s, st,st ',
    'should return cleaned trigrams (2)'
  )
  t.end()
})

test('.asDictionary', function(t) {
  t.equal(
    typeof utils.asDictionary('test'),
    'object',
    'should return an object'
  )

  t.deepEqual(
    utils.asDictionary('test'),
    {'st ': 1, est: 1, tes: 1, ' te': 1},
    'should return trigrams'
  )

  t.deepEqual(
    utils.asDictionary('te@st'),
    {' st': 1, ' te': 1, 'e s': 1, 'st ': 1, 'te ': 1},
    'should return cleaned trigrams (1)'
  )

  t.deepEqual(
    utils.asDictionary('\nte\tst '),
    {' st': 1, ' te': 1, 'e s': 1, 'st ': 1, 'te ': 1},
    'should return cleaned trigrams (2)'
  )

  t.deepEqual(
    utils.asDictionary('testtest'),
    {' te': 1, est: 2, 'st ': 1, stt: 1, tes: 2, tte: 1},
    'should count duplicate trigrams'
  )

  t.end()
})

test('.asTuples', function(t) {
  t.ok(Array.isArray(utils.asTuples('test')), 'should return an array')
  t.equal(
    utils
      .asTuples('test')
      .map(s)
      .join(),
    'st ;1,est;1,tes;1, te;1',
    'should return tuples'
  )
  t.equal(
    utils
      .asTuples('te@st')
      .map(s)
      .join(),
    'st ;1, st;1,e s;1,te ;1, te;1',
    'should return cleaned trigrams (1)'
  )
  t.equal(
    utils
      .asTuples('\nte\tst ')
      .map(s)
      .join(),
    'st ;1, st;1,e s;1,te ;1, te;1',
    'should return cleaned trigrams (2)'
  )

  t.equal(
    utils
      .asTuples('testtest')
      .map(s)
      .join(),
    'st ;1,tte;1,stt;1, te;1,est;2,tes;2',
    'should count duplicate trigrams'
  )

  t.equal(
    utils
      .asTuples('testtest')
      .map(s)
      .join(),
    'st ;1,tte;1,stt;1, te;1,est;2,tes;2',
    'should sort trigrams'
  )

  t.end()
})

test('.tuplesAsDictionary', function(t) {
  t.equal(
    typeof utils.tuplesAsDictionary('test'),
    'object',
    'should return an object'
  )

  t.deepEqual(
    utils.tuplesAsDictionary(utils.asTuples('test')),
    {' te': 1, est: 1, 'st ': 1, tes: 1},
    'should return tuples as a dictionary'
  )

  t.deepEqual(
    utils.tuplesAsDictionary(utils.asTuples('testtest')),
    {' te': 1, est: 2, 'st ': 1, stt: 1, tes: 2, tte: 1},
    'should count duplicate trigrams'
  )

  t.end()
})

function s(tuple) {
  return tuple.join(';')
}
