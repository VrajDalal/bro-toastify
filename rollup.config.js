import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "BroToastify", // This defines the global variable
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        vue: "Vue",
        "@angular/core": "ng.core",
        svelte: "Svelte",
        "svelte/store": "store", // Add this line
      },
      exports: "named",
    },
  ],
  external: [
    "react",
    "react-dom",
    "vue",
    "@angular/core",
    "svelte",
    "svelte/store",
  ],
  plugins: [
    peerDepsExternal(), // Excludes peer dependencies
    resolve(), // Resolves node_modules dependencies
    commonjs(), // Converts CommonJS modules to ES Modules
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    terser(),
    postcss({
      extract: true, // Extract CSS to a separate file
      minimize: true, // Minify the CSS
      sourceMap: true, // Generate source maps for CSS
    }),
  ],
  external: ['react', 'react-dom', 'lucide-react'],
};
