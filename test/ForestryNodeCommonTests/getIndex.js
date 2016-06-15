import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, setup) => {
  test(`${ctx} : getIndex : returns index of node within parent\'s children`, t => {
    const root = setup(simpleDataGen);
    t.is(root.children[1].index, 1);
    t.is(root.children[0].index, 0);
  });

  test(`${ctx} : getIndex : returns null if node has no parent`, t => {
    const root = setup(simpleDataGen);
    t.is(root.index, null);
  });
};
