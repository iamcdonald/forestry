import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      presets: ['es2015-rollup', 'stage-0'],
      babelrc: false
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  exports: 'named',
  format: 'cjs',
  dest: './dist/Forestry.js'
};
