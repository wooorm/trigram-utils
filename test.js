'use strict';

/**
 * Dependencies.
 */

var utils,
    assert;

utils = require('./');
assert = require('assert');

/**
 * Make tuples easier to assert.
 */

function joinTuples(tupples) {
    return tupples.map(function (tuple) {
        return tuple.join('|');
    });
}

/**
 * Tests.
 */

describe('trigramUtils', function () {
    it('should be an Object', function () {
        assert(typeof utils === 'object');
    });
});

describe('trigramUtils.clean()', function () {
    var blacklist;

    blacklist = '!"#$%&\'()*+,-./0123456789:;<=>?@'.split('');

    it('should be a function', function () {
        assert(typeof utils.clean === 'function');
    });

    it('should return a string', function () {
        assert(typeof utils.clean('test') === 'string');
    });

    it('should accept an empty value', function () {
        assert(utils.clean() === '');
        assert(utils.clean(null) === '');
        assert(utils.clean(undefined) === '');
    });

    it('should stringify a value', function () {
        var value,
            stringified;

        stringified = 'test';

        value = {
            'toString' : function () {
                return stringified;
            }
        };

        assert(utils.clean(value) === stringified);
    });

    blacklist.forEach(function (character) {
        it('should remove `' + character + '`', function () {
            assert(utils.clean(character).indexOf(character) === -1);
        });
    });

    it('should concatenate duplicate white space', function () {
        assert(utils.clean('  ').indexOf('  ') === -1);
        assert(utils.clean('\n ').indexOf('\n ') === -1);
        assert(utils.clean(' \t').indexOf('\t ') === -1);
    });

    it('should trim white space', function () {
        assert(utils.clean(' alfred ') === 'alfred');
        assert(utils.clean('\nbertrand ') === 'bertrand');
        assert(utils.clean(' cees\t\t') === 'cees');
        assert(utils.clean('\n\n  \t\f\n') === '');
    });

    it('should lowercase simple uppercase letters', function () {
        assert(utils.clean('AlFrEd') === 'alfred');
        assert(utils.clean('BERTRAND') === 'bertrand');
        assert(utils.clean('Cees') === 'cees');
    });
});

describe('trigramUtils.trigrams()', function () {
    it('should be a function', function () {
        assert(typeof utils.trigrams === 'function');
    });

    it('should return an Array', function () {
        assert(Array.isArray(utils.trigrams('test')));
    });

    it('should return trigrams', function () {
        assert(utils.trigrams('test').join('|') === ' te|tes|est|st ');
    });

    it('should return cleaned trigrams', function () {
        assert(
            utils.trigrams('te@st').join('|') ===
            ' te|te |e s| st|st '
        );

        assert(
            utils.trigrams('\nte\tst ').join('|') ===
            ' te|te |e s| st|st '
        );
    });
});

describe('trigramUtils.asDictionary()', function () {
    it('should be a function', function () {
        assert(typeof utils.asDictionary === 'function');
    });

    it('should return an Object', function () {
        assert(typeof utils.asDictionary('test') === 'object');
    });

    it('should return trigrams as a dictionary', function () {
        var result;

        result = utils.asDictionary('test');

        assert(result[' te'] === 1);
        assert(result.tes === 1);
        assert(result.est === 1);
        assert(result['st '] === 1);
    });

    it('should return cleaned trigrams', function () {
        var result;

        result = utils.asDictionary('te@st');

        assert(result[' te'] === 1);
        assert(result['te '] === 1);
        assert(result['e s'] === 1);
        assert(result[' st'] === 1);
        assert(result['st '] === 1);

        result = utils.asDictionary('\nte\tst ');

        assert(result[' te'] === 1);
        assert(result['te '] === 1);
        assert(result['e s'] === 1);
        assert(result[' st'] === 1);
        assert(result['st '] === 1);
    });

    it('should count duplicate trigrams', function () {
        var result;

        result = utils.asDictionary('testtest');

        assert(result[' te'] === 1);
        assert(result.tes === 2);
        assert(result.est === 2);
        assert(result.stt === 1);
        assert(result.tte === 1);
        assert(result['st '] === 1);
    });
});

describe('trigramUtils.asTuples()', function () {
    it('should be a function', function () {
        assert(typeof utils.asTuples === 'function');
    });

    it('should return an Array', function () {
        assert(Array.isArray(utils.asTuples('test')));
    });

    it('should return trigrams as an array', function () {
        var result;

        result = joinTuples(utils.asTuples('test'));

        assert(result.indexOf(' te|1') !== -1);
        assert(result.indexOf('tes|1') !== -1);
        assert(result.indexOf('est|1') !== -1);
        assert(result.indexOf('st |1') !== -1);
        assert(result.length === 4);
    });

    it('should return cleaned trigrams', function () {
        var result;

        result = joinTuples(utils.asTuples('te@st'));

        assert(result.indexOf(' te|1') !== -1);
        assert(result.indexOf('te |1') !== -1);
        assert(result.indexOf('e s|1') !== -1);
        assert(result.indexOf(' st|1') !== -1);
        assert(result.indexOf('st |1') !== -1);
        assert(result.length === 5);

        result = joinTuples(utils.asTuples('\nte\tst '));

        assert(result.indexOf(' te|1') !== -1);
        assert(result.indexOf('te |1') !== -1);
        assert(result.indexOf('e s|1') !== -1);
        assert(result.indexOf(' st|1') !== -1);
        assert(result.indexOf('st |1') !== -1);
        assert(result.length === 5);
    });

    it('should count duplicate trigrams', function () {
        var result;

        result = joinTuples(utils.asTuples('testtest'));

        assert(result.indexOf(' te|1') !== -1);
        assert(result.indexOf('tes|2') !== -1);
        assert(result.indexOf('est|2') !== -1);
        assert(result.indexOf('stt|1') !== -1);
        assert(result.indexOf('tte|1') !== -1);
        assert(result.indexOf('st |1') !== -1);
        assert(result.length === 6);
    });

    it('should sort trigrams', function () {
        var result;

        result = joinTuples(utils.asTuples('testtest'));

        assert(result.indexOf(' te|1') < 4);
        assert(result.indexOf('stt|1') < 4);
        assert(result.indexOf('tte|1') < 4);
        assert(result.indexOf('st |1') < 4);
        assert(result.indexOf('tes|2') >= 4);
        assert(result.indexOf('est|2') >= 4);
    });
});

describe('trigramUtils.tuplesAsDictionary()', function () {
    it('should be a function', function () {
        assert(typeof utils.tuplesAsDictionary === 'function');
    });

    it('should return an Object', function () {
        assert(typeof utils.tuplesAsDictionary(['abc', 1]) === 'object');
    });

    it('should return tuples as a dictionary', function () {
        var tuples,
            result;

        tuples = [[' te', 1], ['tes', 1], ['est', 1], ['st ', 1]];

        result = utils.tuplesAsDictionary(tuples);

        assert(result[' te'] === 1);
        assert(result.tes === 1);
        assert(result.est === 1);
        assert(result['st '] === 1);
    });

    it('should correctly handle counts', function () {
        var tuples,
            result;

        tuples = [[' te', 1], ['tes', 1], ['est', 1], ['st ', 1]];

        result = utils.tuplesAsDictionary(tuples);

        assert(result[' te'] === 1);
        assert(result.tes === 1);
        assert(result.est === 1);
        assert(result['st '] === 1);
    });

    it('should count duplicate trigrams', function () {
        var tuples,
            result;

        tuples = [
            ['st ', 1],
            ['tte', 1],
            ['stt', 1],
            [' te', 1],
            ['est', 2],
            ['tes', 2]
        ];

        result = utils.tuplesAsDictionary(tuples);

        assert(result[' te'] === 1);
        assert(result.tes === 2);
        assert(result.est === 2);
        assert(result.stt === 1);
        assert(result.tte === 1);
        assert(result['st '] === 1);
    });
});
