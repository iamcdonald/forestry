import test from 'ava';
import { simpleDataGen, objectDataGen, classDataGen } from '../test-utils/dataGen';

export default (ctx, setup, getData, setData) => {
  ctx = `${ctx} : clone`;
  const plainReducer = (acc, node) => `${acc} > ${getData(node)}`;
  const objectReducer = (acc, node) => `${acc} > ${JSON.stringify(getData(node))}`;
  const classReducer = (acc, node) => `${acc} > ${getData(node).constructor.name} - ${getData(node).data}`;
  const testclone = (t, root, reducer) => {
    const cloned = root.clone();
    t.is(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
    setData(cloned.getChildren()[0], 'WOOGLES');
    t.not(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
  };

  test(`${ctx} : clones tree with plain data`, t => {
    testclone(t, setup(simpleDataGen), plainReducer);
  });

  test(`${ctx} : clones tree with object data`, t => {
    testclone(t, setup(objectDataGen), objectReducer);
  });

  test(`${ctx} : clones tree with classes`, t => {
    testclone(t, setup(classDataGen), classReducer);
  });
};
