import React, { Component } from 'react';
import './App.css';

import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {
          name: 'Crazy In Love',
          artist: 'Beyoncé',
          album: 'Dangerously In Love',
          id: '6FRLCMO5TUHTexlWo8ym1W',
          uri: 'spotify:track:5IVuqXILoxVWvWEPm82Jxr'
        },
      ],
      playlistName: 'MyFirstPlaylist',
      playlistTracks: [
        {
          name: 'Crazy In Love',
          artist: 'Beyoncé',
          album: 'Dangerously In Love',
          id: '6FRLCMO5TUHTexlWo8ym1W',
          uri: 'spotify:track:5IVuqXILoxVWvWEPm82Jxr'
        }
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    Spotify.getAccessToken();
  }

  addTrack(track) {
    let newPlaylist = this.state.playlistTracks;
    if (newPlaylist.find(trackInThePlaylist =>
      trackInThePlaylist.id === track.id
    )) {
      return;
    }
    newPlaylist.push(track);
    this.setState({ playlistTracks: newPlaylist });
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks.filter(trackFromPlaylist =>
      trackFromPlaylist.id !== track.id
    );
    this.setState({ playlistTracks: newPlaylist });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
    /*this.setState({ playlistName: name }, () => {
      console.log("New state in ASYNC callback:", this.state.playlistName);
    });*/
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(trackFromPlaylist => {
      return trackFromPlaylist.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({ searchResults: tracks })
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
