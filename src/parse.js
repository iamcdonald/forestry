'use strict';

var Node = require('./Node');

function createNode(obj, childrenProp, valueProp) {
	if (valueProp) {
		return new Node(obj[valueProp]);
	}
	var data = {},
		objKeys = Object.keys(obj);
	for (var i = 0, len = objKeys.length; i < len; i++) {
		if (objKeys[i] !== childrenProp) {
			data[objKeys[i]] = obj[objKeys[i]];
		}
	}
	return new Node(data); 
}

function asArray(children) {
	if (children) {
		if (children.constructor === Array) {
			return children;
		}
		if (typeof children === 'object') {
			var childrenArr = [],
				keys = Object.keys(children);
			for(var i = 0, l = keys.length; i < l; i++) {
				if (children.hasOwnProperty(keys[i])) {
					if (typeof children[keys[i]] !== 'object' || children[keys[i]].constructor === Array) {
						throw new TypeError('Each child must be of type \'object\'');
					}
					childrenArr[i] = children[keys[i]];
					childrenArr[i]._key = keys[i];
				}
			}
			return childrenArr;
		}
		throw new TypeError('\'Children\' property can only be either an Object or Array');
	}
	return [];
}

function parse(obj, childrenProp, dataProp) {

	if (typeof obj !== 'object' || obj.constructor === Array) {
		throw new TypeError('Passed arg must be an object');
	}
	var rootNode = createNode(obj, childrenProp, dataProp),
		arr = [[rootNode, obj]],
		len = 1,
		newNode,
		childArr,
		p;
		
	childrenProp = childrenProp || 'children';

	while (len > 0) {
		p = arr[--len];
		childArr = asArray(p[1][childrenProp]);
		for (var i = 0, l = childArr.length; i < l; i++) {
			newNode = createNode(childArr[i], childrenProp, dataProp);
			p[0].addChild(newNode);
			arr[len++] = [newNode, childArr[i]];
		}
	}
	return rootNode;
}

module.exports = parse;
