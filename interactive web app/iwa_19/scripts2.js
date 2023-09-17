import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  let matches = books;
  let page = 1;

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
  const listBlur = document.querySelector("#data-list-blur");
  const titleList = document.querySelector("data-list-title");
  const subtitleList = document.querySelector("#data-list-subtitle");
  const descriptionList = document.querySelector("#data-list-description");
  const searchGenres = document.getElementById("searchGenres");
  const titleSearch = document.getElementById("data-search-title");
  const settingsOverlay = document.querySelector("#data-settings-overlay");
  const mainSettings = document.getElementById("mainSettings");
  const themeCancel = document.getElementById("themeCancel");
  const saveTheme = document.getElementById("saveTheme");
  const searchButton = document.getElementById("searchButton");

  const css = {
    day: "10, 10, 20",
    night: "255, 255, 255",
  };

  const night = {
    day: "255, 255, 255",
    night: "10, 10, 20",
  };

  const fragment = document.createDocumentFragment();
  let extracted = books.slice(0, 36);
  let theme = "day";

  function displayFilteredResults(filteredBooks) {
    itemsList.innerHTML = ""; // Clear the current itemsList content

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

    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the results
  }

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
    const overlay = document.createElement("div");
    overlay.classList.add("data-list-active");
  
    // Create elements for book details
    const coverImage = document.createElement("img");
    coverImage.classList.add("data-list-image");
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
  
    // Append elements to the overlay
    overlay.appendChild(coverImage);
    overlay.appendChild(titleLabel);
    overlay.appendChild(authorLabel);
    overlay.appendChild(genreLabel);
    overlay.appendChild(yearLabel);
    overlay.appendChild(summaryLabel);
  
    return overlay;
  }

  // PREVIEW

  function createPreview({ author, id, image, title }) {
    const preview = document.createElement("div");
    preview.classList.add("preview"); // Add appropriate classes to your preview element

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
    authorElement.textContent = author;

    // Append the elements to the preview element
    preview.appendChild(imageElement);
    preview.appendChild(titleElement);
    preview.appendChild(authorElement);

    return preview;
  }

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
setTheme(theme);

  listButton.textContent =
    "Show more (" + (matches.length - page * BOOKS_PER_PAGE) + ")";

  listButton.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0);

  const hasRemaining = true; // You need to define 'hasRemaining' based on your logic

  listButton.innerHTML =
    /* html */
    `<span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>`;

  cancelSearch.addEventListener("click", function () {
    searchOverlay.open = false;
  });

  themeCancel.addEventListener("click", function () {
    settingsOverlay.open = false;
  });

  settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    actions.settings.submit();
  });

  closeList.addEventListener("click", function () {
    listActive.open = false;
  });

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

  searchHeader.addEventListener("click", function () {
    searchHeader.open = true;
    searchOverlay.open = true;
    titleSearch.focus();
  });

  mainSettings.addEventListener("click", function () {
    settingsOverlay.open = true;
  });

  saveTheme.addEventListener("click", function () {
    // Get the selected theme from the settings form
    const formData = new FormData(settingsForm);
    const selectedTheme = formData.get("theme");
  
    setTheme(selectedTheme);
    // Close the settings overlay
    settingsOverlay.style.display = "none";
  });
  
  
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  searchButton.addEventListener('click', function () {
      // Process the search and display results
  const formData = new FormData(searchForm);
  const filters = Object.fromEntries(formData);

    matches = books.filter((book) => {
        const titleMatch =
          filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch =
          filters.author === "any" || book.author === filters.author;
        const genreMatch =
          filters.genre === "any" || book.genres.includes(filters.genre);
  
        return titleMatch && authorMatch && genreMatch;
      });

        displayFilteredResults(matches);
        searchOverlay.open = false; 

    // Calculate initial and remaining, update button state and content
    const initial = result.length - page * BOOKS_PER_PAGE;
    const remaining = hasRemaining ? initial : 0;
    listButton.disabled = initial <= 0;

    listButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining})</span>
`;

    });

    // Handle form submission for settings overlay
    settingsOverlay.addEventListener("submit", function (event) {
      event.preventDefault();
    });

    // Handle click events on preview items
    itemsList.addEventListener("click", function (event) {
      const pathArray = Array.from(event.path || event.composedPath());
      let active;

      for (let i = 0; i < pathArray.length; i++) {
        const node = pathArray[i];
        if (active) break;
        const previewId = node?.dataset?.preview;

        active = books.find((book) => book.id === previewId);
      }

      if (!active) return;

       // Create the book details overlay
  const bookDetailsOverlay = createBookDetailsOverlay(active);

  // Append the overlay to the document body
  document.body.appendChild(bookDetailsOverlay);

    // Make the overlay visible
    bookDetailsOverlay.style.display = "block";
});

      // Update data fields based on the clicked item
      listActive.open = true;
      listBlur.style.backgroundImage = `url(${active.image})`;
      titleList.textContent = active.title;

      const authorYear = `${authors[active.author]} (${new Date(
        active.published
      ).getFullYear()})`;
      subtitleList.textContent = authorYear;
      descriptionList.textContent = active.description;
    });
 

