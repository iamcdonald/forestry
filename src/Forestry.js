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

	function breadthFirstOp(node, op, collect) {
		var arr = [[node]],
			idx = 0,
			intn = 0,
			len,
			rtn = (collect !== undefined),
			collection = [];
		while (idx < (len = arr.length)) {
			node = arr[idx][intn++];
			if (op(node) && rtn) {
				collection[collection.length] = node;
				if (!collect) {
					break;
				}
			}
			if (intn >= arr[idx].length) {
				++idx;
				intn = 0;
			}
			if (node.children.length) {
				arr[len] = [].concat(node.children);
			}
		}
		if (rtn) {
			if (collect) {
				return collection;
			}
			return collection.length ? collection[0] : null;
		}
	}

	function depthFirstOp(node, op, collect) {
		var arr = [[1, node]],
			len = 0,
			rtn = (collect !== undefined),
			collection = [];
		while(len >= 0) {
			if (arr[len][0] >= arr[len].length) {
				--len;
				continue;
			}
			node = arr[len][arr[len][0]++];
			if (op(node) && rtn) {
				collection[collection.length] = node;
				if (!collect) {
					break;	
				}
			}
			if (node.children.length) {
				arr[++len] = [1].concat(node.children);
			}
		}
		if (rtn) {
			if (collect) {
				return collection;
			} 
			return collection.length ? collection[0] : null;
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
		} while (node.parent);
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
			if (children[i].data === this.data) {
				this.parent.children[this.parent.children.length] = children[i];
			}
		}
		return this;
	};

	Node.prototype.find = function (term, BFS) {	
		if (BFS) {
			return breadthFirstOp(this, term, false);
		}
		return depthFirstOp(this, term, false);
	};

	Node.prototype.findAll = function (term, BFS) {
		if (BFS) {
			return breadthFirstOp(this, term, true);
		}
		return depthFirstOp(this, term, true);
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

	Node.prototype.prune = function (op) {
		if (op(this)) {
			return null;
		}
		breadthFirstOp(this, function (node) {
			if (op(node)) {
				node.children = [];
				node.remove();
			}
		});
		return this;
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

