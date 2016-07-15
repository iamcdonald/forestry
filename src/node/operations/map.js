import traverse from './traverse';
import { TYPES as TRAVERSAL_TYPES } from '../../traversal';
import getIndex from './getIndex';

export default (node, op) => {
	let mapped;
	traverse(node, node => {
		const newNode = op(node);
		if (!node.parent) {
			mapped = newNode;
			return;
		}
		const children = node.parent.getChildren();
		children.splice(getIndex(node), 1, newNode);
		node.parent.setChildren(children);
	}, TRAVERSAL_TYPES.DFS_POST);
	return mapped;
}
