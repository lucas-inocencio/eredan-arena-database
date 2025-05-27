from cv2 import dnn_superres, imread, imwrite, resize
from json import dump, load
import pytesseract
from os import listdir, rename, system
from pathlib import Path

# Super resolution setup
sr = dnn_superres.DnnSuperResImpl_create()
sr.readModel("FSRCNN_x4.pb")
sr.setModel("fsrcnn", 4)

# Download images
for text in listdir('./docs/urls/'):
    folder = text.replace('.txt', '')
    with open(f'./docs/urls/{text}') as file:
        for code in map(str.strip, file):
            url = f"https://i.imgur.com/{code}.png"
            system(f'curl -L "{url}" -o "./img/{folder}/{code}.png"')

# Upscale images
for folder in listdir('./img/'):
    for image in listdir(f'./img/{folder}'):
        if image.endswith('.jpg'):
            rename(f'./img/{folder}/{image}', f'./img/{folder}/{image[:-4]}.png')
        img = imread(f'./img/{folder}/{image}')
        imwrite(f"./upscaled/{image}", resize(sr.upsample(img), (4320, 7111)))

# OCR descriptions
with open('./cards.json') as file:
    data = load(file)
for card in data:
    card.setdefault('strength', '')
    card['description'] = pytesseract.image_to_string(imread(f'./upscaled/{card["filename"]}.png'), lang='eng')
with open('./cards.json', 'w') as file:
    dump(data, file, indent=4)

# Update url txt files
for text in listdir('./docs/urls/'):
    folder = text.replace('.txt', '')
    with open(f'./docs/urls/{text}', 'w') as file:
        file.writelines(f"{img[:-4]}\n" for img in listdir(f'./img/{folder}') if img.endswith('.png'))

# Update cards.json with new images
with open('./cards.json') as file:
    data = load(file)
existing = {card['filename'] for card in data}
for i, image in enumerate(listdir('./upscaled/'), 1):
    fname = image[:-4]
    if fname not in existing:
        data.append({"id": i, "name": "", "guild": "", "class": "", "race": "", "level": 3, "rarity": "", "strength": "", 'filename': fname})
with open('./cards.json', 'w') as file:
    dump(data, file, indent=4)

# Update guilds
def update_cards_with_guilds(json_path, urls_dir):
    with open(json_path) as file:
        data = load(file)
    filename_map = {c['filename']: c for c in data}
    for txt_file in Path(urls_dir).glob("*.txt"):
        folder = txt_file.stem
        with txt_file.open() as file:
            for line in file:
                card = filename_map.get(line.strip())
                if card: card['guild'] = folder
    with open(json_path, 'w') as file:
        dump(data, file, indent=4)
update_cards_with_guilds('./cards.json', './docs/urls/')
