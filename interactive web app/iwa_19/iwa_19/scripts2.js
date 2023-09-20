// Import necessary data and functions from "./data.js"
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Wait for the DOM to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables to keep track of search results, pagination, and active book
  let matches = books;
  let page = 1;
  let activeBook = null;

  // Get references to various DOM elements using their IDs
  const itemsList = document.getElementById("data-list-items");
  const searchOverlay = document.querySelector("#data-search-overlay");
  const searchAuthors = document.getElementById("data-search-authors");
  const listButton = document.getElementById("listButton");
  const cancelSearch = document.getElementById("cancelSearch");
  const settingsForm = document.getElementById("settingsForm");
  const closeList = document.getElementById("closeList");
  const searchHeader = document.getElementById("mainSearch");
  const searchForm = document.getElementById("searchForm");
  const listMessage = document.querySelector("#data-list-message");
  const listActive = document.querySelector("#data-list-active");
  const searchGenres = document.getElementById("searchGenres");
  const titleSearch = document.getElementById("data-search-title");
  const settingsOverlay = document.querySelector("#data-settings-overlay");
  const mainSettings = document.getElementById("mainSettings");
  const themeCancel = document.getElementById("themeCancel");
  const saveTheme = document.getElementById("saveTheme");
  const searchButton = document.getElementById("searchButton");

  // Define CSS color values for day and night themes
  const css = {
    day: "10, 10, 20",
    night: "255, 255, 255",
  };

  // Define color values for night theme
  const night = {
    day: "255, 255, 255",
    night: "10, 10, 20",
  };
  // Create a document fragment to efficiently append multiple elements
  const fragment = document.createDocumentFragment();

  // Extract a subset of books for initial display
  let extracted = books.slice(0, 36);

  // Set the initial theme to "day"
  let theme = "day";

  // Function to display filtered search results
  function displayFilteredResults(filteredBooks) {
    itemsList.innerHTML = ""; // Clear the current itemsList content.

    const fragment = document.createDocumentFragment();
    for (const { author, image, title, id } of filteredBooks) {
      const preview = createPreview({
        author,
        id,
        image,
        title,
      });
      fragment.appendChild(preview);
    }

    itemsList.appendChild(fragment);

    // Scroll to the top of the results
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Function to create a fragment of book previews
  /*startIndex: An integer indicating the index at which to start extracting books from the books array.
    endIndex: An integer indicating the index at which to stop extracting books from the books array.*/
  function createPreviewsFragment(books, startIndex, endIndex) {
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex && i < books.length; i++) {
      const { author, id, image, title } = books[i];
      const preview = createPreview({
        author,
        id,
        image,
        title,
      });
      fragment.appendChild(preview);
    }

    return fragment;
  }

  // Function to create the book details overlay
  function createBookDetailsOverlay(book) {
    /**creating a new <div> element named overlay, which serves as the container for the entire overlay. */
    const overlay = document.createElement("div");
    /** line adds the CSS class overlay__content to the overlay element. This class contains styling rules to format the overlay's appearance. */
    overlay.classList.add("overlay__content");

    // Create elements for book details
    const coverImage = document.createElement("img");
    coverImage.classList.add("book-image");
    coverImage.src = book.image;
    coverImage.alt = book.title;

    const titleLabel = document.createElement("div");
    titleLabel.classList.add("overlay__title");
    titleLabel.textContent = book.title;

    const authorLabel = document.createElement("div");
    authorLabel.classList.add("book-details-author");
    authorLabel.textContent = `Author: ${authors[book.author]}`;

    const genreLabel = document.createElement("div");
    genreLabel.classList.add("book-details-genre");
    genreLabel.textContent = `Genre: ${genres[book.genres[0]]}`;

    const yearLabel = document.createElement("div");
    yearLabel.classList.add("book-details-year");
    yearLabel.textContent = `Publication Year: ${book.published}`;

    const summaryLabel = document.createElement("div");
    summaryLabel.classList.add("data-list-description");
    summaryLabel.textContent = `Summary: ${book.description}`;

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.classList.add("overlay__button");
    closeButton.addEventListener("click", () => {
      // Close the overlay when the close button is clicked
      listActive.close();
    });

    // Append elements to the overlay
    overlay.appendChild(coverImage);
    overlay.appendChild(titleLabel);
    overlay.appendChild(authorLabel);
    overlay.appendChild(genreLabel);
    overlay.appendChild(yearLabel);
    overlay.appendChild(summaryLabel);

    // Append the close button to the overlay
    overlay.appendChild(closeButton);

    return overlay;
  }

  // PREVIEW

  // Function to create a book preview element
  function createPreview({ author, id, image, title }) {
    const preview = document.createElement("div");
    preview.classList.add("preview"); // Add appropriate classes to your preview element
    preview.dataset.bookId = id; // Add a data attribute to store the book ID

    // Create elements for author, image, title, and other details
    const imageElement = document.createElement("img");
    imageElement.classList.add("preview__image");
    imageElement.src = image;
    imageElement.alt = title;

    const titleElement = document.createElement("div");
    titleElement.classList.add("preview__title");
    titleElement.textContent = title;

    const authorElement = document.createElement("div");
    authorElement.classList.add("preview__author");
    authorElement.textContent = ` ${authors[author]}`;

    // Append the elements to the preview element
    preview.appendChild(imageElement);
    preview.appendChild(titleElement);
    preview.appendChild(authorElement);

    return preview;
  }

  // Get all the book preview elements
  const previews = document.querySelectorAll(".preview");

  // Create preview elements and append them to the fragment
  for (const { author, image, title, id } of extracted) {
    const preview = createPreview({
      author,
      id,
      image,
      title,
    });

    fragment.appendChild(preview);
  }

  itemsList.appendChild(fragment);

  // Create an options fragment for genres selection
  const genresFragment = document.createDocumentFragment();
  const allGenresOption = document.createElement("option");
  allGenresOption.value = "any";
  allGenresOption.textContent = "All Genres";
  genresFragment.appendChild(allGenresOption);

  for (const [id, label] of Object.entries(genres)) {
    const element = document.createElement("option");
    element.value = id; // set the value to the "id" fom genres
    element.innerText = label; // set the text the name from genres
    genresFragment.appendChild(element);
  }

  searchGenres.appendChild(genresFragment);


  //**responsible for dynamically generating and populating an HTML select (dropdown) element with a list of authors based on the data provided in the authors object. */

  // Create an options fragment for authors selection
  const authorsFragment = document.createDocumentFragment();
  const allAuthorsOption = document.createElement("option");
  allAuthorsOption.value = "any";
  allAuthorsOption.innerText = "All Authors";
  authorsFragment.appendChild(allAuthorsOption);

  for (const [id, label] of Object.entries(authors)) {
    const element = document.createElement("option");
    element.value = id; // set the value to the "id" from authors
    element.innerText = label; // set the text to the "label" from authors
    authorsFragment.appendChild(element);
  }

  searchAuthors.appendChild(authorsFragment);

  // Function to set the theme
  function setTheme(theme) {
    document.body.className = theme; // Replace the entire class with the theme
  }

  // Set the initial theme
  setTheme(theme);

  // Update listButton content based on available matches
  listButton.textContent =
    "Show more (" + (matches.length - page * BOOKS_PER_PAGE) + ")";

  // Disable listButton if no more items are available
  listButton.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0);

  const hasRemaining = true;

  // Update listButton content with remaining items
  listButton.innerHTML =
    /* html */
    `<span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>`;

  //EVENT LISTENERS
  // Handle cancelSearch button click event
  cancelSearch.addEventListener("click", function () {
    searchOverlay.open = false;
  });

  // Handle themeCancel button click event
  themeCancel.addEventListener("click", function () {
    settingsOverlay.open = false;
  });

  // Handle settingsForm submission
  settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    actions.settings.submit();
  });

  // Handle closeList button click event
  closeList.addEventListener("click", function () {
    listActive.close();
  });

  // Handle listButton click event for pagination
  listButton.addEventListener("click", function () {
    document
      .querySelector("[data-list-items]")
      .appendChild(
        createPreviewsFragment(
          matches,
          page * BOOKS_PER_PAGE,
          (page + 1) * BOOKS_PER_PAGE
        )
      );
    actions.list.updateRemaining();
    page = page + 1;
  });

  // Handle searchHeader click event to open search overlay
  searchHeader.addEventListener("click", function () {
    searchHeader.open = true;
    searchOverlay.open = true;
    titleSearch.focus();
  });

  // Handle mainSettings click event to open settings overlay
  mainSettings.addEventListener("click", function () {
    settingsOverlay.open = true;
  });

  // Handle saveTheme button click event to set the selected theme
  saveTheme.addEventListener("click", function () {
    // Get the selected theme from the settings form
    const formData = new FormData(settingsForm);
    const selectedTheme = formData.get("theme");

    // Set the selected theme and close the settings overlay
    setTheme(selectedTheme);
    settingsOverlay.style.display = "none";
  });

  // Prevent form submission for searchForm
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  // Handle searchButton click event to process the search and display results
  searchButton.addEventListener("click", function () {
    // Process the search and display results
    const formData = new FormData(searchForm);
    const filters = Object.fromEntries(formData);

    const filteredBooks = books.filter((book) => {
      const titleMatch =
        filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch =
        filters.author === "any" || book.author === filters.author;
      const genreMatch =
        filters.genre === "any" || book.genres.includes(filters.genre);

      return titleMatch && authorMatch && genreMatch;
    });

    if (filteredBooks.length === 0) {
      // Display a message when there are no search results
      listMessage.style.display = "block"; // Show the message element
      itemsList.innerHTML = ""; // Clear the current itemsList content
    } else {
      // Hide the message and display filtered results when there are matches
      listMessage.style.display = "none"; // Hide the message element
      displayFilteredResults(filteredBooks);
    }

    // Calculate initial and remaining, update button state and content
    const initial = filteredBooks.length - page * BOOKS_PER_PAGE;
    const remaining = hasRemaining ? initial : 0;
    listButton.disabled = initial <= 0;

    listButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining})</span>
  `;

    searchOverlay.open = false;
  });

  // Handle form submission for settings overlay
  settingsOverlay.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  // Add a click event listener to each book preview
  previews.forEach((preview) => {
    preview.addEventListener("click", () => {
      // Code to open the overlay when a book preview is clicked
      listActive.showModal(); // Open the overlay
    });
  });

  // Handle click events on preview items
  itemsList.addEventListener("click", function (event) {
    const clickedPreview = event.target.closest(".preview");
    if (!clickedPreview) return; // Clicked outside a preview

    const bookId = clickedPreview.dataset.bookId;

    if (bookId) {
      activeBook = books.find((book) => book.id === bookId);

      if (activeBook) {
        // Create the book details overlay
        const bookDetailsOverlay = createBookDetailsOverlay(activeBook);

        // Append the overlay content to the overlay element
        listActive.innerHTML = ""; // Clear any previous content
        listActive.appendChild(bookDetailsOverlay);

        // Open the overlay
        listActive.showModal();
      }
    }
  });
});
