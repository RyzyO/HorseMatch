const colorCodes = [
    '6920', '76067', '96109', '87421', '73244', '76775', '1362',
    '1416', '98910', '9422', '80802', '97135', '11647', '10690',
    '36541', '89120', '43939', '1628', '94742'
];
let usedCodes = [];
let currentHorses = [];  // Track horses for the current silk
let correctStreak = 0;  // Counter for correct guesses
async function generateRandomSilk() {
    if (usedCodes.length === colorCodes.length) {
        alert('No more new silks available.');
        return;
    }
    const availableCodes = colorCodes.filter(code => !usedCodes.includes(code));
    const randomIndex = Math.floor(Math.random() * availableCodes.length);
    const colorCode = availableCodes[randomIndex];
    usedCodes.push(colorCode);
    const silkImageUrl = `https://www.racingaustralia.horse/JockeySilks/${colorCode}.png`;
    const silkImageElement = document.getElementById('silkImage');
    silkImageElement.src = silkImageUrl;
    silkImageElement.style.display = 'block';  // Show the image
    document.getElementById('result').textContent = '';  // Clear any previous results
    // Fetch horses for the current silk
    const url = `https://racing.racingnsw.com.au/InteractiveForm/JockeySilkDetails.aspx?ColorID=${colorCode}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        // Extract list of horses
        const horseLinks = doc.querySelectorAll('a[href*="HorseFullForm.aspx"]');
        currentHorses = Array.from(horseLinks).map(link => {
            let horseName = link.textContent.trim();
            return horseName.split(' (')[0].toLowerCase(); // Remove text in brackets
        });
    } catch (error) {
        console.error('Error fetching silk details:', error);
        document.getElementById('result').textContent = 'Failed to load silk details.';
    }
}
// Initialize the game with a silk
generateRandomSilk();
// Attach the function to a button click
document.getElementById('generateButton').addEventListener('click', generateRandomSilk);
// Handle form submission
document.getElementById('guessForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const guess = document.getElementById('guessInput').value.trim().toLowerCase();
    
    // Check if the guess is correct
    const isCorrect = currentHorses.some(horse => horse === guess);
    if (isCorrect) {
        correctStreak++;
        document.getElementById('result').textContent = `Correct! Current streak: ${correctStreak}`;
        console.log(`Guess "${guess}" is correct. Streak: ${correctStreak}`);
        // Generate a new silk image after a correct guess
        generateRandomSilk();
    } else {
        correctStreak = 0;  // Reset the counter on incorrect guess
        document.getElementById('result').textContent = 'Incorrect, try again.';
        console.log(`Guess "${guess}" is incorrect. Streak reset.`);
    }
    // Update the streak counter display
    document.getElementById('streakCounter').textContent = `Streak: ${correctStreak}`;
});