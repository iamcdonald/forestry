forestry
===============

A lightweight javascript library for creating and manipulating trees.

## Install

```sh
$ npm install forestry
```

## API

### Forestry.TRAVERSAL_TYPES
An `ENUM` like object that gives consumers access to the traversal types that can be passed into the traverse, find, all and reduce functions.
* *DFS_PRE* - Depth First Pre-order
* *DFS_POST* - Depth First Post-order
* *BFS* - Breadth First

### Forestry.Node
#### Create
Create a node with the given data
```js
var node = new Forestry.Node(data);
```
#### isRoot
Returns `true` if node has no parent and `false` otherwise.
```js
node.isRoot();
```
#### isLeaf
Returns `true` if node has no children and `false` otherwise.
```js
node.isLeaf();
```
#### index
Returns placement of node within parent's children.
```js
node.index();
```
#### level
Returns level of node within tree
```js
node.level();
```
#### remove
Remove's node from tree and returns it.
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
An optional second argument can be given to select a traversal type. If non is given it defaults to depth first pre-order.
```js
node.traverse(function (node) {

});
```
#### find (Type: `Function`, [Type: `Forestry.TRAVERSAL_TYPE`|`String`])
Finds and returns the first node in the tree that the predicate `Function` returns `true` for.
As it utilises the traverse function an optional second argument can be passed to select traversal type.
```js
node.find(function (node) {

});
```
#### all (Type: `Function`, [Type: `Forestry.TRAVERSAL_TYPE`|`String`])
Finds and returns all nodes in the tree that the predicate `Function` returns `true` for.
As it utilises the traverse function an optional second argument can be passed to select traversal type.
```js
node.find(function (node) {

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
*warning* While this makes a clone of the actual tree structure it doesn't clone the data initially used in the creation of the Forestry.Node. Therefore any change to the data will be echoed across both the original and cloned tree.
```js
node.clone();
```

## License

[MIT](http://opensource.org/licenses/MIT) © Iain McDonald
