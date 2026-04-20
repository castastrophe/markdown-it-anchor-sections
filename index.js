/**
 * Create anchor sections from markdown headers.
 *
 * This plugin wraps content in section tags start from a header until the next header of the same level occurs.
 * This facilitates intersection observers identifying when a section of content has left the viewport.
 *
 */

/**
 * Get the level of a heading.
 * @param {string} header
 * @returns {number}
 */
function headingLevel(header) {
  return Number.parseInt(String(header).charAt(1));
}

/**
 * Get the last element of an array.
 * @param {Array<T>} arr
 * @returns {T | undefined}
 */
function last(arr) {
  return arr.slice(-1)[0];
}

/**
 * Clean the content of a token.
 * @param {string} content
 * @returns {string}
 */
function cleanContent(content) {
  const stringified = String(content.trim());
  if (stringified.length === 0) return undefined;
  return stringified.toLowerCase()?.replace(/[\.\)\(\]\[\?!\s]/g, '-')?.replace(/[^a-z0-9]+/g, '-')?.replace(/-+/g, '-')?.replace(/^-+|-+$/g, '')?.replace(/-+/g, '-');
}

/**
 * Add anchor sections to the markdown.
 * @param {import('markdown-it').MarkdownIt} md
 * @returns {void}
 */
export default function(md) {

  /**
   * Add sections to the markdown.
   * @param {import('markdown-it').StateCore} state
   * @returns {void}
   */
  function addSections(state) {
    const tokens = [];  // output
    const Token = state.Token;
    const sections = [];
    let nestedLevel = 0;  // level of nesting

    /**
     * Open a section.
     * @param {Object} section
     * @returns {import('markdown-it').Token}
     */
    function openSection(section) {
      const t = new Token('section_open', 'section', 1);
      t.block = true;  // section is a block-level element
      t.attrs = section?.id ? [[ 'id', section?.id ]] : [];
      return t;
    }

    /**
     * Close a section.
     * @returns {import('markdown-it').Token}
     */
    function closeSection() {
      const t = new Token('section_close', 'section', -1);
      t.block = true;
      return t;
    }

    /**
     * Close sections.
     * @param {Object} section
     * @returns {void}
     */
    function closeSections(section) {
      while (last(sections) && section.header <= last(sections).header) {
        sections.pop();
        tokens.push(closeSection());
      }
    }

    /**
     * Close sections to the current nesting level.
     * @param {number} nesting
     * @returns {void}
     */
    function closeSectionsToCurrentNesting(nesting) {
      while (last(sections) && nesting < last(sections).nesting) {
        sections.pop();
        tokens.push(closeSection());
      }
    }

    /**
     * Close all sections.
     * @returns {void}
     */
    function closeAllSections() {
      while (sections.pop()) {
        tokens.push(closeSection());
      }
    }

    for (let i = 0, l = state.tokens.length; i < l; i++) {
      const token = state.tokens[i];

      // record level of nesting
      if (token.type.search('heading') !== 0) {
        nestedLevel += token.nesting;
      }

      // close sections to the current nesting level
      if (last(sections) && nestedLevel < last(sections).nesting) {
        closeSectionsToCurrentNesting(nestedLevel);
      }

      // add sections before headers
      if (token.type == 'heading_open') {
        const idx = token.attrIndex('id');
        let id;
        if (idx >= 0) {
          id = token.attrs[idx][1];
          // Remove the id attribute from the token
          token.attrs.splice(idx, 1);
        }
        if (!id) {
          let content = cleanContent(token.content ?? '');
          if (!content && state.tokens[i+1]?.children) {
            content = '';
            // Iterate through the children of the token
            for (const child of state.tokens[i+1].children) {
              if (child.type == 'text') {
                content += cleanContent(child.content ?? '');
              }
            }

            content = cleanContent(content);
          }

          if (content) id = encodeURIComponent(content);
        }

        // create a section object
        const section = {
          id,
          header: headingLevel(token.tag),
          nesting: nestedLevel,
        };

        // close sections that are older than the current section
        if (last(sections) && section.header <= last(sections).header) {
          closeSections(section);
        }

        // add the section to the output; copy the id from the heading token
        tokens.push(openSection(section));

        // add the section to the list of sections
        sections.push(section);
      }

      tokens.push(token);
    }  // end for every token

    closeAllSections();

    state.tokens = tokens;
  }

  md.core.ruler.push('anchor_sections', addSections);

};
