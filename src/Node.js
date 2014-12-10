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
	var children = this.parent.children;
	this.parent.children = [];
	for(var i = -1, len = children.length; ++i < len;) {
		if (children[i] !== this) {
			this.parent.children[this.parent.children.length] = children[i];
		}
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

Node.prototype.clone = function () {
	var oldNode,
	newNode,
	rootNode = new Node(this.data),
		arr = [[2, rootNode].concat(this.children)],
		len = 0,
			count = 0;
	while(len >= 0) {
		if (arr[len][0] >= arr[len].length) {
			--len;
			continue;
		}
		oldNode = arr[len][arr[len][0]++]; 
		newNode = new Node(oldNode.data);
		arr[len][1].addChild(newNode);
		if (oldNode.children.length) {
			arr[++len] = [2, newNode].concat(oldNode.children);
		}
	}
	return rootNode;	
};

module.exports = Node;

