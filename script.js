document.addEventListener('DOMContentLoaded', function() {
    const restartButton = document.getElementById('restartButton');
    const silkImage = document.getElementById('silkImage');
    const inputField = document.querySelector('input[type="text"]');
    const resultText = document.getElementById('result');
    const streakCounter = document.getElementById('streakCounter');

    let currentSilk = '';
    const silkCodes = [6920, 76067, 96109, 87421, 73244, 76775, 1362, 1416, 98910, 9422, 80802, 97135, 11647, 10690, 36541, 89120, 43939, 1628, 94742];
    let usedSilks = new Set();

    function getRandomSilkCode() {
        let availableCodes = silkCodes.filter(code => !usedSilks.has(code));
        if (availableCodes.length === 0) {
            usedSilks.clear(); // Reset if all codes have been used
            availableCodes = silkCodes;
        }
        const randomIndex = Math.floor(Math.random() * availableCodes.length);
        return availableCodes[randomIndex];
    }

    function generateNewSilk() {
        const code = getRandomSilkCode();
        usedSilks.add(code);

        // Construct the URL with the selected color code
        silkImage.src = `https://racing.racingnsw.com.au/InteractiveForm/JockeySilkDetails.aspx?ColorID=${code}`;
        currentSilk = `ColorID ${code}`; // This should be updated to the actual silk name or ID if available
        resultText.textContent = '';
    }

    function restartGame() {
        streakCounter.textContent = '0'; // Reset streak counter
        inputField.value = ''; // Clear the text box
        generateNewSilk(); // Generate a new silk
    }

    function checkGuess() {
        const userGuess = inputField.value.trim().toLowerCase();
        const correctSilk = currentSilk.toLowerCase(); // Convert to lower case for comparison

        if (userGuess === correctSilk) {
            resultText.textContent = 'Correct!';
            streakCounter.textContent = parseInt(streakCounter.textContent) + 1; // Update streak counter
            inputField.value = ''; // Clear the text box
            generateNewSilk(); // Generate a new silk
        } else {
            resultText.textContent = 'Try again!';
        }
    }

    // Event listener for the restart button
    restartButton.addEventListener('click', restartGame);

    // Add event listener to handle user input
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });

    // Initial setup
    generateNewSilk(); // Generate the first silk on page load
});
