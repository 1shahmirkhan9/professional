#!/usr/bin/env node
/**
 * generate-manifest.js
 * ─────────────────────────────────────────────────────────────
 * Scans the current directory for all .html files (excluding
 * index.html itself) and writes a manifest.json that the index
 * page uses to auto-discover and list documents.
 *
 * Usage:
 *   node generate-manifest.js
 *
 * Run this whenever you add or remove HTML files from the repo.
 * Commit manifest.json alongside your HTML files.
 * ─────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

const DIR     = process.cwd();
const OUT     = path.join(DIR, 'manifest.json');
const EXCLUDE = new Set(['index.html']);

// Read all .html files in the directory
const files = fs.readdirSync(DIR)
  .filter(f => /\.html?$/i.test(f) && !EXCLUDE.has(f.toLowerCase()))
  .sort()
  .map(f => {
    const stat = fs.statSync(path.join(DIR, f));
    return {
      file:     f,
      modified: stat.mtime.toISOString()
    };
  });

fs.writeFileSync(OUT, JSON.stringify({ files }, null, 2), 'utf8');

console.log(`✓ manifest.json written — ${files.length} file${files.length !== 1 ? 's' : ''} indexed:`);
files.forEach(f => console.log(`  · ${f.file}  (${new Date(f.modified).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })})`));
