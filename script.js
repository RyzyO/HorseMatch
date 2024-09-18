document.addEventListener('DOMContentLoaded', function() {
    const restartButton = document.getElementById('restartButton');
    const silkImage = document.getElementById('silkImage');
    const inputField = document.querySelector('input[type="text"]');
    const resultText = document.getElementById('result');
    const streakCounter = document.getElementById('streakCounter');

    let currentSilk = '';

    // Function to generate a new silk
    function generateNewSilk() {
        // Implement the logic to fetch and display a new silk
        // For now, setting a placeholder image
        silkImage.src = 'path/to/new/silk/image.jpg'; // Update with actual image URL
        currentSilk = 'Name of the new silk'; // Update with actual silk name
        resultText.textContent = '';
    }

    // Function to clear the text box and reset the streak
    function restartGame() {
        streakCounter.textContent = '0'; // Reset streak counter
        inputField.value = ''; // Clear the text box
        generateNewSilk(); // Generate a new silk
    }

    // Event listener for the restart button
    restartButton.addEventListener('click', restartGame);

    // Function to handle user guesses
    function checkGuess() {
        const userGuess = inputField.value.trim().toLowerCase();
        const correctSilk = currentSilk.toLowerCase(); // Convert to lower case for comparison

        if (userGuess === correctSilk) {
            resultText.textContent = 'Correct!';
            // Update streak counter
            streakCounter.textContent = parseInt(streakCounter.textContent) + 1;
            inputField.value = ''; // Clear the text box
            generateNewSilk(); // Generate a new silk
        } else {
            resultText.textContent = 'Try again!';
        }
    }

    // Add event listener to handle user input
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });

    // Initial setup
    generateNewSilk(); // Generate the first silk on page load
});
