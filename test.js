import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";

import { minify } from "html-minifier";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import anchorSections from "./index.js";

const minifyOptions = { collapseWhitespace: true };

/**
 * Clean the result and expected strings for comparison.
 * @param {string} result - The result string to clean.
 * @param {string} expected - The expected string to clean.
 * @returns {void}
 */
function cleanCompare(result, expected) {
	assert.equal(minify(result, minifyOptions), minify(expected, minifyOptions));
}

const md = markdownIt().use(markdownItAttrs).use(anchorSections);

describe("markdown-it-anchor-sections", () => {
	it("should add sections to headers", () => {
    const expected = `<section id="header"><h1>header</h1><p>lorem</p></section>`;
		const result = md.render(`
# header
lorem
`);

		cleanCompare(result, expected);
	});

	it("should maintain header attributes from other plugins", () => {
		const expected = `<section id="header"><h1 class="red">header</h1><p>lorem</p></section>`;
		const result = md.render(`
# header {.red}
lorem
`);

		cleanCompare(result, expected);
	});

	it("should close sections when a new header is of same or lower level", () => {
		const expected = `<section id="asdf"><h2>asdf</h2><p>lorem</p></section><section id="fdsa"><h2>fdsa</h2><p>ipsum</p></section>`;
		const result = md.render(`
## asdf
lorem

## fdsa
ipsum
`);
		cleanCompare(result, expected);
	});

	it("should nest sections", () => {
		const expected = `
<section id="header-1">
  <h1>Header 1</h1>
  <p>Text.</p>
  <section id="header-2">
    <h3>Header 2</h3>
    <p>Lorem?</p>
  </section>
  <section id="header-3">
    <h2>Header 3</h2>
    <p>Ipsum.</p>
  </section>
</section>
<section id="last-header">
  <h1>Last header</h1>
  <p>Markdown rules!</p>
</section>`;
		const result = md.render(`
# Header 1
Text.
### Header 2
Lorem?
## Header 3
Ipsum.
# Last header
Markdown rules!
`);
		cleanCompare(result, expected);
	});

	it("should parse incorrect order of headers", () => {
		const expected = `
<section id="header-4">
  <h4>Header 4</h4>
  <p>Text.</p>
</section>
<section id="header-3">
  <h3>Header 3</h3>
  <p>Hello!</p>
</section>`;

		const result = md.render(`
#### Header 4
Text.
### Header 3
Hello!
`);
		cleanCompare(result, expected);
	});
	it("should handle sections in list", () => {
		const expected = `
<ul>
  <li>foo
    <section id="header-2">
      <h3>Header 2</h3>
      Lorem?
    </section>
  </li>
  <li>bar
    <section id="last-header">
      <h2>Last header</h2>
      Markdown rules!
    </section>
  </li>
</ul>`;
		const result = md.render(`
- foo
  ### Header 2
  Lorem?
- bar
  ## Last header
  Markdown rules!
`);

		cleanCompare(result, expected);
	});

	it("should close sections when a new header is of same level", () => {
		const expected = `
<section id="asdf">
  <h3>asdf</h3>
  <p>lorem</p>
</section>
<section id="fdsa">
  <h3>fdsa</h3>
  <p>ipsum</p>
</section>
`;
		const result = md.render(`
### asdf
lorem

### fdsa
ipsum
`);
		cleanCompare(result, expected);
	});

	it("should move, not copy, ID from header", () => {
		const expected = `
<section id="asdf">
  <h1>asdf</h1>
  <p>qwerty</p>
</section>
`;
		const result = md.render(`
# asdf {#asdf}
qwerty
`);

		cleanCompare(result, expected);
	});
});
