import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, creator) => {
  test(`${ctx} : addChild : adds child to current node`, t => {
    const [d1, d2] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2);
    t.is(node.children.length, 1);
    t.deepEqual(node.children[0].data, d2);
  });

  test(`${ctx} : addChild : adds array as single child`, t => {
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild([d2, d3, d4]);
    t.is(node.children.length, 1);
    t.deepEqual(node.children[0].data, [d2, d3, d4]);
  });

  test(`${ctx} : addChild : adds multiple children to current node if passed aseries of args`, t => {
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2, d3, d4);
    t.is(node.children.length, 3);
    t.deepEqual(node.children[0].data, d2);
    t.deepEqual(node.children[1].data, d3);
    t.deepEqual(node.children[2].data, d4);
  });
};
