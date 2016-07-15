import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, creator) => {
  ctx = `${ctx} : remove`;
  test(`${ctx} : removes node`, t => {
    t.plan(2);
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2, d3, d4);
    node.getChildren()[1].remove();
    t.is(node.getChildren().length, 2);
    t.deepEqual(node.getChildren()[1].data, d4);
  });

  test(`${ctx} : returns removed node with parent set to null`, t => {
    t.plan(2);
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2, d3, d4);
    const removed = node.getChildren()[1].remove();
    t.is(removed.data, d3);
    t.is(removed.parent, null);
  });

  test(`${ctx} : calling remove on root node returns root`, t => {
    t.plan(1);
    const node = creator(simpleDataGen()().next());
    const removed = node.remove();
    t.is(removed, node);
  });
};
