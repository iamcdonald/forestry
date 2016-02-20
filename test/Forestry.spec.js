import tape from 'tape';
import Forestry from '../src/Forestry';
import commonTests from './common';


const setup = (dataGen) => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  let model = {
		reading: d1,
		echoes: [{
			reading: d2,
			echoes: [{
					reading: d4
				}, {
					reading: d5
				}]
			}, {
				reading: d3
			}]
		};
	return new Forestry(model, 'echoes');
}

const creator = (reading, parent) => {
  return new Forestry({ reading }, 'echoes', parent);
}

const setData = (node, val) => node.data.reading = val;
const getData = node => node.data.reading;

tape.only('Forestry', t => {

  commonTests(t, setup, creator, getData, setData);

});
