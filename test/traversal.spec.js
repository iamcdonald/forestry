import test from 'ava';
import forestry from '../src/forestry';
import * as traversal from '../src/traversal';

const transform = i => node => {
  node.data = i++;
  return i;
};
const setup = t => {
  const root = forestry('a');
  root.addChild('a/1', 'a/2');
  root.children[0].addChild('a/1/i');
  t.is(root.data, 'a');
  t.is(root.children[0].data, 'a/1');
  t.is(root.children[1].data, 'a/2');
  t.is(root.children[0].children[0].data, 'a/1/i');
  return root;
};

function testBreadthFirst(ctx, traversal) {
  ctx = `${ctx}: breadth first`;
  test(`${ctx} : processes nodes in the correct order`, t => {
    const root = setup(t);
    traversal.processes[traversal.TYPES.BFS](root, transform(0));
    t.is(root.data, 0);
    t.is(root.children[0].data, 1);
    t.is(root.children[1].data, 2);
    t.is(root.children[0].children[0].data, 3);
  });

  test(`${ctx} : halts traversal when passed function returns null`, t => {
    const root = setup(t);
    const trans = transform(0);
    traversal.processes[traversal.TYPES.BFS](root, node => {
      if (trans(node) === 3) {
        return null;
      }
    });
    t.is(root.data, 0);
    t.is(root.children[0].data, 1);
    t.is(root.children[1].data, 2);
    t.is(root.children[0].children[0].data, 'a/1/i');
  });
}

function testDepthFirstPre(ctx, traversal) {
  ctx = `${ctx} : depth first pre`;
  test(`${ctx} : processes nodes in the correct order`, t => {
    const root = setup(t);
    traversal.processes[traversal.TYPES.DFS_PRE](root, transform(0));
    t.is(root.data, 0);
    t.is(root.children[0].data, 1);
    t.is(root.children[0].children[0].data, 2);
    t.is(root.children[1].data, 3);
  });

  test(`${ctx} : halts traversal when passed function returns null`, t => {
    const root = setup(t);
    const trans = transform(0);
    traversal.processes[traversal.TYPES.DFS_PRE](root, node => {
      if (trans(node) === 3) {
        return null;
      }
    });
    t.is(root.data, 0);
    t.is(root.children[0].data, 1);
    t.is(root.children[0].children[0].data, 2);
    t.is(root.children[1].data, 'a/2');
  });
}

function testDepthFirstPost(ctx, traversal) {
  ctx = `${ctx} : depth first post`;
  test(`${ctx} : processes nodes in the correct order`, t => {
    const root = setup(t);
    traversal.processes[traversal.TYPES.DFS_POST](root, transform(0));
    t.is(root.data, 3);
    t.is(root.children[0].data, 1);
    t.is(root.children[0].children[0].data, 0);
    t.is(root.children[1].data, 2);
  });

  test(`${ctx} : halts traversal when passed function returns null`, t => {
    const root = setup(t);
    const trans = transform(0);
    traversal.processes[traversal.TYPES.DFS_POST](root, node => {
      if (trans(node) === 3) {
        return null;
      }
    });
    t.is(root.data, 'a');
    t.is(root.children[0].data, 1);
    t.is(root.children[0].children[0].data, 0);
    t.is(root.children[1].data, 2);
  });
}

const ctx = 'traversal';
testBreadthFirst(ctx, traversal);
testDepthFirstPre(ctx, traversal);
testDepthFirstPost(ctx, traversal);
