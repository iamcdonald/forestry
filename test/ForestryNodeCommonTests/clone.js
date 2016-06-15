import { simpleDataGen, objectDataGen, classDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, setup, getData, setData) => {
  const plainReducer = (acc, node) => `${acc} > ${getData(node)}`;
  const objectReducer = (acc, node) => `${acc} > ${JSON.stringify(getData(node))}`;
  const classReducer = (acc, node) => `${acc} > ${getData(node).constructor.name} - ${getData(node).data}`;
  const cloneTest = (t, root, reducer) => {
    const cloned = root.clone();
    t.is(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
    setData(cloned.children[0], 'WOOGLES');
    t.not(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
  };

  test(`${ctx} : clone : clones tree with plain data`, t => {
    cloneTest(t, setup(simpleDataGen), plainReducer);
  });

  test(`${ctx} : clone : clones tree with object data`, t => {
    cloneTest(t, setup(objectDataGen), objectReducer);
  });

  test(`${ctx} : clone : clones tree with classes`, t => {
    cloneTest(t, setup(classDataGen), classReducer);
  });
};
