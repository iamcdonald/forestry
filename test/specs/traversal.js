import test from 'ava';

function getHelperFunctions(Node) {
  const transform = i => node => {
    node.data = i++;
    return i;
  };
  const setup = () => {
    const root = new Node('a');
    root.addChild('a/1', 'a/2');
    root.children[0].addChild('a/1/i');
    return root;
  };
  return {
    transform,
    setup
  };
}

function testBreadthFirst(ctx, traversal, Node) {
  ctx = `${ctx} : breadth first`;
  const { transform, setup } = getHelperFunctions(Node);
  test(`${ctx} : processes nodes in the correct order`, t => {
    const root = setup();
    traversal.processes[traversal.TYPES.BFS](root, transform(0));
    t.is(root.data, 0);
    t.is(root.children[0].data, 1);
    t.is(root.children[1].data, 2);
    t.is(root.children[0].children[0].data, 3);
  });

  test(`${ctx} : halts traversal when passed function returns null`, t => {
    const root = setup();
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

function testDepthFirstPre(ctx, traversal, Node) {
  ctx = `${ctx} : depth first pre`;
  const { transform, setup } = getHelperFunctions(Node);
  test(`${ctx} : processes nodes in the correct order`, t => {
    const root = setup();
    traversal.processes[traversal.TYPES.DFS_PRE](root, transform(0));
    t.is(root.data, 0);
    t.is(root.children[0].data, 1);
    t.is(root.children[0].children[0].data, 2);
    t.is(root.children[1].data, 3);
  });

  test(`${ctx} : halts traversal when passed function returns null`, t => {
    const root = setup();
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

function testDepthFirstPost(ctx, traversal, Node) {
  ctx = `${ctx} : depth first post`;
  const { transform, setup } = getHelperFunctions(Node);
  test(`${ctx} : processes nodes in the correct order`, t => {
    const root = setup();
    traversal.processes[traversal.TYPES.DFS_POST](root, transform(0));
    t.is(root.data, 3);
    t.is(root.children[0].data, 1);
    t.is(root.children[0].children[0].data, 0);
    t.is(root.children[1].data, 2);
  });

  test(`${ctx} : halts traversal when passed function returns null`, t => {
    const root = setup();
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

export default (traversal, Node) => {
  const ctx = 'traversal';
  testBreadthFirst(ctx, traversal, Node);
  testDepthFirstPre(ctx, traversal, Node);
  testDepthFirstPost(ctx, traversal, Node);
};
