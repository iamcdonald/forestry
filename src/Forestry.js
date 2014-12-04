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
	
	function Node(data) {
		this.children = [];
		this.parent = null;
		this.data = data;
	}

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

	function depthFirstOp(node, op) {
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

	Node.prototype.find = function (term, BFS) {	
		var found = null;
		if (BFS) {
			breadthFirstOp(this, function (node) {
				if (term(node)) {
					found = node;
					return null;
				}
			});
			return found;
		}
		depthFirstOp(this, function (node) {
			if (term(node)) {
				found = node;
				return null;
			}
		});
		return found;
	};

	Node.prototype.findAll = function (term, BFS) {
		var found = [],
			idx = 0;
		if (BFS) {
			breadthFirstOp(this, function (node) {
				if (term(node)) {
					found[idx++] = node;
				}
			});
			return found;
		}
		depthFirstOp(this, function (node) {
			if (term(node)) {
				found[idx++] = node;
			}
		});
		return found;
	};
		
	Node.prototype.transform = function (func, BFS) {
		if (BFS) {
			breadthFirstOp(this, function (node) {
				func(node);
			});
			return this;
		}
		depthFirstOp(this, function (node) {
			func(node);
		});
		return this;	
	};
	
	Node.prototype.reduce = function (acc, func, BFS) {
		if (BFS) {
			breadthFirstOp(this, function (node) {
				acc = func(acc, node);
			});
			return acc;
		}
		depthFirstOp(this, function (node) {
			acc = func(acc, node);
		});
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

	return {
		Node: Node
	};

})()));

