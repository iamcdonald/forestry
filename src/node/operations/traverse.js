import { TYPES as TRAVERSAL_TYPES, processes as traversalProcesses } from '../../traversal';

const invalidType = type => Object.keys(TRAVERSAL_TYPES).map(key => TRAVERSAL_TYPES[key]).indexOf(type) < 0;

export default (node, op, TRAVERSAL_TYPE = TRAVERSAL_TYPES.DFS_PRE) => {
	if (invalidType(TRAVERSAL_TYPE)) {
		throw new TraversalTypeError();
	}
	traversalProcesses[TRAVERSAL_TYPE](node, op);
}
