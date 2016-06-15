import { TYPES as TRAVERSAL_TYPES } from '../traversal';

const errorMsg = `Traversal type is not valid. It must be one of [${Object.keys(TRAVERSAL_TYPES).map(t => TRAVERSAL_TYPES[t]).join(', ')}].`;

function TraversalTypeError() {
  this.name = 'TraversalTypeError';
  this.message = errorMsg;
}

TraversalTypeError.prototype = Error.prototype;

export default TraversalTypeError;
