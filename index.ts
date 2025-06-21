import type { Plugin } from "vite";

export default function runtimeEnv(): Plugin {
  return {
    name: "runtime-env",
    transform(code: string) {
      const newCode = code.replace(/import\.meta\.env/g, "window.env");

      return newCode;
    },
    transformIndexHtml() {
      const script =
        'import envVars from \'"env.js"; window.env = { ...window.env, ...envVars }';

      return [
        {
          tag: "script",
          attrs: {
            type: "module",
          },
          children: script,
          injectTo: "head",
        },
      ];
    },
  };
}
