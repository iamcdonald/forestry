import test from 'ava';

export default (ctx, creator, getData) => {
  ctx = `${ctx} : init`;
  test(`${ctx} : persists data to instance`, t => {
    const n = creator('data');
    t.is(getData(n), 'data');
  });

  test(`${ctx} : persists parent to instance if given`, t => {
    const n = creator('data', 'parent');
    t.is(n.parent, 'parent');
  });

  test(`${ctx} : parent is null if no arg passed`, t => {
    const n = creator('data');
    t.is(n.parent, null);
  });
};
