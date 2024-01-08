import json

# Opening JSON file
f = open('/content/drive/MyDrive/Fall 2023/CS 4630/Copy of songs.json')
 
# returns JSON object as 
# a dictionary
data = json.load(f)
song_names = []

# Iterating through the json list and store them in a list
for i in data:
    song_names.append(data[i]['name'])

# save it into a text file
with open('songs.txt', 'w') as file:
  file.write('\n'.join(song_names))