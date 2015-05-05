/* global describe, it, beforeEach, before */

'use strict';

var assert = require('assert'),
	Forestry = require('../src/Forestry'),
	traversal = require('../src/traversal'),
	Node = Forestry.Node;

describe('Forestry', function () {

	describe('TRAVERSAL_TYPES', function () {
	
		it('has correct TRAVERSAL_TYPES', function () {
			assert.deepEqual(Forestry.TRAVERSAL_TYPES, traversal.TYPES);
		});

	});

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
	
			node = Forestry.parse(obj);
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
	
			node = Forestry.parse(obj);
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
	
			node = Forestry.parse(obj, 'links');
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
	
			node = Forestry.parse(obj, 'children', 'name');
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
				Forestry.parse([]);
			}, TypeError, 'Passed arg must be of type \'object\'');
			assert.throws(function () {
				Forestry.parse('wrong!');
			}, TypeError, 'Passed arg must be of type \'object\'');
			assert.throws(function () {
				Forestry.parse(123);
			}, TypeError, 'Passed arg must be of type \'object\'');
			assert.throws(function () {
				Forestry.parse(undefined);
			}, TypeError, 'Passed arg must be of type \'object\'');
			assert.throws(function () {
				Forestry.parse(null);
			}, TypeError, 'Passed arg must be of type \'object\'');
		});

		it('throws an error if children are neither objects, arrays or null/undefined', function () {
			
			assert.throws(function () {
				Forestry.parse({
					id: 1,
					children: 'String'
				});
			}, TypeError, '\'Children\' property must point to either Object or Array');
			assert.throws(function () {
				Forestry.parse({
					id: 1,
					children: 12345
				});
			}, TypeError, '\'Children\' property must point to either Object or Array');
	
		});

		it('throws an error if any child is not an object', function () {
		
			assert.throws(function () {
				Forestry.parse({
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
				Forestry.parse({
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
			});

			describe('addChild', function () {

				it('adds child and sets parent properly', function () {
					root.addChild(new Node('val'));
					assert.equal(root.children[2].data, 'val');
					assert(root.children[2].children instanceof Array);
					assert.equal(root.children[2].children.length, 0);
				});

				it('throws error if passed in arg is not of type Node', function () {
					assert.throws(function () {
						root.addChild('wrong!');
					}, TypeError, 'Passed arg must be of type Node');
					assert.throws(function () {
						root.addChild(123);
					}, TypeError, 'Passed arg must be of type Node');
					assert.throws(function () {
						root.addChild({});
					}, TypeError, 'Passed arg must be of type Node');
					assert.throws(function () {
						root.addChild(null);
					}, TypeError, 'Passed arg must be of type Node');
					assert.throws(function () {
						root.addChild(undefined);
					}, TypeError, 'Passed arg must be of type Node');
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
				it('defaults to depth first - pre', function () {
					var i = 0;
					function transform (node) {
						node.data = i++;
					}
					root.traverse(transform);

					assert.equal(root.data, 0);
					assert.equal(root.children[0].data, 1);
					assert.equal(root.children[0].children[0].data, 2);
					assert.equal(root.children[1].data, 3);
				});

				describe('breadth first', function () {
					it('processes nodes in the correct order', function () {
						var i = 0;
						function transform (node) {
							node.data = i++;
						}
						assert.equal(root.data, 'a');
						assert.equal(root.children[0].data, 'a/1');
						assert.equal(root.children[1].data, 'a/2');
						root.traverse(transform, Forestry.TRAVERSAL_TYPES.BFS);

						assert.equal(root.data, 0);
						assert.equal(root.children[0].data, 1);
						assert.equal(root.children[1].data, 2);
						assert.equal(root.children[0].children[0].data, 3);
					});	

				});			

				describe('depth first - pre', function () {
					it('processes nodes in the correct order', function () {
						var i = 0;
						function transform (node) {
							node.data = i++;
						}
						assert.equal(root.data, 'a');
						assert.equal(root.children[0].data, 'a/1');
						assert.equal(root.children[1].data, 'a/2');
						root.traverse(transform, Forestry.TRAVERSAL_TYPES.DFS_PRE);

						assert.equal(root.data, 0);
						assert.equal(root.children[0].data, 1);
						assert.equal(root.children[0].children[0].data, 2);
						assert.equal(root.children[1].data, 3);
					});	
				});

				describe('depth first - post', function () {
					it('processes nodes in correct order', function () {
						var i = 0;
						function transform (node) {
							node.data = i++;
						}
						assert.equal(root.data, 'a');
						assert.equal(root.children[0].data, 'a/1');
						assert.equal(root.children[1].data, 'a/2');
						root.traverse(transform, Forestry.TRAVERSAL_TYPES.DFS_POST);

						assert.equal(root.data, 3);
						assert.equal(root.children[0].data, 1);
						assert.equal(root.children[0].children[0].data, 0);
						assert.equal(root.children[1].data, 2);
					});	
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
});
