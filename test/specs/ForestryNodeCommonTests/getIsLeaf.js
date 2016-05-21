import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('isLeaf', t => {
    t.test('returns true if node has no children', t => {
      t.plan(1);
      const root = setup(simpleDataGen);
      t.equal(root.children[0].children[0].isLeaf, true);
    });

    t.test('returns false if node has children', t => {
      t.plan(1);
      const root = setup(simpleDataGen);
      t.equal(root.children[0].isLeaf, false);
    });
  });
};
