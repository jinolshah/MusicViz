import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from collections import defaultdict
import json

yearLyrics = ...  

wordDictionary = {
    1950: defaultdict(int),
    1960: defaultdict(int),
    1970: defaultdict(int),
    1980: defaultdict(int),
    1990: defaultdict(int),
    2000: defaultdict(int),
    2010: defaultdict(int)
}

wordDictionary1 = {
    1950: defaultdict(int),
    1960: defaultdict(int),
    1970: defaultdict(int),
    1980: defaultdict(int),
    1990: defaultdict(int),
    2000: defaultdict(int),
    2010: defaultdict(int)
}

wordDictionary2 = {
    1950: defaultdict(int),
    1960: defaultdict(int),
    1970: defaultdict(int),
    1980: defaultdict(int),
    1990: defaultdict(int),
    2000: defaultdict(int),
    2010: defaultdict(int)
}

wordDictionary3 = {
    1950: defaultdict(int),
    1960: defaultdict(int),
    1970: defaultdict(int),
    1980: defaultdict(int),
    1990: defaultdict(int),
    2000: defaultdict(int),
    2010: defaultdict(int)
}

wordDictionary4 = {
    1950: defaultdict(int),
    1960: defaultdict(int),
    1970: defaultdict(int),
    1980: defaultdict(int),
    1990: defaultdict(int),
    2000: defaultdict(int),
    2010: defaultdict(int)
}

#decade
#total unique words count
#top repeated words count
#
wordMetaInfo = { 
    0.5: defaultdict(int),
    1: defaultdict(int),
    1.5: defaultdict(int),
    2: defaultdict(int)
}
    
musicData = 'Data/tcc_ceds_music.csv'
dfMusic = pd.read_csv(musicData)
yearLyrics = dfMusic.iloc[:, [3, 5]].values

for line in yearLyrics:
    decade = line[0] - line[0] % 10
    words = line[1].split()
    for word in words:
        wordDictionary[decade][word] += 1

for key in wordDictionary:
    sortedDictionary = sorted(wordDictionary[key].items(), key=lambda item: item[1], reverse = True)

    for percent in  wordMetaInfo:
        topWordsCount = int (len(wordDictionary[key]) * (percent/100))
        topWordsCount = int (topWordsCount - topWordsCount % 10)

        if not wordMetaInfo[percent]:
            wordMetaInfo[percent] = []

        wordMetaInfo[percent].append({
            'decade': key,
            'totalWords': len(wordDictionary[key]),
            'topWordsCount': topWordsCount
        })

        if percent == 0.5:
            wordDictionary1[key] = dict(sortedDictionary[:topWordsCount])
            largestRadius = int (topWordsCount / 10)

            count = 0
            for words in wordDictionary1[key]:
                wordDictionary1[key][words] = [wordDictionary1[key][words], largestRadius/0.8]
                count += 1
                largestRadius, count = (largestRadius - 1, 0) if count == 10 else (largestRadius, count)

        elif percent == 1:
            wordDictionary2[key] = dict(sortedDictionary[:topWordsCount])
            largestRadius = int (topWordsCount / 10)

            count = 0
            for words in wordDictionary2[key]:
                wordDictionary2[key][words] = [wordDictionary2[key][words], largestRadius/1]
                count += 1
                largestRadius, count = (largestRadius - 1, 0) if count == 10 else (largestRadius, count)

        elif percent == 1.5:
            wordDictionary3[key] = dict(sortedDictionary[:topWordsCount])
            largestRadius = int (topWordsCount / 10)

            count = 0
            for words in wordDictionary3[key]:
                wordDictionary3[key][words] = [wordDictionary3[key][words], largestRadius/1.3]
                count += 1
                largestRadius, count = (largestRadius - 1, 0) if count == 10 else (largestRadius, count)

        else:
            wordDictionary4[key] = dict(sortedDictionary[:topWordsCount])
            largestRadius = int (topWordsCount / 10)

            count = 0
            for words in wordDictionary4[key]:
                wordDictionary4[key][words] = [wordDictionary4[key][words], largestRadius/1.7]
                count += 1
                largestRadius, count = ((largestRadius - 1), 0) if count == 10 else (largestRadius, count)

with open("Data/wordDistribution1.json", "w") as outfile: 
    outfile.write(json.dumps(wordDictionary1, indent=4))

with open("Data/wordDistribution2.json", "w") as outfile: 
    outfile.write(json.dumps(wordDictionary2, indent=4))

with open("Data/wordDistribution3.json", "w") as outfile: 
    outfile.write(json.dumps(wordDictionary3, indent=4))

with open("Data/wordDistribution4.json", "w") as outfile: 
    outfile.write(json.dumps(wordDictionary4, indent=4))

with open("Data/wordMetaData.json", "w") as outfile: 
    outfile.write(json.dumps(wordMetaInfo, indent=4))

print(0)