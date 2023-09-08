const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  
  const data = {
    response: {
      requestType: "FETCH_ATHLETE_DATA",
      requestBy: "ALL_MATCHING_ATHLETES",
      forDisplay: "BEST_RACES",
  
      data: {
        NM372: {
          firstName: "Nwabisa",
          surname: "Masiko",
          id: "NM372",
          races: [
            {
              date: '2022-11-18T20:00:00.000Z',
              time: [9, 7, 8, 6],
            },
            {
              date: '2022-12-02T20:00:00.000Z',
              time: [6, 7, 8, 7],
            },
          ],
        },
  
        SV782: {
          firstName: "Schalk",
          surname: "Venter",
          id: "SV782",
          races: [
            {
              date: '2022-11-18T20:00:00.000Z',
              time: [10, 8, 3, 12],
            },
            {
              date: '2022-11-25T20:00:00.000Z',
              time: [6, 8, 9, 11],
            },
            {
              date: '2022-12-02T20:00:00.000Z',
              time: [10, 11, 4, 8],
            },
            {
              date: '2022-12-09T20:00:00.000Z',
              time: [9, 8, 9, 11],
            },
          ],
        },
      },
    },
  };


  const createHtml = (athlete) => {

    // Function to create HTML elements for displaying athlete information

    const { firstName, surname, id, races } = athlete;
    const latestRace = races[races.length - 1];

     // Extracting necessary information from the athlete object
  
    const fragment = document.createDocumentFragment();

      // Creating a document fragment to hold the generated HTML elements
  
    const title = document.createElement('h2');
    title.textContent = id;
    fragment.appendChild(title);
  
    const list = document.createElement('dl');
    // Creating a description list to display the athlete's details

    const date = new Date(latestRace.date);
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

     // Extracting and formatting the date of the latest race
  
    const totalMinutes = latestRace.time.reduce((acc, lapTime) => acc + lapTime, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
     // Calculating the total time of the latest race in hours and minutes

    list.innerHTML = /* html */ `
      <dt>Athlete</dt>
      <dd>${firstName} ${surname}</dd>
  
      <dt>Total Races</dt>
      <dd>${races.length}</dd>
  
      <dt>Event Date (Latest)</dt>
      <dd>${day} ${month} ${year}</dd>
  
      <dt>Total Time (Latest)</dt>
      <dd>${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}</dd>
    `;

     // Creating the HTML structure for the athlete's information
  
    fragment.appendChild(list);

    // Appending the description list to the document fragment

    return fragment;

     // Returning the document fragment containing the generated HTML
  }
  
  const athleteIds = Object.keys(data.response.data);
  
  athleteIds.forEach(athleteId => {
    const section = document.querySelector(`[data-athlete="${athleteId}"]`);
    if (section) {
      const athlete = data.response.data[athleteId];
      section.appendChild(createHtml(athlete));
    }
  });
  