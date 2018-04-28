import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Book extends Component {
  static propTypes = {
      book: PropTypes.object.isRequired
    }
  render() {
    const { book, onUpdateShelf } = this.props
return (
  <li>
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={book.imageLinks && ({ width: 128, height: 188, backgroundImage: 'url("' + book.imageLinks.smallThumbnail + '")' })}></div>
        <div className="book-shelf-changer">
          <select value={book.shelf} onChange={(e) => onUpdateShelf(book,e.target.value)}>
            <option value="disabled" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors && (book.authors.map((author, i, a) => ( author + (i < a.length-1 ? ', ' : '')))
      )}</div>
      </div>
  </li>
  )

}

}

export default Book