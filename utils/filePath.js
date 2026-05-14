import path from "node:path";

export function filePath(baseDir) {
  // Return the calculated path string dynamically so your pipeline can use it
  return path.join(baseDir, "public");
}
