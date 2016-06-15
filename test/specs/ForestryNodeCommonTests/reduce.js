import test from 'ava';
import { TYPES as TRAVERSAL_TYPES } from '../../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup, getData) => {
  ctx = `${ctx} : reduce`;
  const reducer = (acc, node) => `${acc}>${getData(node)}`;
  const [d1, d2, d3, d4, d5] = simpleDataGen()();

  test(`${ctx} : reduces tree`, t => {
    const root = setup(simpleDataGen);
    const expected = [...simpleDataGen()()].slice(0, 5).reduce((acc, d) => acc + d.length, 10);
    const acc = root.reduce((acc, node) => acc + getData(node).length, 10);
    t.is(acc, expected);
  });

  test(`${ctx} : in order of nodes encountered`, t => {
    const root = setup(simpleDataGen);
    let acc = root.reduce(reducer, '', TRAVERSAL_TYPES.DFS_PRE);
    t.is(acc, `>${d1}>${d2}>${d4}>${d5}>${d3}`);
    acc = root.reduce(reducer, '', TRAVERSAL_TYPES.DFS_POST);
    t.is(acc, `>${d4}>${d5}>${d2}>${d3}>${d1}`);
    acc = root.reduce(reducer, '', TRAVERSAL_TYPES.BFS);
    t.is(acc, `>${d1}>${d2}>${d3}>${d4}>${d5}`);
  });
};
