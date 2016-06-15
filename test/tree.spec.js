import commonTests from './ForestryNodeCommonTests/index';
import tree from '../src/tree';

const setup = dataGen => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  const model = {
    reading: d1,
    echoes: [
      {
        reading: d2,
        echoes: [
          {
            reading: d4
          }, {
            reading: d5
          }
        ]
      },
      {
        reading: d3
      }
    ]
  };
  return Object.create(tree).init(model, 'echoes');
};

const creator = (reading, parent) => {
  return Object.create(tree).init({ reading }, 'echoes', parent);
};

const setData = (node, val) => {
  node.data.reading = val;
};

const getData = node => node.data.reading;

commonTests('tree', setup, creator, getData, setData);
