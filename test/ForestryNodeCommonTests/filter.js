import { TYPES as TRAVERSAL_TYPES } from '../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, setup, getData) => {
  const filterPred = node => /^(t|fi).*-/.test(getData(node));
  test(`${ctx} : filter : returns all nodes matching passed in term in order encountered`, t => {
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

  test(`${ctx} : filter : returns empty array if no nodes match term`, t => {
    const root = setup(simpleDataGen);
    const nodes = root.filter(node => node.data === 'WRONG!!');
    t.deepEqual(nodes, []);
  });
};
