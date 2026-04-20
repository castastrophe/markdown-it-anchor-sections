---
description:
alwaysApply: true
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a markdown-it plugin that wraps content in section tags start from a header until the next header of the same level occurs. This facilitates intersection observers identifying when a section of content has left the viewport.

## Tech Stack

- **Node.js**: v24+ (use `nvm use` to switch to the correct version)
- **Package manager**: Yarn

## Commands

```bash
yarn install        # Install dependencies
yarn test          # Run test suite
```

## Architecture

### Code Style

- Tabs for indentation (tabWidth: 4)

## Style Guide

This project follows the **Chicago Manual of Style** with the following project-specific exceptions:

### Capitalization

- **Section titles**: Use sentence case (capitalize only the first word)
    - Correct: "About me", "Experience", "Skills"
    - Incorrect: "About Me", "ABOUT ME"
- **Hyphenated compounds**: Only capitalize the first element
    - Correct: "Front-end"
    - Incorrect: "Front-End"

### Punctuation & Formatting

- **Ampersands**: Use `&` instead of "and" consistently throughout
    - Correct: "scalable web applications & design systems"
    - Incorrect: "scalable web applications and design systems"
- **Numbers**: Prefer numerals over written-out numbers to keep the resume brief and scannable
    - Correct: "12+ years"
    - Incorrect: "twelve-plus years"

### Chicago Style Elements (Retained)

- **Months**: Spell out in full (November, not Nov)
- **Date ranges**: Use en dashes (–) not hyphens (-)
    - Correct: "January 2014–July 2021"
    - Incorrect: "January 2014 - July 2021" or "Jan 2014-Jul 2021"
- **Serial comma**: Use the Oxford comma in lists

## Testing

### Commands

```bash
yarn test              # Run all tests once
yarn test:watch        # Run tests in watch mode
```

### Architecture

Tests live in `test.js` and run via the default node testing tooling.
