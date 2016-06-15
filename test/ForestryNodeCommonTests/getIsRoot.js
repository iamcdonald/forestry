import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, setup) => {
  test(`${ctx} : isRoot : returns true if node is root`, t => {
    const root = setup(simpleDataGen);
    t.is(root.isRoot, true);
  });

  test(`${ctx} : isRoot : returns false if node is not root`, t => {
    const root = setup(simpleDataGen);
    t.is(root.children[0].isRoot, false);
  });
};
