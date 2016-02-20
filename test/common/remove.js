import { simpleDataGen } from '../test-utils/dataGen';

export default (t, creator) => {

  t.test('remove', t => {

    t.test('removes node', t => {
      t.plan(2);
      let [d1, d2, d3, d4] = simpleDataGen()(),
        node = creator(d1);
      node.addChildren([d2, d3, d4]);
      console.log('CALLING REMOVE')
      node.children[1].remove();
      t.equal(node.children.length, 2);
      t.deepEqual(node.children[1].data, d4);
    });

    t.test('returns removed node with parent set to null', t => {
      t.plan(2);
      let [d1, d2, d3, d4] = simpleDataGen()(),
        node = creator(d1);
      node.addChildren([d2, d3, d4]);
      let removed = node.children[1].remove();
      t.equal(removed.data, d3);
      t.equal(removed.parent, null);
    });

    t.test('calling remove on root node does nothing', t => {
      t.plan(1);
      let node = creator(simpleDataGen()().next());
      let removed = node.remove();
      t.equal(removed, undefined);
    });

  });
}
