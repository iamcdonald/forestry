import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup) => {
  ctx = `${ctx} : index`;
  test(`${ctx} : returns index of node within parent\'s children`, t => {
    t.plan(2);
    const root = setup(simpleDataGen);
    t.is(root.getChildren()[1].getIndex(), 1);
    t.is(root.getChildren()[0].getIndex(), 0);
  });

  test(`${ctx} : returns null if node has no parent`, t => {
    t.plan(1);
    const root = setup(simpleDataGen);
    t.is(root.getIndex(), null);
  });
};
