import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('isLeaf', t => {

    t.test('returns true if node is root', t => {
      t.plan(1);
      let root = setup(simpleDataGen);
      t.equal(root.isRoot, true);
    });

    t.test('returns false if node is not root', t => {
      t.plan(1);
      let root = setup(simpleDataGen);
      t.equal(root.children[0].isRoot, false);
    });

  });

}
