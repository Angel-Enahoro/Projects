import { html } from './view.js'

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {
    // Get the orderId from the dragged element's dataset
    const orderId = event.target.dataset.id;
    if (!orderId) return;

    // Update the dragging state with the source orderId
    updateDragging({ source: orderId });
    
    // Set the data being transferred during drag-and-drop
    event.dataTransfer.setData('text/plain', orderId);
}

// Existing handleDragEnd code
const handleDragEnd = (event) => {
    // Clear the dragging state
    updateDragging({ source: null });

    // Clear dragging hover effects
    updateDraggingHtml({ over: null });
}

// Existing handleHelpToggle code
const handleHelpToggle = (event) => {
    // Toggle the visibility of the help overlay
    html.help.overlay.classList.toggle('overlay--visible');
    
    // Set focus appropriately based on overlay visibility
    if (html.help.overlay.classList.contains('overlay--visible')) {
        html.help.overlay.focus();
    } else {
        html.other.add.focus();
    }
}

// Existing handleAddToggle code
const handleAddToggle = (event) => {
    // Toggle the visibility of the add overlay
    html.add.overlay.classList.toggle('overlay--visible');

    // Clear input fields and set initial table value
    html.add.title.value = '';
    html.add.table.value = TABLES[0];

    // Set focus appropriately based on overlay visibility
    if (html.add.overlay.classList.contains('overlay--visible')) {
        html.add.overlay.focus();
    } else {
        html.other.add.focus();
    }
}

// Existing handleAddSubmit code
const handleAddSubmit = (event) => {
    event.preventDefault();
    const title = html.add.title.value;
    const table = html.add.table.value;
    
    // Check if title and table are provided
    if (title && table) {
        // Create a new order object
        const order = createOrderData({ title, table, column: 'ordered' });

        // Update app state and UI
        state.orders[order.id] = order;
        html.columns.ordered.appendChild(createOrderHtml(order));

        // Hide the add overlay
        html.add.overlay.classList.remove('overlay--visible');

        // Set focus back to the "Add Order" button
        html.other.add.focus();
    }
}

// Existing handleEditToggle code
const handleEditToggle = (event) => {
    const orderId = event.target.dataset.id;
    if (!orderId) return;

    // Get the order to edit from the app state
    const order = state.orders[orderId];
    if (!order) return;

    // Populate edit overlay inputs with order details
    html.edit.title.value = order.title;
    html.edit.table.value = order.table;
    html.edit.id.value = order.id;
    html.edit.column.value = order.column;

    // Toggle the visibility of the edit overlay
    html.edit.overlay.classList.toggle('overlay--visible');

    // Set focus appropriately based on overlay visibility
    if (html.edit.overlay.classList.contains('overlay--visible')) {
        html.edit.overlay.focus();
    } else {
        html.other.add.focus();
    }
}

// Existing handleEditSubmit code
const handleEditSubmit = (event) => {
    event.preventDefault();
    const orderId = html.edit.id.value;
    const order = state.orders[orderId];
    if (!order) return;

    // Update order details based on input values
    const newTitle = html.edit.title.value;
    const newTable = html.edit.table.value;
    const newColumn = html.edit.column.value;

    // Check if newTitle, newTable, and newColumn are provided
    if (newTitle && newTable && newColumn) {
        // Update order details
        order.title = newTitle;
        order.table = newTable;
        order.column = newColumn;

        // Hide the edit overlay
        html.edit.overlay.classList.remove('overlay--visible');

        // Move the order to the new column in the UI
        moveToColumn(orderId, newColumn);

        // Set focus back to the "Add Order" button
        html.other.add.focus();
    }
}


const handleDelete = (event) => {
    const orderId = html.edit.id.value;
    const order = state.orders[orderId];
    if (!order) return;

    // Remove the order from app state and UI
    delete state.orders[orderId];
    const htmlSource = document.querySelector(`[data-id="${orderId}"]`);
    if (htmlSource) {
        htmlSource.remove();
    }

    // Hide the edit overlay
    html.edit.overlay.classList.remove('overlay--visible');

    // Set focus back to the "Add Order" button
    html.other.add.focus();
}

// Event listeners

document.addEventListener("DOMContentLoaded", () => {

// Add event listeners to UI elements
html.add.cancel.addEventListener('click', handleAddToggle);
html.other.add.addEventListener('click', handleAddToggle);
html.add.form.addEventListener('submit', handleAddSubmit);

html.other.grid.addEventListener('click', handleEditToggle);
html.edit.cancel.addEventListener('click', handleEditToggle);
html.edit.form.addEventListener('submit', handleEditSubmit);
html.edit.delete.addEventListener('click', handleDelete);

html.help.cancel.addEventListener('click', handleHelpToggle);
html.other.help.addEventListener('click', handleHelpToggle);

// Add drag-and-drop event listeners
for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart);
    htmlColumn.addEventListener('dragend', handleDragEnd);
    htmlColumn.addEventListener('dragover', handleDragOver); // Add this line
}


for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver);
}

html.other.add.focus();
})