# Copilot Instructions for GenAI Name Matcher

## Project Overview
This is a client-side web application that implements a name matching algorithm for determining if two names refer to the same person. The app consists of two files: `index.html` (UI) and `app.js` (logic).

## Architecture & Core Logic

### Name Matching Algorithm (`areNamesMatching()`)
- **Core Rule**: Names match if they share at least 2 word parts (case-insensitive)
- **Preprocessing**: Names are lowercased, split by spaces, and empty parts filtered
- **Validation**: Both names must have at least 2 parts to be considered valid
- **Example**: "John Smith" matches "Smith John Michael" (shares "john" and "smith")

### File Structure
- `index.html`: Simple form with two name inputs and result display
- `app.js`: Contains form handling and `areNamesMatching()` function
- No build system, dependencies, or external libraries

## Development Patterns

### DOM Interaction
- Uses vanilla JavaScript with `getElementById()` for element access
- Event handling via `addEventListener('submit', ...)`
- Form submission prevented with `event.preventDefault()`
- Results displayed by directly setting `textContent`

### Code Style
- Function names use camelCase (`areNamesMatching`)
- Variables use descriptive names (`matchCount`, `parts1`, `parts2`)
- Array methods preferred: `split()`, `filter()`, `includes()`, `forEach()`
- Boolean returns for match results

## Testing & Debugging
- Open `index.html` directly in browser (no server required)
- Test algorithm with browser console: `areNamesMatching("test name", "name test")`
- Edge cases to consider: single names, extra spaces, case variations

## Key Constraints
- **No external dependencies**: Pure HTML/JS implementation
- **Client-side only**: No server communication or data persistence
- **Simple UI**: Minimal styling, focus on functionality
- **Algorithm specificity**: 2+ matching parts requirement is core business logic

When modifying this codebase, preserve the simplicity and maintain the core matching algorithm unless explicitly changing requirements.