import tape from 'tape';
import Node from '../src/Node';
import traversal from '../src/traversal';

tape('traversal', t => {

	const transform = i => node => {
			node.data = i++;
			return i;
		},
		assertRootInitialValue = t => {
			t.equal(root.data, 'a');
			t.equal(root.children[0].data, 'a/1');
			t.equal(root.children[1].data, 'a/2');
			t.equal(root.children[0].children[0].data, 'a/1/i');
		},
		setup = () => {
			root = new Node('a');
			root.addChild(new Node('a/1')).children[0].addChild(new Node('a/1/i'));
			root.addChild(new Node('a/2'));
			return root;
		};

	t.test('breadth first', t => {

		t.test('processes nodes in the correct order', t => {
			t.plan(8);
			let root = setup();
			assertRootInitialValue(t);
			traversal.processes[traversal.TYPES.BFS](root, transform(0));
			t.equal(root.data, 0);
			t.equal(root.children[0].data, 1);
			t.equal(root.children[1].data, 2);
			t.equal(root.children[0].children[0].data, 3);
		});

		t.test('halts traversal when passed function returns null', t => {
			t.plan(8);
			let root = setup(),
				trans = transform(0);
			assertRootInitialValue(t);
			traversal.processes[traversal.TYPES.BFS](root, node => {
				if (trans(node) === 3) {
					return null;
				}
			});
			t.equal(root.data, 0);
			t.equal(root.children[0].data, 1);
			t.equal(root.children[1].data, 2);
			t.equal(root.children[0].children[0].data, 'a/1/i');
		});

	});

	t.test('depth first - pre', t => {

		t.test('processes nodes in the correct order', t => {
			t.plan(8);
			let root = setup();
			assertRootInitialValue(t);
			traversal.processes[traversal.TYPES.DFS_PRE](root, transform(0));
			t.equal(root.data, 0);
			t.equal(root.children[0].data, 1);
			t.equal(root.children[0].children[0].data, 2);
			t.equal(root.children[1].data, 3);
		});

		t.test('halts traversal when passed function returns null', t => {
			t.plan(8);
			let root = setup(),
				trans = transform(0);
			assertRootInitialValue(t);
			traversal.processes[traversal.TYPES.DFS_PRE](root, node => {
				if (trans(node) === 3) {
					return null;
				}
			});

			t.equal(root.data, 0);
			t.equal(root.children[0].data, 1);
			t.equal(root.children[0].children[0].data, 2);
			t.equal(root.children[1].data, 'a/2');
		});
	});

	t.test('depth first - post', t => {

		t.test('processes nodes in the correct order', t => {
			t.plan(8);
			let root = setup();
			assertRootInitialValue(t);
			traversal.processes[traversal.TYPES.DFS_POST](root, transform(0));
			t.equal(root.data, 3);
			t.equal(root.children[0].data, 1);
			t.equal(root.children[0].children[0].data, 0);
			t.equal(root.children[1].data, 2);
		});

		t.test('halts traversal when passed function returns null', t => {
			t.plan(8);
			let root = setup(),
				trans = transform(0);
			assertRootInitialValue(t);
			traversal.processes[traversal.TYPES.DFS_POST](root, node => {
				if (trans(node) === 3) {
					return null;
				}
			});

			t.equal(root.data, 'a');
			t.equal(root.children[0].data, 1);
			t.equal(root.children[0].children[0].data, 0);
			t.equal(root.children[1].data, 2);
		});
	});

});
