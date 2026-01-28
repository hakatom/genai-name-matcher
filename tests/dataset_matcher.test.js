const { compareNames } = require('../src/matcher');
const testData = require('./dataset/names.json');

describe('Name Matcher - Diverse Dataset Tests', () => {
    testData.forEach((data, index) => {
        const { name1, name2, expectedMatch, category } = data;

        test(`[${category}] Should ${expectedMatch ? 'MATCH' : 'NOT match'} "${name1}" vs "${name2}"`, () => {
            const result = compareNames(name1, name2);

            // Helpful error message if test fails
            const errorMsg = `
                Failed Comparison: "${name1}" vs "${name2}"
                Category: ${category}
                Expected Match: ${expectedMatch}
                Actual Match: ${result.match}
                Score: ${result.score}
                Details: ${JSON.stringify(result.details)}
            `;

            if (expectedMatch) {
                expect(result.match).toBe(true);
                // Optional: Check score threshold for expected matches if strictness is needed
                // expect(result.score).toBeGreaterThanOrEqual(0.85); 
            } else {
                expect(result.match).toBe(false);
            }
        });
    });
});
