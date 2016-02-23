import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup, getData, setData) => {
  t.test('map', t => {

    const mapper = node => {
      setData(node, `!${getData(node)}`);
      return node;
    }

    t.test('doesn\'t affect tree called on', t => {
      t.plan(5);
      let root = setup(simpleDataGen),
        mapped = root.map(mapper);
      root.traverse(node => t.ok(/^[^!]/.test(getData(node))));
    });

    t.test('returns mapped tree', t => {
      t.test(5);
      let root = setup(simpleDataGen),
      mapped = root.map(mapper);
      mapped.traverse(node => t.ok(/^!/.test(getData(node))));
    });

    t.test('maps to arbitary objects', t => {
      t.test(1);
      const [d1, d2, d3, d4, d5] = simpleDataGen()();
      let root = setup(simpleDataGen),
      mapped = root.map(node => {
        return {
          data: getData(node),
          children: node.children
        }
      });
      t.deepEqual(mapped, {
        data: d1,
        children: [{
          data: d2,
          children: [{
            data: d4,
            children: []
          }, {
            data: d5,
            children: []
          }]
        }, {
          data: d3,
          children: []
        }]
      });
    });

  });
}
