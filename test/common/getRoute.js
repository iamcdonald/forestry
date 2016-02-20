import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('getRoute', t => {
    t.test('should return route to node from the root of the tree', t => {
      t.plan(2);
      let root = setup(simpleDataGen);
      t.deepEqual(root.children[1].getRoute(), [1]);
      t.deepEqual(root.children[0].children[1].getRoute(), [0, 1]);
    });

    t.test('returns empty array if called on tree root', t => {
      t.plan(1);
      let root = setup(simpleDataGen);
      t.deepEqual(root.getRoute(), []);
    });
  });
}
