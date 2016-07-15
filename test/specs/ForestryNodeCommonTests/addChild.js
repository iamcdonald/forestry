import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, creator) => {
  ctx = `${ctx} : addChild`;
  test(`${ctx} : adds child to current node`, t => {
    const [d1, d2] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2);
    t.is(node.getChildren().length, 1);
    t.deepEqual(node.getChildren()[0].data, d2);
  });

  test(`${ctx} : adds array as single child`, t => {
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild([d2, d3, d4]);
    t.is(node.getChildren().length, 1);
    t.deepEqual(node.getChildren()[0].data, [d2, d3, d4]);
  });

  test(`${ctx} : adds multiple children to current node if passed a series of args`, t => {
    const [d1, d2, d3, d4] = simpleDataGen()();
    const node = creator(d1);
    node.addChild(d2, d3, d4);
    t.is(node.getChildren().length, 3);
    t.deepEqual(node.getChildren()[0].data, d2);
    t.deepEqual(node.getChildren()[1].data, d3);
    t.deepEqual(node.getChildren()[2].data, d4);
  });
};
