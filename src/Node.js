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
	if (!this.parent) {
		return null;
	}
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

Node.prototype.addChild = function () {
	var nodes = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments),
		node;
	for (var i = 0, l = nodes.length; i < l; i++) {
		node = nodes[i];
		if (!(node instanceof Node)) {
			node = new Node(node);
		}
		node.parent = this;
		this.children.push(node);
	}
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

Node.prototype.find = function (term, TRAVERSAL_TYPE) {
	var found = null;
	this.traverse(function (node) {
		if (term(node)) {
			found = node;
			return null;
		}
	}, TRAVERSAL_TYPE);
	return found;
};

Node.prototype.all = function (term, TRAVERSAL_TYPE) {
	var found = [],
	idx = 0;
	this.traverse(function (node) {
		if (term(node)) {
			found[idx++] = node;
		}
	}, TRAVERSAL_TYPE);
	return found;
};

Node.prototype.reduce = function (acc, func, TRAVERSAL_TYPE) {
	this.traverse(function (node) {
		acc = func(acc, node);
	}, TRAVERSAL_TYPE);
	return acc;
};

Node.prototype.filter = function (term) {
	return this.clone().traverse(function (node) {
		if (!term(node)) {
			node.remove();
			node.children.length = 0;
		}
	}, traversal.TYPES.DFS_POST);
};

Node.prototype.map = function (func) {
	var mapped = this.traverse(function (node) {
			node._temp = func(node);
			var isNode = node._temp instanceof Node;
			if (!isNode) {
				if (node._temp !== Object(node._temp)) {
					node._temp = {
						data: node._temp
					};
				}
				node._temp.children = [];
			}
			for (var i = 0, l = node.children.length; i < l; i++) {
				if (isNode) {
					node._temp.addChild(node.children[i]._temp);
				} else {
					node._temp.children.push(node.children[i]._temp);
				}
				delete node.children[i]._temp;
			}
		}, traversal.TYPES.DFS_POST)._temp;
	delete this._temp;
	return mapped;

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
	return this.map(function (node) {
		return new Node(cloneData(node.data, dataCloneFunc));
	});
};

module.exports = Node;
