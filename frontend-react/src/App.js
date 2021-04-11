import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      currentMovie: null,
      searchVal: "",
    };

    // this.Row = this.Row.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
  }

  // when an item in the list has been clicked, set the state to indicate we want to show it
  // handleClick(Id) {
  //   const clickedMovie = this.state.movies.find((movie) => movie.Id === Id);
  //   this.setState({ currentMovie: clickedMovie });
  // }

  handleChange(event) {
    this.setState({searchVal: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    fetch(`/api/search?search_val=${this.state.searchVal}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ movies: data });
      })
      .catch(console.log);
  }

  clearSearchButton() {
    return (
      <input type="submit" value="Clear" onClick={this.handleClearButtonClick}/>
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
