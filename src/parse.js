import Node from './Node';

const isObject = obj => (obj instanceof Object) && !(obj instanceof Array);

const createNode = (obj, childrenProp, dataProp) => {
	if (dataProp) {
		return new Node(obj[dataProp]);
	}
  let data = Object.keys(obj)
        .reduce((acc, key) => {
          if (key !== childrenProp) {
            acc[key] = obj[key];
          }
          return acc;
        }, {});
	return new Node(data);
}

const asArray = children => {
  if (!children) {
    return [];
  }
	if (Array.isArray(children)) {
    children.forEach(child => {
      if (!isObject(child)) {
        throw new TypeError('Each child must be of type \'object\'');
      }
    })
		return children;
	}
	if (isObject(children)) {
    return Object.keys(children)
      .map(key => {
        if (!isObject(children[key])) {
					throw new TypeError('Each child must be of type \'object\'');
				}
        let data = children[key];
        data._key = key;
        return data;
      });
	}
	throw new TypeError('\'Children\' property can only be either an Object or Array');
}

const parse = (obj, childrenProp, dataProp) => {

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

export default parse;
