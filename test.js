import assert from 'node:assert/strict'
import test from 'node:test'
import {
  clean,
  trigrams,
  asDictionary,
  asTuples,
  tuplesAsDictionary
} from './index.js'

test('.clean', function () {
  const ignore = '!"#$%&\'()*+,-./0123456789:;<=>?@'
  let index = -1

  assert.equal(typeof clean('test'), 'string', 'should return a string')
  assert.equal(clean(), '', 'should accept a missing value')
  assert.equal(clean(null), '', 'should accept `null`')
  assert.equal(clean(undefined), '', 'should accept `undefined`')

  while (++index < ignore.length) {
    assert.equal(
      clean(ignore.charAt(index)),
      '',
      'should remove `' + ignore.charAt(index) + '`'
    )
  }

  assert.equal(clean('a  b'), 'a b', 'should collapse multiple spaces to one')
  assert.equal(
    clean('a\n b'),
    'a b',
    'should collapse newlines and spaces to a space'
  )
  assert.equal(
    clean('a \tb'),
    'a b',
    'should collapse tabs and spaces to a space'
  )

  assert.equal(clean('\n\ta'), 'a', 'should trim initial white-space')
  assert.equal(clean('a \f'), 'a', 'should trim final white-space')
  assert.equal(clean('\ta \f'), 'a', 'should trim surrounding white-space')
  assert.equal(clean('\t\n \f'), '', 'should trim white-space only input')

  assert.equal(clean('AlPHA'), 'alpha', 'should lowercase mixed-case')
  assert.equal(clean('BRAVO'), 'bravo', 'should lowercase uppercase')
  assert.equal(clean('Charlie'), 'charlie', 'should lowercase sentence-case')
})

test('.trigrams', function () {
  assert.ok(Array.isArray(trigrams('test')), 'should return an array')
  assert.equal(
    trigrams('test').join(','),
    ' te,tes,est,st ',
    'should return trigrams'
  )
  assert.equal(
    trigrams('te@st').join(','),
    ' te,te ,e s, st,st ',
    'should return cleaned trigrams (1)'
  )
  assert.equal(
    trigrams('\nte\tst ').join(','),
    ' te,te ,e s, st,st ',
    'should return cleaned trigrams (2)'
  )
})

test('.asDictionary', function () {
  assert.equal(typeof asDictionary('test'), 'object', 'should return an object')

  assert.deepEqual(
    asDictionary('test'),
    {'st ': 1, est: 1, tes: 1, ' te': 1},
    'should return trigrams'
  )

  assert.deepEqual(
    asDictionary('te@st'),
    {' st': 1, ' te': 1, 'e s': 1, 'st ': 1, 'te ': 1},
    'should return cleaned trigrams (1)'
  )

  assert.deepEqual(
    asDictionary('\nte\tst '),
    {' st': 1, ' te': 1, 'e s': 1, 'st ': 1, 'te ': 1},
    'should return cleaned trigrams (2)'
  )

  assert.deepEqual(
    asDictionary('testtest'),
    {' te': 1, est: 2, 'st ': 1, stt: 1, tes: 2, tte: 1},
    'should count duplicate trigrams'
  )
})

test('.asTuples', function () {
  assert.ok(Array.isArray(asTuples('test')), 'should return an array')
  assert.equal(
    asTuples('test')
      .map((d) => d.join(';'))
      .join(','),
    ' te;1,tes;1,est;1,st ;1',
    'should return tuples'
  )
  assert.equal(
    asTuples('te@st')
      .map((d) => d.join(';'))
      .join(','),
    ' te;1,te ;1,e s;1, st;1,st ;1',
    'should return cleaned trigrams (1)'
  )
  assert.equal(
    asTuples('\nte\tst ')
      .map((d) => d.join(';'))
      .join(','),
    ' te;1,te ;1,e s;1, st;1,st ;1',
    'should return cleaned trigrams (2)'
  )

  assert.equal(
    asTuples('testtest')
      .map((d) => d.join(';'))
      .join(','),
    ' te;1,stt;1,tte;1,st ;1,tes;2,est;2',
    'should count duplicate trigrams'
  )

  assert.equal(
    asTuples('testtest')
      .map((d) => d.join(';'))
      .join(','),
    ' te;1,stt;1,tte;1,st ;1,tes;2,est;2',
    'should sort trigrams'
  )
})

test('.tuplesAsDictionary', function () {
  assert.equal(
    typeof tuplesAsDictionary(asTuples('test')),
    'object',
    'should return an object'
  )

  assert.deepEqual(
    tuplesAsDictionary(asTuples('test')),
    {' te': 1, est: 1, 'st ': 1, tes: 1},
    'should return tuples as a dictionary'
  )

  assert.deepEqual(
    tuplesAsDictionary(asTuples('testtest')),
    {' te': 1, est: 2, 'st ': 1, stt: 1, tes: 2, tte: 1},
    'should count duplicate trigrams'
  )
})
