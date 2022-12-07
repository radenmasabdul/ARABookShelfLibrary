// navbar
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
}

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSELF_LIBRARY';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

// Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser yang kamu gunakan tidak mendukung Local Storage');
        return false;
    }
    return true;
}

// Fungsi ini digunakan untuk menyimpan data ke localStorage berdasarkan KEY yang sudah ditetapkan sebelumnya

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


// Fungsi ini digunakan untuk memuat data dari localStorage Dan memasukkan data hasil parsing ke variabel

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {

    const {
        id,
        title,
        author,
        year,
        isComplete
    } = bookObject;

    const textTitle = document.createElement('h1');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;

    const textYear = document.createElement('p');
    textYear.innerText = year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    if (isComplete) {

        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.textContent = 'Not Finished Reading';
        undoButton.addEventListener('click', function () {
            undoTaskFromComplete(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.textContent = 'Delete Books';
        trashButton.addEventListener('click', function () {
            removeTaskFromComplete(id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.textContent = 'Mark As Read';
        checkButton.addEventListener('click', function () {
            addTaskComplete(id);
        });

        container.append(checkButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete Books';
        deleteButton.addEventListener('click', function () {
            removeTaskFromComplete(id);
        });

        container.append(deleteButton);

    }

    return container;
}

function addBook() {
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const textYear = parseInt(document.getElementById('year').value);
    let isRead;
    if (document.getElementById('inputBookIsComplete').checked) {
        isRead = true;
    } else {
        isRead = false;
    }
    const generateID = generateId();
    const bookObject = generateBookObject(generateID, textTitle, textAuthor, textYear, isRead);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert('Book added successfully');

}

function addTaskComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromComplete(bookId) {
    let text = "Do you want to delete this book?";
    if (confirm(text) == true) {

        const bookTarget = findBookIndex(bookId);
        if (bookTarget === -1) return;
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

function undoTaskFromComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {});

document.addEventListener(RENDER_EVENT, function () {
    const uncompleteBOOKList = document.getElementById('incompleteBookshelfList');
    const listcomplete = document.getElementById('completeBookshelfList');

    uncompleteBOOKList.innerHTML = '';
    listcomplete.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            listcomplete.append(bookElement);
        } else {
            uncompleteBOOKList.append(bookElement);
        }
    }
});

function search() {
    var count = parseInt(0);
    var input, filter, div, h1, txtValue;
    input = document.getElementById('searchBookTitle');
    filter = input.value.toUpperCase();
    div = document.getElementsByClassName('item shadow');

    for (var i = 0; i < div.length; i++) {
        h1 = div[i].getElementsByTagName('h1')[0];
        txtValue = h1.textContent || h1.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = '';
            count++;
        } else {
            div[i].style.display = 'none';
        }
    }
    let a = document.getElementById('searchBookTitle').value;
    if (a == "") {
        console.log(a);
        window.alert('Input can not be left blank');
    } else {
        if (count == 0) {
            window.alert('Books dont exist ');
        } else if (count > 0) {
            window.alert('Books available');
        }
    }
}