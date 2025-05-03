import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import preserveDirectives from "rollup-preserve-directives";
import autoprefixer from "autoprefixer";

const postcssConfig = {
  plugins: [
    require("@tailwindcss/postcss")({ config: "./tailwind.config.js" }),
    autoprefixer(),
  ],
  extract: true,
  minimize: true,
  sourceMap: true,
  modules: false,
  inject: false,
};

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs.js",
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
        name: "BroToastify",
        sourcemap: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "React",
          vue: "Vue",
          "@angular/core": "ng.core",
          svelte: "Svelte",
          "svelte/store": "SvelteStore",
        },
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
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
        ...postcssConfig,
        extract: "index.css",
        include: ["src/index.css", "src/**/*.css"],
      }),
      preserveDirectives(),
    ],
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "vue",
      "@angular/core",
      "svelte",
      "svelte/store",
    ],
  },
  {
    input: "src/adapters/react/index.ts",
    output: [
      {
        file: "dist/react.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/react.esm.js",
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
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
        ...postcssConfig,
        extract: "react.css",
        include: ["src/index.css", "src/**/*.css"],
      }),
      preserveDirectives(),
    ],
    external: [
      "react",
      "react-dom",
      "vue",
      "@angular/core",
      "svelte",
      "svelte/store",
    ],
  },
  {
    input: "src/adapters/angular/index.ts",
    output: [
      {
        file: "dist/angular.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/angular.esm.js",
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: ["@babel/preset-env", "@babel/preset-typescript"],
        extensions: [".js", ".ts"],
      }),
      terser(),
      postcss({
        ...postcssConfig,
        extract: "angular.css",
        include: ["src/index.css", "src/**/*.css"],
      }),
    ],
    external: [
      "react",
      "react-dom",
      "vue",
      "@angular/core",
      "svelte",
      "svelte/store",
    ],
  },
  {
    input: "src/adapters/vanilla/index.ts",
    output: [
      {
        file: "dist/vanilla.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/vanilla.esm.js",
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: ["@babel/preset-env", "@babel/preset-typescript"],
        extensions: [".js", ".ts"],
      }),
      terser(),
      postcss({
        ...postcssConfig,
        extract: "vanilla.css",
        include: ["src/index.css", "src/**/*.css"],
      }),
    ],
    external: [
      "react",
      "react-dom",
      "vue",
      "@angular/core",
      "svelte",
      "svelte/store",
    ],
  },
];
