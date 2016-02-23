import { TYPES as TRAVERSAL_TYPES } from '../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup, getData) => {
  t.test('find', t => {

    t.test('returns node matching passed in pred', t => {
      t.plan(2);
      let root = setup(simpleDataGen);
      t.deepEqual(root.find(node => /^five/.test(getData(node))), root.children[0].children[1]);
      t.deepEqual(root.find(node => /^three/.test(getData(node))), root.children[1]);
    });

    t.test('returns first node matching passed in pred', t => {
      t.plan(2);
      let root = setup(simpleDataGen);
      t.deepEqual(root.find(node => /-hundred/.test(getData(node)), TRAVERSAL_TYPES.DFS_PRE), root);
      t.deepEqual(root.find(node => /-hundred/.test(getData(node)), TRAVERSAL_TYPES.DFS_POST), root.children[0].children[0]);
    });

    t.test('returns null if no nodes match term', t => {
      t.plan(1);
      let root = setup(simpleDataGen),
      found = root.find(node => node.data === 'WRONG!!');
      t.equal(found, null);
    });
  });
}
