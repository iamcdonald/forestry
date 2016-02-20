import { TYPES as TRAVERSAL_TYPES } from '../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup, getData) => {

  const reducer = (acc, node) => `${acc}>${getData(node)}`;
  const [d1, d2, d3, d4, d5] = simpleDataGen()();

  t.test('reduce', t => {
    t.test('reduces tree', t => {
      t.plan(1);
      let root = setup(simpleDataGen),
        expected = [...simpleDataGen()()].slice(0, 5).reduce((acc, d) => acc + d.length, 10),
        acc = root.reduce((acc, node) => acc + getData(node).length, 10);
      t.equal(acc, expected);
    });

    t.test('in order of nodes encountered', t => {
      t.plan(3);
      let root = setup(simpleDataGen),
      acc = root.reduce(reducer, '', TRAVERSAL_TYPES.DFS_PRE);
      t.equal(acc, `>${d1}>${d2}>${d4}>${d5}>${d3}`);
      acc = root.reduce(reducer, '', TRAVERSAL_TYPES.DFS_POST);
      t.equal(acc, `>${d4}>${d5}>${d2}>${d3}>${d1}`);
      acc = root.reduce(reducer, '', TRAVERSAL_TYPES.BFS);
      t.equal(acc, `>${d1}>${d2}>${d3}>${d4}>${d5}`);
    });
  });
}
