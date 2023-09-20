//Import necessary data
import {
  authors,
  genres,
  books,
  BOOKS_PER_PAGE,
  getGenreName,
} from "./data.js";

//VARIABLES

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);
const bookList = document.querySelector(".list__items[data-list-items]");
const loadMoreButton = document.querySelector(".list__button[data-list-button]");
const authorsFilter = document.querySelector(".overlay__input[data-search-authors]");
const genresFilter = document.querySelector(".overlay__input[data-search-genres]");
const listMessage = document.querySelector("[data-list-message]");
const searchForm = document.getElementById("searchForm");
const searchCancel = document.querySelector("[data-search-cancel]");
const settingsButton = document.getElementById("settingsButton");
const searchInput = document.querySelector(".overlay__input[data-search-title]");
const backdrop = document.querySelector(".backdrop");
const htmlElement = document.documentElement;
const mainSearch = document.getElementById("data-header-search");
const settingsForm = document.querySelector(".overlay__form[data-search-form]");
const searchOverlay = document.getElementById("data-search-overlay");
const searchButton = document.getElementById("searchButton");
const sidebar = document.getElementById("overlay_theme_content");
const saveTheme = document.getElementById("saveTheme");
const themeCancel = document.getElementById("themeCancel");


let currentPage = 0;
let currentFilters = {
  title: null,
  author: null,
  genre: null,
};

// FUNCTIONS
function toggleTheme() {
  const currentTheme = document.body.classList.contains("night-theme")
    ? "day"
    : "night";
  document.body.classList.toggle("night-theme");
  setTheme(currentTheme);

  if (currentTheme === "day") {
    document.body.style.color = "black";
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

  // Apply the selected theme immediately
  setTheme(selectedTheme);
}

// Function to apply the selected theme
function setTheme(themeName) {
  // Implement your theme switching logic here
  if (themeName === "day") {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  } else if (themeName === "night") {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
  }
}

// Define a function to handle search overlay
function handleSearchOverlay() {
  if (typeof searchOverlay.showModal === "function") {
    searchOverlay.showModal(); // Use showModal to display the overlay if supported
  } else {
    // Fallback for browsers that don't support showModal
    searchOverlay.style.display = "block";
    searchOverlay.style.zIndex = "1000"; // You may need to adjust the zIndex value
  }
}

// Define a function to load the filtered books
function loadFilteredBooks() {
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

function toggleSidebar() {
  overlay_theme_content.classList.toggle("active");
  backdrop.classList.toggle("active");
}

// LOADBOOKS

function loadBooks() {
  const start = currentPage * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;

  // Clear the book list before adding new books
  bookList.innerHTML = "";

  const searchQuery = searchInput.value.toLowerCase();
  const filteredBooksList = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) &&
      (!currentFilters.author ||
        book.author.some((a) =>
          a.toLowerCase().includes(currentFilters.author)
        )) &&
      (!currentFilters.genre || book.genres.includes(currentFilters.genre))
  );

  if (filteredBooksList.length === 0) {
    listMessage.style.display = "block";
  } else {
    listMessage.style.display = "none";
  }

  for (let i = start; i < end && i < filteredBooksList.length; i++) {
    const book = filteredBooksList[i];
    const bookPreview = createBookPreview(book);
    bookList.appendChild(bookPreview);
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
    const authorNames = getAuthorName(book.author);
    bookAuthor.textContent = `Author(s): ${authors}`;
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

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.matches(".list__button[data-list-button]")) {
      // Handle the button click
      currentPage++;
      loadBooks();
    }

    settingsButton.addEventListener("click", function () {
      // Toggle the "active" class to open/close the sidebar
      sidebar.classList.toggle("active");
      backdrop.classList.toggle("active");

      toggleTheme();
      sidebar.style.display = "block";
    });

    searchButton.addEventListener("click", function () {
      // Close the overlay
      searchOverlay.style.display = "none";

      // Load the filtered books
      loadBooks();
    });

    searchCancel.addEventListener("click", function () {
      searchOverlay.close();
    });

    if (loadMoreButton) {
      loadMoreButton.addEventListener("click", () => {
        currentPage++;
        loadBooks();
      });
    }

    if (authorsFilter) {
      authorsFilter.addEventListener("change", loadBooks);
    }

    if (genresFilter) {
      genresFilter.addEventListener("change", loadBooks);
    }

    saveTheme.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("save button was clicked");
      saveSelectedTheme();

      overlay.style.display = "none";
    });
  });

  themeCancel.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("themeCancel button was clicked");
    toggleSidebar(); // Call the toggleSidebar function here
  });

  // Add event listener to the search button in the header
  mainSearch.addEventListener("click", handleSearchOverlay);

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    handleSearchOverlay();
    loadFilteredBooks();
  });
});

loadBooks();
