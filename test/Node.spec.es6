import tape from 'tape';
import sinon from 'sinon';
import Node from '../src/Node';
import traversal from '../src/traversal';

tape('Node', t => {

	const setup = () => {
		root = new Node('a');
		root.addChild(new Node('a/1')).children[0].addChild(new Node('a/1/i'));
		root.addChild(new Node('a/2'));
		return root;
	}

	t.test('constructor', t => {

		t.test('returns correctly populated Forestry.Node object', t => {
			t.plan(4);
			var fn = new Node('value');
			t.equal(fn.data, 'value');
			t.equal(fn.parent, null);
			t.ok(fn.children instanceof Array);
			t.equal(fn.children.length, 0);
		});

	});

	t.test('getRoot', t => {

		t.test('should return the root of the tree the node belongs to', t => {
			t.plan(2);
			let root = setup();
			t.equal(root.children[0].getRoot(), root);
			t.equal(root.children[0].children[0].getRoot(), root);
		});
	});

	t.test('isRoot', t => {
		t.test('should return true if node is the root of a tree', t => {
			t.plan(1);
			let root = setup();
			t.equal(root.isRoot(), true);
		});

		t.test('should return false if node is not root of a tree', t => {
			t.plan(2);
			let root = setup();
			t.equal(root.children[0].isRoot(), false);
			t.equal(root.children[0].children[0].isRoot(), false);
		});
	});

	t.test('isLeaf', t => {
		t.test('should return true if node has no children', t => {
			t.plan(1);
			let root = setup();
			t.equal(root.children[0].children[0].isLeaf(), true);
		});

		t.test('should return false if child has children', t => {
			t.plan(2);
			let root = setup();
			t.equal(root.children[1].isLeaf(). false);
			t.equal(root.isLeaf(), false);
		});
	});

	t.test('level', t => {
		t.test('returns the correct level of the node', t => {
			t.plan(2);
			let root = setup();
			t.equal(root.children[1].level(), 1);
			t.equal(root.children[0].children[0].level(), 2);
		});
	});

	t.test('index', t => {
		t.test('returns the index of the node within it\'s parents children array', t => {
			t.plan(2);
			let root = setup();
			t.equal(root.children[1].index(), 1);
			t.equal(root.children[0].children[0].index(), 0);
		});

		t.test('returns null if node doesn\'t have a parent', t => {
			t.plan(1)
			var node = new Node();
			t.equal(node.index(), null);
		});

		t.test('returns null if node doesn\'t exist in parents children array', t => {
			t.plan(1);
			var node = new Node();
			node.parent = new Node().addChild('a', 'b');
			t.equal(node.index(), null);
		});
	});

	t.test('addChild', t => {

		t.test('adds child and sets parent properly', t => {
			t.plan(3);
			let root = setup();
			root.addChild(new Node('val'));
			t.equal(root.children[2].data, 'val');
			t.ok(root.children[2].children instanceof Array);
			t.equal(root.children[2].children.length, 0);
		});

		t.test('wraps passed argument in Node if it isn\'t of type Node', t => {
			t.plan(3);
			let root = setup();
			root.addChild('val');
			t.equal(root.children[2].data, 'val');
			t.ok(root.children[2].children instanceof Array);
			t.equal(root.children[2].children.length, 0);
		});
	});

	t.test('addChildren', t => {
		t.test('adds multiple children', t => {
			t.plan(9);
			let root = setup();
			root.addChild(['val', new Node('val2'), 'val3']);
			t.equal(root.children[2].data, 'val');
			t.ok(root.children[2].children instanceof Array);
			t.equal(root.children[2].children.length, 0);
			t.equal(root.children[3].data, 'val2');
			t.ok(root.children[3].children instanceof Array);
			t.equal(root.children[3].children.length, 0);
			t.equal(root.children[4].data, 'val3');
			t.ok(root.children[4].children instanceof Array);
			t.equal(root.children[4].children.length, 0);
		});
	});

	t.test('remove', t => {

		t.test('removes the node from the tree (and by association the node\'s children)', t => {
			t.plan(2);
			let root = setup(),
				temp1 = root.children[1];
			root.children[0].remove();
			t.equal(root.children.length, 1);
			t.equal(root.children[0], temp1);
		});

		t.test('returns the removed node with no parent', t => {
			t.plan(2);
			let root = setup(),
				temp = root.children[0],
				tempParent = temp.parent,
				removed = root.children[0].remove();
			t.equal(removed.data, temp.data);
			t.notEqual(removed.parent, tempParent);
		});
	});

	t.test('traverse', t => {

		const test = () => {},
			stubTraversals = () => {
				sinon.stub(traversal.processes, traversal.TYPES.BFS);
				sinon.stub(traversal.processes, traversal.TYPES.DFS_PRE);
				sinon.stub(traversal.processes, traversal.TYPES.DFS_POST);
			},
			resetTraversals = () => {
				traversal.processes[traversal.TYPES.BFS].restore();
				traversal.processes[traversal.TYPES.DFS_PRE].restore();
				traversal.processes[traversal.TYPES.DFS_POST].restore();
			};

		t.test('defaults to depth first - pre', t => {
			t.plan(3);
			stubTraversals();
			let root = setup();
			root.traverse(test);
			t.equal(traversal.processes[traversal.TYPES.DFS_PRE].callCount, 1);
			t.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][0], root);
			t.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][1], test);
			resetTraversals();
		});

		t.test('breadth first', t => {
			t.test('processes nodes in the correct order', t => {
				t.plan(3);
				stubTraversals();
				let root = setup();
				root.traverse(test, traversal.TYPES.BFS);
				t.equal(traversal.processes[traversal.TYPES.BFS].callCount, 1);
				t.equal(traversal.processes[traversal.TYPES.BFS].args[0][0], root);
				t.equal(traversal.processes[traversal.TYPES.BFS].args[0][1], test);
				resetTraversals();
			});

		});

		t.test('depth first - pre', t => {
			t.test('processes nodes in the correct order', t => {
				t.plan(3);
				stubTraversals();
				let root = setup();
				root.traverse(test, traversal.TYPES.DFS_PRE);
				t.equal(traversal.processes[traversal.TYPES.DFS_PRE].callCount, 1);
				t.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][0], root);
				t.equal(traversal.processes[traversal.TYPES.DFS_PRE].args[0][1], test);
				resetTraversals();
			});
		});

		t.test('depth first - post', t => {
			t.test('processes nodes in correct order', t => {
				t.plan(3);
				stubTraversals();
				let root = setup();
				root.traverse(test, traversal.TYPES.DFS_POST);
				t.equal(traversal.processes[traversal.TYPES.DFS_POST].callCount, 1);
				t.equal(traversal.processes[traversal.TYPES.DFS_POST].args[0][0], root);
				t.equal(traversal.processes[traversal.TYPES.DFS_POST].args[0][1], test);
				resetTraversals();
			});
		});

		t.test('throws an error if traversal type is not legit', t => {
			t.plan(1);
			let root = setup();
			t.throws(() => {
				root.traverse(test, 'WRONG');
			}, Error, 'Traversal type is not valid. It must be one of ' + Object.keys(traversal.TYPES).join(', ') + '.');
		});
	});

	t.test('find', t => {
		t.test('returns node if found', t => {
			t.plan(2);
			let root = setup();
			const func = node => node.data === 'a/1/i',
				funcII = node => node.data.split('/').length === 2;
			let found = root.find(func);
			t.equal(found, root.children[0].children[0]);
			found = root.find(funcII);
			t.equal(found, root.children[0]);
		});

		t.test('returns null if no node found', t => {
			t.plan(1);
			let root = setup();
			const func = node => node.data.length > 20,
				found = root.find(func);
			t.equal(found, null);
		});
	});

	t.test('all', t => {
		t.test('returns node if found', t => {
			t.plan(7);
			let root = setup();
			const regex = new RegExp('a/.*'),
			  func = node => node.data.match(regex),
				funcII = node => node.data.split('/').length === 2;
			let found = root.all(func);
			t.equal(found.length, 3);
			t.equal(found[0], root.children[0]);
			t.equal(found[2], root.children[1]);
			t.equal(found[1], root.children[0].children[0]);
			found = root.all(funcII);
			t.equal(found.length, 2);
			t.equal(found[0], root.children[0]);
			t.equal(found[1], root.children[1]);
		});

		t.test('returns empty array if no node found', t => {
			t.plan(1);
			let root = setup();
			const func = node => node.data.length > 20,
				found = root.all(func);
			t.equal(found.length, 0);
		});
	});

	t.test('reduce', t => {
		t.test('reduces tree using passed in function', t => {
			t.plan(2);
			let root = setup();
			const sum = (acc, node) => acc + node.data.length;
			t.equal(root.reduce(0, sum), 12);
			t.equal(root.children[0].reduce(10, sum), 18);
		});
	});

	t.test('map', t => {


		t.test('maps each node adding children to array if returned object is not an instance of Node', t => {
			t.plan(12);
			let root = setup();
			const checkObj = (obj, data) => {
					t.equal(obj.aka, data);
					t.equal(obj.parent, undefined);
					t.equal(obj.traverse, undefined);
				},
				mappedTree = root.map(n => {
								return {
									aka: '!' + n.data
								};
							});
			checkObj(mappedTree, '!' + root.data);
			checkObj(mappedTree.children[0], '!' + root.children[0].data);
			checkObj(mappedTree.children[0].children[0], '!' + root.children[0].children[0].data);
			checkObj(mappedTree.children[1], '!' + root.children[1].data);
		});

		t.test('maps each node wrapping returned value, if primtive, as object and adding children to array', t => {
			t.plan(12);
			let root = setup();
			const checkObj = (obj, data) => {
					t.equal(obj.data, data);
					t.equal(obj.parent, undefined);
					t.equal(obj.traverse, undefined);
				},
				mappedTree = root.map(n => '!' + n.data);
			checkObj(mappedTree, '!' + root.data);
			checkObj(mappedTree.children[0], '!' + root.children[0].data);
			checkObj(mappedTree.children[0].children[0], '!' + root.children[0].children[0].data);
			checkObj(mappedTree.children[1], '!' + root.children[1].data);
		});

		t.test('maps each node adding children using addChild if returned object is an instance of Node', t => {
			t.plan(12);
			let root = setup();
			const checkObj = (obj, data, parent) => {
					t.equal(obj.data, data);
					t.deepEqual(obj.parent, parent);
					t.equal(typeof obj.traverse, 'function');
				},
				mappedTree = root.map(n => new Node('!!' + n.data));
			checkObj(mappedTree, '!!' + root.data, null);
			checkObj(mappedTree.children[0], '!!' + root.children[0].data, mappedTree);
			checkObj(mappedTree.children[0].children[0], '!!' + root.children[0].children[0].data, mappedTree.children[0], mappedTree);
			checkObj(mappedTree.children[1], '!!' + root.children[1].data, mappedTree);
		});
	});

	t.test('filter', t => {
		t.test('does not affect original tree', t => {
			t.plan(4);
			let root = setup();
			const clone = root.clone();
			root.filter(node => !/a\/1/.test(node.data));
			t.equal(clone.data, root.data);
			t.equal(clone.children[0].data, root.children[0].data);
			t.equal(clone.children[0].children[0].data, root.children[0].children[0].data);
			t.equal(clone.children[1].data, root.children[1].data);
		});

		t.test('returns tree with nodes (and by association their children) not matching predicate filtered out', t => {
			t.plan(2);
			let root = setup();
			const filtered = root.filter(node => /a(?!\/1)/.test(node.data));
			t.equal(filtered.children.length, 1);
			t.equal(filtered.children[0].data, root.children[1].data);
		});
	});

	t.test('clone', t => {

		class Person {
			constructor(age, name) {
				this.age = age;
				this.name = name;
			}

			clone() {
				return new Person(this.age, this.name);
			}
		}

		t.test('returns a clone of the tree', t => {
			t.plan(7);
			let root = setup();
			t.equal(root.data, 'a');
			t.equal(root.children[0].data, 'a/1');
			t.equal(root.children[1].data, 'a/2');

 			const clone = root.clone();
			t.equal(clone.data, 'a');
			t.equal(clone.children[0].data, 'a/1');
			t.equal(clone.children[1].data, 'a/2');

			t.notEqual(root, clone);
		});

		t.test('uses clone method on node.data if available', t => {
			t.plan(8)
			let root = setup(),
				original = new Node(new Person(86, 'Magaret'))
							.addChild(new Node(new Person(65, 'James')))
							.addChild(new Node(new Person(62, 'Jake')))
							.children[1].addChild(new Node(new Person(37, 'William')))
							.parent,
				clone = original.clone();

			t.equal(original.data.age, 86);
			t.equal(clone.data.age, 86);
			original.data.age = 95;
			t.equal(original.data.age, 95);
			t.equal(clone.data.age, 86);

			t.equal(original.children[1].children[0].data.name, 'William');
			t.equal(clone.children[1].children[0].data.name, 'William');
			clone.children[1].children[0].data.name = 'Jacob';
			t.equal(original.children[1].children[0].data.name, 'William');
			t.equal(clone.children[1].children[0].data.name, 'Jacob');
		});

		t.test('uses a passed in clone method if given', t => {
			t.plan(8);
			let root = setup(),
				original = new Node({age: 86, name: 'Margaret'})
							.addChild(new Node({age: 65, name: 'James'}))
							.addChild(new Node({age: 62, name: 'Jake'}))
							.children[1].addChild(new Node({age: 37, name: 'William'}))
							.parent,
				clone = original.clone(data => {
							return  {
								age: data.age,
								name: data.name
							};
						});

			t.equal(original.data.age, 86);
			t.equal(clone.data.age, 86);
			original.data.age = 95;
			t.equal(original.data.age, 95);
			t.equal(clone.data.age, 86);

			t.equal(original.children[1].children[0].data.name, 'William');
			t.equal(clone.children[1].children[0].data.name, 'William');
			clone.children[1].children[0].data.name = 'Jacob';
			t.equal(original.children[1].children[0].data.name, 'William');
			t.equal(clone.children[1].children[0].data.name, 'Jacob');
		});

		t.test('priotises clone method over passed in function', t => {
			t.plan(8);
			let root = setup(),
				original = new Node(new Person(86, 'Magaret'))
							.addChild(new Node(new Person(65, 'James')))
							.addChild(new Node(new Person(62, 'Jake')))
							.children[1].addChild(new Node(new Person(37, 'William')))
							.parent,
				clone = original.clone(() => {
						return {};
					});

			t.equal(original.data.age, 86);
			t.equal(clone.data.age, 86);
			original.data.age = 95;
			t.equal(original.data.age, 95);
			t.equal(clone.data.age, 86);

			t.equal(original.children[1].children[0].data.name, 'William');
			t.equal(clone.children[1].children[0].data.name, 'William');
			clone.children[1].children[0].data.name = 'Jacob';
			t.equal(original.children[1].children[0].data.name, 'William');
			t.equal(clone.children[1].children[0].data.name, 'Jacob');

		});
	});
});
