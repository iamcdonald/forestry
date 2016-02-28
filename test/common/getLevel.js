import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('level', t => {

    t.test('returns index of node within parent\'s children', t => {
      t.plan(3);
      let root = setup(simpleDataGen);
      t.equal(root.level, 0);
      t.equal(root.children[1].level, 1);
      t.equal(root.children[0].children[0].level, 2);
    });

  });

}
