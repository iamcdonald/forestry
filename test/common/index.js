import constructorTest from './constructor';
import addChildrenTest from './addChildren';
import removeTest from './remove';
import getIndexTest from './getIndex';
import getRouteTest from './getRoute';
import getNodeUsingRouteTest from './getNodeUsingRoute';
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
  addChildrenTest(t, creator);
  removeTest(t, creator);
  getIndexTest(t, setup);
  getRouteTest(t, setup);
  getNodeUsingRouteTest(t, setup);
  climbTest(t, setup);
  // replaceTest(t, setup);
  traverseTest(t, setup, getData, setData);
  findTest(t, setup, getData);
  filterTest(t, setup, getData);
  reduceTest(t, setup, getData);
  cloneTest(t, setup, getData, setData);
  mapTest(t, setup, getData, setData);
}
