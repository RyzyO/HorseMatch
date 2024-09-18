import requests
from bs4 import BeautifulSoup
import pandas as pd
import logging

# Configure logging
logging.basicConfig(filename='script_log.log', level=logging.INFO, format='%(asctime)s - %(message)s')

# Base URL for silk details page
base_silk_url = 'https://racing.racingnsw.com.au/InteractiveForm/JockeySilkDetails.aspx?ColorID='

def extract_silk_and_horses(color_code):
    silk_url = f"{base_silk_url}{color_code}"
    try:
        response = requests.get(silk_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract silk image URL
        silk_image_tag = soup.find('img', src=True)
        silk_image_url = silk_image_tag['src'] if silk_image_tag else 'N/A'

        # Extract list of horses
        horse_links = soup.find_all('a', href=True)
        horses = []
        for link in horse_links:
            if 'HorseFullForm.aspx' in link['href']:
                horse_name = link.get_text(strip=True)
                horses.append(horse_name)

        return {
            'silk_image': silk_image_url,
            'horses': ', '.join(horses)  # Join horse names with commas
        }

    except Exception as e:
        logging.error(f"Failed to process color code {color_code}: {e}")
        return {
            'silk_image': 'Error',
            'horses': 'Error'
        }

# Define range of color codes (adjust as necessary)
start_code = 10000  # Example start code
end_code = 10100    # Example end code

# List to hold all data
all_data = []

for color_code in range(start_code, end_code + 1):
    color_code_str = str(color_code)
    logging.info(f"Processing color code: {color_code_str}")
    data = extract_silk_and_horses(color_code_str)
    if data['silk_image'] != 'Error':
        logging.info(f"Successfully added data for color code: {color_code_str}")
    all_data.append(data)

# Convert to DataFrame and save to CSV
df = pd.DataFrame(all_data)
df.to_csv('silk_horses_data.csv', index=False)
logging.info('Data saved to silk_horses_data.csv')
print('Data saved to silk_horses_data.csv')
