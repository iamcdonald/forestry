import tape from 'tape';
import parse from '../src/parse';

tape('parse', t => {

	t.test(`parses an object to a tree with default settings
		(uses \'children\' as children property and includes all
		other properties as the data of that node)`, t => {
		t.plan(10);
		let obj = {
				name: '1',
				id: 1,
				children: [
					{
						name: '2',
						id: 2,
						children: [
							{
								name: '5',
								id: 5
							},
							{
								name: '6',
								id: 6
							}
						]
					},
					{
						name: '3',
						id: 3,
						children: [
							{
								name: '7',
								id: 7
							}
						]
					},
					{
						name: '4',
						id: 4
					}
				]
			},
			node = parse(obj);

		t.equal(node.data.name, '1');
		t.equal(node.data.id, 1);
		t.equal(node.children.length, 3);
		t.equal(node.children[2].data.name, '4');
		t.equal(node.children[2].data.id, 4);
		t.equal(node.children[1].children[0].data.name, '7');
		t.equal(node.children[1].children[0].data.id, 7);
		node = node.find(n => n.data.name === '5');
		t.equal(node.data.name, '5');
		t.equal(node.data.id, 5);
		t.equal(node.children.length, 0);

	});

	t.test(`parses an object to a tree with default settings
		(exchanges child objects for arrays and places the \'key\'
		on each object in the new array)`, t => {
		t.plan(13);
		let obj = {
				name: '1',
				id: 1,
				children: {
					'one': {
						name: '2',
						id: 2,
						children: {
							'four': {
								name: '5',
								id: 5
							},
							'five': {
								name: '6',
								id: 6
							}
						}
					},
					'two': {
						name: '3',
						id: 3,
						children: {
							'six': {
								name: '7',
								id: 7
							}
						}
					},
					'three': {
						name: '4',
						id: 4
					}
				}
			},
			node = parse(obj);

		t.equal(node.data.name, '1');
		t.equal(node.data.id, 1);
		t.equal(node.children.length, 3);
		t.equal(node.children[0].data.name, '2');
		t.equal(node.children[0].data.id, 2);
		t.equal(node.children[1].data._key, 'two');
		t.equal(node.children[1].children[0].data.name, '7');
		t.equal(node.children[1].children[0].data.id, 7);
		t.equal(node.children[1].children[0].data._key, 'six');
		node = node.find(n => n.data.name === '5');
		t.equal(node.data.name, '5');
		t.equal(node.data.id, 5);
		t.equal(node.data._key, 'four');
		t.equal(node.children.length, 0);

	});

	t.test('parses an object to a tree with different \'children\' property', t => {
		t.plan(10);
		let obj = {
				name: '1',
				id: 1,
				links: [
					{
						name: '2',
						id: 2,
						links: [
							{
								name: '5',
								id: 5
							},
							{
								name: '6',
								id: 6
							}
						]
					},
					{
						name: '3',
						id: 3,
						links: [
							{
								name: '7',
								id: 7
							}
						]
					},
					{
						name: '4',
						id: 4
					}
				]
			},
			node = parse(obj, 'links');

		t.equal(node.data.name, '1');
		t.equal(node.data.id, 1);
		t.equal(node.children.length, 3);
		t.equal(node.children[1].data.name, '3');
		t.equal(node.children[1].data.id, 3);
		t.equal(node.children[1].children[0].data.name, '7');
		t.equal(node.children[1].children[0].data.id, 7);
		node = node.find(n => n.data.name === '5');
		t.equal(node.data.name, '5');
		t.equal(node.data.id, 5);
		t.equal(node.children.length, 0);
	});

	t.test('parses an object to a tree using only property passed in as \'data\' for each node', t => {
		t.plan(6);
		let obj = {
				name: '1',
				id: 1,
				children: [
					{
						name: '2',
						id: 2,
						children: [
							{
								name: '5',
								id: 5
							},
							{
								name: '6',
								id: 6
							}
						]
					},
					{
						name: '3',
						id: 3,
						children: [
							{
								name: '7',
								id: 7
							}
						]
					},
					{
						name: '4',
						id: 4
					}
				]
			},
			node = parse(obj, 'children', 'name');

		t.equal(node.data, '1');
		t.equal(node.children.length, 3);
		t.equal(node.children[1].data, '3');
		t.equal(node.children[1].children[0].data, '7');
		node = node.find(n => n.data === '5');
		t.equal(node.data, '5');
		t.equal(node.children.length, 0);
	});

	t.test('throws an error if object passed in is not of type object', t => {
		t.plan(5);
		t.throws(function () {
			parse([]);
		}, TypeError, 'Passed arg must be of type \'object\'');
		t.throws(function () {
			parse('wrong!');
		}, TypeError, 'Passed arg must be of type \'object\'');
		t.throws(function () {
			parse(123);
		}, TypeError, 'Passed arg must be of type \'object\'');
		t.throws(function () {
			parse(undefined);
		}, TypeError, 'Passed arg must be of type \'object\'');
		t.throws(function () {
			parse(null);
		}, TypeError, 'Passed arg must be of type \'object\'');
	});

	t.test('throws an error if children are neither objects, arrays or null/undefined', t => {
		t.plan(2);
		t.throws(function () {
			parse({
				id: 1,
				children: 'String'
			});
		}, TypeError, '\'Children\' property must point to either Object or Array');
		t.throws(function () {
			parse({
				id: 1,
				children: 12345
			});
		}, TypeError, '\'Children\' property must point to either Object or Array');

	});

	t.test('throws an error if any child is not an object', t => {
		t.plan(2);
		t.throws(function () {
			parse({
				id: 1,
				children: [
					{
						name: 'John'
					},
					1111
				]
			});
		}, TypeError, 'Each child must be of type \'object\'');
		t.throws(function () {
			parse({
				id: 1,
				children: {
					'one': {
						name: 'John'
					},
					'two': 'Jake'
				}
			});
		}, TypeError, 'Each child must be of type \'object\'');
	});

});
