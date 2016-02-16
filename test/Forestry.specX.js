import tape from 'tape';
import sinon from 'sinon';
import Forestry, { TRAVERSAL_TYPES } from '../src/Forestry';

const setup = () => {
	let model = {
		data: 'a',
		children: [{
			data: 'i',
			children: [{
					data: 'one'
				}, {
					data: 'two'
				}]
			}, {
				data: 'ii'
			}]
		};
	return new Forestry(model, 'children');
}

tape('Forestry', t => {

	t.test('constructor', t => {

		t.test('data arg', t => {

			t.test('persists data to instance', t => {
				t.plan(1);
				let n = new Forestry('data');
				t.equal(n.data, 'data');
			});
		});

		t.test('child property arg', t => {
			t.test('persists child property to instance if given', t => {
				t.plan(1);
				let n = new Forestry('data', 'kids');
				t.equal(n._childrenProp, 'kids');
			});
		});

		t.test('parent arg', t => {

			t.test('persists parent to instance if given', t => {
				t.plan(1);
				let n = new Forestry('data', 'kids' ,'parent');
				t.equal(n.parent, 'parent');
			});

			t.test('parent is null if no arg passed', t => {
				t.plan(1);
				let n = new Forestry('data');
				t.equal(n.parent, null);
			});
		});

	});

	t.test('on the fly parsing of third party tree structure', t => {
		t.plan(10);
		let obj = {
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
			node = new Forestry(obj, 'children');

		t.equal(node.data.name, '1');
		t.equal(node.data.id, 1);
		t.equal(node.children.length, 3);
		t.equal(node.children[2].data.name, '4');
		t.equal(node.children[2].data.id, 4);
		t.equal(node.children[1].children[0].data.name, '7');
		t.equal(node.children[1].children[0].data.id, 7);
		node = node.find(n => n.data.name === '5');
		t.equal(node.data.name, '5');
		t.equal(node.data.id, 5);
		t.equal(node.children.length, 0);

	});

	t.test('addChildren', t => {
		t.test('adds child to current node', t => {
			t.plan(2);
			let node = new Forestry({ data: 'thing' }, 'kids');
			node.addChildren('stuff');
			t.equal(node.children.length, 1);
			t.equal(node.children[0].data, 'stuff');
		});

		t.test('adds multiple children to current node if passed array', t => {
			t.plan(4);
			let node = new Forestry({ data: 'thing' }, 'kids');
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
			let node = new Forestry({ data: 'things' }, 'kids');
			node.addChildren([1, 2, 3]);
			node.children[1].remove();
			t.equal(node.children.length, 2);
			t.equal(node.children[1].data, 3);
		});

		t.test('returns removed node with parent set to null', t => {
			t.plan(2);
			let node = new Forestry({ data: 'things' }, 'kids');
			node.addChildren([1, 2, 3]);
			let removed = node.children[1].remove();
			t.equal(removed.data, 2);
			t.equal(removed.parent, null);
		});

		t.test('calling remove on root node does nothing', t => {
			t.plan(1);
			let node = new Forestry({ data: 'things' }, 'kids');
			let removed = node.remove();
			t.equal(removed, undefined);
		});

	});

	t.test('traverse', t => {

		const order = i => node => node.data.data = i++;
		const orderNull = i => l => node => i <= l ? node.data.data = i++ : null;

		t.test('defaults to DFS_PRE', t => {
			t.plan(5);
			let root = setup();
			root.traverse(order(0));
			t.equal(root.data.data, 0);
			t.equal(root.children[0].data.data, 1);
			t.equal(root.children[0].children[0].data.data, 2);
			t.equal(root.children[0].children[1].data.data, 3);
			t.equal(root.children[1].data.data, 4);
		});

		t.test('when Depth First Pre (DFS_PRE) passed as type arg', t => {

			t.test('uses depth first pre traversal algorith,', t => {
				t.plan(5);
				let root = setup();
				root.traverse(order(0));
				t.equal(root.data.data, 0);
				t.equal(root.children[0].data.data, 1);
				t.equal(root.children[0].children[0].data.data, 2);
				t.equal(root.children[0].children[1].data.data, 3);
				t.equal(root.children[1].data.data, 4);
			});

			t.test('bails if passed function returns null', t => {
				t.plan(5);
				let root = setup();
				root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_PRE);
				t.equal(root.data.data, 0);
				t.equal(root.children[0].data.data, 1);
				t.equal(root.children[0].children[0].data.data, 'one');
				t.equal(root.children[0].children[1].data.data, 'two');
				t.equal(root.children[1].data.data, 'ii');
			});
		});

		t.test('when Depth First Post (DFS_POST) passed as arg', t => {

			t.test('uses depth first post traversal algorithm', t => {
				t.plan(5);
				let root = setup();
				root.traverse(order(0), TRAVERSAL_TYPES.DFS_POST);
				t.equal(root.data.data, 4);
				t.equal(root.children[0].data.data, 2);
				t.equal(root.children[0].children[0].data.data, 0);
				t.equal(root.children[0].children[1].data.data, 1);
				t.equal(root.children[1].data.data, 3);
			});

			t.test('bails if passed function returns null', t => {
				t.plan(5);
				let root = setup();
				root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_POST);
				t.equal(root.data.data, 'a');
				t.equal(root.children[0].data.data, 'i');
				t.equal(root.children[0].children[0].data.data, 0);
				t.equal(root.children[0].children[1].data.data, 1);
				t.equal(root.children[1].data.data, 'ii');
			});
		});

		t.test('when Breadth First (BFS) passed as arg', t => {

			t.test('uses breadth first traversal algorithm', t => {
				t.plan(5);
				let root = setup();
				root.traverse(order(0), TRAVERSAL_TYPES.BFS);
				t.equal(root.data.data, 0);
				t.equal(root.children[0].data.data, 1);
				t.equal(root.children[0].children[0].data.data, 3);
				t.equal(root.children[0].children[1].data.data, 4);
				t.equal(root.children[1].data.data, 2);
			});

			t.test('bails if passed function returns null', t => {
				t.plan(5);
				let root = setup();
				root.traverse(orderNull(0)(2), TRAVERSAL_TYPES.BFS);
				t.equal(root.data.data, 0);
				t.equal(root.children[0].data.data, 1);
				t.equal(root.children[0].children[0].data.data, 'one');
				t.equal(root.children[0].children[1].data.data, 'two');
				t.equal(root.children[1].data.data, 2);
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
				found = root.find(node => node.data.data === 'two');
			t.deepEqual(found, root.children[0].children[1]);
			found = root.find(node => node.data.data === 'ii');
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
				nodes = root.filter(node => /^i+/.test(node.data.data));
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
				acc = root.reduce((acc, node) => acc + node.data.data.length, 10);
			t.equal(acc, 20);
		});

		t.test('defaults to Depth First Pre algorithm', t => {
			t.plan(1);
			let root = setup(),
				acc = root.reduce((acc, node) => `${acc}>${node.data.data}`, '');
			t.equal(acc, '>a>i>one>two>ii');
		});

		t.test('accepts other traversal types as arg', t => {
			t.plan(3);
			const reducer = (acc, node) => `${acc}>${node.data.data}`;
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

		const reducer = (acc, node) => `${acc} > ${node.data.data}`;
		const objectReducer = (acc, node) => `${acc} > ${JSON.stringify(node.data.data)}`;
		const classReducer = (acc, node) => `${acc} > ${node.data.constructor.name} - ${node.data.data}`;

		const setupTreeOfObjects = () => {
			let model = {
				data: { data: 1 },
				children: [{
					data: { stuff: 'totes' },
					children: [{
							data: {what: 'no'}
						}]
					}, {
						data: { wild: 'thing' }
					}]
				};
			return new Forestry(model);
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
			let root = new Forestry(new Test('1'), 'echoes');
			root.echoes = [new Test('2'), new Test('3')];
			root.echoes[0].echoes = [new Test('4')];
			return root;
		}

		t.test('clones tree with plain data', t => {
			t.plan(2);
			let root = setup(),
			  cloned = root.clone();
			t.equal(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
			cloned.data.data = 'what';
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
			t.notEqual(root.data.data, cloned.data.data)
		});
	});

	t.test('map', t => {

		const mapper = node => {
				node.data.data = `!${node.data.data}`;
				return node;
			};

		t.test('doesn\'t affect tree called on', t => {
			t.plan(5);
			let root = setup(),
			  mapped = root.map(mapper);
			root.traverse(node => {
				t.ok(/^[^!]/.test(node.data.data))
			});
		});

		t.test('returns mapped tree', t => {
			t.test(5);
			let root = setup(),
			  mapped = root.map(mapper);
			mapped.traverse(node => {
				t.ok(/^[!]/.test(node.data.data))
			});
		});

		t.test('maps to arbitary objects', t => {
			t.test(1);
			let root = setup(),
			  mapped = root.map(({ data: { data, children }}) => {
					return {
						aka: data
					, echoes: children || null
					}
				});
			t.deepEqual(mapped, {
				aka: 'a',
				echoes: [{
						aka: 'i',
						echoes: [{
								aka: 'one',
								echoes: null
							}, {
								aka: 'two',
								echoes: null
							}]
					}, {
						aka: 'ii',
						echoes: null
					}]
			});
		});

	});

});
