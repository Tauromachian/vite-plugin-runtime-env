import { describe, it, expect } from "vitest";

import { build } from "vite";

import path from "path";

import runtimeEnv from "..";

describe("vite-plugin-runtime-env", () => {
  const testDir = path.resolve(__dirname, "fixtures");
  const testFile = path.resolve(testDir, "entry.js");

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
  });
});
