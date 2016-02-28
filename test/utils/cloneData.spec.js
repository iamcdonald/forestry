import cloneData from '../../src/utils/cloneData';
import tape from 'tape';

tape('src/utils/cloneData', t => {

  t.test('handles simple types', t => {
    t.plan(3);
    t.equal(cloneData('one'), 'one');
    t.equal(cloneData(34), 34);
    t.equal(cloneData(22.9), 22.9);
  });

  t.test('handles arrays', t => {
    t.plan(2);
    let arr = [1, 2, 3, 4],
      clone = cloneData(arr);
    t.deepEqual(arr, clone);
    clone.splice(1, 1);
    t.notDeepEqual(arr, clone);
  });

  t.test('handles objects', t => {
    t.plan(2);
    let obj = {
        one: 1
      , two: 'two'
      },
      clone = cloneData(obj);
    t.deepEqual(obj, clone);
    clone.two = 12;
    t.notDeepEqual(obj, clone);
  });

  t.test('handles objects with array', t => {
    t.plan(2);
    let obj = {
        one: 1
      , two: [1, 2, 3]
      },
      clone = cloneData(obj);
    t.deepEqual(obj, clone);
    clone.two.splice(1, 1);
    t.notDeepEqual(obj, clone);
  });

  t.test('handles nested objects', t => {
    t.plan(2);
    let obj = {
        one: 1
      , two: {
          yeah: [{
            what: 'ever'
          }, {
            no: 'doubt'
          }]
        }
      },
      clone = cloneData(obj);
    t.deepEqual(obj, clone);
    clone.two.yeah[1].no = 'CHANGE!';
    t.notDeepEqual(obj, clone);
  });

  t.test('ignores childrenProp when cloning if one given', t => {
    t.plan(2);
    let obj = {
        one: 1
      , two: {
          yeah: [{
            what: 'ever'
          }, {
            no: 'doubt'
          }]
        }
      },
      clone = cloneData(obj, 'two');
    t.deepEqual({ one: 1 }, clone);
    clone.one = 'CHANGE!';
    t.notDeepEqual({ one: 1 }, clone);
  });


});
