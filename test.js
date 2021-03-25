import test from 'tape'
import {
  clean,
  trigrams,
  asDictionary,
  asTuples,
  tuplesAsDictionary
} from './index.js'

test('.clean', function (t) {
  var ignore = '!"#$%&\'()*+,-./0123456789:;<=>?@'
  var index = -1

  t.equal(typeof clean('test'), 'string', 'should return a string')
  t.equal(clean(), '', 'should accept a missing value')
  t.equal(clean(null), '', 'should accept `null`')
  t.equal(clean(undefined), '', 'should accept `undefined`')

  while (++index < ignore.length) {
    t.equal(
      clean(ignore.charAt(index)),
      '',
      'should remove `' + ignore.charAt(index) + '`'
    )
  }

  t.equal(clean('a  b'), 'a b', 'should collapse multiple spaces to one')
  t.equal(
    clean('a\n b'),
    'a b',
    'should collapse newlines and spaces to a space'
  )
  t.equal(clean('a \tb'), 'a b', 'should collapse tabs and spaces to a space')

  t.equal(clean('\n\ta'), 'a', 'should trim initial white-space')
  t.equal(clean('a \f'), 'a', 'should trim final white-space')
  t.equal(clean('\ta \f'), 'a', 'should trim surrounding white-space')
  t.equal(clean('\t\n \f'), '', 'should trim white-space only input')

  t.equal(clean('AlPHA'), 'alpha', 'should lowercase mixed-case')
  t.equal(clean('BRAVO'), 'bravo', 'should lowercase uppercase')
  t.equal(clean('Charlie'), 'charlie', 'should lowercase sentence-case')

  t.end()
})

test('.trigrams', function (t) {
  t.ok(Array.isArray(trigrams('test')), 'should return an array')
  t.equal(trigrams('test').join(), ' te,tes,est,st ', 'should return trigrams')
  t.equal(
    trigrams('te@st').join(),
    ' te,te ,e s, st,st ',
    'should return cleaned trigrams (1)'
  )
  t.equal(
    trigrams('\nte\tst ').join(),
    ' te,te ,e s, st,st ',
    'should return cleaned trigrams (2)'
  )
  t.end()
})

test('.asDictionary', function (t) {
  t.equal(typeof asDictionary('test'), 'object', 'should return an object')

  t.deepEqual(
    asDictionary('test'),
    {'st ': 1, est: 1, tes: 1, ' te': 1},
    'should return trigrams'
  )

  t.deepEqual(
    asDictionary('te@st'),
    {' st': 1, ' te': 1, 'e s': 1, 'st ': 1, 'te ': 1},
    'should return cleaned trigrams (1)'
  )

  t.deepEqual(
    asDictionary('\nte\tst '),
    {' st': 1, ' te': 1, 'e s': 1, 'st ': 1, 'te ': 1},
    'should return cleaned trigrams (2)'
  )

  t.deepEqual(
    asDictionary('testtest'),
    {' te': 1, est: 2, 'st ': 1, stt: 1, tes: 2, tte: 1},
    'should count duplicate trigrams'
  )

  t.end()
})

test('.asTuples', function (t) {
  t.ok(Array.isArray(asTuples('test')), 'should return an array')
  t.equal(
    asTuples('test')
      .map((d) => d.join(';'))
      .join(),
    ' te;1,tes;1,est;1,st ;1',
    'should return tuples'
  )
  t.equal(
    asTuples('te@st')
      .map((d) => d.join(';'))
      .join(),
    ' te;1,te ;1,e s;1, st;1,st ;1',
    'should return cleaned trigrams (1)'
  )
  t.equal(
    asTuples('\nte\tst ')
      .map((d) => d.join(';'))
      .join(),
    ' te;1,te ;1,e s;1, st;1,st ;1',
    'should return cleaned trigrams (2)'
  )

  t.equal(
    asTuples('testtest')
      .map((d) => d.join(';'))
      .join(),
    ' te;1,stt;1,tte;1,st ;1,tes;2,est;2',
    'should count duplicate trigrams'
  )

  t.equal(
    asTuples('testtest')
      .map((d) => d.join(';'))
      .join(),
    ' te;1,stt;1,tte;1,st ;1,tes;2,est;2',
    'should sort trigrams'
  )

  t.end()
})

test('.tuplesAsDictionary', function (t) {
  t.equal(
    typeof tuplesAsDictionary(asTuples('test')),
    'object',
    'should return an object'
  )

  t.deepEqual(
    tuplesAsDictionary(asTuples('test')),
    {' te': 1, est: 1, 'st ': 1, tes: 1},
    'should return tuples as a dictionary'
  )

  t.deepEqual(
    tuplesAsDictionary(asTuples('testtest')),
    {' te': 1, est: 2, 'st ': 1, stt: 1, tes: 2, tte: 1},
    'should count duplicate trigrams'
  )

  t.end()
})
