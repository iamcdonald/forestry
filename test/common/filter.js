import { TYPES as TRAVERSAL_TYPES } from '../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup, getData) => {
  t.test('filter', t => {
    const filterPred = node => /^(t|fi).*-/.test(getData(node));

    t.test('returns all nodes matching passed in term in order encountered', t => {
      t.plan(2);
      const root = setup(simpleDataGen);
      let nodes = root.filter(filterPred);
      t.deepEqual(
        nodes,
        [
          root.children[0],
          root.children[0].children[1],
          root.children[1]
        ]
      );
      nodes = root.filter(filterPred, TRAVERSAL_TYPES.BFS);
      t.deepEqual(
        nodes,
        [
          root.children[0],
          root.children[1],
          root.children[0].children[1]
        ]
      );
    });

    t.test('returns empty array if no nodes match term', t => {
      t.plan(1);
      const root = setup(simpleDataGen);
      const nodes = root.filter(node => node.data === 'WRONG!!');
      t.deepEqual(nodes, []);
    });
  });
};
