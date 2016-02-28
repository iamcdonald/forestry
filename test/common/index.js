import constructorTest from './constructor';
import addChildTest from './addChild';
import removeTest from './remove';
import getIndexTest from './getIndex';
import getLevelTest from './getLevel';
import getIsLeafTest from './getIsLeaf';
import getIsRootTest from './getIsRoot';
import climbTest from './climb';
import replaceTest from './replace';
import traverseTest from './traverse';
import findTest from './find';
import filterTest from './filter';
import reduceTest from './reduce';
import cloneTest from './clone';
import mapTest from './map';

export default (t, setup, creator, getData, setData) => {
  constructorTest(t, creator, getData);
  addChildTest(t, creator);
  removeTest(t, creator);
  getIndexTest(t, setup);
  getLevelTest(t, setup);
  getIsLeafTest(t, setup);
  getIsRootTest(t, setup);
  climbTest(t, setup);
  traverseTest(t, setup, getData, setData);
  findTest(t, setup, getData);
  filterTest(t, setup, getData);
  reduceTest(t, setup, getData);
  cloneTest(t, setup, getData, setData);
  mapTest(t, setup, getData, setData);
}
