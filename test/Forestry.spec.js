/* global describe, it, beforeEach, before, xdescribe */

'use strict';

var assert = require('assert'),
	proxyquire = require('proxyquire').noCallThru();

describe('Forestry', function () {

	var testee,
		stubs = {};
	beforeEach(function () {
		stubs['./traversal'] = {
			TYPES: ['1', '2']
		};
		stubs['./Node'] = 'Node';
		stubs['./parse'] = 'parse';
		testee = proxyquire('../src/Forestry', stubs);
	});

	it('has correct TRAVERSAL_TYPES', function () {
		assert.deepEqual(testee.TRAVERSAL_TYPES, stubs['./traversal'].TYPES);
	});

	it('has reference to parse module', function () {
		assert.equal(testee.parse, stubs['./parse']);
	});

	it('has reference to Node module', function () {
		assert.equal(testee.Node, stubs['./Node']);
	});

});
