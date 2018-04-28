import React from 'react'
import { Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Bookshelf from './Bookshelf'

class BookSearch extends React.Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    onUpdateShelf: PropTypes.func.isRequired,
    onType: PropTypes.func.isRequired,
  }
  state = {
    query: ''
  }
  updateQuery = (query) => {
    query.length > 2 ? (this.props.onType(query)) : (this.props.cleanSearch())
    return this.setState(() => ({
      query: query
    }))
  }
  clearQuery = () => {
    this.updateQuery('')
  }
  render() {
    const { query } = this.state
    const { books, onUpdateShelf, onType, error } = this.props
    return (
          <div className="search-books">
            <div className="search-books-bar">
              <Link
              to='/'
              className="close-search"
              >Close</Link>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={query}
                  onChange={(e) => this.updateQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              { books.length > 0 && !error && (<Bookshelf
                key="Search"
                books={books}
                title="Search Result"
                onUpdateShelf={onUpdateShelf}
              />)}
              {
              error && (
                  <div className="search-books-error">
                    {error}
                  </div>
                )}
            </div>
          </div>
      )
  }
}

export default BookSearch