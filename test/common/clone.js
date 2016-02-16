import { simpleTreeCreator, objectTreeCreator, classTreeCreator } from '../utils/setupHelper';

export default (t, creator, getData) => {
  t.test('clone', t => {

    const reducer = (acc, node) => `${acc} > ${getData(node)}`;
    const objectReducer = (acc, node) => `${acc} > ${JSON.stringify(getData(node))}`;
    const classReducer = (acc, node) => `${acc} > ${node.data.constructor.name} - ${node.data.data}`;

    const test = (t, root) => {
      t.plan(2);
      let cloned = root.clone();
      t.equal(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
      cloned.children[0].remove();
      t.notEqual(root.reduce(reducer, ''), cloned.reduce(reducer, ''));
    }

    t.test('clones tree with plain data', t => {
      test(t, simpleTreeCreator(creator));
    });

    t.test('clones tree with object data', t => {
      test(t, objectTreeCreator(creator));
    });

    t.test('clones tree with classes', t => {
      test(t, classTreeCreator(creator));
    });
  });
}
