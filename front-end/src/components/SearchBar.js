import React, { Component } from 'react'

export default class SearchBar extends Component {

  state = {
    query: "",
  }

  handleChange = (e) => {
    this.setState({ query: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let query = e.target.firstElementChild.value
    if (query === "") return
    this.props.search(query)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        <input type="text" onChange={this.handleChange} className="search-input-field" />
        <br />
        <button type="submit" className="search-form-button">Search</button>
      </form>
    )
  }
}
