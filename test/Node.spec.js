/* global describe, it, beforeEach, afterEach, before */

'use strict';

var assert = require('assert'),
	Node = require('../src/Node'),
    traversal = require('../src/traversal'),
	sinon = require('sinon');


describe('Node', function () {

	describe('constructor', function () {
		it('returns correctly populated Forestry.Node object', function () {
			var fn = new Node('value');

			assert.equal(fn.data, 'value');
			assert.equal(fn.parent, null);
			assert(fn.children instanceof Array);
			assert.equal(fn.children.length, 0);
		});

	});

	describe('prototype methods', function () {

		var root;
		beforeEach(function () {
			root = new Node('a');
			root.addChild(new Node('a/1')).children[0].addChild(new Node('a/1/i'));
			root.addChild(new Node('a/2'));
		});

		describe('getRoot', function () {
			it('should return the root of the tree the node belongs to', function () {
				assert.equal(root.children[0].getRoot(), root);
				assert.equal(root.children[0].children[0].getRoot(), root);
			});
		});

		describe('isRoot', function () {
			it('should return true if node is the root of a tree', function () {
				assert.equal(root.isRoot(), true);
			});

			it('should return false if node is not root of a tree', function () {
				assert.equal(root.children[0].isRoot(), false);
				assert.equal(root.children[0].children[0].isRoot(), false);
			});
		});

		describe('isLeaf', function () {
			it('should return true if node has no children', function () {
				assert.equal(root.children[0].children[0].isLeaf(), true);
			});

			it('should return false if child has children', function () {
				assert.equal(root.children[1].isLeaf(). false);
				assert.equal(root.isLeaf(), false);
			});
		});

		describe('level', function () {
			it('returns the correct level of the node', function () {
				assert.equal(root.children[1].level(), 1);
				assert.equal(root.children[0].children[0].level(), 2);
			});
		});

		describe('index', function () {
			it('returns the index of the node within it\'s parents children array', function () {
				assert.equal(root.children[1].index(), 1);
				assert.equal(root.children[0].children[0].index(), 0);
			});

			it('returns null if node doesn\'t have a parent', function () {
				var node = new Node();
				assert.equal(node.index(), null);
			});

			it('returns null if node doesn\'t exist in parents children array', function () {
				var node = new Node();
				node.parent = new Node().addChild('a', 'b');
				assert.equal(node.index(), null);
			});
		});

		describe('addChild', function () {

			it('adds child and sets parent properly', function () {
				root.addChild(new Node('val'));
				assert.equal(root.children[2].data, 'val');
				assert(root.children[2].children instanceof Array);
				assert.equal(root.children[2].children.length, 0);
			});

			it('wraps passed argument in Node if it isn\'t of type Node', function () {
				root.addChild('val');
				assert.equal(root.children[2].data, 'val');
				assert(root.children[2].children instanceof Array);
				assert.equal(root.children[2].children.length, 0);
			});
		});

		describe('addChildren', function () {
			it('adds multiple children', function () {
				root.addChild(['val', new Node('val2'), 'val3']);
				assert.equal(root.children[2].data, 'val');
				assert(root.children[2].children instanceof Array);
				assert.equal(root.children[2].children.length, 0);
				assert.equal(root.children[3].data, 'val2');
				assert(root.children[3].children instanceof Array);
				assert.equal(root.children[3].children.length, 0);
				assert.equal(root.children[4].data, 'val3');
				assert(root.children[4].children instanceof Array);
				assert.equal(root.children[4].children.length, 0);
			});
		});

		describe('remove', function () {
			it('removes the node from the tree (and by association the node\'s children)', function () {
				var temp0 = root.children[0],
				temp1 = root.children[1];
				root.children[0].remove();
				assert.equal(root.children.length, 1);
				assert.equal(root.children[0], temp1);
			});
			it('returns the removed node with no parent', function () {
				var temp = root.children[0],
				tempParent = temp.parent,
				removed;
				removed = root.children[0].remove();
				assert.equal(removed.data, temp.data);
				assert.notEqual(removed.parent, tempParent);
			});
		});

		describe('traverse', function () {

			var i = 0;
			function transform (node) {
				node.data = i++;
			}

			beforeEach(function () {
				sinon.stub(traversal.processes, traversal.TYPES.BFS);
				sinon.stub(traversal.processes, traversal.TYPES.DFS_PRE);
				sinon.stub(traversal.processes, traversal.TYPES.DFS_POST);
			});

			afterEach(function () {
				traversal.processes[traversal.TYPES.BFS].restore();
				traversal.processes[traversal.TYPES.DFS_PRE].restore();
				traversal.processes[traversal.TYPES.DFS_POST].restore();
			});

			it('defaults to depth first - pre', function () {
				root.traverse(transform);

				assert.equal(traversal.processes[traversal.TYPES.DFS_PRE].callCount, 1);
				assert.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][0], root);
				assert.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][1].toString(), transform.toString());

			});

			describe('breadth first', function () {
				it('processes nodes in the correct order', function () {
					root.traverse(transform, traversal.TYPES.BFS);

					assert.equal(traversal.processes[traversal.TYPES.BFS].callCount, 1);
					assert.equal(traversal.processes[traversal.TYPES.BFS].args[0][0], root);
					assert.equal(traversal.processes[traversal.TYPES.BFS].args[0][1].toString(), transform.toString());

				});

			});

			describe('depth first - pre', function () {
				it('processes nodes in the correct order', function () {
					root.traverse(transform, traversal.TYPES.DFS_PRE);

					assert.equal(traversal.processes[traversal.TYPES.DFS_PRE].callCount, 1);
					assert.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][0], root);
					assert.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][1].toString(), transform.toString());

				});
			});

			describe('depth first - post', function () {
				it('processes nodes in correct order', function () {
					root.traverse(transform, traversal.TYPES.DFS_POST);

					assert.equal(traversal.processes[traversal.TYPES.DFS_POST].callCount, 1);
					assert.equal(traversal.processes[traversal.TYPES.DFS_POST].args[0][0], root);
					assert.equal(traversal.processes[traversal.TYPES.DFS_POST].args[0][1].toString(), transform.toString());

				});
			});

			it('throws an error if traversal type is not legit', function () {
				assert.throws(function () {
					root.traverse(transform, 'WRONG');
				}, Error, 'Traversal type is not valid. It must be one of ' + Object.keys(traversal.TYPES).join(', ') + '.');
			});
		});

		describe('find', function () {
			it('returns node if found', function () {
				function func(node) {
					return node.data === 'a/1/i';
				}
				var found = root.find(func);
				assert.equal(found, root.children[0].children[0]);

				function funcII(node) {
					return node.data.split('/').length === 2;
				}
				found = root.find(funcII);
				assert.equal(found, root.children[0]);
			});

			it('returns null if no node found', function () {
				function func(node) {
					return node.data.length > 20;
				}
				var found = root.find(func);
				assert.equal(found, null);
			});
		});

		describe('all', function () {
			it('returns node if found', function () {
				var regex = new RegExp('a/.*');
				function func(node) {
					return node.data.match(regex);
				}
				var found = root.all(func);
				assert.equal(found.length, 3);
				assert.equal(found[0], root.children[0]);
				assert.equal(found[2], root.children[1]);
				assert.equal(found[1], root.children[0].children[0]);

				function funcII(node) {
					return node.data.split('/').length === 2;
				}
				found = root.all(funcII);
				assert.equal(found.length, 2);
				assert.equal(found[0], root.children[0]);
				assert.equal(found[1], root.children[1]);
			});

			it('returns empty array if no node found', function () {
				function func(node) {
					return node.data.length > 20;
				}
				var found = root.all(func);
				assert.equal(found.length, 0);
			});
		});

		describe('reduce', function () {
			it('reduces tree using passed in function', function () {
				function sum(acc, node) {
					acc += node.data.length;
					return acc;
				}
				assert.equal(root.reduce(0, sum), 12);
				assert.equal(root.children[0].reduce(10, sum), 18);
			});
		});

		describe('map', function () {

			it('maps each node adding children to array if returned object is not an instance of Node', function () {
				function checkObj(obj, data) {
					assert.equal(obj.aka, data);
					assert.equal(obj.parent, undefined);
					assert.equal(obj.traverse, undefined);
				}

				var mappedTree = root.map(function (n) {
									return {
										aka: '!' + n.data
									};
								});
				checkObj(mappedTree, '!' + root.data);
				checkObj(mappedTree.children[0], '!' + root.children[0].data);
				checkObj(mappedTree.children[0].children[0], '!' + root.children[0].children[0].data);
				checkObj(mappedTree.children[1], '!' + root.children[1].data);
			});

			it('maps each node wrapping returned value, if primtive, as object and adding children to array', function () {
				function checkObj(obj, data) {
					assert.equal(obj.data, data);
					assert.equal(obj.parent, undefined);
					assert.equal(obj.traverse, undefined);
				}

				var mappedTree = root.map(function (n) {
									return '!' + n.data;
								});
				checkObj(mappedTree, '!' + root.data);
				checkObj(mappedTree.children[0], '!' + root.children[0].data);
				checkObj(mappedTree.children[0].children[0], '!' + root.children[0].children[0].data);
				checkObj(mappedTree.children[1], '!' + root.children[1].data);
			});

			it('maps each node adding children using addChild if returned object is an instance of Node', function () {
				function checkObj(obj, data, parent) {
					assert.equal(obj.data, data);
					assert.deepEqual(obj.parent, parent);
					assert.equal(typeof obj.traverse, 'function');
				}

				var mappedTree = root.map(function (n) {
									return new Node('!!' + n.data);
								});
				checkObj(mappedTree, '!!' + root.data, null);
				checkObj(mappedTree.children[0], '!!' + root.children[0].data, mappedTree);
				checkObj(mappedTree.children[0].children[0], '!!' + root.children[0].children[0].data, mappedTree.children[0]);
				checkObj(mappedTree.children[1], '!!' + root.children[1].data, mappedTree);
			});
		});

		describe('filter', function () {
			it('does not affect original tree', function () {
				var clone = root.clone(),
					filtered = root.filter(function (node) {
									return !/a\/1/.test(node.data);
								});
				assert.equal(clone.data, root.data);
				assert.equal(clone.children[0].data, root.children[0].data);
				assert.equal(clone.children[0].children[0].data, root.children[0].children[0].data);
				assert.equal(clone.children[1].data, root.children[1].data);
			});

			it('returns tree with nodes (and by association their children) not matching predicate filtered out', function () {
				var filtered = root.filter(function (node) {
									return /a(?!\/1)/.test(node.data);
								});
				assert.equal(filtered.children.length, 1);
				assert.equal(filtered.children[0].data, root.children[1].data);
			});
		});

		describe('clone', function () {

			it('returns a clone of the tree', function () {
				assert.equal(root.data, 'a');
				assert.equal(root.children[0].data, 'a/1');
				assert.equal(root.children[1].data, 'a/2');

				var clone = root.clone();
				assert.equal(clone.data, 'a');
				assert.equal(clone.children[0].data, 'a/1');
				assert.equal(clone.children[1].data, 'a/2');

				assert.notEqual(root, clone);
				assert.notEqual(root.children[0], clone.children[0]);
				assert.notEqual(root.children[0].children[0], clone.children[0].children[0]);
				assert.notEqual(root.children[1], clone.children[1]);
			});

			it('uses clone method on node.data if available', function () {
				function Person(age, name) {
					this.age = age;
					this.name = name;
				}
				Person.prototype.clone = function () {
					return new Person(this.age, this.name);
				};

				var original = new Node(new Person(86, 'Magaret'))
								.addChild(new Node(new Person(65, 'James')))
								.addChild(new Node(new Person(62, 'Jake')))
								.children[1].addChild(new Node(new Person(37, 'William')))
								.parent,
					clone = original.clone();

				assert.equal(original.data.age, 86);
				assert.equal(clone.data.age, 86);
				original.data.age = 95;
				assert.equal(original.data.age, 95);
				assert.equal(clone.data.age, 86);

				assert.equal(original.children[1].children[0].data.name, 'William');
				assert.equal(clone.children[1].children[0].data.name, 'William');
				clone.children[1].children[0].data.name = 'Jacob';
				assert.equal(original.children[1].children[0].data.name, 'William');
				assert.equal(clone.children[1].children[0].data.name, 'Jacob');
			});

			it('uses a passed in clone method if given', function () {
				var original = new Node({age: 86, name: 'Margaret'})
								.addChild(new Node({age: 65, name: 'James'}))
								.addChild(new Node({age: 62, name: 'Jake'}))
								.children[1].addChild(new Node({age: 37, name: 'William'}))
								.parent,
					clone = original.clone(function (data) {
								return  {
									age: data.age,
									name: data.name
								};
							});

				assert.equal(original.data.age, 86);
				assert.equal(clone.data.age, 86);
				original.data.age = 95;
				assert.equal(original.data.age, 95);
				assert.equal(clone.data.age, 86);

				assert.equal(original.children[1].children[0].data.name, 'William');
				assert.equal(clone.children[1].children[0].data.name, 'William');
				clone.children[1].children[0].data.name = 'Jacob';
				assert.equal(original.children[1].children[0].data.name, 'William');
				assert.equal(clone.children[1].children[0].data.name, 'Jacob');
			});

			it('priotises clone method over passed in function', function () {

				function Person(age, name) {
					this.age = age;
					this.name = name;
				}
				Person.prototype.clone = function () {
					return new Person(this.age, this.name);
				};

				var original = new Node(new Person(86, 'Magaret'))
								.addChild(new Node(new Person(65, 'James')))
								.addChild(new Node(new Person(62, 'Jake')))
								.children[1].addChild(new Node(new Person(37, 'William')))
								.parent,
					clone = original.clone(function (data) {
						return {};
					});

				assert.equal(original.data.age, 86);
				assert.equal(clone.data.age, 86);
				original.data.age = 95;
				assert.equal(original.data.age, 95);
				assert.equal(clone.data.age, 86);

				assert.equal(original.children[1].children[0].data.name, 'William');
				assert.equal(clone.children[1].children[0].data.name, 'William');
				clone.children[1].children[0].data.name = 'Jacob';
				assert.equal(original.children[1].children[0].data.name, 'William');
				assert.equal(clone.children[1].children[0].data.name, 'Jacob');

			});
		});

	});

});
