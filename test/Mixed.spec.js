import tape from 'tape';
import Forestry from '../src/Forestry';
import Node from '../src/Node';
import climbTest from './common/climb';
import traverseTest from './common/traverse';
import findTest from './common/find';
import filterTest from './common/filter';
import reduceTest from './common/reduce';
import cloneTest from './common/clone';
import mapTest from './common/map';

const nodeWithinForestrySetup = dataGen => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  const model = {
    reading: d1,
    echoes: []
  };
  const root = new Forestry(model, 'echoes');
  const node = new Node(d2);
  node.addChild(d4, d5);
  root.addChild(node, { reading: d3 });
  return root;
};

const forestryWithinNodeSetup = dataGen => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  const model = {
    reading: d2,
    echoes: [
      {
        reading: d4
      },
      {
        reading: d5
      }
    ]
  };
  const root = new Node(d1);
  const node = new Forestry(model, 'echoes');
  root.addChild(node, d3);
  return root;
};

const forestryWithinForestrySetup = dataGen => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  const model = {
    reading: d2,
    echoes: [
      {
        reading: d4
      },
      {
        reading: d5
      }
    ]
  };
  const root = new Forestry({ guffaws: d1, energy: [] }, 'energy');
  const node = new Forestry(model, 'echoes');
  root.addChild(node, { guffaws: d3 });
  return root;
};

const setData = (node, val) => {
  if (node instanceof Forestry) {
    if (node.data.hasOwnProperty('reading')) {
      node.data.reading = val;
    }
    node.data.guffaws = val;
  } else {
    node.data = val;
  }
};

const getData = node => {
  if (node instanceof Forestry) {
    if (node.data.hasOwnProperty('reading')) {
      return node.data.reading;
    }
    return node.data.guffaws;
  }
  return node.data;
};

tape('Mixed Tree I - Node Within Forestry Tree', t => {
  climbTest(t, nodeWithinForestrySetup);
  traverseTest(t, nodeWithinForestrySetup, getData, setData);
  findTest(t, nodeWithinForestrySetup, getData);
  filterTest(t, nodeWithinForestrySetup, getData);
  reduceTest(t, nodeWithinForestrySetup, getData);
  cloneTest(t, nodeWithinForestrySetup, getData, setData);
  mapTest(t, nodeWithinForestrySetup, getData, setData);
});

tape('Mixed Tree II - Forestry Tree Within Node', t => {
  climbTest(t, forestryWithinNodeSetup);
  traverseTest(t, forestryWithinNodeSetup, getData, setData);
  findTest(t, forestryWithinNodeSetup, getData);
  filterTest(t, forestryWithinNodeSetup, getData);
  reduceTest(t, forestryWithinNodeSetup, getData);
  cloneTest(t, forestryWithinNodeSetup, getData, setData);
  mapTest(t, forestryWithinNodeSetup, getData, setData);
});

tape('Mixed Tree III - Forestry Tree Within Forestry Tree', t => {
  climbTest(t, forestryWithinForestrySetup);
  traverseTest(t, forestryWithinForestrySetup, getData, setData);
  findTest(t, forestryWithinForestrySetup, getData);
  filterTest(t, forestryWithinForestrySetup, getData);
  reduceTest(t, forestryWithinForestrySetup, getData);
  cloneTest(t, forestryWithinForestrySetup, getData, setData);
  mapTest(t, forestryWithinForestrySetup, getData, setData);
});
