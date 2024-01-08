import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from collections import defaultdict
from collections import OrderedDict

yearLyrics = ...  

genreDictionary = {
    "1950-1960": defaultdict(int),
    "1960-1970": defaultdict(int),
    "1970-1980": defaultdict(int),
    "1980-1990": defaultdict(int),
    "1990-2000": defaultdict(int),
    "2000-2010": defaultdict(int),
    "2010-2020": defaultdict(int)
}
    
musicData = 'Data/tcc_ceds_music.csv'
dfMusic = pd.read_csv(musicData)
yearGenre = dfMusic.iloc[:, [3, 4]].values

for line in yearGenre:
    decadeStart = line[0] - line[0] % 10
    decade = f'{decadeStart}-{decadeStart+10}'
    genre = line[1]
    genreDictionary[decade][genre] += 1

genreList = []
for decade in genreDictionary:
    for genre in genreDictionary[decade]:
        genreList.append(genre)

uniqueGenrelist = pd.Series(genreList).drop_duplicates().tolist()

for decade in genreDictionary:
    for genre in uniqueGenrelist:
        if genre not in genreDictionary[decade].keys():
            genreDictionary[decade][genre] = 0
    genreDictionary[decade] = OrderedDict(sorted(genreDictionary[decade].items()))

with open("Data/genreDistribution.csv", "w") as outfile: 
    # for 
    outfile.write('group,variable,value\n')
    for decade in genreDictionary:
        for genre in genreDictionary[decade]:
            line = f'{decade},{genre},{genreDictionary[decade][genre]}\n'
            outfile.write(line)

print(0)