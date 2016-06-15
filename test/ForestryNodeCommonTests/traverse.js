import { simpleDataGen } from '../test-utils/dataGen';
import { TYPES as TRAVERSAL_TYPES } from '../../src/traversal';
import test from 'ava';

function getOrderFunctions(setData) {
  return {
    order: i => node => setData(node, i++),
    orderNull: i => l => node => i <= l ? setData(node, i++) : null
  };
}

function testDepthFirstPre(ctx, setup, getData, setData) {
  ctx = `${ctx} : Depth First Pre`;
  const { order, orderNull } = getOrderFunctions(setData);
  test(`${ctx} : uses depth first pre traversal algorithm`, t => {
    const root = setup(simpleDataGen);
    root.traverse(order(0), TRAVERSAL_TYPES.DFS_PRE);
    t.is(getData(root), 0);
    t.is(getData(root.children[0]), 1);
    t.is(getData(root.children[0].children[0]), 2);
    t.is(getData(root.children[0].children[1]), 3);
    t.is(getData(root.children[1]), 4);
  });

  test(`${ctx} : bails if passed function returns null`, t => {
    const root = setup(simpleDataGen);
    const control = setup(simpleDataGen);
    root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_PRE);
    t.is(getData(root), 0);
    t.is(getData(root.children[0]), 1);
    t.is(getData(root.children[0].children[0]), getData(control.children[0].children[0]));
    t.is(getData(root.children[0].children[1]), getData(control.children[0].children[1]));
    t.is(getData(root.children[1]), getData(control.children[1]));
  });
}

function testDepthFirstPost(ctx, setup, getData, setData) {
  ctx = `${ctx} : Depth First Post`;
  const { order, orderNull } = getOrderFunctions(setData);
  test(`${ctx} : uses depth first post traversal algorithm`, t => {
    const root = setup(simpleDataGen);
    root.traverse(order(0), TRAVERSAL_TYPES.DFS_POST);
    t.is(getData(root), 4);
    t.is(getData(root.children[0]), 2);
    t.is(getData(root.children[0].children[0]), 0);
    t.is(getData(root.children[0].children[1]), 1);
    t.is(getData(root.children[1]), 3);
  });

  test(`${ctx} : bails if passed function returns null`, t => {
    const root = setup(simpleDataGen);
    const control = setup(simpleDataGen);
    root.traverse(orderNull(0)(1), TRAVERSAL_TYPES.DFS_POST);
    t.is(getData(root), getData(root));
    t.is(getData(root.children[0]), getData(control.children[0]));
    t.is(getData(root.children[0].children[0]), 0);
    t.is(getData(root.children[0].children[1]), 1);
    t.is(getData(root.children[1]), getData(control.children[1]));
  });
}

function testBreadthFirst(ctx, setup, getData, setData) {
  ctx = `${ctx} : Breadth First`;
  const { order, orderNull } = getOrderFunctions(setData);
  test(`${ctx} : uses breadth first traversal algorithm`, t => {
    const root = setup(simpleDataGen);
    root.traverse(order(0), TRAVERSAL_TYPES.BFS);
    t.is(getData(root), 0);
    t.is(getData(root.children[0]), 1);
    t.is(getData(root.children[0].children[0]), 3);
    t.is(getData(root.children[0].children[1]), 4);
    t.is(getData(root.children[1]), 2);
  });

  test(`${ctx} : bails if passed function returns null`, t => {
    const root = setup(simpleDataGen);
    const control = setup(simpleDataGen);
    root.traverse(orderNull(0)(2), TRAVERSAL_TYPES.BFS);
    t.is(getData(root), 0);
    t.is(getData(root.children[0]), 1);
    t.is(getData(root.children[0].children[0]), getData(control.children[0].children[0]));
    t.is(getData(root.children[0].children[1]), getData(control.children[0].children[1]));
    t.is(getData(root.children[1]), 2);
  });
}

export default (ctx, setup, getData, setData) => {
  ctx = `${ctx} : traverse`;
  const { order } = getOrderFunctions(setData);
  test(`${ctx} : defaults to DFS_PRE`, t => {
    const root = setup(simpleDataGen);
    root.traverse(order(0));
    t.is(getData(root), 0);
    t.is(getData(root.children[0]), 1);
    t.is(getData(root.children[0].children[0]), 2);
    t.is(getData(root.children[0].children[1]), 3);
    t.is(getData(root.children[1]), 4);
  });

  testDepthFirstPre(ctx, setup, getData, setData);
  testDepthFirstPost(ctx, setup, getData, setData);
  testBreadthFirst(ctx, setup, getData, setData);

  test(`${ctx} : throws error if TRAVERSAL_TYPE given does not match one of the possible types`, t => {
    const root = setup(simpleDataGen);
    t.throws(() => root.traverse(order(0), 'WRONG'), /TraversalTypeError/);
  });
};
