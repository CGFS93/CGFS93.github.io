let myChart; // Declare myChart outside functions for later reference

async function fetchData(timeFrame) {
    const url = `https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${timeFrame}`;
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
        const dates = timestamps.map(timestamp => new Date(timestamp * 1000).toLocaleDateString());

        // Destroy the existing chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Continue with chart creation
        createChart(dates.reverse(), prices.reverse());

    } catch (error) {
        console.error(error);
    }
}

function createChart(labels, data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bitcoin',
                data: data,
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: false, // Do not display x-axis
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
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
            },
            tooltips: {
                position: 'custom',
                callbacks: {
                    title: function(tooltipItem, data) {
                        return ''; // hide the title
                    },
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel;
                    }
                },
                custom: function(tooltipModel) {
                    const tooltipEl = document.getElementById('custom-tooltip');

                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'custom-tooltip';
                        document.body.appendChild(tooltipEl);
                    }

                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    tooltipEl.innerHTML = 'Custom Content: ' + tooltipModel.body[0].lines[0];
                    tooltipEl.style.left = tooltipModel.caretX + 'px';
                    tooltipEl.style.top = tooltipModel.caretY + 'px';
                    tooltipEl.style.opacity = 1;
                }
            }
        }
    });
}

function updateChart() {
    const selectedTimeFrame = document.getElementById('timeFrame').value;
    fetchData(selectedTimeFrame);
}

// Initial data fetch on page load
fetchData(document.getElementById('timeFrame').value);
