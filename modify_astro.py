import re

with open('src/pages/index.astro', 'r') as f:
    text = f.read()

with open('src/pages/local-seo.astro', 'r') as f:
    seo = f.read()

# 1. Spacing removal
text = text.replace('<div class="split-grid fade-up" style="margin-top: var(--gap-sm)">', '<div class="split-grid fade-up">')

# 2. Button text and link
text = text.replace('<a href="#" class="btn btn-primary btn-lg">How we deliver results</a>', '<a href="/about" class="btn btn-primary btn-lg">Learn more about us</a>')

# 3. Relocate AI Receptionist
ai_block_start = '    <!-- Block AI: Text Left, Visual Right -->'
block1_start = '    <!-- Block 1: Text Left, Visual Right -->'
block2_start_1 = '    <!-- Block 2: Visual Left, Text Right (Dark bg) -->'
block2_start_2 = '    <!-- Block 2: Visual Left, Text Right (Dark bg) - CSS Animated -->'
block3_start = '    <!-- Block 3: Text Left, Visual Right -->'
css_start = '    /* 3. SEO Local Rank Animation (Search Results) */'
css_end = '    /* AI Receptionist Animation (Chat UI) */'

ai_block_match = re.search(f'({re.escape(ai_block_start)}.*?){re.escape(block1_start)}', text, flags=re.DOTALL)
if ai_block_match:
    ai_block = ai_block_match.group(1)
    text = text.replace(ai_block, '') # Remove it 
    
    # insert below Block 2 (which means right before Block 3)
    # Block 3: Text Left, Visual Right
    # Wait, Block 3 is being removed too, so right before Block 3 or </section>
    # Since we move Block 3 entirely out of index.astro:
    pass

# 4. Extract Block 3 (Our approach) and its CSS
# Extract CSS
css_match = re.search(f'({re.escape(css_start)}.*?){re.escape(css_end)}', text, flags=re.DOTALL)
css_block = ""
if css_match:
    css_block = css_match.group(1).strip()
    # Wait, need to fix the end since it might grab too much or too little if there are trailing newlines
    text = text.replace(css_match.group(1), '')

# Extract Block 3
block3_match = re.search(f'({re.escape(block3_start)}.*?)(?:</section>|    <!-- ============================================================)', text, flags=re.DOTALL)
block3_html = ""
if block3_match:
    block3_html = block3_match.group(1)
    # Remove block 3 from text
    text = text.replace(block3_html, '')

# Now we can insert ai_block at the end of detail-section where block 3 used to be (i.e. before </section>)
if ai_block_match:
    # After removing block 3, the section ends with </section>. Wait, let's insert ai_block right before </section> that ends detail-section.
    # The string to look for is `  </section>\n\n  <!-- ============================================================`
    text = text.replace('  </section>', ai_block + '  </section>', 1) # Wait, there are multiple </section>. Let's do it right:
    # We can just append it if we replace carefully:
    # Actually, we know Block 1 and Block 2 are still there. Block 2 ends before Block 3. Thus, block3_html was right after Block 2. 
    # Since we removed block3_html, we can just place ai_block exactly where block3_html was!
    # No, wait, if we replaced block3_html with empty string, we can just replace it with ai_block!
    pass

# Redo insertion safely:
# Let's read the file again and do it sequentially.
with open('src/pages/index.astro', 'r') as f:
    text = f.read()

# 1 & 2
text = text.replace('<div class="split-grid fade-up" style="margin-top: var(--gap-sm)">', '<div class="split-grid fade-up">')
text = text.replace('<a href="#" class="btn btn-primary btn-lg">How we deliver results</a>', '<a href="/about" class="btn btn-primary btn-lg">Learn more about us</a>')

# Extract CSS and HTML
ai_match = re.search(f'({re.escape(ai_block_start)}.*?){re.escape(block1_start)}', text, flags=re.DOTALL)
ai_html = ai_match.group(1)

css_match = re.search(f'({re.escape(css_start)}.*?){re.escape(css_end)}', text, flags=re.DOTALL)
css_code = css_match.group(1)

block3_match = re.search(f'({re.escape(block3_start)}.*?)(?=  </section>)', text, flags=re.DOTALL)
block3_html = block3_match.group(1)

# Modify index.astro
text = text.replace(ai_html, '')
text = text.replace(css_code, '')
text = text.replace(block3_html, ai_html) # Replace block3 with ai_html! This puts AI receptionist exactly below Block 2

with open('src/pages/index.astro', 'w') as f:
    f.write(text)

# Modify local-seo.astro
# Insert block3_html and css_code into local-seo.astro right below the hero section.
# Hero section ends with:
#        </div>
#
#      </div>
#    </div>
#  </section>

hero_end = '  </section>\n\n  <!-- ============================================================\n       TRUSTED BY — 3 testimonial cards\n  ============================================================ -->'

# Create the styled block3_html
# We need to wrap the CSS in <style> tag since local-seo.astro does not have pageStyles setup in the same way, or does it?
# Yes, BaseLayout takes pageStyles prop! Wait, local-seo.astro does NOT have pageStyles defined. We can just add <style>{css_code}</style> to local-seo.astro or add pageStyles.
# Easiest is to add <style> right before the HTML block.

new_seo_block = f"""
  <style>
{css_code}
  </style>

  <section class="detail-section" id="our-approach">
{block3_html}
  </section>
"""

seo = seo.replace(hero_end, new_seo_block + '\n' + hero_end)

# Remove the duplicated modal from local-seo.astro since it is in BaseLayout now!
modal_regex = r'  <!-- ============================================================\n       FREE WEBSITE MODAL\n  ============================================================ -->.*?</script>'
seo = re.sub(modal_regex, '', seo, flags=re.DOTALL)

with open('src/pages/local-seo.astro', 'w') as f:
    f.write(seo)
