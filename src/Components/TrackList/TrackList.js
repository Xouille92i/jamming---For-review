import React, { Component } from 'react';
import './TrackList.css';

import Track from '../Track/Track';

let myTrackList = [];

class TrackList extends Component {
  render () {
    if (this.props.tracks) {
      myTrackList = this.props.tracks;
    }
    return (
      <div className="TrackList">
        {myTrackList.map(track => {
          return (
            <Track
              track={track}
              key={track.id}
              onAdd={this.props.onAdd}
              isRemoval={this.props.isRemoval}
              onRemove={this.props.onRemove} />
          )
        })}
      </div>
    );
  }
}

export default TrackList;
