import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Bookshelf from './Bookshelf'
import BookSearch from './BookSearch'
import { Route, Link } from 'react-router-dom'

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
        const books = currentState.myBooks
        book.shelf === 'none' && (books.push(book))
        return {myBooks: books.map((b) => {
        b.id === book.id && (b.shelf = shelf)
        return b})}
      })
    BooksAPI.update(book, shelf)
  }
  addShelfInfo = (result) => {
    result.map((book) => {
      let shelf = 'none'
      for(let b of this.state.myBooks){
        book.id === b.id && (shelf = b.shelf)
      }
      book.shelf = shelf
    })
  }
  searchBooks = (query) => {
    BooksAPI.search(query)
      .then((bookSearchResult) => {
        //this.addShelfInfo(bookSearchResult)
        bookSearchResult.error ? (this.setState(() => ({
          error : 'no books found'
        }))) :
        (
          this.setState(() => ({
          bookSearchResult,
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