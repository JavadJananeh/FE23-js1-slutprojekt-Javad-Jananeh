$(document).ready(function() {
    const API_KEY = 'cca4b00d82a711c4ba09dfee9c47262d'
    const BASE_URL = 'https://api.themoviedb.org/3';
    const API_URL = BASE_URL + '/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&api_key=' + API_KEY;
    const IMG_URL = 'https://image.tmdb.org/t/p/w500';
    const searchURL = BASE_URL + '/search/multi?api_key=' + API_KEY;

    const main = $('#main');
    const form = $('#form');
    const search = $('#search');

    getMovies(API_URL);

    function getMovies(url) {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Warning: Do not search wrong again! (${res.status} - ${res.statusText})`);
                }
                return res.json();
            })
            .then(data => {
                if (data.results && data.results.length > 0) {
                    showMovies(data.results);
                } else {
                    showError('No results found.');
                }
            })
            .catch(error => {
                showError(`Error: ${error.message}`);
            });
    }

    function showMovies(data) {
        main.html('');
        data.forEach(movie => {
            const { title, poster_path, vote_average, overview, release_date } = movie;
            const movieEl = $('<div>').addClass('movie');
            movieEl.html(`
            <img src="${IMG_URL + poster_path}" alt="${title}">
            
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                <p>${release_date}</p>
                ${overview}
            </div>
            
            `);

            main.append(movieEl);
        });
    }

    function getColor(vote) {
        if (vote >= 8) {
            return 'green';
        } else if (vote >= 5) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    function showError(message) {
        main.html(`<div class="error">${message}</div>`);
    }

    form.on('submit', function (e) {
        e.preventDefault();

        const searchTerm = search.val();

        if (searchTerm) {
            getMovies(searchURL + '&query=' + searchTerm);
        } else {
            getMovies(API_URL);
        }
    });
});