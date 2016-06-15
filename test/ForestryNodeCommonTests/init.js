import test from 'ava';

export default (ctx, creator, getData) => {
  test(`${ctx} init : persists data to instance`, t => {
    const n = creator('data');
    t.is(getData(n), 'data');
  });

  test(`${ctx} : init : persists parent to instance if given`, t => {
    const n = creator('data', 'parent');
    t.is(n.parent, 'parent');
  });

  test(`${ctx} : init : parent is null if no arg passed`, t => {
    const n = creator('data');
    t.is(n.parent, null);
  });
};
