const { compareNames } = require('../src/matcher');

describe('Name Matcher Logic', () => {

    test('should match exact names', () => {
        const result = compareNames('John Doe', 'John Doe');
        expect(result.match).toBe(true);
        expect(result.score).toBe(1.0);
    });

    test('should match names with different order', () => {
        const result = compareNames('John Doe', 'Doe, John');
        expect(result.match).toBe(true);
        expect(result.score).toBe(1.0);
    });

    test('should match names with simple typos (Phonetic/JW)', () => {
        const result = compareNames('Michael', 'Micheal');
        expect(result.match).toBe(true);
        expect(result.score).toBeGreaterThan(0.95);
    });

    test('should match names with capitalization differences', () => {
        const result = compareNames('john doe', 'JOHN DOE');
        expect(result.match).toBe(true);
        expect(result.score).toBe(1.0);
    });

    test('should match hyphenated vs non-hyphenated names', () => {
        const result = compareNames('Jean-Luc', 'Jean Luc');
        expect(result.match).toBe(true);
        expect(result.score).toBe(1.0);
    });

    test('should match truncated/concatenated compound names', () => {
        const result = compareNames('Doron Elvaida', 'Doron El Vaida');
        expect(result.match).toBe(true);
        // Logic might result in average score ~1.0 if full coverage
        expect(result.score).toBeGreaterThanOrEqual(0.90);
    });

    test('should match concatenated names with hyphens', () => {
        const result = compareNames('Doron Elvaida', 'Doron El-Vaida');
        expect(result.match).toBe(true);
        expect(result.score).toBeGreaterThanOrEqual(0.90);
    });

    test('should NOT match distinct names (John vs Jane)', () => {
        // "John" matching "Jane" is the key false positive we fixed
        const result = compareNames('John Doe', 'Jane Doe');
        expect(result.match).toBe(false);
        // Expect mixed result: "Doe" matches (1.0). "John" vs "Jane" (~0.755).
        // Total score approx (1 + 0.755)/2 = 0.8775. Threshold is 0.9.
        expect(result.score).toBeLessThan(0.92);
    });

    test('should NOT match completely different names', () => {
        const result = compareNames('John Doe', 'Alice Smith');
        expect(result.match).toBe(false);
        expect(result.score).toBeLessThan(0.5);
    });

    test('should handle empty inputs gracefully', () => {
        const result = compareNames('', 'John');
        expect(result.match).toBe(false);
        expect(result.score).toBe(0);
    });
});
