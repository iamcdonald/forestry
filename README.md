forestry [![Build Status](https://travis-ci.org/iamcdonald/forestry.svg?branch=master)](https://travis-ci.org/iamcdonald/forestry) [![Coverage Status](https://coveralls.io/repos/iamcdonald/forestry/badge.svg?branch=master&service=github)](https://coveralls.io/github/iamcdonald/forestry?branch=master)
===============

A lightweight javascript library for creating and manipulating trees.

## Install

```sh
$ npm install forestry --save     #npm
$ bower install forestry --save   #bower
```

## API

### Forestry.TRAVERSAL_TYPES
An enum like object that gives consumers access to the traversal types that can be passed into the traverse, find, all and reduce functions available on each `Node`.
`Forestry.TRAVERSAL_TYPES.DFS_PRE` - [Depth First Pre-order](http://en.wikipedia.org/wiki/Tree_traversal#Pre-order).  
`Forestry.TRAVERSAL_TYPES.DFS_POST` - [Depth First Post-order](http://en.wikipedia.org/wiki/Tree_traversal#Post-order).  
`Forestry.TRAVERSAL_TYPES.BFS` - [Breadth First](http://en.wikipedia.org/wiki/Tree_traversal#Breadth-first).  
### Forestry.Node
Each node has 'public' parent, data and children properties.  
`node.parent` - the parent node of this node (`undefined` if the node is the root of the tree).  
`node.data` - the data passed into the constructor.  
`node.children` - an array of nodes that are children of this node (empty if the node is a leaf on the tree).
#### Constructor
Create a node with the given data.  
```js
var node = new Forestry.Node(data);
```
#### isRoot
Returns `true` if the node has no parent and `false` otherwise.
```js
node.isRoot;
```
#### isLeaf
Returns `true` if the node has no children and `false` otherwise.
```js
node.isLeaf;
```
#### index
Returns the placement of the node within parent's children.
```js
node.index;
```
#### level
Returns the level of the node within the tree
```js
node.level;
```
#### addChild(Type: `Any` [, val2 [, val3 [, valX]]])
Adds the given Node/s (if the arguments are not of type Node each is first wrapped) as children.
Arguments can be provided as an array or series of arguments.  
Returns the added node.
```js
node.addChild(new Forestry.Node('1'));
node.addChild('some data');
node.addChild([new Forestry.Node({}), 'data']);
node.addChild('some', 'data', new Forestry.Node(12345));
```
#### remove()
Remove's the node from tree and returns it.
```js
node.remove();
```
#### getRoot()
Returns the root node of the tree the node exists in.
```js
node.getRoot();
```
#### climb (Type: `Function`)
Starting from the current node it climbs to the root node passing each node encountered through the given `Function`.
```js
node.climb(function (node) {

});
```
#### traverse (Type: `Function`, [Type `Forestry.TRAVERSAL_TYPE`|`String`])
Traverses the tree passing each node through the given `Function`.  
Traversal can be halted at any point by returning null from the `Function`.  
An optional second argument can be given to select a traversal type.  
If none is given it defaults to depth first pre-order.  
All traversal types are non-recursive.
```js
node.traverse(function (node) {

});
```
#### find (Type: `Function`, [Type: `Forestry.TRAVERSAL_TYPE`|`String`])
Finds and returns the first node in the tree that the predicate `Function` returns `true` for.  
Returns `null` if no nodes match the predicate.  
As it utilises the traverse function an optional second argument can be passed to select traversal type.
```js
node.find(function (node) {

});
```
#### all (Type: `Function`, [Type: `Forestry.TRAVERSAL_TYPE`|`String`])
Finds and returns an array of nodes in the tree that the predicate `Function` returns `true` for.  
Returns an empty array if no nodes match the predicate.  
As it utilises the traverse function an optional second argument can be passed to select traversal type.
```js
node.all(function (node) {

});
```
#### map (Type: `Function`)
Replaces each node with the return value of the passed `Function`. Returns the new 'mapped' tree.  
If the function returns a value of type `Node` already processed child nodes are added using `addChild`.  
If an `Object` is returned a `children` property is added to the object which is then an array populated with already processed child nodes.  
If a `non-object` is returned it is wrapped in an object under a `data` property and processed child nodes are added to a `children` property as above.
```js
node.map(function (node) {

});
```
#### reduce (Type: `Any`, Type: `Function`, [Type: `Forestry.TRAVERSAL_TYPE`|`String`])
Applies a `Function` against an accumulator and each node. Returns the accumulated value.  
As it utilises the traverse function an optional second argument can be passed to select traversal type.
```js
node.reduce(initialValue, function (currentValue, node) {

});
```
#### clone([Type: `Function`])
Returns a clone of the tree.  
While this makes a clone of the actual tree structure it doesn't clone the data initially used in the creation of the `Node` unless the data object has a 'clone' method of it's own or a `Function` is passed in to take care of this (this could be a bespoke function or from another library e.g. lo-dash's clone/cloneDeep fuctions).  
If no data clone function is provided (either as an argument or on each data object) any change to a cloned tree will be local but any change to the `data` property of each node will be echoed across both the cloned and original trees.  
In some cases this may not matter (you may only want to manipulate the tree structure itself).
```js
node.clone();
```

### Forestry(Type: `Object`, [Type: `String`])
Enables the use of the Forestry.Node API on already existing tree data structures.
Any operations that result in modifications to the data structure (addChildren, remove) will be persisted upon the data structure originally passed in.

#### Constructor
Wraps an already existing tree data structure object, the first argument, and returns the root Forestry object.
Rather than parsing the entire tree children of this root node are parsed and wrapped lazily when requested.
The second argument informs the Forestry instance what property children reside under within this data model.

```js
const obj = {
    name: 'Joanne',
    links: [{
      name: 'Jake'
    }, {
      name: 'Jason',
      links: [{
        name: 'Jennifer'
      }]
    }]
  };
const rootNode = Forestry(obj, 'links');
```

## Forestry vs Forestry.Node
Forestry and Forestry.Node have identical API's.
However Forestry is intended to allow the API to be used across already existing tree data structures.
Conversely Forestry.Node is meant for those wishing to use the lib when constructing their own tree data structures.
Whilst the two represent different ways of utilising the API they are interoperable as shown below.

```js
const names1 = {
    name: 'Joanne',
    links: [{
      name: 'Jake'
    }, {
      name: 'Jason',
      links: [{
        name: 'Jennifer'
      }]
    }]
  };
const names2 = {
    name: 'Steve',
    offspring: [{
      name: 'Susan'
    }, {
      name: 'Fredrik'
    }]
  };
const names = Forestry(names1, 'links');
names.addChild(Forestry(names2, 'offspring'), Forestry.Node('James'));
names.
```


## Issues
If you have any issues using this library or if you would like to suggest tweaks or new functionality please don't hesitate to give me a shout.  

## Contribution
* Fork the repository.
* run `npm install` in the project root folder to make sure you have all the dependencies needed.
* run `npm test` which will run eslint on all .js files within the project and run the tests and gather code coverage.

## License

[MIT](http://opensource.org/licenses/MIT) © Iain McDonald
