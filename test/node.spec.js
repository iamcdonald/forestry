import commonTests from './ForestryNodeCommonTests/index';
import node from '../src/node';

const setup = dataGen => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  const root = Object.create(node).init(d1);
  root.addChild(d2, d3);
  root.children[0].addChild(d4, d5);
  return root;
};

const creator = (data, parent) => {
  return Object.create(node).init(data, parent);
};

const setData = (node, val) => {
  node.data = val;
};

const getData = node => node.data;

commonTests('node', setup, creator, getData, setData);
