/* global describe, it, beforeEach, before */

'use strict';

var assert = require('assert'),
	Forestry = require('../src/Forestry');

describe('Forestry.Node', function () {
	describe('constructor', function () {
		it('returns correctly populated Forestry.Node object', function () {
			var fn = new Forestry.Node('value');

			assert.equal(fn.id, '0');
			assert.equal(fn.data, 'value');
			assert.equal(fn.parent, null);
			assert(fn.children instanceof Array);
			assert.equal(fn.children.length, 0);
		});

	});

	describe('prototype methods', function () {
		
		var root;
		beforeEach(function () {
			root = new Forestry.Node('a');
			root.addChild(new Forestry.Node('a/1')).children[0].addChild(new Forestry.Node('a/1/i'));
			root.addChild(new Forestry.Node('a/2'));
		});	

		describe('addChild', function () {

			it('adds child and sets parent properly', function () {
				root.addChild(new Forestry.Node('val'));
				assert.equal(root.children[2].id, '0/2');
				assert.equal(root.children[2].data, 'val');
				assert.equal(root.children[2].parent.id, root.id);
				assert(root.children[2].children instanceof Array);
				assert.equal(root.children[2].children.length, 0);
			});

		});

		describe('find', function () {

			describe('breadth first', function () {
		
				describe('pass in string', function () {
		
					it('returns node if found', function () {
						var found = root.find('0/1', true);
						assert.equal(found, root.children[1]);
						found = root.find('0/0/0', true);
						assert.equal(found, root.children[0].children[0]);
					});

					it('returns null if no node found', function () {
						var found = root.find('bb', true);
						assert.equal(found, null);
						found = root.children[0].children[0].find('a/1', true);
						assert.equal(found, null);
					});
				});
		
				describe('pass in function', function () {
		
					it('returns node if found', function () {
						function func(node) {
							return node.data === 'a/1/i';
						}
						var found = root.find(func, true);
						assert.equal(found, root.children[0].children[0]);
						
						function funcII(node) {
							return node.data.split('/').length === 2;
						}
						found = root.find(funcII, true);
						assert.equal(found, root.children[0]);
					});
		
					it('returns null if no node found', function () {
						function func(node) {
							return node.data.length > 20;
						}
						var found = root.find(func, true);
						assert.equal(found, null);
					});
				});
			});
			
			describe('depth first', function () {
		
				describe('pass in string', function () {
		
					it('returns node if found', function () {
						var found = root.find('0/1');
						assert.equal(found, root.children[1]);
						found = root.find('0/0/0', true);
						assert.equal(found, root.children[0].children[0]);
					});

					it('returns null if no node found', function () {
						var found = root.find('b');
						assert.equal(found, null);
						found = root.children[0].children[0].find('a/1');
						assert.equal(found, null);
					});
				});
		
				describe('pass in function', function () {
		
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
			});
		});
		
		describe('transform', function () {
			
			it('passes node and children through a function and returns the result', function () {
				var i = 0;
				function transform () {
					return i++;
				}
				assert.equal(root.data, 'a');
				assert.equal(root.children[0].data, 'a/1');
				assert.equal(root.children[1].data, 'a/2');
				root.transform(transform);

				assert.equal(root.data, 0);
				assert.equal(root.children[0].data, 1);
				assert.equal(root.children[0].children[0].data, 2);
				assert.equal(root.children[1].data, 3);
			});	
		});
		
		describe('clone', function () {
			
			it('returns a clone of the tree', function () {
				var i = 0;
				function transform () {
					return i++;
				}
				assert.equal(root.data, 'a');
				assert.equal(root.children[0].data, 'a/1');
				assert.equal(root.children[1].data, 'a/2');
				var clone = root.clone();

				assert.notEqual(root, clone);
				assert.notEqual(root.children[0], clone.children[0]);
				assert.notEqual(root.children[0].children[0], clone.children[0].children[0]);
				assert.notEqual(root.children[1], clone.children[1]);
			});	
		});

		describe('map', function () {
			
			it('passes node and children through a function and returns the result', function () {
				var i = 0;
				function transform () {
					return i++;
				}
				assert.equal(root.data, 'a');
				assert.equal(root.children[0].data, 'a/1');
				assert.equal(root.children[1].data, 'a/2');
				var newRoot = root.map(transform);
				assert.equal(root.data, 'a');
				assert.equal(root.children[0].data, 'a/1');
				assert.equal(root.children[1].data, 'a/2');

				assert.equal(newRoot.data, 0);
				assert.equal(newRoot.children[0].data, 1);
				assert.equal(newRoot.children[0].children[0].data, 2);
				assert.equal(newRoot.children[1].data, 3);
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

	});
});
