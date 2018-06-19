import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {searchState: ''};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search() {
    this.props.onSearch(this.state.searchState);
    console.log(this.state.searchState);
  }

  handleTermChange(e) {
    let searchTerm = e.target.value;
    if (searchTerm) {
      this.setState({ searchState: searchTerm }, () => {
        this.search();
      });
    }
  }

  render () {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
