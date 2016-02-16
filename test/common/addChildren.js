import dataGen from '../utils/dataGen';

export default (t, creator) => {

  t.test('addChildren', t => {
    t.test('adds child to current node', t => {
      t.plan(2);
      let [d1, d2] = dataGen()(),
        node = creator(d1);
      node.addChildren(d2);
      t.equal(node.children.length, 1);
      t.deepEqual(node.children[0].data, d2);
    });

    t.test('adds multiple children to current node if passed array', t => {
      t.plan(4);
      let [d1, d2, d3, d4] = dataGen()(),
        node = creator(d1);
      node.addChildren([d2, d3, d4]);
      t.equal(node.children.length, 3);
      t.deepEqual(node.children[0].data, d2);
      t.deepEqual(node.children[1].data, d3);
      t.deepEqual(node.children[2].data, d4);
    });
  });
}
