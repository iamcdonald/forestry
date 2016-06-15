import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup) => {
  ctx = `${ctx} : isLeaf`;
  test(`${ctx} : returns true if node has no children`, t => {
    const root = setup(simpleDataGen);
    t.is(root.children[0].children[0].isLeaf, true);
  });

  test(`${ctx} : returns false if node has children`, t => {
    const root = setup(simpleDataGen);
    t.is(root.children[0].isLeaf, false);
  });
};
