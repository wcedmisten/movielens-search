import './App.css'

import React, { Component } from 'react';
import GenreSelect from './GenreSelect.js';
import RangeSlider from './RangeSlider';
import MovieList from './MovieList.js';
import MovieView from './MovieView.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      currentMovie: null,
      sliderValue: [0.5, 5],
      searchVal: "",
      genres: [
        "Action",
        "Adventure",
        "Animation",
        "Children's",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Fantasy",
        "Film-Noir",
        "Horror",
        "Musical",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Thriller",
        "War",
        "Western"
      ],
    };

    this.getMovies = this.getMovies.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleChange(event) {
    this.setState({searchVal: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    var url = new URL(`/api/search`, 'http://localhost:8090/')

    var params = {
      search_val:this.state.searchVal,
      min_rating:this.state.sliderValue[0],
      max_rating:this.state.sliderValue[1],
      genres: JSON.stringify(this.state.genres)
    }

    url.search = new URLSearchParams(params).toString();

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ movies: data });
      })
      .catch(console.log);
  }

  updateCurrentMovie = (id) => {
    fetch(`/api/movie/${id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ currentMovie: data });
      })
      .catch(console.log);
  }

  handleSliderChange(event, value) {
    this.setState({sliderValue: value});
  }

  handleGenreChange = (event) => {
    let genres = [...this.state.genres];
    if (event.target.checked) {
      genres.push(event.target.name)
    } else {
      genres = genres.filter(item => item !== event.target.name)
    }
    this.setState({genres: genres});
  };

  clearSearchButton() {
    return (
      <input type="submit" value="Clear" onClick={this.handleClearButtonClick}/>
    );
  }

  getMovies() {
    return this.state.movies
  }

  movieViewCondition() {
    if (this.state.currentMovie != null) {
      return <MovieView movie={this.state.currentMovie}></MovieView>
    }
  }

  render() {
    return (
      <div>
        <h1>Search Movies</h1>
        <div className="Search">
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.searchVal} ref={el => this.searchBar = el} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Search" />
            {this.state.searchVal != "" && this.clearSearchButton()}
          </form>
        </div>
        <div className="ScoreRange">
          <RangeSlider handleSliderChange={this.handleSliderChange}></RangeSlider>
        </div>
        <div className="Genres">
          <GenreSelect handleGenreChange={this.handleGenreChange}></GenreSelect>
        </div>
        <div className="MovieList">
          <MovieList movies={this.getMovies()} handler={this.updateCurrentMovie}></MovieList>
        </div>
        {this.movieViewCondition()}
        <pre>state = {JSON.stringify(this.state, undefined, '  ')}</pre>
      </div>
    );
  }

  // componentDidMount() {
  //   fetch('/api/movies').then((res) => {
  //     return res.json();
  //   }).then((res) => {
  //     this.setState({res});
  //   }).catch((err) => {
  //     this.setState({err});
  //   });
  // }
}

export default App;
