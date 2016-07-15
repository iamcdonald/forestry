import Node from '../../Node';
import Forestry from '../../Forestry';

const shouldWrapData = node => !(node instanceof Node) && !(node instanceof Forestry);

export default (node, children, wrapData) => {
	children = children.map(child => {
		if (shouldWrapData(child)) {
			return wrapData(child, node);
		}
		child.parent = node;
		return child;
	});
	node.setChildren(node.getChildren().concat(children));
}
