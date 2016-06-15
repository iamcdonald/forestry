import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, creator) => {
  test(`${ctx} : remove : removes node`, t => {
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2, d3, d4);
    node.children[1].remove();
    t.is(node.children.length, 2);
    t.deepEqual(node.children[1].data, d4);
  });

  test(`${ctx} : remove : returns removed node with parent set to null`, t => {
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2, d3, d4);
    const removed = node.children[1].remove();
    t.is(removed.data, d3);
    t.is(removed.parent, null);
  });

  test(`${ctx} : remove : calling remove on root node returns root`, t => {
    const node = creator(simpleDataGen()().next());
    const removed = node.remove();
    t.is(removed, node);
  });
};
