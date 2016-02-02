import tape from 'tape';
import Forestry from '../src/Forestry';
import traversal from '../src/traversal';
import parse from '../src/parse';
import Node from '../src/Node';

tape('Forestry', t => {

	t.test('has correct TRAVERSAL_TYPES', t => {
		t.plan(1);
		t.deepEqual(Forestry.TRAVERSAL_TYPES, traversal.TYPES);
	});

	t.test('has reference to parse module', t => {
		t.plan(1);
		t.deepEqual(Forestry.parse, parse);
	});

	t.test('has reference to Node module', t => {
		t.plan(1);
		t.deepEqual(Forestry.Node, Node);
	});

});
