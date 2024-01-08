import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json
import time
import requests
from bs4 import BeautifulSoup

def get_billboard_top_100_for(year):
    billboard_page = f"https://www.billboard.com/charts/year-end/{year}/hot-100-songs/"

    page = requests.get(billboard_page)
    bs_page = BeautifulSoup(page.content, 'html.parser')

    top_100 = bs_page.find('div', {'class': 'chart-results-list'})
    top_100_songs = top_100.find_all('h3', {'class': 'c-title', 'id': 'title-of-a-story'})
    top_100_artists = top_100.find_all('span', {'class': 'c-label'})

    return top_100_songs, top_100_artists

def getBillboard():
    for year in range(2006, 2023):
        songs_this_year = []
        songs, artists = get_billboard_top_100_for(year)
        for i in range(len(songs)):
            songs_this_year.append(songs[i].text.strip() + ' ' + artists[(i*2+1)].text.strip())
        with open(r"billboard.json", "r") as file:
            try:
                billboard_data = json.load(file)
            except:
                billboard_data = {}
            billboard_data[year] = songs_this_year
        with open(r"billboard.json", "w") as file:
            file.write(json.dumps(billboard_data, indent=4))


with open(r"billboard.json", "r") as file:
    billboard_data = json.load(file)
    max_year = int(max(billboard_data.keys()))
    min_billboard_year = int(min(billboard_data.keys()))

with open(r"songs_by_year.json", "r") as file:
    try:
        songs_by_year = json.load(file)
        min_year = int(min(songs_by_year.keys())) + 1
    except:
        min_year = min_billboard_year

print(min_year, ' - ', max_year)

with open(r"secret.json", "r") as file:
    secret = json.load(file)

client_id = secret['CLIENT_ID']
client_secret = secret['CLIENT_SECRET']

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=client_id, client_secret=client_secret), requests_timeout = 60)

def getData():
    songs_all = {}
    artists_all = {}
    albums_all = {}

    for year, songs in billboard_data.items():
        if int(year) < min_year:
            continue
        songs_this_year = []
        for i in range(len(songs)):
            print(year, ' - ', i + 1, ' - ', songs[i])

            time.sleep(0.5)
            
            results = sp.search(songs[i], limit=5, offset=0, type='track', market=None)
            track = results['tracks']['items'][0] 
            track = track if 'karaoke' not in track['album']['name'].lower() and 'karaoke' not in track['artists'][0]['name'].lower() \
                        else results['tracks']['items'][1]

            song = {}

            song['album'] = track['album']['id']

            if track['album']['id'] not in albums_all:
                albums_all[track['album']['id']] = {
                    'name': track['album']['name'],
                    'release_date': track['album']['release_date'],
                    'url': track['album']['external_urls']['spotify'],
                    'image': track['album']['images'][0],
                }

            song['artists'] = []
            for artist in track['artists']:
                song['artists'].append(artist['id'])
                if artist['id'] not in artists_all:
                    artists_all[artist['id']] = {
                        'name': artist['name'],
                        'url': artist['external_urls']['spotify']
                    }

            song['name'] = track['name']
            song['duration'] = track['duration_ms']
            song['explicit'] = track['explicit']
            song['url'] = track['external_urls']['spotify']
            song['popularity'] = track['popularity']
            song['rank'] = i + 1
            song['billboard_year'] = year

            songs_all[track['id']] = song

            songs_this_year.append(track['id'])

        with open(r"songs_by_year.json", "r") as file:
            try:
                curr_data = json.load(file)
            except:
                curr_data = {}
            curr_data[year] = songs_this_year
        with open(r"songs_by_year.json", "w") as file:
            file.write(json.dumps(curr_data, indent=4))


        with open(r"albums.json", "r") as file:
            try:
                curr_data = json.load(file)
            except:
                curr_data = {}
            curr_data.update(albums_all)
        with open(r"albums.json", "w") as file:
            file.write(json.dumps(curr_data, indent=4))


        with open(r"artists.json", "r") as file:
            try:
                curr_data = json.load(file)
            except:
                curr_data = {}
            curr_data.update(artists_all)
        with open(r"artists.json", "w") as file:
            file.write(json.dumps(curr_data, indent=4))


        with open(r"songs.json", "r") as file:
            try:
                curr_data = json.load(file)
            except:
                curr_data = {}
            curr_data.update(songs_all)
        with open(r"songs.json", "w") as file:
            file.write(json.dumps(curr_data, indent=4))

def getSongFeatures():
    with open(r"songs.json", "r") as file:
        all_songs = json.load(file)
    all_songs_keys = list(all_songs.keys())
    num_songs = len(all_songs_keys)
    print(num_songs)

    a = 0
    b = 100 if num_songs >= 100 else num_songs - 1

    while True:
        print(a, b)
        features = sp.audio_features(tracks=all_songs_keys[a:b])
        structured_features = {}

        for i in range(b-a):
            feature = features[i]
            structure = {
                "danceability": feature['danceability'],
                "energy": feature['energy'],
                "key": feature['key'],
                "loudness": feature['loudness'],
                "mode": feature['mode'],
                "speechiness": feature['speechiness'],
                "acousticness": feature['acousticness'],
                "instrumentalness": feature['instrumentalness'],
                "liveness": feature['liveness'],
                "valence": feature['valence'],
                "tempo": feature['tempo'],
                "time_signature": feature['time_signature']
            }
            structured_features[feature['id']] = structure

        with open(r"song_features.json", "r") as file:
            try: 
                curr_data = json.load(file)
            except:
                curr_data = {}
            curr_data.update(structured_features)
        with open(r"song_features.json", "w") as file:
            file.write(json.dumps(curr_data, indent=4))
        
        if b == num_songs:
            break

        a = b
        b = b + 100 if b + 100 <= num_songs else num_songs
        time.sleep(10)

def getArtistData():
    with open(r"artists.json", "r") as file:
        all_artists = json.load(file)
    all_artists_keys = list(all_artists.keys())
    num_artists = len(all_artists_keys)
    print(num_artists)

    a = 0
    b = 50 if num_artists >= 50 else num_artists - 1

    while True:
        print(a, b)
        artists = sp.artists(artists=all_artists_keys[a:b])
        artists = artists['artists']
        structured_artists = {}

        for i in range(b-a):
            artist = artists[i]
            structure = {
                "name": artist['name'],
                "popularity": artist['popularity'],
                "genres": artist['genres'],
                "image": artist['images'][0] if len(artist['images']) > 0 else None,
                "type": artist['type'],
                "followers": artist['followers']['total'],
                "url": artist['external_urls']['spotify']
            }
            structured_artists[artist['id']] = structure

        with open(r"artist_details.json", "r") as file:
            try: 
                curr_data = json.load(file)
            except:
                curr_data = {}
            curr_data.update(structured_artists)
        with open(r"artist_details.json", "w") as file:
            file.write(json.dumps(curr_data, indent=4))
        
        if b == num_artists:
            break

        a = b
        b = b + 50 if b + 50 <= num_artists else num_artists
        time.sleep(10)

# getBillboard()
# getData()
# getSongFeatures()
# getArtistData()