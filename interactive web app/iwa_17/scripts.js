// scripts.js

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

// Only edit below 

const createArray = (length) => {
    const result = [];

    for (let i = 0; i < length; i++) {
        result.push(i);
    }

    return result;
};

// Function to create the data structure for the calendar
const createData = () => {
    const current = new Date();
    current.setDate(1); // Set the date to the 1st of the current month

    const startDay = current.getDay(); // Get the day of the week for the 1st of the month
    const daysInMonth = getDaysInMonth(current); // Get the total number of days in the current month

    const weeks = createArray(5); // Create an array representing weeks (5 weeks)
    const days = createArray(7); // Create an array representing days (0-6 for Sunday to Saturday)

    const result = []; // The final data structure to hold the calendar data

    for (const weekIndex of weeks) {
        result.push({
            week: weekIndex + 1, // Week number, starting from 1
            days: [] // Array to hold days of the week
        });

        for (const dayIndex of days) {
            const day = (dayIndex - startDay) + (weekIndex * 7) + 1;
            // Calculate the day of the month based on start day and week index
            const isValid = day > 0 && day <= daysInMonth; // Check if the day is valid

            result[weekIndex].days.push({
                dayOfWeek: dayIndex + 1, // Day of the week (0-6, where 0 is Sunday)
                value: isValid ? day : '', // Day value (date of the month) or empty string if not valid
            });
        }
    }

    return result; // Return the final calendar data structure
};

// Function to add a cell to the HTML table

const addCell = (existing, classString, value) => {
    const result = /* html */ `
        ${existing}
        <td class="${classString}">
            &nbsp;${value}&nbsp;
        </td>
    `;

    return result;
};

// Function to create the HTML structure for the calendar

const createHtml = (data) => {
    let result = ''; // String to hold the HTML content

    for (const { week, days } of data) {
        let inner = ''; // String to hold the inner content of each row

        inner = addCell(inner, 'table__cell table__cell_sidebar', `Week ${week}`);
        // Add a cell for the week number to the inner content

        for (const { dayOfWeek, value } of days) {
            const isToday = new Date().getDate() === value; // Check if the day is today
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Check if it's a weekend day
            const isAlternate = week % 2 === 0; // Check if it's an alternate week

            let classString = 'table__cell'; // Default class string for the cell

            if (isToday) classString = `${classString} table__cell_today`; // Highlight today's date
            if (isWeekend) classString = `${classString} table__cell_weekend`; // Apply weekend styling
            if (isAlternate) classString = `${classString} table__cell_alternate`; // Apply alternate week styling

            inner = addCell(inner, classString, value); // Add the cell with appropriate class and value
        }

        result = `
            ${result}
            <tr>${inner}</tr>
        `; // Add the row with inner content to the result
    }
    
    return result; // Return the final HTML content
};

// Only edit above


// Get the current date
const current = new Date();

// Set the title of the calendar to display the current month and year
document.querySelector('[data-title]').innerText = `${MONTHS[current.getMonth()]} ${current.getFullYear()}`;

// Create the calendar data structure
const data = createData();

// Populate the HTML table with the calendar content
document.querySelector('[data-content]').innerHTML = createHtml(data);
