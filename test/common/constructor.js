
export default (t, creator, getData) => {

  t.test('constructor', t => {

    t.test('data arg', t => {

      t.test('persists data to instance', t => {
        t.plan(1);
        let n = creator('data');
        t.equal(getData(n), 'data');
      });
    });

    t.test('parent arg', t => {

      t.test('persists parent to instance if given', t => {
        t.plan(1);
        let n = creator('data', 'parent');
        t.equal(n.parent, 'parent');
      });

      t.test('parent is null if no arg passed', t => {
        t.plan(1);
        let n = creator('data');
        t.equal(n.parent, null);
      });
    });
  });
}
