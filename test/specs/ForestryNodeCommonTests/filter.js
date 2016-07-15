import test from 'ava';
import { TYPES as TRAVERSAL_TYPES } from '../../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup, getData) => {
  ctx = `${ctx} : filter`;
  const filterPred = node => /^(t|fi).*-/.test(getData(node));
  test(`${ctx} : returns all nodes matching passed in term in order encountered`, t => {
    const root = setup(simpleDataGen);
    let nodes = root.filter(filterPred);
    t.deepEqual(
      nodes,
      [
        root.getChildren()[0],
        root.getChildren()[0].getChildren()[1],
        root.getChildren()[1]
      ]
    );
    nodes = root.filter(filterPred, TRAVERSAL_TYPES.BFS);
    t.deepEqual(
      nodes,
      [
        root.getChildren()[0],
        root.getChildren()[1],
        root.getChildren()[0].getChildren()[1]
      ]
    );
  });

  test(`${ctx} : returns empty array if no nodes match term`, t => {
    const root = setup(simpleDataGen);
    const nodes = root.filter(node => node.data === 'WRONG!!');
    t.deepEqual(nodes, []);
  });
};
