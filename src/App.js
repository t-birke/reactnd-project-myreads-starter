import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Bookshelf from './Bookshelf'
import { Route } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    myBooks: [],
    showSearchPage: false
  }
  componentDidMount() {
    BooksAPI.getAll()
      .then((myBooks) => {
        this.setState(() => ({
          myBooks
        }))
      })
  }
  getBookDetails = (id) => {
    BooksAPI.get(id)
      .then((book) => {
        this.setState((currentState) => {
          currentState.myBooks.add(book)
        })
      })
  }
  updateShelf = (book, shelf) => {
    this.setState((currentState) => {
      book.shelf === 'none' && (currentState.myBooks.add(book))
      currentState.myBooks.map((b) => {
        b.id === book.id && (b.shelf = shelf)
      })
      return currentState.myBooks
    })
    BooksAPI.update(book, shelf)
  }
  render() {
    const bookShelfCategory = [
      {
        "key": "currentlyReading",
        "title": "Currently Reading"
      },
      {
        "key": "wantToRead",
        "title": "Want to Read"
      },
      {
        "key": "read",
        "title": "Read"
      }
    ]
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {bookShelfCategory.map((cat)=>{
                  return (
                      <Bookshelf
                        key={cat.title}
                        books={this.state.myBooks.filter((book) => book.shelf === cat.key)}
                        title={cat.title}
                        onUpdateShelf={this.updateShelf}
                      />
                    )
                })}
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
