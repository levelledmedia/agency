import re

with open('src/pages/index.astro', 'r') as f:
    index_content = f.read()

with open('src/pages/local-seo.astro', 'r') as f:
    local_seo_content = f.read()

# 1. Remove margin-top from split grid
index_content = re.sub(
    r'<div class="split-grid fade-up" style="margin-top: var\(--gap-sm\)">',
    r'<div class="split-grid fade-up">',
    index_content
)

# 2. Change "How we deliver results" to "Learn more about us" and link to "/about"
index_content = index_content.replace(
    '<a href="#" class="btn btn-primary btn-lg">How we deliver results</a>',
    '<a href="/about" class="btn btn-primary btn-lg">Learn more about us</a>'
)

# 3. Move "AI Receptionist" below "Local SEO"
# Extract AI Receptionist Block
ai_regex = r'(\s*<!-- Block AI: Text Left, Visual Right -->.*?</div>\s*</div>\s*</div>\s*)<!-- Block 1: Text Left, Visual Right -->'
ai_match = re.search(ai_regex, index_content, flags=re.DOTALL)
if ai_match:
    ai_block = ai_match.group(1)
    index_content = index_content.replace(ai_block, '') # remove it from current position

    # Find the end of Local SEO block and insert there
    local_seo_regex = r'(<!-- Block 2: Visual.*?(?:<!-- Block 3|</section>))'
    # Wait, need to be careful with regex
    
