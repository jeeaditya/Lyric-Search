import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';

import '../../App.css';

class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {},
  };

  componentDidMount() {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`
      )
      .then((res) => {
        //console.log(res.data);
        this.setState({ lyrics: res.data.message.body.lyrics });

        return axios.get(
          `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`
        );
      })
      .then((res) => {
        console.log(res.data);
        this.setState({ track: res.data.message.body.track });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { track, lyrics } = this.state;

    if (
      track === undefined ||
      lyrics === undefined ||
      Object.keys(track).length === 0 ||
      Object.keys(lyrics).length === 0
    ) {
      return <Spinner />;
    } else {
      return (
        <Fragment>
          <Link to='/' className='btn btn-dark btn-sm mb-4'>
            Back
          </Link>
          <div className='card'>
            <h5 className='card-header'>
              <strong>{track.track_name}</strong> By{' '}
              <span className='text-secondary'>
                <i>{track.artist_name}</i>
              </span>
            </h5>
            <div className='card-body lyric'>
              <p className='card-text'>{lyrics.lyrics_body}</p>
            </div>
          </div>

          <ul className='list-group mt-3'>
            <li className='list-group-item'>
              <strong>Album Id:&nbsp;&nbsp;</strong>
              {track.album_id}
            </li>
            <li className='list-group-item'>
              <strong>Song Genre:&nbsp;&nbsp;</strong>
              {track.primary_genres.music_genre_list[0]
                ? track.primary_genres.music_genre_list[0].music_genre
                    .music_genre_name
                : 'N/A'}
            </li>
            <li className='list-group-item'>
              <strong>Explicit Words:&nbsp;&nbsp;</strong>
              {track.explicit === 0 ? 'No' : 'Yes'}
            </li>
            <li className='list-group-item'>
              <strong>Updated Date:&nbsp;&nbsp;</strong>
              {track.updated_time.substr(0, 10)}
            </li>
          </ul>
        </Fragment>
      );
    }
  }
}

export default Lyrics;
