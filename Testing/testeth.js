async function fetchData(timeFrame){
const url = 'https://coinranking1.p.rapidapi.com/coin/razxDUgYGNAdQ/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fd1cb23f63msh41afddfa667a152p1396a8jsnc8033fd9f6f2',
		'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
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
							label: `${coinInfo.name} (${coinInfo.symbol})`,
							data: data,
							borderColor: '#FFD700',
							backgroundColor: 'rgba(255, 215, 0, 0.5)',
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
