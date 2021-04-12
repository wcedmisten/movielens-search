import './App.css'

import React, { Component } from 'react';
import GenreSelect from './GenreSelect.js';
import RangeSlider from './RangeSlider';
import MovieList from './MovieList.js';
import MovieView from './MovieView.js';

import Grid from '@material-ui/core/Grid';


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

    // bind handlers to this
    this.getMovies = this.getMovies.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  // handler for the search input box
  handleSearchInputChange(event) {
    this.setState({searchVal: event.target.value});
  }

  // function to intiate a search based on current filter/input state
  // updates state.movies for the movie list view
  // and updates searchCount to display appropriate pagination numbers
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

  // handler for the clear button
  handleClearButtonClick() {
    this.searchBar.value = "";
    // use callback to guarantee set is state before searching
    this.setState(
      { searchVal: "" },
      this.search
    );
  }

  // handle the search button to initiate a search starting at page 1
  handleSubmit(event) {
    event.preventDefault();
    this.setState(
      { page: 1 },
      this.search
    );
  }

  // handler for when a movie is clicked from the movie list
  // retrieves and displays details in the movie view
  updateCurrentMovie = (id) => {
    fetch(`/api/movie/${id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ currentMovie: data });
      })
      .catch(console.log);
  }

  // handler for the average score slider filter
  handleSliderChange(event, value) {
    this.setState({sliderValue: value});
  }

  // handler for genre checkboxes
  // modifies the list of enabled genres in state.genres
  handleGenreChange = (event) => {
    let genres = [...this.state.genres];
    if (event.target.checked) {
      genres.push(event.target.name)
    } else {
      genres = genres.filter(item => item !== event.target.name)
    }
    this.setState({genres: genres});
  };

  // return the clear button
  clearSearchButton() {
    return (
      <input type="submit" value="Clear" onClick={this.handleClearButtonClick}/>
    );
  }

  // get the movie search results
  getMovies() {
    return this.state.movies
  }

  // return the searchbar and related filters
  searchBarCondition() {
    return <Grid className="Search" item xs={12} sm={6}>
            <h1>Search Movies</h1>
            <div className="SearchBar">
              <form onSubmit={this.handleSubmit}>
                <label>
                  <input type="text" value={this.state.searchVal} ref={el => this.searchBar = el} onChange={this.handleSearchInputChange} />
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
          </Grid>
  }

  // return the movie list component if appropriate (after a search)
  movieListCondition() {
    if (this.state.movies != null) {
      return <Grid className="MovieList" item xs={12}>
        <MovieList count={Math.ceil(this.state.searchCount / 10 )} page={this.state.page} movies={this.getMovies()} clickHandler={this.updateCurrentMovie} onPageChange={this.onPageChange}></MovieList>
      </Grid>
    }
  }

  // return a movie view component if appropriate (after a search result has been clicked)
  movieViewCondition() {
    if (this.state.currentMovie != null) {
      return <Grid className="MovieView" item xs={12} sm={6}>
          <MovieView movie={this.state.currentMovie}></MovieView>
        </Grid>
    }
  }

  // handler for paginator change
  onPageChange(event, page) {
    this.setState(
      { page: page },
      this.search
    );
  }

  // render every component in a grid layout
  render() {
    return (
      <div>
        <Grid container 
          direction="row"
          alignContent="center"
          alignItems="center"
          justify="center"
          spacing={1}>
          {this.searchBarCondition()}
          {this.movieViewCondition()}
          {this.movieListCondition()}
        </Grid>
      </div>
    );
  }
}

export default App;
