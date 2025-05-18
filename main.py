# load json file
import json
import pytesseract
import cv2

pytesseract.pytesseract.tesseract_cmd = r'C:\Arquivos de Programas\Tesseract-OCR\tesseract.exe'
# read image
with open('./cards.json', 'r') as file:
    data = json.load(file)
    # find the card with the same filename
    for card in data:
        if card.get('description', '') != '':
            continue
        else:
            try:
                # read image
                image = cv2.imread('./upscaled/' + card['filename'] + '.png')
                # read text from image
                text = pytesseract.image_to_string(image, lang='eng')
                # create and write in description field
                card['description'] = text
                print(f"\rAdded description for {card['filename']} to data", end=" ")
                # write json file
                with open('./cards.json', 'w') as file:
                    json.dump(data, file, indent=4)
            except Exception as e:
                print(f"\rError processing {card['filename']}: {e}", end=" ")
            finally:
                # print percent
                percent = (data.index(card) + 1) / len(data) * 100
                print(f"\r{percent:.2f}%", end=" ")