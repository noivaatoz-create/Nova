// Use built server for Vercel - source import fails in serverless
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const handler = require("../dist/index.cjs").default;
export default handler;
