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
	function breadthFirstSearch(node, func) {
		var arr = [[node]],
		idx = 0,
		intn = 0;
		while (idx < arr.length) {
			node = arr[idx][intn++];
			if (func(node)) {
				return node;
			}
			if (intn >= arr[idx].length) {
				++idx;
				intn = 0;
			}
			if (node.children.length) {
				arr[arr.length] = [].concat(node.children);
			}
		}
		return null;
	}

	function depthFirstSearch(node, func) {
		var arr = [[1, node]],
		len = 0;
		while(len >= 0) {
			if (arr[len][0] >= arr[len].length) {
				--len;
				continue;
			}
			node = arr[len][arr[len][0]++];
			if (func(node)) {
				return node;
			}
			if (node.children.length) {
				arr[++len] = [1].concat(node.children);
			}
		}
		return null;
	}

	function Node(data) {
		this.id = '0';
		this.children = [];
		this.parent = null;
		this.data = data;
	}

	Node.prototype.getRoot = function () {
		var node = this;
		while (node.parent) {
			node = node.parent;
		}
		return node;
	};

	Node.prototype.addChild = function (node) {
		node.parent = this;
		node.id = this.id + '/' + this.children.length;
		this.children.push(node);
		return this;
	};

	Node.prototype.remove = function () {
		var children = this.parent.children;
		this.parent.children = [];
		for(var i = 0, len = children.length; i++ < len;) {
			if (this.parent.children[i].id === this.id) {
				this.parent.children[this.parent.children.length - 1] = children[i];
			}
		}
		return this;
	};

	Node.prototype.find = function (term, BFS) {	
		var func = term;
		if (typeof term === 'string') {
			func = function(node) {
				return node.id === term;
			};
		}
			
		if (BFS) {
			return breadthFirstSearch(this, func, false);
		}
		return depthFirstSearch(this, func, false);
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

	Node.prototype.transform = function (func) {
		var node,
			arr = [[1, this]],
			len = 0,
			count = 0;
		while(len >= 0) {
			if (arr[len][0] >= arr[len].length) {
				--len;
				continue;
			}
			node = arr[len][arr[len][0]++]; 
			node.data = func(node.data);
			if (node.children.length) {
				arr[++len] = [1].concat(node.children);
			}
		}	
		return this;	
	};

	Node.prototype.map = function (func) {
		return this.clone().transform(func);
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

