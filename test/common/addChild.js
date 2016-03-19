import { simpleDataGen } from '../test-utils/dataGen';

export default (t, creator) => {
  t.test('addChild', t => {
    t.test('adds child to current node', t => {
      t.plan(2);
      const [d1, d2] = simpleDataGen()();
      const node = creator(d1);
      node.addChild(d2);
      t.equal(node.children.length, 1);
      t.deepEqual(node.children[0].data, d2);
    });

    t.test('adds array as single child', t => {
      t.plan(2);
      const [d1, d2, d3, d4] = simpleDataGen()();
      const node = creator(d1);
      node.addChild([d2, d3, d4]);
      t.equal(node.children.length, 1);
      t.deepEqual(node.children[0].data, [d2, d3, d4]);
    });

    t.test('adds multiple children to current node if passed aseries of args', t => {
      t.plan(4);
      const [d1, d2, d3, d4] = simpleDataGen()();
      const node = creator(d1);
      node.addChild(d2, d3, d4);
      t.equal(node.children.length, 3);
      t.deepEqual(node.children[0].data, d2);
      t.deepEqual(node.children[1].data, d3);
      t.deepEqual(node.children[2].data, d4);
    });
  });
};
