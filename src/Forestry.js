(function (root, Node) {
	
	if (typeof module !== 'undefined') {
		module.exports = Node; 
		return;
	} 
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return Node;
		});
		return;
	}
	
	root.Forestry = Node;

}(this, (function () {

	'use strict';

	function breadthFirstSearch(node, id) {
		var arr = [],
			found = null;
		arr.push(node);
		while (arr.length) {
			node = arr.shift();
			if (node.id === id) {
				found = node;
				break;
			}
			arr = arr.concat(node.children);
		}
		return found;
	}

	function depthFirstSearch(node, id) {
		var found = null;
		if (node.id === id) {
			return node;
		}
		for (var i = 0,length = node.children.length; i < length; i++) {
			found = depthFirstSearch(node.children[i], id);
			if (found) {
				break;
			}
		}
		return found;
	}

	var Node = function (id, value) {
		this.id = id;
		this.children = [];
		this.parent = null;
		this.value = value;
	};

	Node.prototype.getRoot = function () {
		var node = this;
		while (node.parent) {
			node = node.parent;
		}
		return node;
	};

	Node.prototype.addChild = function (node) {
		node.parent = this;
		this.children.push(node);
		return this;
	};

	Node.prototype.findNodeById = function (id, BFS) {	
		if (BFS) {
			return breadthFirstSearch(this, id);
		}
		return depthFirstSearch(this, id);
	};

	Node.prototype.map = function (func) {
		if (typeof func !== 'function') {
			return this;
		}
		var copy = new Node(this.id, this.value);
		copy.parent = this.parent;

		for (var i = 0, length = this.children.length; i < length; i++) {
			copy.children.push(this.children[i].map(func));
		}
		return func(copy);
	};

	Node.prototype.reduce = function (acc, func) {
		var node = this,
			arr = [];
		arr.push(node);
		while (arr.length) {
			node = arr.shift();
			acc = func(acc, node);
			arr = arr.concat(node.children);
		}
		return acc;
	};

	return {
		Node: Node
	};

})()));

