'use strict';

var TreeNode = function (path, value, parent) {
	this.path = path;
	this.children = [];
	this.parent = parent || null;
	this.setValue(value);
};

TreeNode.prototype.setValue = function (value) {
	this.value = value;
	this.isFile = !!(this.value && !this.value.isNull());
};

TreeNode.prototype.update = function (node) {
	this.setValue(node.value);
};

TreeNode.prototype.getName = function () {
	var label = '.';
	if (this.parent) {
		label = this.path.replace(this.parent.path + '/', '');
	}
	return label;
};

TreeNode.prototype.getRoot = function () {
	var node = this;
	while (node.parent) {
		node = node.parent;
	}
	return node;
};

TreeNode.prototype.addNodeToTree = function (node) {
	var root = this.getRoot(),
		existingNode = root.findNodeByPath(node.path);
	if (existingNode) {
		existingNode.update(node);
		return;
	}
	root.addChildNode(node);
};

TreeNode.prototype.addChildNode = function (node) {

	if (!node.path.match(this.path)) {
		//cannot add node under current node
		throw new Error();
	}

	//find folder and add file to it
	var path = node.path,
		folderPath = path.replace(/\/?[^\/]*\/?$/, ''),
		parent;

	parent = this.path === folderPath ? this : this.findNodeByPath(folderPath);

	if (!parent) {
		parent = this.addChildNode(new TreeNode(folderPath));
	}
	parent.children.push(node);
	node.parent = parent; 
	return node;
};

TreeNode.prototype.findNodeByPath = function (path) {
	var found = null;
	if (this.path === path) {
		return this;
	}

	this.children.some(function (node) {
		found = node.findNodeByPath(path);
		return !!found;
	});

	return found;
};

TreeNode.prototype.pruneRoot = function () {
	var temp = this;
	while (temp.children.length === 1) {
		temp = temp.children[0];
		temp.parent = null;
	}
	return temp;
};

TreeNode.prototype.map = function (func) {
	var copy = new TreeNode(this.path, this.value, this.parent);

	this.children.forEach(function (node) {
		copy.children.push(node.map(func));
	});

	if (typeof func !== 'function') {
		return copy;
	}
	return func(copy);
};

module.exports = TreeNode;
