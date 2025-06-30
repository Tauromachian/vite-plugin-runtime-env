import { describe, it, expect } from "vitest";

import { build } from "vite";

import path from "path";

import runtimeEnv from "..";

describe("vite-plugin-runtime-env", () => {
  const testDir = path.resolve(__dirname, "fixtures");
  const testFile = path.resolve(testDir, "entry.js");
  const testHtml = path.resolve(testDir, "index.html");

  describe("transform", () => {
    it("replaces import.meta.env with window.env", async () => {
      const result = await build({
        root: testDir,
        logLevel: "silent",
        plugins: [runtimeEnv()],
        build: {
          write: false,
          rollupOptions: {
            input: testFile,
          },
        },
      });

      const code = (result as any).output[0].code;

      expect(code).toContain("}=window.env");
      expect(code).toContain("window.env.SOME_OTHER_ENV");

      expect(code).to.not.contain("import.meta.env.SOME_OTHER_ENV");
    });

    it("replaces import.meta.env with window.X applying configuration", async () => {
      const result = await build({
        root: testDir,
        logLevel: "silent",
        plugins: [runtimeEnv({ globalObjectName: "lol" })],
        build: {
          write: false,
          rollupOptions: {
            input: testFile,
          },
        },
      });

      const code = (result as any).output[0].code;

      expect(code).toContain("}=window.lol");
      expect(code).toContain("window.lol.SOME_OTHER_ENV");

      expect(code).to.not.contain("import.meta.env.SOME_OTHER_ENV");
    });

    it("Injects the env.js loading script", async () => {
      const result = await build({
        root: testDir,
        logLevel: "silent",
        plugins: [runtimeEnv()],
        build: {
          write: false,
          rollupOptions: {
            input: testHtml,
          },
        },
      });

      expect(result.output[0].source).toContain(
        'import envVars from "./env.js"; window.env = { ...window.env, ...envVars }',
      );
    });

    it("Injects the script with name specified in the config", async () => {
      const result = await build({
        root: testDir,
        logLevel: "silent",
        plugins: [runtimeEnv({ jsFileName: "config" })],
        build: {
          write: false,
          rollupOptions: {
            input: testHtml,
          },
        },
      });

      expect(result.output[0].source).toContain(
        'import envVars from "./config.js"; window.env = { ...window.env, ...envVars }',
      );
    });

    it("Sets the global variables specified in the config", async () => {
      const result = await build({
        root: testDir,
        logLevel: "silent",
        plugins: [runtimeEnv({ globalObjectName: "i_am_batman" })],
        build: {
          write: false,
          rollupOptions: {
            input: testHtml,
          },
        },
      });

      expect(result.output[0].source).toContain(
        'import envVars from "./env.js"; window.i_am_batman = { ...window.i_am_batman, ...envVars }',
      );
    });

    it("Won't inject script if specified in the configuration file", async () => {
      const result = await build({
        root: testDir,
        logLevel: "silent",
        plugins: [runtimeEnv({ injectScript: false })],
        build: {
          write: false,
          rollupOptions: {
            input: testHtml,
          },
        },
      });

      expect(result.output[0].source).to.not.contain(
        'import envVars from "./env.js"; window.env = { ...window.env, ...envVars }',
      );
    });
  });
});
