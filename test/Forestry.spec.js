/* global describe, it, beforeEach */

'use strict';

var assert = require('assert'),
	Forestry = require('../src/Forestry');

describe('Forestry.Node', function () {
	describe('constructor', function () {
		it('returns correctly populated Forestry.Node object', function () {
			var fn = new Forestry.Node('id', 'value');

			assert.equal(fn.id, 'id');
			assert.equal(fn.value, 'value');
			assert.equal(fn.parent, null);
			assert(fn.children instanceof Array);
			assert.equal(fn.children.length, 0);
		});

	});

	describe('prototype methods', function () {
		
		var root;
		beforeEach(function () {
			root = new Forestry.Node('a');
			root.addChild(new Forestry.Node('a/1').addChild(new Forestry.Node('a/1/i')));
			root.addChild(new Forestry.Node('a/2'));
		});	

		describe('addChild', function () {

			it('adds child and sets parent properly', function () {
				root.addChild(new Forestry.Node('a/3', 'val'));
				assert.equal(root.children[2].id, 'a/3');
				assert.equal(root.children[2].value, 'val');
				assert.equal(root.children[2].parent.id, root.id);
				assert(root.children[2].children instanceof Array);
				assert.equal(root.children[2].children.length, 0);
			});

		});

		describe('findNodeById', function () {

			describe('breadth first', function () {
				it('returns node if found', function () {
					var found = root.findNodeById('a/2', true);
					assert.equal(found, root.children[1]);
					found = root.findNodeById('a/1/i', true);
					assert.equal(found, root.children[0].children[0]);
				});

				it('returns null if no node found', function () {
					var found = root.findNodeById('b', true);
					assert.equal(found, null);
					found = root.children[0].children[0].findNodeById('a/1', true);
					assert.equal(found, null);
				});
			});
			
			describe('depth first', function () {
				it('returns node if found', function () {
					var found = root.findNodeById('a/2', false);
					assert.equal(found, root.children[1]);
					found = root.findNodeById('a/1/i', false);
					assert.equal(found, root.children[0].children[0]);
				});

				it('returns null if no node found', function () {
					var found = root.findNodeById('b', false);
					assert.equal(found, null);
					found = root.children[0].children[0].findNodeById('a/1', false);
					assert.equal(found, null);
				});
			});
			

		});

		describe('map', function () {
			
			it('passes node and children through a function and returns the result', function () {
				function transform (node) {
					node.value = node.id.length;
					return node;
				}
				assert.equal(root.value, undefined);
				assert.equal(root.children[0].value, undefined);
				assert.equal(root.children[1].value, undefined);
				var newRoot = root.map(transform);
				assert.equal(root.value, undefined);
				assert.equal(root.children[0].value, undefined);
				assert.equal(root.children[1].value, undefined);

				assert.equal(newRoot.value, root.id.length);
				assert.equal(newRoot.children[0].value, root.children[0].id.length);
				assert.equal(newRoot.children[1].value, root.children[1].id.length);
			});	
		});

		describe('reduce', function () {
			
			it('reduces tree using passed in function', function () {
				function sum(acc, node) {
					acc += node.id.length;
					return acc;
				}
				assert.equal(root.reduce(0, sum), 12);
				assert.equal(root.children[0].reduce(10, sum), 18);
			});
		});
	});
});
