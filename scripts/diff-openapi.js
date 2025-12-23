#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Lightweight OpenAPI diff that works with OpenAPI 3.1 JSON.
 *
 * It focuses on what you need to systematically update the frontend after regenerating:
 * - Added/removed operations (METHOD + path)
 * - Changed operation signatures (operationId, params, requestBody, responses)
 * - Added/removed/changed component schemas
 *
 * Usage:
 *   node ./scripts/diff-openapi.js --before openapi/openapi.before.json --after openapi/openapi.after.json [--limit 200]
 */

const fs = require('fs');

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'];

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function stableStringify(value) {
  return JSON.stringify(sortKeysDeep(value));
}

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = sortKeysDeep(value[key]);
  }
  return out;
}

function toSet(arr) {
  return new Set(arr);
}

function diffSets(before, after) {
  const added = [];
  const removed = [];
  for (const x of after) if (!before.has(x)) added.push(x);
  for (const x of before) if (!after.has(x)) removed.push(x);
  added.sort();
  removed.sort();
  return { added, removed };
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
  }
  return out;
}

function simplifySchema(schema) {
  if (!schema) return null;
  // Favor a stable, small-ish representation.
  if (schema.$ref) return { $ref: schema.$ref };
  return pick(schema, ['type', 'format', 'enum', 'nullable', 'items', 'oneOf', 'anyOf', 'allOf', 'properties', 'required']);
}

function simplifyParameters(params) {
  const safe = Array.isArray(params) ? params : [];
  return safe.map((p) => {
    if (!p) return p;
    if (p.$ref) return { $ref: p.$ref };
    return {
      name: p.name,
      in: p.in,
      required: !!p.required,
      schema: simplifySchema(p.schema),
    };
  });
}

function simplifyRequestBody(requestBody) {
  if (!requestBody) return null;
  if (requestBody.$ref) return { $ref: requestBody.$ref };
  const content = requestBody.content || {};
  const contentTypes = Object.keys(content).sort();
  const simplifiedContent = {};
  for (const ct of contentTypes) {
    simplifiedContent[ct] = {
      schema: simplifySchema(content[ct]?.schema),
    };
  }
  return {
    required: !!requestBody.required,
    content: simplifiedContent,
  };
}

function simplifyResponses(responses) {
  const res = responses || {};
  const codes = Object.keys(res).sort();
  const out = {};
  for (const code of codes) {
    const r = res[code];
    if (!r) continue;
    if (r.$ref) {
      out[code] = { $ref: r.$ref };
      continue;
    }
    const content = r.content || {};
    const contentTypes = Object.keys(content).sort();
    const simplifiedContent = {};
    for (const ct of contentTypes) {
      simplifiedContent[ct] = { schema: simplifySchema(content[ct]?.schema) };
    }
    out[code] = { content: simplifiedContent };
  }
  return out;
}

function extractOperations(spec) {
  const paths = spec?.paths || {};
  const out = new Map(); // key => signature

  for (const path of Object.keys(paths).sort()) {
    const item = paths[path] || {};
    const commonParams = item.parameters;

    for (const method of HTTP_METHODS) {
      if (!item[method]) continue;
      const op = item[method];
      const key = `${method.toUpperCase()} ${path}`;

      const signature = {
        operationId: op.operationId || null,
        tags: Array.isArray(op.tags) ? [...op.tags].sort() : [],
        parameters: simplifyParameters([...(Array.isArray(commonParams) ? commonParams : []), ...(Array.isArray(op.parameters) ? op.parameters : [])]),
        requestBody: simplifyRequestBody(op.requestBody),
        responses: simplifyResponses(op.responses),
      };

      out.set(key, signature);
    }
  }

  return out;
}

function extractSchemas(spec) {
  const schemas = spec?.components?.schemas || {};
  const out = new Map();
  for (const name of Object.keys(schemas).sort()) {
    out.set(name, simplifySchema(schemas[name]));
  }
  return out;
}

function parseArgs(argv) {
  const args = { before: 'openapi/openapi.before.json', after: 'openapi/openapi.after.json', limit: 200 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--before') args.before = argv[++i];
    else if (a === '--after') args.after = argv[++i];
    else if (a === '--limit') args.limit = Number(argv[++i] || '200');
    else if (a === '-h' || a === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

function printList(title, items, limit) {
  if (!items.length) return;
  console.log(title);
  const slice = items.slice(0, limit);
  for (const x of slice) console.log(`  - ${x}`);
  if (items.length > slice.length) console.log(`  ... and ${items.length - slice.length} more`);
  console.log('');
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('Usage: node ./scripts/diff-openapi.js --before <file> --after <file> [--limit 200]');
    process.exit(0);
  }

  const before = readJson(args.before);
  const after = readJson(args.after);

  const beforeOps = extractOperations(before);
  const afterOps = extractOperations(after);

  const beforeOpKeys = toSet([...beforeOps.keys()]);
  const afterOpKeys = toSet([...afterOps.keys()]);
  const { added: addedOps, removed: removedOps } = diffSets(beforeOpKeys, afterOpKeys);

  const changedOps = [];
  for (const key of [...beforeOps.keys()]) {
    if (!afterOps.has(key)) continue;
    const a = stableStringify(beforeOps.get(key));
    const b = stableStringify(afterOps.get(key));
    if (a !== b) changedOps.push(key);
  }
  changedOps.sort();

  const beforeSchemas = extractSchemas(before);
  const afterSchemas = extractSchemas(after);
  const { added: addedSchemas, removed: removedSchemas } = diffSets(toSet([...beforeSchemas.keys()]), toSet([...afterSchemas.keys()]));

  const changedSchemas = [];
  for (const name of [...beforeSchemas.keys()]) {
    if (!afterSchemas.has(name)) continue;
    if (stableStringify(beforeSchemas.get(name)) !== stableStringify(afterSchemas.get(name))) changedSchemas.push(name);
  }
  changedSchemas.sort();

  console.log('=== OpenAPI diff summary ===');
  console.log(`Operations: +${addedOps.length}  -${removedOps.length}  ~${changedOps.length}`);
  console.log(`Schemas:    +${addedSchemas.length}  -${removedSchemas.length}  ~${changedSchemas.length}`);
  console.log('');

  printList('Added operations:', addedOps, args.limit);
  printList('Removed operations:', removedOps, args.limit);
  printList('Changed operations (signature changed):', changedOps, args.limit);

  printList('Added schemas:', addedSchemas, args.limit);
  printList('Removed schemas:', removedSchemas, args.limit);
  printList('Changed schemas:', changedSchemas, args.limit);

  if (!addedOps.length && !removedOps.length && !changedOps.length && !addedSchemas.length && !removedSchemas.length && !changedSchemas.length) {
    console.log('No differences detected (based on operations + component schemas).');
  }
}

main();



