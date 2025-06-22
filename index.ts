import type { Plugin } from "vite";

type RuntimeConfig = {
  jsFileName?: string;
  globalObjectName?: string;
  injectScript?: boolean;
};

export default function runtimeEnv(config?: RuntimeConfig): Plugin {
  config = {
    jsFileName: config?.jsFileName ?? "env.js",
    globalObjectName: config?.globalObjectName ?? "env",
    injectScript: config?.injectScript ?? true,
  };

  return {
    name: "runtime-env",
    transform(code: string) {
      const newCode = code.replace(
        /import\.meta\.env/g,
        `window.${config.globalObjectName}`,
      );

      return newCode;
    },
    transformIndexHtml() {
      if (!config.injectScript) return;

      const script = `import envVars from \'"${config.jsFileName}.js"; window.${config.globalObjectName} = { ...window.env, ...envVars }`;

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
