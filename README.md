# Vite runtime env

This plugin lets you use environment variables on run-time.

## Options

There are three options

| Name             | Type      | Description                                                    | Default      |
|------------------|-----------|----------------------------------------------------------------|--------------|
| jsFileName       | string    | To set the name of the variables file.                         | 'env'        |
| globalObjectName | string    | To set the name of the global(window) object.                  | 'window'.env |
| injectScript     | boolean   | To enable/disable the script (That loads the config variables) | true         |

## Use

Use it like so. Notice that you can pass the options you want.

```ts
import runtimeEnv from '@jogarcia/vite-plugin-runtime-env'

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [runtimeEnv()],
});
```

When using options

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

## What does it does exactly?

This plugin:

1. Replaces every `import.meta.env` with a `window.env`
2. Injects a script at the head of your HTML that reads a JS file which is expected to contain the runtime variables.

The scripts (by default) expects a js file named `env.js`. And the structure should like this:

```js
export default {
    VITE_SOME_VAR: 123,
    APP_SOME_VAR: 321
}
```
