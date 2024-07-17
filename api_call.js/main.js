document.getElementById('fetch-data-button').addEventListener('click', fetchData);
var cik = 0;
const fetchurl = 'https://data.sec.gov/api/xbrl/companyfacts/CIK'+ cik + '.json';
const button = document.getElementById('srcButton');
const input = document.getElementById('searchbar').value;

function searchTicker() {button.addEventListener('click',() => {
    cik = input.value;
    console.log(cik);
});}


function fetchData() {
    fetch(fetchurl)
        .then(response => response.json())
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // Clear any previous content
    data.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p>`;
        container.appendChild(div);
    });
}
