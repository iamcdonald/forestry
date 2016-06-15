import { TYPES as TRAVERSAL_TYPES } from '../../src/traversal';
import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, setup, getData) => {
  test(`${ctx} : find : returns node matching passed in pred`, t => {
    const root = setup(simpleDataGen);
    t.deepEqual(root.find(node => /^five/.test(getData(node))), root.children[0].children[1]);
    t.deepEqual(root.find(node => /^three/.test(getData(node))), root.children[1]);
  });

  test(`${ctx} : find : returns first node matching passed in pred`, t => {
    const root = setup(simpleDataGen);
    t.deepEqual(root.find(node => /-hundred/.test(getData(node)), TRAVERSAL_TYPES.DFS_PRE), root);
    t.deepEqual(root.find(node => /-hundred/.test(getData(node)), TRAVERSAL_TYPES.DFS_POST), root.children[0].children[0]);
  });

  test(`${ctx} : find : returns null if no nodes match term`, t => {
    const root = setup(simpleDataGen);
    const found = root.find(node => node.data === 'WRONG!!');
    t.is(found, null);
  });
};
