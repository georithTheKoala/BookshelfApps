// import './functions.js';

const books = [];
const RENDER_BOOK = 'render-book';
const SAVED_BOOK = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

const generateID = () => {
  return +new Date();
}

const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id, title, author, year, isComplete
  }
}

const findBook = (bookId) => {
  for(const bookItem of books) {
    if(bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const isStorageExist = () => {
  if(typeof (Storage) === undefined){
    alert('Browser anda tidak mendukung media penyimpanan storage, silahkan update browser anda terlebih dahulu');
    return false;
  }
  return true;
}

const saveData = () => {
  if(isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOK));
  }
}

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_BOOK));
}

const makeBook = (bookObject) => {
  const titleOfBook = document.createElement('h3');
  titleOfBook.innerText = bookObject.title;
  const authorOfBook = document.createElement('p');
  authorOfBook.innerText = `Penulis : ${bookObject.author}`;
  const yearOfBook = document.createElement('p');
  yearOfBook.innerHTML = `Tahun : ${bookObject.year}`;

  const bookList = document.createElement('article');
  bookList.classList.add('book_item');
  bookList.setAttribute('id', `book-${bookObject.id}`);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('red');
  deleteButton.innerHTML = 'Hapus Buku';
  deleteButton.addEventListener('click', function () {
    removeBookFromList(bookObject.id);
  });

  if(bookObject.isComplete) {
    const actionButtons =  document.createElement('div');
    actionButtons.classList.add('action');
    
    const undoneButton = document.createElement('button');
    undoneButton.innerHTML = 'Belum selesai dibaca';
    undoneButton.classList.add('green');
    undoneButton.addEventListener('click', function () {
      addBookToUndoneList(bookObject.id);
    });

    actionButtons.append(deleteButton, undoneButton);
    
    bookList.append(
      titleOfBook, 
      authorOfBook, 
      yearOfBook, 
      actionButtons);
  } else {
    const anotherActionButtons =  document.createElement('div');
    anotherActionButtons.classList.add('action');

    const doneButton = document.createElement('button');
    doneButton.innerHTML = 'Selesai dibaca';
    doneButton.classList.add('green');
    doneButton.addEventListener('click', function () {
      addBookToDoneList(bookObject.id);
    });

    anotherActionButtons.append(deleteButton, doneButton);

    bookList.append(
      titleOfBook, 
      authorOfBook, 
      yearOfBook, 
      anotherActionButtons);
  }
  return bookList;
}

const addBook = () => {
  const titleBook = document.getElementById('inputBookTitle').value;
  const authorBook = document.getElementById('inputBookAuthor').value;
  const yearBook = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateID();
  const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, isComplete);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

const addBookToDoneList = (bookId) => {
  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

const addBookToUndoneList = (bookId) => {
  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

const removeBookFromList = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchingForm = document.getElementById('searchBook');
  searchingForm.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  document.addEventListener(RENDER_BOOK, function () {
    const incompleteBOOKList = document.getElementById('incompleteBookshelfList');
    incompleteBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if(!bookItem.isComplete)
        incompleteBOOKList.append(bookElement);
      else
        completedBOOKList.append(bookElement);
    }
  });

  document.addEventListener(SAVED_BOOK, function () {
    const saveBook = localStorage.getItem(STORAGE_KEY);
    console.log(saveBook);
  });

  if(isStorageExist()){
    loadDataFromStorage();
  }
});