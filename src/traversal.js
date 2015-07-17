'use strict';

function breadthFirstOp(node, op) {
	var arr = [node],
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

function depthFirstOpPre(node, op) {
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

function depthFirstOpPost(node, op) {
	var arr = [node],
		lastParent,
		i,
		idx = 0;
	while (idx >= 0) {
		node = arr[idx];
		if (lastParent === node || node.isLeaf()) {
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

var TYPES = {
		BFS: 'BFS',
		DFS_PRE: 'DFS_PRE',
		DFS_POST: 'DFS_POST'
	},
	processes = {};

processes[TYPES.BFS] = breadthFirstOp;
processes[TYPES.DFS_PRE] = depthFirstOpPre;
processes[TYPES.DFS_POST] = depthFirstOpPost;

module.exports = {
	TYPES: TYPES,
	processes: processes
};
