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
        const priceChange = jsonResult.data.change;
        const supplyData = jsonSupply.data.supply;
        const priceData = jsonPrice.data.price;

        // Extract timestamps, prices, supply
        const timestamps = data.map(entry => entry.timestamp);
        const prices = data.map(entry => entry.price);
        const supply = supplyData['circulatingAmount']
        const marketCap = supply * priceData

        // Use timestamps to generate human-readable dates
        const dates = generateDates(timestamps, timeFrame);

        // Destroy the existing chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Continue with chart creation, including coin information and last known price
        createChart(dates.reverse(), prices.reverse(), selectedCoin);
        barChart(priceData, supply, selectedCoin, marketCapChart);
        displayPriceChange(priceChange, timeFrame, selectedCoin);
        displayMarketCap(marketCap);
        displayCurrentPrice(priceData);


    } catch (error) {
        console.error(error.message);
    }
}


function displayCurrentPrice(priceData, selectedCoin) {

    const roundedNumber = priceData;

    const currentPriceString = parseFloat(roundedNumber).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


    // Format the price change value
    const formattedCurrentPrice = '$' + currentPriceString

    // Get the HTML element by its ID (replace 'priceChangeElement' with the actual ID)
    const priceElement = document.getElementById('currentPrice');

    // Update the HTML content
    priceElement.textContent = `${nameSelection(selectedCoin)} Price in USD : ${formattedCurrentPrice}`;

}


function displayMarketCap(marketCap, selectedCoin) {

    const marketCapString = String(marketCap.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    // Format the price change value
    const formattedMarketCap = '$' + marketCapString

    // Get the HTML element by its ID (replace 'priceChangeElement' with the actual ID)
    const elements = document.getElementById('marketCapValue');

    // Update the HTML content
    elements.textContent = `${nameSelection(selectedCoin)} MCAP in USD: ${formattedMarketCap}`;

}



function displayPriceChange(priceChange, timeFrame, selectedCoin) {

    const priceChangeString = String(priceChange);

    // Format the price change value
    const formattedPriceChange = priceChangeString + '%'

    // Get the HTML element by its ID (replace 'priceChangeElement' with the actual ID)
    const element = document.getElementById('priceChange');

// Change the color based on the sign of priceChange
if (priceChange > 0) {
    element.style.color = 'green';
} else if (priceChange < 0) {
    element.style.color = 'red';
} else {
    // If priceChange is zero, you might want to handle it differently
    element.style.color = 'white';
}


    // Update the HTML content
    element.textContent = `${nameSelection(selectedCoin)} ${timeSelection(timeFrame)} Price Change: ${formattedPriceChange}`;

}


function timeSelection(timeFrame) {
    let time;
    switch (timeFrame) {
        case '5y':
            time = '5 Year';
            break;
        case '3y':
            time = '3 Year';
            break;
        case '1y':
            time = '1 Year';
            break;
        case '3m':
            time = '3 Month';
            break;
        case '30d':
            time = '30 Day';
            break;
        case '7d':
            time = '7 Day';
            break;
        case '24h':
            time = '24 Hour';
            break;
        case '3h':
            time = '3 Hour';
            break;
    }

    return time;
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
            scales: {
                y: {
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

    // Format market cap with commas and two decimal places
    const formattedMarketCap = marketCap.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Update the HTML element with the market cap
    document.getElementById('marketCapValue').textContent = `${nameSelection(selectedCoin)} MCAP in USD: $${formattedMarketCap}`;

    // Check if marketCapChart exists
    if (!marketCapChart) {
        // Create the bar chart
        const ctx = document.getElementById('marketCapChart').getContext('2d');
        marketCapChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [nameSelection(selectedCoin)],
                datasets: [{
                    label: 'Market Cap (USD)',
                    data: [marketCap],
                    backgroundColor: colorSelection(selectedCoin),
                    borderColor: colorSelection(selectedCoin),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value, index, values) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    } else {
        // Update the existing chart
        marketCapChart.data.labels = [nameSelection(selectedCoin)];
        marketCapChart.data.datasets[0].data = [marketCap];

        // Update border color and background color
        marketCapChart.data.datasets[0].backgroundColor = colorSelection(selectedCoin);
        marketCapChart.data.datasets[0].borderColor = colorSelection(selectedCoin);

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
