import { simpleDataGen, objectDataGen, classDataGen } from '../test-utils/dataGen';

export default (t, setup, getData, setData) => {
  t.test('clone', t => {

    const plainReducer = (acc, node) => `${acc} > ${getData(node)}`;
    const objectReducer = (acc, node) => `${acc} > ${JSON.stringify(getData(node))}`;
    const classReducer = (acc, node) => `${acc} > ${getData(node).constructor.name} - ${getData(node).data}`;

    const test = (t, root, reducer) => {
      t.plan(2);
      let cloned = root.clone();
      t.equal(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
      setData(cloned.children[0], 'WOOGLES');
      t.notEqual(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
    }

    t.test('clones tree with plain data', t => {
      test(t, setup(simpleDataGen), plainReducer);
    });

    t.test('clones tree with object data', t => {
      test(t, setup(objectDataGen), objectReducer);
    });

    t.test('clones tree with classes', t => {
      test(t, setup(classDataGen), classReducer);
    });
  });
}
