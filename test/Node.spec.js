import tape from 'tape';
import sinon from 'sinon';
import Node from '../src/Node';
import { TYPES as TRAVERSAL_TYPES } from '../src/traversal';

const setup = () => {
	let root = new Node('a');
	root.addChildren(['i', 'ii']);
	root.children[0].addChildren(['one', 'two']);
	return root;
}

tape('Node', t => {

	t.test('constructor', t => {

		t.test('data arg', t => {

			t.test('persists data to instance', t => {
				t.plan(1);
				let n = new Node('data');
				t.equal(n.data, 'data');
			});
		});

		t.test('parent arg', t => {

			t.test('persists parent to instance if given', t => {
				t.plan(1);
				let n = new Node('data', 'parent');
				t.equal(n.parent, 'parent');
			});

			t.test('parent is null if no arg passed', t => {
				t.plan(1);
				let n = new Node('data');
				t.equal(n.parent, null);
			});
		});

	});

	t.test('addChildren', t => {
		t.test('adds child to current node', t => {
			t.plan(2);
			let node = new Node('data');
			node.addChildren('stuff');
			t.equal(node.children.length, 1);
			t.equal(node.children[0].data, 'stuff');
		});

		t.test('adds multiple children to current node if passed array', t => {
			t.plan(4);
			let node = new Node('data');
			node.addChildren([1, 2, 3]);
			t.equal(node.children.length, 3);
			t.equal(node.children[0].data, 1);
			t.equal(node.children[1].data, 2);
			t.equal(node.children[2].data, 3);
		});
	});

	t.test('remove', t => {

		t.test('removes node', t => {
			t.plan(2);
			let node = new Node('data');
			node.addChildren([1, 2, 3]);
			node.children[1].remove();
			t.equal(node.children.length, 2);
			t.equal(node.children[1].data, 3);
		});

		t.test('returns removed node with parent set to null', t => {
			t.plan(2);
			let node = new Node('data');
			node.addChildren([1, 2, 3]);
			let removed = node.children[1].remove();
			t.equal(removed.data, 2);
			t.equal(removed.parent, null);
		});

		t.test('calling remove on root node does nothing', t => {
			t.plan(1);
			let node = new Node('data');
			let removed = node.remove();
			t.equal(removed, undefined);
		});

	});

	t.test('traverse', t => {

		const order = i => node => node.data = i++;
		const orderNull = i => l => node => i <= l ? node.data = i++ : null;

		t.test('defaults to DFS_PRE', t => {
			t.plan(5);
			let root = setup();
			root.traverse(order(0));
			t.equal(root.data, 0);
			t.equal(root.children[0].data, 1);
			t.equal(root.children[0].children[0].data, 2);
			t.equal(root.children[0].children[1].data, 3);
			t.equal(root.children[1].data, 4);
		});

		t.test('when Depth First Pre (DFS_PRE) passed as type arg', t => {

			t.test('uses depth first pre traversal algorith,', t => {
				t.plan(5);
				let root = setup();
				root.traverse(order(0));
				t.equal(root.data, 0);
				t.equal(root.children[0].data, 1);
				t.equal(root.children[0].children[0].data, 2);
				t.equal(root.children[0].children[1].data, 3);
				t.equal(root.children[1].data, 4);
			});

			t.test('bails if passed function returns null', t => {
				t.plan(5);
				let root = setup();
				root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_PRE);
				t.equal(root.data, 0);
				t.equal(root.children[0].data, 1);
				t.equal(root.children[0].children[0].data, 'one');
				t.equal(root.children[0].children[1].data, 'two');
				t.equal(root.children[1].data, 'ii');
			});
		});

		t.test('when Depth First Post (DFS_POST) passed as arg', t => {

			t.test('uses depth first post traversal algorithm', t => {
				t.plan(5);
				let root = setup();
				root.traverse(order(0), TRAVERSAL_TYPES.DFS_POST);
				t.equal(root.data, 4);
				t.equal(root.children[0].data, 2);
				t.equal(root.children[0].children[0].data, 0);
				t.equal(root.children[0].children[1].data, 1);
				t.equal(root.children[1].data, 3);
			});

			t.test('bails if passed function returns null', t => {
				t.plan(5);
				let root = setup();
				root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_POST);
				t.equal(root.data, 'a');
				t.equal(root.children[0].data, 'i');
				t.equal(root.children[0].children[0].data, 0);
				t.equal(root.children[0].children[1].data, 1);
				t.equal(root.children[1].data, 'ii');
			});
		});

		t.test('when Breadth First (BFS) passed as arg', t => {

			t.test('uses breadth first traversal algorithm', t => {
				t.plan(5);
				let root = setup();
				root.traverse(order(0), TRAVERSAL_TYPES.BFS);
				t.equal(root.data, 0);
				t.equal(root.children[0].data, 1);
				t.equal(root.children[0].children[0].data, 3);
				t.equal(root.children[0].children[1].data, 4);
				t.equal(root.children[1].data, 2);
			});

			t.test('bails if passed function returns null', t => {
				t.plan(5);
				let root = setup();
				root.traverse(orderNull(0)(2), TRAVERSAL_TYPES.BFS);
				t.equal(root.data, 0);
				t.equal(root.children[0].data, 1);
				t.equal(root.children[0].children[0].data, 'one');
				t.equal(root.children[0].children[1].data, 'two');
				t.equal(root.children[1].data, 2);
			});
		});

		t.test('throws error if TRAVERSAL_TYPE given does not match one of the possible types', t => {
			t.plan(1);
			let root = setup();
			t.throws(() => root.traverse(order(0), 'WRONG'), /TraversalTypeError/);
		});
	});

	t.test('find', t => {

		t.test('returns node matching passed in term', t => {
			t.plan(2);
			let root = setup(),
				found = root.find(node => node.data === 'two');
			t.deepEqual(found, root.children[0].children[1]);
			found = root.find(node => node.data === 'ii');
			t.deepEqual(found, root.children[1]);
		});

		t.test('returns null if no nodes match term', t => {
			t.plan(1);
			let root = setup(),
				found = root.find(node => node.data === 'WRONG!!');
			t.equal(found, null);
		});
	});

	t.test('filter', t => {

		t.test('returns all nodes matching passed in term', t => {
			t.plan(1);
			let root = setup(),
				nodes = root.filter(node => /^i+/.test(node.data));
			t.deepEqual(nodes, [root.children[0], root.children[1]]);
		});

		t.test('returns empty array if no nodes match term', t => {
			t.plan(1);
			let root = setup(),
				nodes = root.filter(node => node.data === 'WRONG!!');
			t.deepEqual(nodes, []);
		});
	});

	t.test('reduce', t => {
		t.test('reduces tree', t => {
			t.plan(1);
			let root = setup(),
				acc = root.reduce((acc, node) => acc + node.data.length, 10);
			t.equal(acc, 20);
		});

		t.test('defaults to Depth First Pre algorithm', t => {
			t.plan(1);
			let root = setup(),
				acc = root.reduce((acc, node) => `${acc}>${node.data}`, '');
			t.equal(acc, '>a>i>one>two>ii');
		});

		t.test('accepts other traversal types as arg', t => {
			t.plan(3);
			const reducer = (acc, node) => `${acc}>${node.data}`;
			let root = setup(),
				acc = root.reduce(reducer, '', TRAVERSAL_TYPES.DFS_PRE);
			t.equal(acc, '>a>i>one>two>ii');
			acc = root.reduce(reducer, '', TRAVERSAL_TYPES.DFS_POST);
			t.equal(acc, '>one>two>i>ii>a');
			acc = root.reduce(reducer, '', TRAVERSAL_TYPES.BFS);
			t.equal(acc, '>a>i>ii>one>two');
		});
	});

	t.test('clone', t => {

		const reducer = (acc, node) => `${acc} > ${node.data}`;
		const objectReducer = (acc, node) => `${acc} > ${JSON.stringify(node.data)}`;
		const classReducer = (acc, node) => `${acc} > ${node.data.constructor.name} - ${node.data.data}`;

		const setupTreeOfObjects = () => {
			let root = new Node({ data: 1 });
			root.addChildren([{ stuff: 'totes' }, { wild: 'thing' }]);
			root.children[0].addChildren({what: 'no'});
			return root;
		}

		class Test {
			constructor(data) {
				this.data = data;
			}

			clone() {
				return new Test(this.data)
			}
		}

		const setupTreeOfClasses = () => {
			let root = new Node(new Test('1'));
			root.addChildren([new Test('2'), new Test('3')]);
			root.children[0].addChildren(new Test('4'));
			return root;
		}

		t.test('clones tree with plain data', t => {
			t.plan(2);
			let root = setup(),
			  cloned = root.clone();
			t.equal(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
			cloned.data = 'what';
			t.notEqual(root.data, cloned.data)
		});

		t.test('clones tree with object data', t => {
			t.plan(2);
			let root = setupTreeOfObjects(),
			  cloned = root.clone();
			t.equal(root.reduce(objectReducer, ''), cloned.reduce(objectReducer, ''));
			cloned.data.data = 'what';
			t.notEqual(root.data, cloned.data)
		});

		t.test('clones tree with classes', t => {
			t.plan(2);
			let root = setupTreeOfClasses(),
			  cloned = root.clone();
			t.equal(root.reduce(classReducer, ''), cloned.reduce(classReducer, ''));
			cloned.data.data = 'what';
			t.notEqual(root.data, cloned.data)
		});
	});

	t.test('map', t => {

		const mapper = node => {
				node.data = `!${node.data}`;
				return node;
			};

		t.test('doesn\'t affect tree called on', t => {
			t.plan(5);
			let root = setup(),
			  mapped = root.map(mapper);
			root.traverse(node => t.ok(/^[^!]/.test(node.data)));
		});

		t.test('returns mapped tree', t => {
			t.test(5);
			let root = setup(),
			  mapped = root.map(mapper);
			mapped.traverse(node => t.ok(/^[!]/.test(node.data)));
		});

		t.test('maps to arbitary objects', t => {
			t.test(1);
			let root = setup(),
			  mapped = root.map(({ data, children }) => {
					return {
						data: data
					, children: children
					}
				});
			t.deepEqual(mapped, {
				data: 'a',
				children: [{
						data: 'i',
						children: [{
								data: 'one',
								children: []
							}, {
								data: 'two',
								children: []
							}]
					}, {
						data: 'ii',
						children: []
					}]
			});
		});

	});

});
