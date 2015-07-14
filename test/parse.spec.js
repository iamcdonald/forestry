/* global describe, it, beforeEach, before, xdescribe */

'use strict';

var assert = require('assert'),
	parse = require('../src/parse');

describe('parse', function () {

	it('parses an object to a tree with default settings (uses \'children\' as children property and includes all other properties as the data of that node)', function () {
		var obj = {
				name: '1',
				id: 1,
				children: [
					{
						name: '2',
						id: 2,
						children: [
							{
								name: '5',
								id: 5
							},
							{
								name: '6',
								id: 6
							}
						]
					},
					{
						name: '3',
						id: 3,
						children: [
							{
								name: '7',
								id: 7
							}
						]
					},
					{
						name: '4',
						id: 4
					}
				]
			},
			node;

		node = parse(obj);
		assert.equal(node.data.name, '1');
		assert.equal(node.data.id, 1);
		assert.equal(node.children.length, 3);
		assert.equal(node.children[2].data.name, '4');
		assert.equal(node.children[2].data.id, 4);
		assert.equal(node.children[1].children[0].data.name, '7');
		assert.equal(node.children[1].children[0].data.id, 7);
		node = node.find(function (n) {
			return n.data.name === '5';
		});
		assert.equal(node.data.name, '5');
		assert.equal(node.data.id, 5);
		assert.equal(node.children.length, 0);

	});

	it('parses an object to a tree with default settings (exchanges child objects for arrays and places the \'key\' on each object in the new array)', function () {
		var obj = {
				name: '1',
				id: 1,
				children: {
					'one': {
						name: '2',
						id: 2,
						children: {
							'four': {
								name: '5',
								id: 5
							},
							'five': {
								name: '6',
								id: 6
							}
						}
					},
					'two': {
						name: '3',
						id: 3,
						children: {
							'six': {
								name: '7',
								id: 7
							}
						}
					},
					'three': {
						name: '4',
						id: 4
					}
				}
			},
			node;

		node = parse(obj);
		assert.equal(node.data.name, '1');
		assert.equal(node.data.id, 1);
		assert.equal(node.children.length, 3);
		assert.equal(node.children[0].data.name, '2');
		assert.equal(node.children[0].data.id, 2);
		assert.equal(node.children[1].data._key, 'two');
		assert.equal(node.children[1].children[0].data.name, '7');
		assert.equal(node.children[1].children[0].data.id, 7);
		assert.equal(node.children[1].children[0].data._key, 'six');
		node = node.find(function (n) {
			return n.data.name === '5';
		});
		assert.equal(node.data.name, '5');
		assert.equal(node.data.id, 5);
		assert.equal(node.data._key, 'four');
		assert.equal(node.children.length, 0);

	});

	it('parses an object to a tree with different \'children\' property', function () {
		var obj = {
				name: '1',
				id: 1,
				links: [
					{
						name: '2',
						id: 2,
						links: [
							{
								name: '5',
								id: 5
							},
							{
								name: '6',
								id: 6
							}
						]
					},
					{
						name: '3',
						id: 3,
						links: [
							{
								name: '7',
								id: 7
							}
						]
					},
					{
						name: '4',
						id: 4
					}
				]
			},
			node;

		node = parse(obj, 'links');
		assert.equal(node.data.name, '1');
		assert.equal(node.data.id, 1);
		assert.equal(node.children.length, 3);
		assert.equal(node.children[1].data.name, '3');
		assert.equal(node.children[1].data.id, 3);
		assert.equal(node.children[1].children[0].data.name, '7');
		assert.equal(node.children[1].children[0].data.id, 7);
		node = node.find(function (n) {
			return n.data.name === '5';
		});
		assert.equal(node.data.name, '5');
		assert.equal(node.data.id, 5);
		assert.equal(node.children.length, 0);
	});

	it('parses an object to a tree using only property passed in as \'data\' for each node', function () {
		var obj = {
				name: '1',
				id: 1,
				children: [
					{
						name: '2',
						id: 2,
						children: [
							{
								name: '5',
								id: 5
							},
							{
								name: '6',
								id: 6
							}
						]
					},
					{
						name: '3',
						id: 3,
						children: [
							{
								name: '7',
								id: 7
							}
						]
					},
					{
						name: '4',
						id: 4
					}
				]
			},
			node;

		node = parse(obj, 'children', 'name');
		assert.equal(node.data, '1');
		assert.equal(node.children.length, 3);
		assert.equal(node.children[1].data, '3');
		assert.equal(node.children[1].children[0].data, '7');
		node = node.find(function (n) {
			return n.data === '5';
		});
		assert.equal(node.data, '5');
		assert.equal(node.children.length, 0);
	});

	it('throws an error if object passed in is not of type object', function () {
		assert.throws(function () {
			parse([]);
		}, TypeError, 'Passed arg must be of type \'object\'');
		assert.throws(function () {
			parse('wrong!');
		}, TypeError, 'Passed arg must be of type \'object\'');
		assert.throws(function () {
			parse(123);
		}, TypeError, 'Passed arg must be of type \'object\'');
		assert.throws(function () {
			parse(undefined);
		}, TypeError, 'Passed arg must be of type \'object\'');
		assert.throws(function () {
			parse(null);
		}, TypeError, 'Passed arg must be of type \'object\'');
	});

	it('throws an error if children are neither objects, arrays or null/undefined', function () {

		assert.throws(function () {
			parse({
				id: 1,
				children: 'String'
			});
		}, TypeError, '\'Children\' property must point to either Object or Array');
		assert.throws(function () {
			parse({
				id: 1,
				children: 12345
			});
		}, TypeError, '\'Children\' property must point to either Object or Array');

	});

	it('throws an error if any child is not an object', function () {

		assert.throws(function () {
			parse({
				id: 1,
				children: [
					{
						name: 'John'
					},
					1111
				]
			});
		}, TypeError, 'Each child must be of type \'object\'');
		assert.throws(function () {
			parse({
				id: 1,
				children: {
					'one': {
						name: 'John'
					},
					'two': 'Jake'
				}
			});
		}, TypeError, 'Each child must be of type \'object\'');
	});

});
