let myChart; // Declare myChart outside functions for later reference
var mykey = config.MY_KEY;

async function fetchData(timeFrame, selectedCoin) {
    const url = `https://coinranking1.p.rapidapi.com/coin/${selectedCoin}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${timeFrame}`;
    const supply_url = `https://coinranking1.p.rapidapi.com/coin/${selectedCoin}/supply`;
    const price_url = `https://coinranking1.p.rapidapi.com/coin/${selectedCoin}/price?referenceCurrencyUuid=yhjMzLPhuIDl`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': mykey,
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
    };

    try {
        // Fetch Calls
        const response = await fetch(url, options);
        const supplyCall = await fetch(supply_url, options);
        const priceCall = await fetch(price_url, options);

        // Check if any of the fetch calls failed
        if (!response.ok || !supplyCall.ok || !priceCall.ok) {
            throw new Error('Failed to fetch data');
        }

        const jsonResult = await response.json();
        const jsonSupply = await supplyCall.json();
        const jsonPrice = await priceCall.json();

        // Extract data from the API response
        const data = jsonResult.data.history;
        const supplyData = jsonSupply.data.supply;
        const priceData = jsonPrice.data.price;

        // Extract timestamps, prices, supply
        const timestamps = data.map(entry => entry.timestamp);
        const prices = data.map(entry => entry.price);
        const supply = supplyData['circulatingAmount']


        // Use timestamps to generate human-readable dates
        const dates = generateDates(timestamps, timeFrame);

        // Destroy the existing chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Continue with chart creation, including coin information and last known price
        createChart(dates.reverse(), prices.reverse(), selectedCoin);
        barChart(priceData, supply, selectedCoin);

    } catch (error) {
        console.error(error.message);
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

let marketCapChart; // Declare marketCapChart outside functions for later reference

function barChart(priceData, supply, selectedCoin) {
    // Calculate market cap
    const marketCap = priceData * supply;

    // Check if marketCapChart exists
    if (!marketCapChart) {
        // Create the bar chart
        const ctx = document.getElementById('marketCapChart').getContext('2d');
        marketCapChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [nameSelection(selectedCoin)], // Use an array for labels
                datasets: [{
                    label: 'Market Cap (USD)',
                    data: [marketCap], // Use an array for data
                    borderColor: 'rgba(255, 215, 0, 0.5)',
                    backgroundColor: 'rgba(255, 215, 0, 0.5)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        // Include a dollar sign in the ticks
                        ticks: {
                            callback: function (value, index, values) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide the legend
                    }
                }
            }
        });
    } else {
        // Update the existing chart
        marketCapChart.data.labels = [nameSelection(selectedCoin)];
        marketCapChart.data.datasets[0].data = [marketCap];

        // Update border color and background color
        marketCapChart.data.datasets[0].backgroundColor = colorSelection(selectedCoin); // Update to your desired background color
        marketCapChart.data.datasets[0].borderColor = colorSelection(selectedCoin); // Update to your desired border color

        marketCapChart.update();
    }

}




function updateChart() {
    const selectedCoin = document.getElementById('coin').value;
    const selectedTimeFrame = document.getElementById('timeFrame').value;
    fetchData(selectedTimeFrame, selectedCoin);
}

// Initial data fetch on page load
fetchData(document.getElementById('timeFrame').value, document.getElementById('coin').value);
