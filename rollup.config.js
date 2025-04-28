import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      exports: "named",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
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
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
    }),
    terser(),
    postcss({
      extract: true, // Extract CSS to a separate file
      minimize: true, // Minify the CSS
      sourceMap: true, // Generate source maps for CSS
    }),
  ],
};
