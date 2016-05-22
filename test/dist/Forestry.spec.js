import 'babel-polyfill';
import forestryTests from '../specs/Forestry';
import nodeTests from '../specs/Node';
import mixedTests from '../specs/mixed';

var Forestry = require('../../dist/Forestry');

forestryTests(Forestry.default);
nodeTests(Forestry.Node);
mixedTests(Forestry.default, Forestry.Node);
