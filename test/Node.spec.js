import tape from 'tape';
import dataGen from './utils/dataGen';
import Node from '../src/Node';
import commonTests from './common';


const setup = () => {
  let [d1, d2, d3, d4, d5] = dataGen()(),
    root = new Node(d1);
	root.addChildren([d2, d3]);
	root.children[0].addChildren([d4, d5]);
	return root;
}

const creator = (data, parent) => {
  return new Node(data, parent);
}

const setData = (node, val) => node.data = val;
const getData = node => node.data;

tape.only('Node', t => {

  commonTests(t, setup, creator, getData, setData);

});
