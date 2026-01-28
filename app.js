const form = document.getElementById('nameForm');
const resultArea = document.getElementById('resultArea');
const matchStatus = document.getElementById('matchStatus');
const scoreBadge = document.getElementById('scoreBadge');
const matchDetails = document.getElementById('matchDetails');
const analysisList = document.getElementById('analysisList');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loader = submitBtn.querySelector('.loader');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI Loading State
    setLoading(true);
    resultArea.classList.add('hidden');

    const name1 = document.getElementById('name1').value;
    const name2 = document.getElementById('name2').value;

    try {
        // Use relative URL to work in both development and production
        const response = await fetch('/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name1, name2 })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        console.error('Error:', error);
        // Display user-friendly error message
        resultArea.classList.remove('hidden');
        matchStatus.textContent = "Connection Error";
        matchStatus.style.color = "#EF4444";
        scoreBadge.textContent = "Error";
        analysisList.innerHTML = '<li>Unable to connect to the server. Please ensure the server is running on port 3000.</li>';
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
        btnText.style.display = 'none';
        loader.style.display = 'inline-block';
    } else {
        btnText.style.display = 'inline-block';
        loader.style.display = 'none';
    }
}

function displayResult(data) {
    resultArea.classList.remove('hidden');

    // Update Status
    if (data.match) {
        matchStatus.textContent = "It's a Match!";
        matchStatus.style.color = "#10B981"; // Green
        resultArea.className = "match-success";
    } else {
        matchStatus.textContent = "No Match Found";
        matchStatus.style.color = "#EF4444"; // Red
        resultArea.className = "match-fail";
    }

    // Update Score
    const percentage = Math.round(data.score * 100);
    scoreBadge.textContent = `${percentage}% Confidence`;

    // Update Analysis
    analysisList.innerHTML = '';
    if (data.details && data.details.length > 0) {
        data.details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            analysisList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "No strong token matches found.";
        analysisList.appendChild(li);
    }
}
