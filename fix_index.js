const fs = require('fs');
const file = 'src/pages/index.astro';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove margin-top
content = content.replace(
  '<div class="split-grid fade-up" style="margin-top: var(--gap-sm)">',
  '<div class="split-grid fade-up">'
);

// 2. Fix button
content = content.replace(
  '<a href="#" class="btn btn-primary btn-lg">How we deliver results</a>',
  '<a href="/about" class="btn btn-primary btn-lg">Learn more about us</a>'
);

// 3. Extract the 4 blocks
const aiBlockStartIndex = content.indexOf('<!-- Block AI: Text Left, Visual Right -->');
const block1StartIndex = content.indexOf('<!-- Block 1: Text Left, Visual Right -->');
const block2StartIndex = content.indexOf('<!-- Block 2: Visual Left, Text Right (Dark bg) -->');
const block3StartIndex = content.indexOf('<!-- Block 3: Text Left, Visual Right -->');
const block3EndIndex = content.indexOf('</section>', block3StartIndex);

if (aiBlockStartIndex === -1 || block1StartIndex === -1 || block2StartIndex === -1 || block3StartIndex === -1) {
  console.log("Blocks not found!");
  process.exit(1);
}

const aiBlock = content.slice(aiBlockStartIndex, block1StartIndex);
const block1 = content.slice(block1StartIndex, block2StartIndex);
const block2 = content.slice(block2StartIndex, block3StartIndex);
const block3 = content.slice(block3StartIndex, block3EndIndex);

// Reorder blocks for index.astro
const newContent = content.slice(0, aiBlockStartIndex) +
  block1 + block2 + aiBlock + content.slice(block3EndIndex);

fs.writeFileSync(file, newContent);

// Save block3 for local-seo.astro
fs.writeFileSync('block3.txt', block3);

console.log("Fixed index.astro");
