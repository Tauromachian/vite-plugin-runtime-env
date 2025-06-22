# Vite runtime env

In some projects you may need to import "environment variables" on runtime.

With this plugin I solve that issue in a simple manner.

## Use

Use it like so:

```ts
import runtimeEnv from '@jogarcia/vite-plugin-runtime-env'

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [runtimeEnv()],
});
```

## What does it does exactly?

This plugin:

1. Replaces every `import.meta.env` with a `window.env`
2. Injects a script at the head of your HTML that reads a JS file which is expected to contain the runtime variables.

## Options

There are three main Options

1. `jsFileName: string`: To set the name of the variables file. It's default is `env`.
2. `gobalObjectName: string`: To set the name of the global(window) object. The default is `env` as in `window.env`
3. `injectScript: boolean`: To enable/disable the script (That loads the config variables). The default is true.

Ex:


```ts
import runtimeEnv from '@jogarcia/vite-plugin-runtime-env'

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    runtimeEnv({
      jsFileName: "config", // Will search for config.js file
      globalObjectName: "iAmBatman", // Will set window.iAmBatman global object
      injectScript: false, // Will disable script
    }),
  ],
});
```
