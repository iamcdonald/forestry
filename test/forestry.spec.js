import climbTest from './ForestryNodeCommonTests/climb';
import traverseTest from './ForestryNodeCommonTests/traverse';
import findTest from './ForestryNodeCommonTests/find';
import filterTest from './ForestryNodeCommonTests/filter';
import reduceTest from './ForestryNodeCommonTests/reduce';
import cloneTest from './ForestryNodeCommonTests/clone';
import mapTest from './ForestryNodeCommonTests/map';
import forestry from '../src/forestry';

function testMixedTypeTree(ctx, nodeWithinForestrySetup, getData, setData) {
  climbTest(ctx, nodeWithinForestrySetup);
  traverseTest(ctx, nodeWithinForestrySetup, getData, setData);
  findTest(ctx, nodeWithinForestrySetup, getData);
  filterTest(ctx, nodeWithinForestrySetup, getData);
  reduceTest(ctx, nodeWithinForestrySetup, getData);
  cloneTest(ctx, nodeWithinForestrySetup, getData, setData);
  mapTest(ctx, nodeWithinForestrySetup, getData, setData);
}

const nodeWithinForestrySetup = dataGen => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  const model = {
    reading: d1,
    echoes: []
  };
  const root = forestry(model, 'echoes');
  const node = forestry(d2);
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
  const root = forestry(d1);
  const node = forestry(model, 'echoes');
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
  const root = forestry({ guffaws: d1, energy: [] }, 'energy');
  const node = forestry(model, 'echoes');
  root.addChild(node, { guffaws: d3 });
  return root;
};

const setData = (node, val) => {
  if (node.data.hasOwnProperty('reading')) {
    node.data.reading = val;
  } else if (node.data.hasOwnProperty('guffaws')) {
    node.data.guffaws = val;
  } else {
    node.data = val;
  }
};

const getData = node => {
  if (node.data.hasOwnProperty('reading')) {
    return node.data.reading;
  }
  if (node.data.hasOwnProperty('guffaws')) {
    return node.data.guffaws;
  }
  return node.data;
};

testMixedTypeTree('Mixed Tree I - Node Within Forestry Tree', nodeWithinForestrySetup, getData, setData);
testMixedTypeTree('Mixed Tree II - Forestry Tree Within Node', forestryWithinNodeSetup, getData, setData);
testMixedTypeTree('Mixed Tree III - Forestry Tree Within Forestry Tree', forestryWithinForestrySetup, getData, setData);
