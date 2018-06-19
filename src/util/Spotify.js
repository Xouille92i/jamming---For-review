const client_ID = 'f9ebd440d21141a4aa21c5a84efb6cd9';
//const clientSecret = 'e9c872526e9245ac851c5ee79914a9d6';
const base_API_URL = 'https://accounts.spotify.com/authorize?';
const REDIRECT_URI = 'http://localhost:3000/'

const authorizationRequest = `${base_API_URL}client_id=${client_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`
let accessToken = '';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log("if it exists:" + accessToken);
      return accessToken;
    } else {
      if (window.location.href.match(/access_token=([^&]*)/)) {
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1]
      }
      console.log("if it does not exists:" + accessToken);
      let expirationTime = window.location.href.match(/expires_in=([^&]*)/);
      console.log("if it does not exists:" + expirationTime);
      if (accessToken === '') {
        window.location.href = authorizationRequest;
      }
      if (expirationTime) {
        window.setTimeout(() => accessToken = accessToken, expirationTime * 1000);
        window.history.pushState('Access Token', null, '/');
      }
      return accessToken;
    }
  },
  search(searchTerm) {
    if (searchTerm) {
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}&limit=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        method: 'GET'
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.tracks.items) {
          let myArray = [];
          myArray = jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
          return myArray;
        } else {
          return [];
        }
      });
    }
  },

  savePlaylist(playlistName, trackURIs) {
    if (playlistName && trackURIs) {
      //let localAccessToken = accessToken;
      //let headers = { 'Authorization': 'Bearer ' + localAccessToken };
      let playlist_ID = '';
      let user_ID = '';

      user_ID = fetch('https://api.spotify.com/v1/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => {
          console.log(networkError.message);
        }).then(jsonResponse => {
          user_ID = jsonResponse.id
          console.log(user_ID);
          return jsonResponse.id;
        }).then(user_ID => {
          playlist_ID = fetch(`https://api.spotify.com/v1/users/${user_ID}/playlists`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            dataType:'json',
            body: JSON.stringify({
              'name': playlistName,
              'public': true
            }),
          }).then(response => {
            return response.json();
          }).then(jsonResponse => {
            return jsonResponse.id;
          }).then(playlist_ID => {
            fetch(`https://api.spotify.com/v1/users/${user_ID}/playlists/${playlist_ID}/tracks/`, {
              method: 'POST',
              body: JSON.stringify({ 'uris': trackURIs }),
              dataType:'json',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }).then(response => {
              return response.json();
            }).then(jsonResponse => {
              playlist_ID = jsonResponse.id;
          });
        });
      });
    } else {
      return;
    }
  }
};

export default Spotify;
