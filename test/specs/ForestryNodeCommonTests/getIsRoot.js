import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup) => {
  ctx = `${ctx} : isLeaf`;
  test(`${ctx} : returns true if node is root`, t => {
    const root = setup(simpleDataGen);
    t.is(root.isRoot, true);
  });

  test(`${ctx} : returns false if node is not root`, t => {
    const root = setup(simpleDataGen);
    t.is(root.children[0].isRoot, false);
  });
};
