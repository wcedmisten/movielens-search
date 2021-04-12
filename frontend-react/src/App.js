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
        "Children",
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
      page: 1
    };

    this.getMovies = this.getMovies.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  handleChange(event) {
    this.setState({searchVal: event.target.value});
  }

  search() {
    var url = new URL(`/api/search`, 'http://localhost:8090/')

    var params = {
      search_val:this.state.searchVal,
      min_rating:this.state.sliderValue[0],
      max_rating:this.state.sliderValue[1],
      genres: JSON.stringify(this.state.genres),
      page: this.state.page
    }

    url.search = new URLSearchParams(params).toString();

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          movies: data.results,
          searchCount: data.count
        });
      })
      .catch(console.log);
  }

  handleClearButtonClick() {
    this.searchBar.value = "";
    // use callback to guarantee set is state before searching
    this.setState(
      { searchVal: null },
      this.search
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState(
      { page: 1 },
      this.search
    );
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

  onPageChange(event, page) {
    this.setState(
      { page: page },
      this.search
    );
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
          <MovieList count={Math.ceil(this.state.searchCount / 10 )} page={this.state.page} movies={this.getMovies()} clickHandler={this.updateCurrentMovie} onPageChange={this.onPageChange}></MovieList>
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
