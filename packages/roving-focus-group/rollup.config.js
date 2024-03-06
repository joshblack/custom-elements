import babel from '@rollup/plugin-babel';
import inject from '@rollup/plugin-inject';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import packageJson from './package.json' assert { type: 'json' };

const dependencies = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);
const external = Array.from(dependencies).map((dependency) => {
  return new RegExp(`^${dependency}(/.*)?`);
});

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const basePlugins = [
  resolve({
    extensions,
  }),
  babel({
    extensions,
    exclude: /node_modules/,
    babelHelpers: 'runtime',
    configFile: false,
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: '> 0.25%, not dead',
        },
      ],
    ],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          version: '2023-05',
        },
      ],
      '@babel/plugin-transform-runtime',
    ],
  }),
];

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: ['./src/index.ts', './src/define.ts'],
    external,
    plugins: basePlugins,
    output: {
      dir: './dist',
      format: 'esm',
    },
  },
  {
    input: ['./src/index.ts', './src/define.ts'],
    external,
    plugins: [
      ...basePlugins,
      // Reference:
      // https://github.com/lit/lit/blob/5c8b142552542ffa775b74074b8bd16f427a00fa/rollup-common.js#L260-L276
      inject({
        HTMLElement: ['@lit-labs/ssr-dom-shim', 'HTMLElement'],
        customElements: ['@lit-labs/ssr-dom-shim', 'customElements'],
      }),
      replace({
        preventAssignment: true,
        values: {
          'extends HTMLElement':
            'extends (globalThis.HTMLElement ?? HTMLElement)',
        },
      }),
    ],
    output: {
      dir: './dist/node',
      format: 'esm',
    },
  },
];

export default config;
