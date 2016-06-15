import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, setup) => {
  test(`${ctx} : isLeaf : returns true if node has no children`, t => {
    const root = setup(simpleDataGen);
    t.is(root.children[0].children[0].isLeaf, true);
  });

  test(`${ctx} : isLeaf : returns false if node has children`, t => {
    const root = setup(simpleDataGen);
    t.is(root.children[0].isLeaf, false);
  });
};
