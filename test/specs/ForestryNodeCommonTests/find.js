import test from 'ava';
import { TYPES as TRAVERSAL_TYPES } from '../../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup, getData) => {
  ctx = `${ctx} : find`;
  test(`${ctx} : returns node matching passed in pred`, t => {
    const root = setup(simpleDataGen);
    t.deepEqual(root.find(node => /^five/.test(getData(node))), root.children[0].children[1]);
    t.deepEqual(root.find(node => /^three/.test(getData(node))), root.children[1]);
  });

  test(`${ctx} : returns first node matching passed in pred`, t => {
    const root = setup(simpleDataGen);
    t.deepEqual(root.find(node => /-hundred/.test(getData(node)), TRAVERSAL_TYPES.DFS_PRE), root);
    t.deepEqual(root.find(node => /-hundred/.test(getData(node)), TRAVERSAL_TYPES.DFS_POST), root.children[0].children[0]);
  });

  test(`${ctx} : returns null if no nodes match term`, t => {
    const root = setup(simpleDataGen);
    const found = root.find(node => node.data === 'WRONG!!');
    t.is(found, null);
  });
};
