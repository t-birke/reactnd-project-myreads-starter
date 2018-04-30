import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Bookshelf from './Bookshelf'
import BookSearch from './BookSearch'
import './App.css'

class BooksApp extends React.Component {
  state = {
     myBooks: [],
     bookSearchResult: [],
     error: false
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
        let books = currentState.myBooks
        book.shelf === 'none' && (books = books.concat([book]))
        return {myBooks: books.map((b) => {
        b.id === book.id && (b.shelf = shelf)
        return b})}
      })
    BooksAPI.update(book, shelf)
  }
  addShelfInfo = (result) => {
    return result.map((book) => {
      let shelf = 'none'
      for(let b of this.state.myBooks){
        book.id === b.id && (shelf = b.shelf)
      }
      book.shelf = shelf
      return book
    })
  }
  searchBooks = (query) => {
    BooksAPI.search(query)
      .then((bookSearchResult) => {
        bookSearchResult.error ? (this.setState(() => ({
          error : 'no books found'
        }))) :
        (
          this.setState(() => ({
          bookSearchResult: this.addShelfInfo(bookSearchResult),
          error : false
        })
          )
        )
      })
  }
  cleanSearch = () => {
    this.setState(() => ({
        bookSearchResult : [],
        error : false
      })
    )
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
    const error = this.state.error
    return (
      <div className="app">

      <Route path='/search' render={({ history }) => (
          <BookSearch
            key="searchBooks"
            books={this.state.bookSearchResult}
            onUpdateShelf={this.updateShelf}
            onType={this.searchBooks}
            error={error}
            cleanSearch={this.cleanSearch}
          />
        )} />

        <Route exact path='/' render={() => (
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
              <Link
            to='/search'
          >Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp