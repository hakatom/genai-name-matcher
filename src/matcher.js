const doubleMetaphone = require('talisman/phonetics/double-metaphone');
const jaroWinkler = require('talisman/metrics/jaro-winkler');

// Tokenize and clean name
function processName(name) {
    if (!name) return [];
    // Replace non-alpha characters with spaces to handle hyphens as separators
    // "El-Vaida" -> "El Vaida" -> ["el", "vaida"]
    return name.toString().toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

// Calculate match score between two tokens
function getTokenScore(token1, token2) {
    if (token1 === token2) return 1.0;

    // Jaro-Winkler Distance
    const jw = jaroWinkler(token1, token2);

    // Phonetic Match
    const codes1 = doubleMetaphone(token1);
    const codes2 = doubleMetaphone(token2);

    let phoneticMatch = false;
    for (const c1 of codes1) {
        if (c1 && codes2.includes(c1)) {
            phoneticMatch = true;
            break;
        }
    }

    if (phoneticMatch) {
        // Lowered phonetic weight to avoid John/Jane false positives
        // John/Jane: Phonetic=1, JW=~0.65 -> 0.3 + 0.455 = 0.755 (No interaction)
        return (0.3 * 1.0) + (0.7 * jw);
    } else {
        return jw;
    }
}

// Global Name Match comparison
function compareNames(name1, name2) {
    let tokens1 = processName(name1);
    let tokens2 = processName(name2);

    if (tokens1.length === 0 || tokens2.length === 0) {
        return { match: false, score: 0, reason: "Empty name(s)" };
    }

    // Phase 1: Direct Token Matching (Greedy)

    const allPairs = [];
    tokens1.forEach((t1, i) => {
        tokens2.forEach((t2, j) => {
            allPairs.push({ i, j, score: getTokenScore(t1, t2), t1, t2 });
        });
    });

    // Sort by score desc to prioritize best matches
    allPairs.sort((a, b) => b.score - a.score);

    let matchedIndices1 = new Set();
    let matchedIndices2 = new Set();
    let totalScore = 0;
    let matchesFound = 0;
    let details = [];

    // Apply strict greedy matching first
    for (const pair of allPairs) {
        // Only accept VERY good matches for the first pass (e.g. Exact or near exact)
        // This allows compound matching to catch "Elvaida" vs "El" + "Vaida"
        if (!matchedIndices1.has(pair.i) && !matchedIndices2.has(pair.j)) {
            if (pair.score > 0.92) {
                matchedIndices1.add(pair.i);
                matchedIndices2.add(pair.j);
                totalScore += pair.score;
                matchesFound++;
                details.push(`${pair.t1} <-> ${pair.t2} (${pair.score.toFixed(2)})`);
            }
        }
    }

    // Phase 2: Compound Matching (Concatenation)

    const tryCompoundMatching = (sourceTokens, targetTokens, matchedSource, matchedTarget) => {
        for (let i = 0; i < sourceTokens.length - 1; i++) {
            if (matchedSource.has(i)) continue;

            for (let j = 0; j < targetTokens.length; j++) {
                if (matchedTarget.has(j)) continue;

                let combined = sourceTokens[i];
                for (let k = i + 1; k < sourceTokens.length; k++) {
                    if (matchedSource.has(k)) break;

                    combined += sourceTokens[k];

                    const score = getTokenScore(combined, targetTokens[j]);
                    if (score > 0.90) { // Strict compound match
                        for (let m = i; m <= k; m++) matchedSource.add(m);
                        matchedTarget.add(j);
                        totalScore += score;
                        matchesFound++;
                        details.push(`[${sourceTokens.slice(i, k + 1).join('+')}] <-> ${targetTokens[j]} (${score.toFixed(2)})`);
                        return true;
                    }
                }
            }
        }
        return false;
    };

    tryCompoundMatching(tokens1, tokens2, matchedIndices1, matchedIndices2);
    tryCompoundMatching(tokens2, tokens1, matchedIndices2, matchedIndices1);

    // Final Cleanup: Loose matching for remaining
    for (const pair of allPairs) {
        if (!matchedIndices1.has(pair.i) && !matchedIndices2.has(pair.j)) {
            // Lower threshold for leftovers, but strict enough to reject John/Jane
            if (pair.score > 0.85) {
                matchedIndices1.add(pair.i);
                matchedIndices2.add(pair.j);
                totalScore += pair.score;
                matchesFound++;
                details.push(`${pair.t1} <-> ${pair.t2} (${pair.score.toFixed(2)})`);
            }
        }
    }

    // Simple approach: Average coverage.
    const coverage1 = matchedIndices1.size / tokens1.length;
    const coverage2 = matchedIndices2.size / tokens2.length;

    const finalScore = (coverage1 + coverage2) / 2;

    const threshold = 0.90; // 90% coverage required
    const match = finalScore >= threshold;

    return {
        match,
        score: finalScore,
        tokens1,
        tokens2,
        details
    };
}

module.exports = { compareNames, processName, getTokenScore };
