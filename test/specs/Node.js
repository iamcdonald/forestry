import tape from 'tape';
import commonTests from './ForestryNodeCommonTests/index';

export default Node => {
  const setup = dataGen => {
    const [d1, d2, d3, d4, d5] = dataGen()();
    const root = new Node(d1);
    root.addChild(d2, d3);
    root.children[0].addChild(d4, d5);
    return root;
  };

  const creator = (data, parent) => {
    return new Node(data, parent);
  };

  const setData = (node, val) => {
    node.data = val;
  };

  const getData = node => node.data;

  tape('Node', t => {
    commonTests(t, setup, creator, getData, setData);
  });
};
