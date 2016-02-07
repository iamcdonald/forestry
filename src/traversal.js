const breadthFirstOp = (node, op) => {
	let arr = [node],
		idx = 0,
		i,
		l,
		len = 0;
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

const depthFirstOpPre = (node, op) => {
	var arr = [node],
		i,
		idx = 0;
	while(idx >= 0) {
		node = arr[idx--];
		if (op(node) === null) {
			break;
		}
		for (i = node.children.length; --i >= 0;) {
			arr[++idx] = node.children[i];
		}
	}
}

const depthFirstOpPost = (node, op) => {
	var arr = [node],
		lastParent,
		i,
		idx = 0;
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
