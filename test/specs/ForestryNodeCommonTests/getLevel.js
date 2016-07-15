import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup) => {
  ctx = `${ctx} : level`;
  test(`${ctx} : returns index of node within parent\'s children`, t => {
    const root = setup(simpleDataGen);
    t.is(root.getLevel(), 0);
    t.is(root.getChildren()[1].getLevel(), 1);
    t.is(root.getChildren()[0].getChildren()[0].getLevel(), 2);
  });
};
