// src/packages/utils/get-file.ts
import path from "node:path";

/**
 * Statically scoped to `<project-root>/docs` — the `"docs"` segment is a
 * literal here, not a variable, so Next.js's build tracer can prove the
 * filesystem access is confined to that one folder instead of tracing
 * (and bundling) the entire project. Only pass the filename; nesting a
 * caller-supplied directory back in reintroduces the dynamic-path warning.
 */
const DOCS_DIR = path.join(process.cwd(), "docs");

export const getFilePath = (fileName: string): string =>
  path.join(DOCS_DIR, fileName);
