//Import necessary data
import {
  authors,
  genres,
  books,
  BOOKS_PER_PAGE,
  getGenreName,
} from "./data.js";

if (!books || !Array.isArray(books) || books.length === 0) {
  throw new Error("Source required or not an array");
}

const theme = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },
  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};


function toggleTheme() {
  const currentTheme = document.body.classList.contains("night-theme")
    ? "day"
    : "night";
  document.body.classList.toggle("night-theme");
  setTheme(currentTheme);

  if(currentTheme=== "day") {
    document.body.style.color= "black";
  } else {
    document.body.style.color = "white";
  }
}

// Function to save the selected theme
function saveSelectedTheme() {
    // Get the selected theme from your settings options
    const themeSelect = document.getElementById("themeSelect");
    const selectedTheme = themeSelect.value;
  
   
  // Save the selected theme to local storage or another storage mechanism
  localStorage.setItem("selectedTheme", selectedTheme);
 
    // Save the selected theme to local storage or another storage mechanism
    // This allows the theme to persist between page loads
  
    // Apply the selected theme immediately
    setTheme(selectedTheme);
}

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

const bookList = document.querySelector(".list__items[data-list-items]");
const loadMoreButton = document.querySelector(
  ".list__button[data-list-button]"
);
const authorsFilter = document.querySelector(
  ".overlay__input[data-search-authors]"
);
const genresFilter = document.querySelector(
  ".overlay__input[data-search-genres]"
);
const listMessage = document.querySelector("[data-list-message]");
const searchForm = document.getElementById("searchForm");
const searchCancel = document.querySelector("[data-search-cancel]");
const settingsButton = document.getElementById("settingsButton");
const searchInput = document.querySelector(".overlay__input[data-search-title]");
const backdrop = document.querySelector(".backdrop");
const htmlElement = document.documentElement;
const mainSearch = document.getElementById("data-header-search");
const settingsForm = document.querySelector(".overlay__form[data-search-form]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const searchResults = document.getElementById("searchResults");
const searchButton = document.getElementById("searchButton");
const sidebar = document.getElementById("Sidebar");
const saveTheme= document.getElementById("saveTheme");
const themeCancel= document.getElementById("themeCancel");


let currentPage = 0;
let currentFilters = {
  title: null,
  author: null,
  genre: null,
};

// FUNCTIONS

// Function to apply the selected theme
function setTheme(themeName) {
    // Implement your theme switching logic here
    // You can use the themeName to apply the selected theme's styles
    // Example:
    if (themeName === "day") {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    } else if (themeName === "night") {
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
    }
} 
  

function handleSearchButton() {
  // Close the overlay
  const overlay = document.querySelector(".overlay");
  overlay.close(); // Close the dialog

  // Load the filtered books
  loadBooks();
}

function handleSearchSubmit(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  searchOverlay.showModal();

  // Get the search query and other form values
  const title = searchInput.value;
  const genre = genresFilter.value;
  const author = authorsFilter.value;

  // Update the currentFilters with the search criteria
  currentFilters.title = title;
  currentFilters.genre = genre;
  currentFilters.author = author;

  // Load the filtered books
  loadBooks();
}

function handleSearchCancel() {
  // Clear the form fields
  searchInput.value = "";
  genresFilter.value = "";
  authorsFilter.value = "";

  // Close the overlay
  const overlay = document.querySelector(".overlay__content");
  overlay.style.display = "none";
}

function getAuthorName(authorIds) {
  if (!Array.isArray(authorIds) || authorIds.length === 0) {
    return "Unknown";
  }

  const authorNames = authorIds.map((authorId) => {
    const author = authors.find((author) => author.id === authorId);
    return author ? author.name : "Unknown";
  });

  return authorNames.join(", ");
}

function closeOverlay() {
  const overlay = document.querySelector(".overlay");
  overlay.close(); // Close the dialog
}

// LOADBOOKS

function loadBooks() {
  const start = currentPage * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;

  // Clear the book list before adding new books
  bookList.innerHTML = "";

  const searchQuery = searchInput.value.toLowerCase();

  for (let i = start; i < end && i < books.length; i++) {
    const book = books[i];

    if (
      (!currentFilters.title ||
        book.title.toLowerCase().includes(searchQuery)) &&
      (!currentFilters.genre ||
        (book.genres && book.genres.includes(currentFilters.genre))) &&
      (!currentFilters.author ||
        (book.author && book.author.includes(currentFilters.author)))
    ) {

      const bookPreview = createBookPreview(book);
      bookList.appendChild(bookPreview);
    }
  }

  if (bookList.children.length === 0) {
    listMessage.style.display = "block";
  } else {
    listMessage.style.display = "none";
  }
}

//PREVIEW

function createBookPreview(book) {
  const bookPreview = document.createElement("div");
  bookPreview.classList.add("book-preview");

  // Image
  const bookImage = document.createElement("img");
  bookImage.classList.add("book-image");
  bookImage.src = book.image;
  bookPreview.appendChild(bookImage);

  // Title
  const bookTitle = document.createElement("h3");
  bookTitle.textContent = book.title;
  bookPreview.appendChild(bookTitle);

  // Inside the createBookPreview function
  const bookAuthor = document.createElement("p");
  if (book.authors && book.authors.length > 0) {
    const authorNames = getAuthorName(books.author);
    bookAuthor.textContent = `Author(s): ${authorNames}`;
  } else {
    bookAuthor.textContent = "Author: Unknown";
  }
  bookPreview.appendChild(bookAuthor);

  // Genre
  const bookGenre = document.createElement("p");
  bookGenre.textContent = `Genre:  ${getGenreName(book.genres[0])}`;
  bookPreview.appendChild(bookGenre);

  // Publication Date
  const bookDate = document.createElement("p");
  const publicationYear = new Date(book.published).getFullYear();
  bookDate.textContent = `Publication Date: ${book.published}`;
  bookPreview.appendChild(bookDate);

  bookList.appendChild(bookPreview);

  // Summary (Initially hidden)
  const bookSummary = document.createElement("div");
  bookSummary.classList.add("book-summary");
  bookSummary.style.display = "none";
  bookSummary.innerHTML = `Summary: ${book.description}`;
  bookPreview.appendChild(bookSummary);

  // Show/Hide Summary on Click
  bookPreview.addEventListener("click", () => {
    if (bookSummary.style.display === "none") {
      bookSummary.style.display = "block";
    } else {
      bookSummary.style.display = "none";
    }
  });

  return bookPreview;
}

// FILTERING

function filteredBooks(searchText, author, genre) {
  // Filter books based on search text
  const filteredBySearchText = books.filter((book) =>
    book.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Filter books by author
  const filteredByAuthor = author
    ? filteredBySearchText.filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
      )
    : filteredBySearchText;

  // Filter books by genre
  const filteredByGenre = genre
    ? filteredByAuthor.filter(
        (book) => book.genre.toLowerCase() === genre.toLowerCase()
      )
    : filteredByAuthor;

  return filteredByGenre;
}

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.matches(".list__button[data-list-button]")) {
      // Handle the button click
      currentPage++;
      loadBooks();
    }
})

themeCancel.addEventListener("click", () => {
    try {
      // Retrieve the previously saved theme from local storage
      const savedTheme = localStorage.getItem("selectedTheme");
  
      // Set the theme select element value to the saved theme (if available)
      if (savedTheme) {
        themeSelect.value = savedTheme;
      } else {
        // If there's no saved theme, you can set a default theme value here
        themeSelect.value = "day"; // Example default value
      }
    } catch (error) {
      console.error("Error in themeCancel event handler:", error);
    }
  
    // Apply the selected theme immediately
    setTheme(themeSelect.value);
  });
  
 
  settingsButton.addEventListener("click", function () {
    // Toggle the "active" class to open/close the sidebar
    sidebar.classList.toggle("active");
    backdrop.classList.toggle("active");

    toggleTheme();
    sidebar.style.display = "block";


  });
});

searchButton.addEventListener("click", handleSearchSubmit);


searchCancel.addEventListener("click",  handleSearchCancel);


if (loadMoreButton) {
  loadMoreButton.addEventListener("click", () => {
    currentPage++;
    loadBooks();
  });
}

mainSearch.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("main search button clicked");
  handleSearchSubmit(event);
});

if (authorsFilter) {
  authorsFilter.addEventListener("change", loadBooks);
}

if (genresFilter) {
  genresFilter.addEventListener("change", loadBooks);
}

saveTheme.addEventListener("click", saveSelectedTheme(),
console.log("save button was clicked")
)
; 
loadBooks();

// OVERLAY FOR BOOK PREVIEW

document.addEventListener("DOMContentLoaded", () => {
  const listItems = document.querySelector("[data-list-items]");
  const overlay = document.querySelector(".overlay");

  // Function to show the overlay
  function showBookOverlay(bookId) {

    // Find the book with the specified ID
    const book = books.find((b) => b.id === bookId);

    if (book) {
      // Fill in the overlay with book details
      const overlayImage = document.querySelector("[data-list-image]");
      const overlayTitle = document.querySelector("[data-list-title]");
      const overlaySubtitle = document.querySelector("[data-list-subtitle]");
      const overlayDescription = document.querySelector(
        "[data-list-description]"
      );
      overlayImage.src = book.image;
      overlayTitle.textContent = book.title;
      overlaySubtitle.textContent = `Author: ${book.author}`;
      overlayDescription.textContent = book.description;

      overlay.style.display = "block";
    }
  }

  // Attach click event listeners to each book preview
  listItems.addEventListener("click", (event) => {
    if (event.target.classList.contains("preview")) {
      const bookId = event.target.getAttribute("data-book-id");
      showBookOverlay(bookId);
    }
  });
});
searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
  
    // Get the search query and other form values
    const title = searchInput.value.toLowerCase();
    const genre = genresFilter.value.toLowerCase();
    const author = authorsFilter.value.toLowerCase();
  
    // Update the currentFilters with the search criteria
    currentFilters.title = title;
    currentFilters.genre = genre;
    currentFilters.author = author;
  
    // Reset the current page to 0 when searching
    currentPage = 0;
  
    // Load the filtered books
    loadBooks();
  });
  
function displaySearchResults(books) {
  // Clear previous results
  searchResults.innerHTML = "";

  if (books.length === 0) {
    searchResults.innerHTML = "No results found.";
    return;
  }

  // Create and display results in the searchResults container
  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.textContent = book.title; // Display book title (customize as needed)
    searchResults.appendChild(bookElement);
  });
}


































































/*scripts.js
import { books } from "./data.js";

const listItems = document.querySelector("[data-list-items]");
const message = document.querySelector("[data-list-message]");
const button = document.querySelector("[data-list-button]");

function displayBooks(books) {
  listItems.innerHTML = "";

  if (books.length === 0) {
    message.style.display = "block";
  } else {
    message.style.display = "none";
    books.forEach((book) => {
      const listItem = document.createElement("div");
      listItem.classList.add("book-item");

      listItem.innerHTML = `
        <div class="book-item__image">
          <img src="${book.image}" alt="${book.title}" />
        </div>
        <div class="book-item__info">
          <h2>${book.title}</h2>
          <p>Author: ${book.author}</p>
          <p>Publication Date: ${book.publicationDate}</p>
          <p>Genres: ${book.genres.join(", ")}</p>
          <button class="book-item__button">Read Summary</button>
        </div>
      `;

      listItems.appendChild(listItem);
    });
  }
}

displayBooks(books);



































//* Import necessary data
/*import { authors, genres, books, BOOKS_PER_PAGE } from './data.js';

console.log(books);

if (!books || !Array.isArray(books) || books.length === 0) {
  throw new Error('Source required or not an array');
}

const theme = {
  day: {
    dark: '10, 10, 20',
    light: '255, 255, 255',
  },
  night: {
    dark: '255, 255, 255',
    light: '10, 10, 20',
  },
};

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

const bookList = document.querySelector('.list__items[data-list-items]');
const loadMoreButton = document.querySelector('.list__button[data-list-button]');
const searchButton = document.querySelector('.header__button[data-header-search]');
const authorsFilter = document.querySelector('.overlay__input[data-search-authors]');
const genresFilter = document.querySelector('.overlay__input[data-search-genres]');

let currentPage = 0;
let currentFilters = {
  author: null,
  genre: null,
};

function loadBooks() {
  const start = currentPage * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;

  // Clear the book list before adding new books
  bookList.innerHTML = '';

// ...

// ...

for (let i = start; i < end && i < bookData.length; i++) {
    const book = bookData[i];
    if (
      (!currentFilters.author || (book.authors && book.authors.length > 0 && book.authors.includes(currentFilters.author))) &&
      (!currentFilters.genre || (book.genres && book.genres.length > 0 && book.genres.includes(currentFilters.genre)))
    ) {
      const bookPreview = document.createElement('div');
      bookPreview.classList.add('book-preview');
  
      // Image
      const bookImage = document.createElement('img');
      bookImage.classList.add('book-image');
      bookImage.src = book.image;
      bookPreview.appendChild(bookImage);
  
      // Title
      const bookTitle = document.createElement('h3');
      bookTitle.textContent = book.title;
      bookPreview.appendChild(bookTitle);
  
      // Author
      const bookAuthor = document.createElement('p');
      bookAuthor.textContent = `Author: ${book.authors && book.authors.length > 0 ? authors[book.authors[0]] : 'Unknown'}`;
      bookPreview.appendChild(bookAuthor);
  
      // Genre
      const bookGenre = document.createElement('p');
      bookGenre.textContent = `Genre: ${book.genres && book.genres.length > 0 ? genres[book.genres[0]] : 'Unknown'}`;
      bookPreview.appendChild(bookGenre);
  
      // Summary
      const bookSummary = document.createElement('p');
      bookSummary.textContent = `Summary: ${book.description}`;
      bookPreview.appendChild(bookSummary);
  
      // Publication Date
      const bookDate = document.createElement('p');
      bookDate.textContent = `Publication Date: ${book.publicationDate}`;
      bookPreview.appendChild(bookDate);
  
      bookList.appendChild(bookPreview);
    }
  }
  
  // ...

for (const { author, image, title, id } of extracted) {
  const preview = bookPreview({
    author,
    id,
    image,
    title,
  });

  fragment.appendChild(preview);
}

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadBooks);
  }
  
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      document.querySelector('[data-search-overlay]').showModal();
    });
  }
  
  if (authorsFilter) {
    authorsFilter.addEventListener('change', filterBooks);
  }
  
  if (genresFilter) {
    genresFilter.addEventListener('change', filterBooks);
  }
  
  loadBooks();




















































/*

//Import necessary variables and constants from data.js 
import { authors, genres, books, BOOKS_PER_PAGE } from './data.js';
// Define your variables and constants here
let page = 1;

const css = {
  day: {
    dark: '10, 10, 20',
    light: '255, 255, 255',
  },
  night: {
    dark: '255, 255, 255',
    light: '10, 10, 20',
  },
};
const dataSettingsTheme = document.getElementById('data-settings-theme'); // Replace with your HTML element

// Function to create a book preview element
function createPreview(book) {
  const preview = document.createElement('div');
  preview.classList.add('book-preview');

  // Add book image
  const image = document.createElement('img');
  image.src = book.image;
  image.alt = book.title;
  preview.appendChild(image);

  // Add book title
  const title = document.createElement('h3');
  title.textContent = book.title;
  preview.appendChild(title);

  // Add book author
  const author = document.createElement('p');
  author.textContent = `Author: ${authors[book.author] || 'Unknown'}`;
  preview.appendChild(author);

  // Add publication date
  const date = document.createElement('p');
  date.textContent = `Publication Date: ${new Date(book.published).getFullYear()}`;
  preview.appendChild(date);

  // Add click event to toggle book preview
  preview.addEventListener('click', () => {
    const details = preview.querySelector('.book-details');
    details.classList.toggle('hidden');
  });

  // Add book details (initially hidden)
  const details = document.createElement('div');
  details.classList.add('book-details', 'hidden');
  details.textContent = book.description; // Replace with the book's summary
  preview.appendChild(details);

  return preview;
}

// Function to filter and display books
function filterAndDisplayBooks() {
  const titleFilter = document.getElementById('data-search-title').value.toLowerCase();
  const authorFilter = document.getElementById('data-search-authors').value;
  const genreFilter = document.getElementById('data-search-genres').value;

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(titleFilter);
    const authorMatch = authorFilter === 'any' || book.author === authorFilter;
    const genreMatch = genreFilter === 'any' || book.genres.includes(genreFilter);

    return titleMatch && authorMatch && genreMatch;
  });

  // Clear existing books
  const bookList = document.querySelector('.list__items[data-list-items]');
  bookList.innerHTML = '';

  // Display filtered books
  const start = (page - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;
  const booksToDisplay = filteredBooks.slice(start, end);

  booksToDisplay.forEach((book) => {
    const preview = createPreview(book);
    bookList.appendChild(preview);
  });

  // Update "Show more" button
  const showMoreButton = document.querySelector('.list__button[data-list-button]');
  showMoreButton.disabled = end >= filteredBooks.length;
}

const settingsForm = document.getElementById('settings');

if (settingsForm) {
  settingsForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get form data
    const formData = new FormData(settingsForm);
    const selectedTheme = formData.get('theme'); // Assuming you have an input with the name "theme" in your form

    // You can now use the form data as needed
    // For example, you can send it to a server using fetch() or update the page content

    // Example: Update the page content based on the selected theme
    if (selectedTheme === 'day') {
      // Set the day theme
      document.body.classList.remove('night-theme');
      document.body.classList.add('day-theme');
    } else if (selectedTheme === 'night') {
      // Set the night theme
      document.body.classList.remove('day-theme');
      document.body.classList.add('night-theme');
    }
  });
}



// Add event listeners for search filters
const search = document.getElementById('data-search-title');
search.addEventListener('input', filterAndDisplayBooks);

const searchAuthors = document.getElementById('data-search-authors');
searchAuthors.addEventListener('change', filterAndDisplayBooks);

const searchGenres = document.getElementById('data-search-genres');
searchGenres.addEventListener('change', filterAndDisplayBooks);

// Initial filtering and display
filterAndDisplayBooks();

// Event listener for "Show more" button
const showMoreButton = document.querySelector('.list__button[data-list-button]');
showMoreButton.addEventListener('click', () => {
  page += 1;
  filterAndDisplayBooks();
});
















//* Import necessary data
/*import { authors, genres, books, BOOKS_PER_PAGE } from './data.js';


if (!books || !Array.isArray(books) || books.length === 0) {
  throw new Error('Source required or not an array');
}

const theme = {
  day: {
    dark: '10, 10, 20',
    light: '255, 255, 255',
  },
  night: {
    dark: '255, 255, 255',
    light: '10, 10, 20',
  },
};

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

const bookList = document.querySelector('.list__items[data-list-items]');
const loadMoreButton = document.querySelector('.list__button[data-list-button]');
const searchButton = document.querySelector('.header__button[data-header-search]');
const authorsFilter = document.querySelector('.overlay__input[data-search-authors]');
const genresFilter = document.querySelector('.overlay__input[data-search-genres]');

let currentPage = 0;
let currentFilters = {
  author: null,
  genre: null,
};

function loadBooks() {
  const start = currentPage * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;

  // Clear the book list before adding new books
  bookList.innerHTML = '';

// ...

// ...

for (let i = start; i < end && i < bookData.length; i++) {
    const book = bookData[i];
    if (
      (!currentFilters.author || (book.authors && book.authors.length > 0 && book.authors.includes(currentFilters.author))) &&
      (!currentFilters.genre || (book.genres && book.genres.length > 0 && book.genres.includes(currentFilters.genre)))
    ) {
      const bookPreview = document.createElement('div');
      bookPreview.classList.add('book-preview');
  
      // Image
      const bookImage = document.createElement('img');
      bookImage.classList.add('book-image');
      bookImage.src = book.image;
      bookPreview.appendChild(bookImage);
  
      // Title
      const bookTitle = document.createElement('h3');
      bookTitle.textContent = book.title;
      bookPreview.appendChild(bookTitle);
  
      // Author
      const bookAuthor = document.createElement('p');
      bookAuthor.textContent = `Author: ${book.authors && book.authors.length > 0 ? authors[book.authors[0]] : 'Unknown'}`;
      bookPreview.appendChild(bookAuthor);
  
      // Genre
      const bookGenre = document.createElement('p');
      bookGenre.textContent = `Genre: ${book.genres && book.genres.length > 0 ? genres[book.genres[0]] : 'Unknown'}`;
      bookPreview.appendChild(bookGenre);
  
      // Summary
      const bookSummary = document.createElement('p');
      bookSummary.textContent = `Summary: ${book.description}`;
      bookPreview.appendChild(bookSummary);
  
      // Publication Date
      const bookDate = document.createElement('p');
      bookDate.textContent = `Publication Date: ${book.publicationDate}`;
      bookPreview.appendChild(bookDate);
  
      bookList.appendChild(bookPreview);
    }
  }
  
  // ...

for (const { author, image, title, id } of extracted) {
  const preview = bookPreview({
    author,
    id,
    image,
    title,
  });

  fragment.appendChild(preview);
}

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadBooks);
  }
  
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      document.querySelector('[data-search-overlay]').showModal();
    });
  }
  
  if (authorsFilter) {
    authorsFilter.addEventListener('change', filterBooks);
  }
  
  if (genresFilter) {
    genresFilter.addEventListener('change', filterBooks);
  }
  
  loadBooks();

/**  data-list-items.appendChild(fragment)

genres = document.createDocumentFragment()
element = document.createElement('option')
element.value = 'any'
element = 'All Genres'
genres.appendChild(element)

for ([id, name]; Object.entries(genres); i++) {
    document.createElement('option')
    element.value = value
    element.innerText = text
    genres.appendChild(element)
}

data-search-genres.appendChild(genres)

authors = document.createDocumentFragment()
element = document.createElement('option')
element.value = 'any'
element.innerText = 'All Authors'
authors.appendChild(element)

for ([id, name];Object.entries(authors); id++) {
    document.createElement('option')
    element.value = value
    element = text
    authors.appendChild(element)
}

data-search-authors.appendChild(authors)

data-settings-theme.value === window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' | 'day'

documentElement.style.setProperty('--color-dark', css[v].dark);
documentElement.style.setProperty('--color-light', css[v].light);
data-list-button = "Show more (books.length - BOOKS_PER_PAGE)"

data-list-button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)

data-list-button.innerHTML = /* html */

/**[
  '<span>Show more</span>',
  '<span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>',
]

data-search-cancel.click() { data-search-overlay.open === false }
data-settings-cancel.click() { querySelect(data-settings-overlay).open === false }
data-settings-form.submit() { actions.settings.submit }
data-list-close.click() { data-list-active.open === false }

data-list-button.click() {
  document.querySelector([data-list-items]).appendChild(createPreviewsFragment(matches, page x BOOKS_PER_PAGE, {page + 1} x BOOKS_PER_PAGE]))
  actions.list.updateRemaining()
  page = page + 1
}

data-header-search.click() {
  data-search-overlay.open === true ;
  data-search-title.focus();
}

data-search-form.click(filters) {
  preventDefault()
  const formData = new FormData(event.target)
  const filters = Object.fromEntries(formData)
  result = []

  for (book; booksList; i++) {
      titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
      authorMatch = filters.author = 'any' || book.author === filters.author

      {
          genreMatch = filters.genre = 'any'
          for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
      }

      if titleMatch && authorMatch && genreMatch => result.push(book)
  }

  if display.length < 1 
  data-list-message.class.add('list__message_show')
  else data-list-message.class.remove('list__message_show')
  

  data-list-items.innerHTML = ''
  const fragment = document.createDocumentFragment()
  const extracted = source.slice(range[0], range[1])

  for ({ author, image, title, id }; extracted; i++) {
      const { author: authorId, id, image, title } = props

      element = document.createElement('button')
      element.classList = 'preview'
      element.setAttribute('data-preview', id)

      element.innerHTML = /* html */

/* `
          <img
              class="preview__image"
              src="${image}"
          />
          
          <div class="preview__info">
              <h3 class="preview__title">${title}</h3>
              <div class="preview__author">${authors[authorId]}</div>
          </div>
      `

      fragment.appendChild(element)
  }
  
  data-list-items.appendChild(fragments)
  initial === matches.length - [page * BOOKS_PER_PAGE]
  remaining === hasRemaining ? initial : 0
  data-list-button.disabled = initial > 0

  data-list-button.innerHTML = /* html */

/* `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining})</span>
  `

  window.scrollTo({ top: 0, behavior: 'smooth' });
  data-search-overlay.open = false
}

data-settings-overlay.submit; {
  preventDefault()
  const formData = new FormData(event.target)
  const result = Object.fromEntries(formData)
  document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
  document.documentElement.style.setProperty('--color-light', css[result.theme].light);
  data-settings-overlay).open === false
}

data-list-items.click() {
  pathArray = Array.from(event.path || event.composedPath())
  active;

  for (node; pathArray; i++) {
      if active break;
      const previewId = node?.dataset?.preview
  
      for (const singleBook of books) {
          if (singleBook.id === id) active = singleBook
      } 
  }
  
  if !active return
  data-list-active.open === true
  data-list-blur + data-list-image === active.image
  data-list-title === active.title
  
  data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
  data-list-description === active.description
}
*/
