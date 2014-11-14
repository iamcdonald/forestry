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

		function breadthFirstSearch(node, id) {
			var arr = [[node]],
				idx = 0,
				intn = 0;
			while (idx < arr.length) {
				node = arr[idx][intn++];
				if (node.id === id) {
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

		function depthFirstSearch(node, id) {
			var arr = [[1, node]],
				len = 0;
			while(len >= 0) {
				if (arr[len][0] >= arr[len].length) {
					--len;
					continue;
				}
				node = arr[len][arr[len][0]++];
				if (node.id === id) {
					return node;
				}
				if (node.children.length) {
					arr[++len] = [1].concat(node.children);
				}
			}
			return null;
		}

	
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
	
	Node.prototype.mapMut = function (func) {
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
			node.value = func(node.value);
			if (node.children.length) {
				arr[++len] = [1].concat(node.children);
			}
		}	
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

	return {
		Node: Node
	};

})()));

