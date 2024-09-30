const colorCodes = [
    '6920', '76067', '96109', '87421', '73244',
    '76775', '1362', '1416', '98910', '9422',
    '80802', '97135', '11647', '10690', '36541',
    '89120', '43939', '1628', '94742'
];
let usedCodes = [];
let currentHorses = [];

// Function to generate a random silk
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
    silkImageElement.style.display = 'block';
    document.getElementById('result').textContent = '';

    const url = `https://racing.racingnsw.com.au/InteractiveForm/JockeySilkDetails.aspx?ColorID=${colorCode}`;
    
    try {
        const response = await fetch(url);
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
            return horseName.split(' (')[0].toLowerCase();
        });

        // Display the silk details or a message
        document.getElementById('result').textContent = currentHorses.length > 0
            ? 'Silk details loaded successfully!'
            : 'No horses found for this silk.';
    } catch (error) {
        console.error('Error fetching silk details:', error);
        document.getElementById('result').textContent = 'Failed to load silk details. Trying with a proxy...';

        // Fallback to using a more reliable proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        try {
            const proxyResponse = await fetch(proxyUrl);
            if (!proxyResponse.ok) {
                throw new Error('Network response was not ok from proxy.');
            }
            const proxyData = await proxyResponse.json();
            const proxyDoc = parser.parseFromString(proxyData.contents, 'text/html');

            // Extract list of horses from the proxy response
            const proxyHorseLinks = proxyDoc.querySelectorAll('a[href*="HorseFullForm.aspx"]');
            currentHorses = Array.from(proxyHorseLinks).map(link => {
                let horseName = link.textContent.trim();
                return horseName.split(' (')[0].toLowerCase();
            });

            // Display the silk details or a message
            document.getElementById('result').textContent = currentHorses.length > 0
                ? 'Silk details loaded successfully via proxy!'
                : 'No horses found for this silk via proxy.';
        } catch (proxyError) {
            console.error('Error fetching silk details from proxy:', proxyError);
            document.getElementById('result').textContent = 'Failed to load silk details from both sources.';
        }
    }
}
