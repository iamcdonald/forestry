import test from 'ava';

export default cloneData => {
  const ctx = 'src/utils/cloneData';
  test(`${ctx} : handles simple types`, t => {
    t.is(cloneData('one'), 'one');
    t.is(cloneData(34), 34);
    t.is(cloneData(22.9), 22.9);
  });

  test(`${ctx} : handles arrays`, t => {
    const arr = [1, 2, 3, 4];
    const clone = cloneData(arr);
    t.deepEqual(arr, clone);
    clone.splice(1, 1);
    t.notDeepEqual(arr, clone);
  });

  test(`${ctx} : handles objects`, t => {
    const obj = {
      one: 1,
      two: 'two'
    };
    const clone = cloneData(obj);
    t.deepEqual(obj, clone);
    clone.two = 12;
    t.notDeepEqual(obj, clone);
  });

  test(`${ctx} : handles objects with array`, t => {
    const obj = {
      one: 1,
      two: [1, 2, 3]
    };
    const clone = cloneData(obj);
    t.deepEqual(obj, clone);
    clone.two.splice(1, 1);
    t.notDeepEqual(obj, clone);
  });

  test(`${ctx} : handles nested objects`, t => {
    const obj = {
      one: 1,
      two: {
        yeah: [
          { what: 'ever' },
          { no: 'doubt' }
        ]
      }
    };
    const clone = cloneData(obj);
    t.deepEqual(obj, clone);
    clone.two.yeah[1].no = 'CHANGE!';
    t.notDeepEqual(obj, clone);
  });

  test(`${ctx} : ignores childrenProp when cloning if one given`, t => {
    const obj = {
      one: 1,
      two: {
        yeah: [
          { what: 'ever' },
          { no: 'doubt' }
        ]
      }
    };
    const clone = cloneData(obj, 'two');
    t.deepEqual({ one: 1 }, clone);
    clone.one = 'CHANGE!';
    t.notDeepEqual({ one: 1 }, clone);
  });
};
