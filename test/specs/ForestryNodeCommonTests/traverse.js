import { simpleDataGen } from '../test-utils/dataGen';
import { TYPES as TRAVERSAL_TYPES } from '../../../src/traversal';

export default (t, setup, getData, setData) => {
  const order = i => node => setData(node, i++);
  const orderNull = i => l => node => i <= l ? setData(node, i++) : null;

  t.test('traverse', t => {
    t.test('defaults to DFS_PRE', t => {
      t.plan(5);
      const root = setup(simpleDataGen);
      root.traverse(order(0));
      t.equal(getData(root), 0);
      t.equal(getData(root.children[0]), 1);
      t.equal(getData(root.children[0].children[0]), 2);
      t.equal(getData(root.children[0].children[1]), 3);
      t.equal(getData(root.children[1]), 4);
    });

    t.test('when Depth First Pre (DFS_PRE) passed as type arg', t => {
      t.test('uses depth first pre traversal algorithm,', t => {
        t.plan(5);
        const root = setup(simpleDataGen);
        root.traverse(order(0));
        t.equal(getData(root), 0);
        t.equal(getData(root.children[0]), 1);
        t.equal(getData(root.children[0].children[0]), 2);
        t.equal(getData(root.children[0].children[1]), 3);
        t.equal(getData(root.children[1]), 4);
      });

      t.test('bails if passed function returns null', t => {
        t.plan(5);
        const root = setup(simpleDataGen);
        const control = setup(simpleDataGen);
        root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_PRE);
        t.equal(getData(root), 0);
        t.equal(getData(root.children[0]), 1);
        t.equal(getData(root.children[0].children[0]), getData(control.children[0].children[0]));
        t.equal(getData(root.children[0].children[1]), getData(control.children[0].children[1]));
        t.equal(getData(root.children[1]), getData(control.children[1]));
      });
    });

    t.test('when Depth First Post (DFS_POST) passed as arg', t => {
      t.test('uses depth first post traversal algorithm', t => {
        t.plan(5);
        const root = setup(simpleDataGen);
        root.traverse(order(0), TRAVERSAL_TYPES.DFS_POST);
        t.equal(getData(root), 4);
        t.equal(getData(root.children[0]), 2);
        t.equal(getData(root.children[0].children[0]), 0);
        t.equal(getData(root.children[0].children[1]), 1);
        t.equal(getData(root.children[1]), 3);
      });

      t.test('bails if passed function returns null', t => {
        t.plan(5);
        const root = setup(simpleDataGen);
        const control = setup(simpleDataGen);
        root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_POST);
        t.equal(getData(root), getData(root));
        t.equal(getData(root.children[0]), getData(control.children[0]));
        t.equal(getData(root.children[0].children[0]), 0);
        t.equal(getData(root.children[0].children[1]), 1);
        t.equal(getData(root.children[1]), getData(control.children[1]));
      });
    });

    t.test('when Breadth First (BFS) passed as arg', t => {
      t.test('uses breadth first traversal algorithm', t => {
        t.plan(5);
        const root = setup(simpleDataGen);
        root.traverse(order(0), TRAVERSAL_TYPES.BFS);
        t.equal(getData(root), 0);
        t.equal(getData(root.children[0]), 1);
        t.equal(getData(root.children[0].children[0]), 3);
        t.equal(getData(root.children[0].children[1]), 4);
        t.equal(getData(root.children[1]), 2);
      });

      t.test('bails if passed function returns null', t => {
        t.plan(5);
        const root = setup(simpleDataGen);
        const control = setup(simpleDataGen);
        root.traverse(orderNull(0)(2), TRAVERSAL_TYPES.BFS);
        t.equal(getData(root), 0);
        t.equal(getData(root.children[0]), 1);
        t.equal(getData(root.children[0].children[0]), getData(control.children[0].children[0]));
        t.equal(getData(root.children[0].children[1]), getData(control.children[0].children[1]));
        t.equal(getData(root.children[1]), 2);
      });
    });

    t.test('throws error if TRAVERSAL_TYPE given does not match one of the possible types', t => {
      t.plan(1);
      const root = setup(simpleDataGen);
      t.throws(() => root.traverse(order(0), 'WRONG'), /TraversalTypeError/);
    });
  });
};
