import reduce from './reduce';
import climb from './climb'

export default (node) => {
	return reduce(node, (root, node) => {
		const clone = node.copy();
		clone.setChildren([]);
		if (!root) {
			return clone;
		}
		const route = climb(node, (node, route) => [node.getIndex()].concat(route), []);
		const parent = route.slice(1, -1)
										.reduce((node, idx) => node.getChildren()[idx], root);
		parent.addChild(clone);
		return root;
	});
}
