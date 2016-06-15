import climbTest from './ForestryNodeCommonTests/climb';
import traverseTest from './ForestryNodeCommonTests/traverse';
import findTest from './ForestryNodeCommonTests/find';
import filterTest from './ForestryNodeCommonTests/filter';
import reduceTest from './ForestryNodeCommonTests/reduce';
import cloneTest from './ForestryNodeCommonTests/clone';
import mapTest from './ForestryNodeCommonTests/map';

function testCombination(ctx, setup, getData, setData) {
  climbTest(ctx, setup);
  traverseTest(ctx, setup, getData, setData);
  findTest(ctx, setup, getData);
  filterTest(ctx, setup, getData);
  reduceTest(ctx, setup, getData);
  cloneTest(ctx, setup, getData, setData);
  mapTest(ctx, setup, getData, setData);
}

export default (Forestry, Node) => {
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

  testCombination('Forestry -> Node', nodeWithinForestrySetup, getData, setData);
  testCombination('Node -> Forestry', forestryWithinNodeSetup, getData, setData);
  testCombination('Forestry -> Forestry', forestryWithinForestrySetup, getData, setData);
};
