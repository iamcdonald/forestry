forestry
===============

A lightweight javascript library for creating and manipulating trees.

## Install

```sh
$ npm install forestry
```

## API

### Forestry.TRAVERSAL_TYPES
An enum like object that gives consumers access to the traversal types that can be passed into the traverse, find, all and reduce functions.   
`Forestry.TRAVERSAL_TYPES.DFS_PRE` - [Depth First Pre-order](http://en.wikipedia.org/wiki/Tree_traversal#Pre-order).  
`Forestry.TRAVERSAL_TYPES.DFS_POST` - [Depth First Post-order](http://en.wikipedia.org/wiki/Tree_traversal#Post-order).  
`Forestry.TRAVERSAL_TYPES.BFS` - [Breadth First](http://en.wikipedia.org/wiki/Tree_traversal#Breadth-first).  
### Forestry.Node
Each node has 'public' parent, data and children properties.  
`node.parent` - the parent node of this node (`undefined` if the node is the root of the tree).  
`node.data` - the data passed into the constructor.  
`node.children` - an array of nodes that are children of this node (empty if the node is a leaf on the tree).
#### Create
Create a node with the given data.  
```js
var node = new Forestry.Node(data);
```
#### isRoot
Returns `true` if the node has no parent and `false` otherwise.
```js
node.isRoot();
```
#### isLeaf
Returns `true` if the node has no children and `false` otherwise.
```js
node.isLeaf();
```
#### index
Returns the placement of the node within parent's children.
```js
node.index();
```
#### level
Returns the level of the node within the tree
```js
node.level();
```
#### addChild(Type: `Node`)
Adds the given node as a child.  
Returns the added node.
```js
node.addChild(new Forestry.Node());
```
#### remove
Remove's the node from tree and returns it.
```js
node.remove();
```
#### getRoot
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
#### reduce (Type: `Any`, Type: `Function`, [Type: `Forestry.TRAVERSAL_TYPE`|`String`])
Applies a `Function` against an accumulator and each node. Returns the accumulated value.  
As it utilises the traverse function an optional second argument can be passed to select traversal type.
```js
node.reduce(initialValue, function (currentValue, node) {

});
```
#### clone
Returns a clone of the tree.   
*warning* While this makes a clone of the actual tree structure it doesn't clone the data initially used in the creation of the Forestry.Node. 
Therefore any change to the tree will be local but any change to the `data` property of the node will be echoed across both the original and cloned tree.
```js
node.clone();
```
## Contribution
* Fork the repository.
* run `npm install` in the project root folder to make sure you have all the dependencies needed.
* run `npm test` which will run jshint on all .js files within the project and run the tests.

## License

[MIT](http://opensource.org/licenses/MIT) © Iain McDonald
