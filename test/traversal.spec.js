/* global describe, it, beforeEach, before, xdescribe */

'use strict';

var assert = require('assert'),
	traversal = require('../src/traversal'),
    Node = require('../src/Node');

describe('traversal', function () {

    var i,
		root;
    function transform (node) {
        node.data = i++;
    }

	function assertRootInitialValue() {
		assert.equal(root.data, 'a');
		assert.equal(root.children[0].data, 'a/1');
		assert.equal(root.children[1].data, 'a/2');
		assert.equal(root.children[0].children[0].data, 'a/1/i');
	}

    beforeEach(function () {
        root = new Node('a');
        root.addChild(new Node('a/1')).children[0].addChild(new Node('a/1/i'));
        root.addChild(new Node('a/2'));
    });

	describe('breadth first', function () {
		it('processes nodes in the correct order', function () {
			i = 0;

			assertRootInitialValue();

            traversal.processes[traversal.TYPES.BFS](root, transform);

			assert.equal(root.data, 0);
			assert.equal(root.children[0].data, 1);
			assert.equal(root.children[1].data, 2);
			assert.equal(root.children[0].children[0].data, 3);
		});

		it('halts traversal when passed function returns null', function () {
			i = 0;

			assertRootInitialValue();

            traversal.processes[traversal.TYPES.BFS](root, function (node) {
				transform(node);
				if (i === 3) {
					return null;
				}
			});

			assert.equal(root.data, 0);
			assert.equal(root.children[0].data, 1);
			assert.equal(root.children[1].data, 2);
			assert.equal(root.children[0].children[0].data, 'a/1/i');
		});

	});

	describe('depth first - pre', function () {
		it('processes nodes in the correct order', function () {
			i = 0;

			assertRootInitialValue();

			traversal.processes[traversal.TYPES.DFS_PRE](root, transform);

			assert.equal(root.data, 0);
			assert.equal(root.children[0].data, 1);
			assert.equal(root.children[0].children[0].data, 2);
			assert.equal(root.children[1].data, 3);
		});

		it('halts traversal when passed function returns null', function () {
			i = 0;

			assertRootInitialValue();

            traversal.processes[traversal.TYPES.DFS_PRE](root, function (node) {
				transform(node);
				if (i === 3) {
					return null;
				}
			});
			
			assert.equal(root.data, 0);
			assert.equal(root.children[0].data, 1);
			assert.equal(root.children[0].children[0].data, 2);
			assert.equal(root.children[1].data, 'a/2');
		});
	});

	describe('depth first - post', function () {
		it('processes nodes in correct order', function () {
			i = 0;

			assertRootInitialValue();

			traversal.processes[traversal.TYPES.DFS_POST](root, transform);

			assert.equal(root.data, 3);
			assert.equal(root.children[0].data, 1);
			assert.equal(root.children[0].children[0].data, 0);
			assert.equal(root.children[1].data, 2);
		});

		it('halts traversal when passed function returns null', function () {
			i = 0;

			assertRootInitialValue();

            traversal.processes[traversal.TYPES.DFS_POST](root, function (node) {
				transform(node);
				if (i === 3) {
					return null;
				}
			});

			assert.equal(root.data, 'a');
			assert.equal(root.children[0].data, 1);
			assert.equal(root.children[0].children[0].data, 0);
			assert.equal(root.children[1].data, 2);
		});
	});
});
