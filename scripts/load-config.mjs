import ts from "typescript";
import { readFile } from "node:fs/promises";
export async function loadWeddingConfig() {
  const source = await readFile("src/config/wedding.config.ts", "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return (await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`)).weddingConfig;
}
