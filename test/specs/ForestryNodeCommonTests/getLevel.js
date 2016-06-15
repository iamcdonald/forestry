import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup) => {
  ctx = `${ctx} : level`;
  test(`${ctx} : returns index of node within parent\'s children`, t => {
    const root = setup(simpleDataGen);
    t.is(root.level, 0);
    t.is(root.children[1].level, 1);
    t.is(root.children[0].children[0].level, 2);
  });
};
