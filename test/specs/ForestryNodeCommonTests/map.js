import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup, getData, setData) => {
  ctx = `${ctx} : map`;
  const mapper = node => {
    setData(node, `!${getData(node)}`);
    return node;
  };

  test(`${ctx} : doesn\'t affect tree called on`, t => {
    const root = setup(simpleDataGen);
    root.traverse(node => t.truthy(/^[^!]/.test(getData(node))));
  });

  test(`${ctx} : returns mapped tree`, t => {
    const root = setup(simpleDataGen);
    const mapped = root.map(mapper);
    mapped.traverse(node => t.truthy(/^!/.test(getData(node))));
  });

  test(`${ctx} : maps to arbitary objects`, t => {
    const [d1, d2, d3, d4, d5] = simpleDataGen()();
    const root = setup(simpleDataGen);
    const mapped = root.map(node => {
      return {
        data: getData(node),
        children: node.children
      };
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
};
