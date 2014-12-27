'use strict';

var traversal = require('./traversal'),
	traversalTypesArr = Object.keys(traversal.processes);

function Node(data) {
	this.children = [];
	this.parent = null;
	this.data = data;
}

Node.prototype.isRoot = function () {
	return !this.parent;
};

Node.prototype.isLeaf = function () {
	return this.children.length === 0;
};

Node.prototype.index = function () {
	for (var i = this.parent.children.length; --i >= 0;) {
		if (this === this.parent.children[i]) {
			return i;
		}
	}
	return null; 
};

Node.prototype.level = function () {
	var level = -1;
	this.climb(function () {
		++level;
	});
	return level;
};

Node.prototype.addChild = function (node) {
	if (!(node instanceof Node)) {
		throw new TypeError('Passed arg must be of type Node');
	}
	node.parent = this;
	this.children.push(node);
	return this;
};

Node.prototype.remove = function () {
	if (!this.isRoot()) {
		var children = this.parent.children;
		this.parent.children = [];
		for(var i = -1, len = children.length; ++i < len;) {
			if (children[i] !== this) {
				this.parent.children[this.parent.children.length] = children[i];
			}
		}
		this.parent = null;
	}
    return this;
};

Node.prototype.getRoot = function () {
	var node = this;
	while (node.parent) {
		node = node.parent;
	}
	return node;
};

Node.prototype.climb = function (op) {
	var node = this;
	do {
		op(node);
	} while ((node = node.parent));
};

Node.prototype.traverse = function (op, traversalType) {
	traversalType = traversalType ? traversalType : traversal.TYPES.DFS_PRE;
	if (traversalTypesArr.indexOf(traversalType) < 0) {
		throw new Error('Traversal type is not valid. It must be one of ' + traversalTypesArr.join(', ') + '.');
	}
	traversal.processes[traversalType](this, op);	
	return this;
};

Node.prototype.find = function (term, BFS) {	
	var found = null;
	this.traverse(function (node) {
		if (term(node)) {
			found = node;
			return null;
		}
	}, BFS);
	return found;
};

Node.prototype.all = function (term, BFS) {
	var found = [],
	idx = 0;
	this.traverse(function (node) {
		if (term(node)) {
			found[idx++] = node;
		}
	}, BFS);
	return found;
};

Node.prototype.reduce = function (acc, func, BFS) {
	this.traverse(function (node) {
		acc = func(acc, node);
	}, BFS);
	return acc;
};

function cloneData(data, cloneFunc) {
	if (typeof data.clone === 'function') {
		return data.clone();
	}
	if (cloneFunc) {
		return cloneFunc(data);
	}
	return data;
}

Node.prototype.clone = function (dataCloneFunc) {
	var rootNode = new Node(cloneData(this.data, dataCloneFunc)),
		arr = [[rootNode, this]],
		len = 1,
		newNode,
		childArr,
		p;
		
	while (len > 0) {
		p = arr[--len];
		childArr = p[1].children;
		for (var i = 0, l = childArr.length; i < l; i++) {
			newNode = new Node(cloneData(childArr[i].data, dataCloneFunc));
			p[0].addChild(newNode);
			arr[len++] = [newNode, childArr[i]];
		}
	}
	return rootNode;
};

module.exports = Node;

