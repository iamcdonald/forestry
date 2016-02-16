import { TYPES as TRAVERSAL_TYPES } from '../../src/traversal';

export default (t, setup, getData) => {
  t.test('filter', t => {

    const filterPred = node => /^(t|fi).*-/.test(getData(node));

    t.test('returns all nodes matching passed in term in order encountered', t => {
      t.plan(2);
      let root = setup(),
        nodes = root.filter(filterPred);
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
      let root = setup(),
      nodes = root.filter(node => node.data === 'WRONG!!');
      t.deepEqual(nodes, []);
    });
  });
}
