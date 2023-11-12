let myChart; // Declare myChart outside functions for later reference

async function fetchData(timeFrame, selectedCoin) {
    const url = `https://coinranking1.p.rapidapi.com/coin/${selectedCoin}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${timeFrame}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fd1cb23f63msh41afddfa667a152p1396a8jsnc8033fd9f6f2',
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const jsonResult = await response.json();

        // Extract data from the API response
        const data = jsonResult.data.history;

        // Extract timestamps and prices
        const timestamps = data.map(entry => entry.timestamp);
        const prices = data.map(entry => entry.price);

        // Use timestamps to generate human-readable dates
        const dates = generateDates(timestamps, timeFrame);


        // Destroy the existing chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Continue with chart creation, including coin information
        createChart(dates.reverse(), prices.reverse(), selectedCoin);

    } catch (error) {
        console.error(error);
    }
}

function generateDates(timestamps, timeFrame) {
  // Choose the date format based on the time frame
  let dateFormat;
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  switch (timeFrame) {
      case '5y':
      case '3y':
      case '1y':
          dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
          break;
      case '3m':
          dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
          break;
      case '30d':
      case '7d':
          dateFormat = { weekday:'short', day: 'numeric', month: 'short'};
          break;
      case '24h':
      case '3h':
          dateFormat = { hour: 'numeric', minute: 'numeric', hour12: true };
          break;
      default:
          dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
  }

  // Use timestamps to generate human-readable dates
  return timestamps.map(timestamp => {
      if (timeFrame === '24h' || timeFrame === '3h') {
          // For 24h and 3h, display only time
          return new Date(timestamp * 1000).toLocaleTimeString('en-US', dateFormat);
      } else {
          // For other cases, display the full date
          return new Date(timestamp * 1000).toLocaleDateString('en-US', dateFormat);
      }
  });
}

function nameSelection(selectedCoin) {
    switch (selectedCoin) {
        case 'Qwsogvtv82FCd':
            Name = "Bitcoin (BTC)"
            break;

        case 'razxDUgYGNAdQ':
            Name = "Ethereum (ETH)"
            break;
        case 'VLqpJwogdhHNb':
            Name = "Chainlink (LINK)"
            break;
    }

    return Name
}

function colorSelection(selectedCoin) {
    switch (selectedCoin) {
        case 'Qwsogvtv82FCd':
            color = 'rgba(255, 215, 0, 0.5)'
            break;

        case 'razxDUgYGNAdQ':
            color = 'rgba(138, 43, 226, 0.5)'
            break;
            case 'VLqpJwogdhHNb':
            color = 'rgba(0, 0, 255, 0.5)'
            break;
    }

    return color
}

function createChart(labels, data, selectedCoin) {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: nameSelection(selectedCoin), // Display coin name and symbol
                data: data,
                borderColor: colorSelection(selectedCoin),
                backgroundColor: colorSelection(selectedCoin),
                borderWidth: 3,
                fill: false
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false // Hide the legend
                }
            },
            elements: {
                point: {
                    radius: 0 // Hide the points on the line
                }
            }
        }
    });
}

function updateChart() {
    const selectedCoin = document.getElementById('coin').value;
    const selectedTimeFrame = document.getElementById('timeFrame').value;
    fetchData(selectedTimeFrame, selectedCoin);
}

// Initial data fetch on page load
fetchData(document.getElementById('timeFrame').value, document.getElementById('coin').value);
