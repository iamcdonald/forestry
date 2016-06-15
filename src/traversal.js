function breadthFirstOp(node, op) {
  const arr = [node];
  let idx = 0;
  let i;
  let l;
  let len = 0;
  while (idx <= len) {
    node = arr[idx++];
    if (op(node) === null) {
      break;
    }
    for (i = -1, l = node.children.length; ++i < l;) {
      arr[++len] = node.children[i];
    }
  }
}

function depthFirstOpPre(node, op) {
  const arr = [node];
  let i;
  let idx = 0;
  while (idx >= 0) {
    node = arr[idx--];
    if (op(node) === null) {
      break;
    }
    for (i = node.children.length; --i >= 0;) {
      arr[++idx] = node.children[i];
    }
  }
}

function depthFirstOpPost(node, op) {
  const arr = [node];
  let lastParent;
  let i;
  let idx = 0;
  while (idx >= 0) {
    node = arr[idx];
    if (lastParent === node || node.children.length === 0) {
      --idx;
      lastParent = node.parent;
      if (op(node) === null) {
        break;
      }
      continue;
    }
    for (i = node.children.length; --i >= 0;) {
      arr[++idx] = node.children[i];
    }
  }
}

export const TYPES = {
  BFS: 'BFS',
  DFS_PRE: 'DFS_PRE',
  DFS_POST: 'DFS_POST'
};

export const processes = {
  [TYPES.BFS]: breadthFirstOp,
  [TYPES.DFS_PRE]: depthFirstOpPre,
  [TYPES.DFS_POST]: depthFirstOpPost
};
