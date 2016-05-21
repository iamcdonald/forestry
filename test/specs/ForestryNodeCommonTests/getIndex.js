import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('index', t => {
    t.test('returns index of node within parent\'s children', t => {
      t.plan(2);
      const root = setup(simpleDataGen);
      t.equal(root.children[1].index, 1);
      t.equal(root.children[0].index, 0);
    });

    t.test('returns null if node has no parent', t => {
      t.plan(1);
      const root = setup(simpleDataGen);
      t.equal(root.index, null);
    });
  });
};
