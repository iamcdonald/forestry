export default (t, setup) => {
  t.test('getIndex', t => {

    t.test('returns index of node within parent\'s children', t => {
      t.plan(2);
      let root = setup();
      t.equal(root.children[1].getIndex(), 1)
      t.equal(root.children[0].getIndex(), 0)
    });

    t.test('returns null if node has no parent', t => {
      t.plan(1);
      let root = setup();
      t.equal(root.getIndex(), null);
    });
  });

}
