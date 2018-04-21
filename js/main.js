// Constants
const button = document.getElementById('button');
const gallery = document.getElementById('movie-gallery');
const searchForm = document.getElementById('searchForm');
const searchText = document.getElementById('searchText');
const lightBox = document.getElementById('lightbox');

// Variables
var movieData = new Array();
var movieId = new Array();
var imdbData = new Array();

var meta;
var metaRating;
   
var rotten;
var rottenRating;

var imdb; 
var rottenRating;

// Create event listener
searchForm.addEventListener('submit', function(e){
  e.preventDefault();

  searchMovies(function(){

   idHandler(function(i){

      ratingHandler(i);

   }); 
   
  });

});

// ================================== searchMovies() function ==================================
function searchMovies(callback){
  var input = searchText.value; 
  // Reset movie Id's on every search
  movieId = [];

  // Create XHR Object
  var xhr = new XMLHttpRequest();

  // function - open(TYPE, url/file, "boolean" async)
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=5df7d00a&s='+input, true);

  xhr.onload = function(){
    if(this.status === 200){
      var data = JSON.parse(xhr.responseText);
      
      for (var i = 0; i < data.Search.length; i++) {
        
        movieId.push(data.Search[i].imdbID);
      }

      callback();

    } else if(this.status === 404) {
      gallery.innerHTML = 'NOT FOUND!!!';
    }
  }

  xhr.onerror = function(){
    gallery.InnerHTML = 'Request error...';
  }

  // Sends request

  xhr.send();
  
} // END of searchMovies()

// ================================== idHandler() function ==================================
var idHandler = function(cb) {
  var output = '';
  
  var xhr2 = [], i;
  for(i = 0; i < movieId.length; i++){ //for loop
    (function(i){

      xhr2[i] = new XMLHttpRequest();

      url = 'http://www.omdbapi.com/?apikey=5df7d00a&i='+movieId[i];

      xhr2[i].open("GET", url, true);

      xhr2[i].onreadystatechange = function(){

        if (xhr2[i].readyState === 4 && xhr2[i].status === 200){

          imdbData = JSON.parse(xhr2[i].responseText);

          output += `
          <div class="card">

            <div class="card__img-container">
              ${getCardPoster(imdbData)}
            </div>
            <div class="card__rotating-part">
              <div class="card__front">

                <div class="card__front-left">
                  <div class="card__front-left--container">
                    <h3 class="h-3">${imdbData.Title}</h4><span>(${imdbData.Year}) - ${getType(imdbData.Type)}</span>

                    <h4 class="h-4">Gen:</h4>
                    <ul class="card__ratings">
                      ${imdbData.Genre}
                    </ul>
                  </div>
                </div>

                <div class="card__front-right">
                  <div class="card__front-right--container">
                    <h4 class="h-4 mb-xs">Evaluari:</h4>
                    <ul class="card__ratings">
                        ${getRatings(imdbData.Ratings)}
                    </ul>
                  </div>

                </div>
              </div>

              <div class="card__back">
                <p>${imdbData.Plot}</p>
                <button class="btn btn--yellow" onclick="getMoreDetails('${movieId[i]}')">Detalii++</button>
              </div>
            </div>
          </div>
          `;

          gallery.innerHTML = output;

          cb(i);

        }
      };
      
      xhr2[i].send();

      
    })(i);

  }


} // END OF idHandler()

// ================================== getCardPoster() function ==================================
function getCardPoster(data) {
  if(data.Poster === 'N/A') {
    return `<div class="card__img-not-found">
      <p>${data.Title}</p>
    </div>`;
  } else {
    return `<img class="card__img" src="${data.Poster}" alt="${data.Title} poster">`;
  }
}

// ================================== getRatings() function ==================================
function getRatings(rating){
  var result = '';

  for (var i = 0; i < 3; i++) {

    if(rating.hasOwnProperty('Source') && rating[0].Source === 'Internet Movie Database') {
      rating[0].Source = 'IMDb';
    }

    if(rating[i] === undefined){
      rating[i] = {};
      rating[i].Value = 'N/A';
    }
  }

  result += `                
            <div class="card__ratings--top">
              <li class='imdb'>IMDb</li>
              <li class='imdb-rating'>${rating[0].Value}</li>
            </div>

            <div class="card__ratings--middle">
              <li class='rotten'>
                <svg class="rotten__icon"> <use xlink:href="img/Twemoji_1f345.svg#svg2"></use> </svg>
                <p>meter</p>
              </li>
              <li class='rotten-rating'>${rating[1].Value}</li>
            </div>

            <div class="div card__ratings--down">
              <li class='meta'>Metascore</li>
              <li class='meta-rating'>${rating[2].Value}</li>
            </div>
`
  return result;
}

// ================================== getType() function ==================================
function getType(type) {
  if(type === 'movie'){
    type = 'Film';
  } else if (type === 'series'){
    type = 'Serial';
  } else if (type === 'game'){
    type = 'Joc';
  } 
    
  return type;
}

// ================================== ratingHandler() function ==================================
var ratingHandler = function(i) {

  meta = document.querySelectorAll('.meta');
  metaRating = document.querySelectorAll('.meta-rating');

  rotten = document.querySelectorAll('.rotten');
  rottenRating = document.querySelectorAll('.rotten-rating');

  imdb = document.querySelectorAll('.imdb');
  imdbRating = document.querySelectorAll('.imdb-rating');

  for(var j = 0; j < meta.length; j++){
  
    var metaParse = metaRating[j].innerText.split('/')[0];
    if(parseInt(metaParse) < 40) {
      metaRating[j].classList.add('bc-red');
      
    } else if (parseInt(metaParse) < 60){
      metaRating[j].classList.add('bc-yellow');
      
    } else if (parseInt(metaParse) <= 100){
      metaRating[j].classList.add('bc-green');
      
    } else {
      metaRating[j].classList.add('bc-grey');
      
    }

    var imdbParse = imdbRating[j].innerText.split('/')[0];
    if(parseInt(imdbParse) < 4) {
      imdbRating[j].classList.add('bc-red');
      
    } else if (parseInt(imdbParse) < 6){
      imdbRating[j].classList.add('bc-yellow');
      
    } else if (parseInt(imdbParse) <= 10){
      imdbRating[j].classList.add('bc-green');
      
    } else {
      imdbRating[j].classList.add('bc-grey');
      
   }

    var rottenParse = rottenRating[j].innerText.split('%')[0];
    if(parseInt(rottenParse) < 40) {
      rottenRating[j].classList.add('bc-red');
      
    } else if (parseInt(rottenParse) < 60){
      rottenRating[j].classList.add('bc-yellow');
      
    } else if (parseInt(rottenParse) <= 100){
      rottenRating[j].classList.add('bc-green');
      
    } else {
      rottenRating[j].classList.add('bc-grey');
      
    }

  }
}

// // ================================== getMoreDetails() function ==================================
function getMoreDetails(theId) {
  console.log(theId);
  var theResult = '';
  
  var xhr3;

  xhr3 = new XMLHttpRequest();

  xhr3.open("GET", 'http://www.omdbapi.com/?apikey=5df7d00a&i='+theId, true);

  xhr3.onload = function(){
    if (xhr3.readyState === 4 && xhr3.status === 200){
  
      var theMovie = JSON.parse(xhr3.responseText);

      theResult = `
      <div class="lightbox">
        <div class="lightbox__content">
          <div class="lightbox__left">
            <div class="lightbox__img-container">
            ${getLightBoxPoster(theMovie)}
            </div>
          </div>
          <div class="lightbox__right">
  
            <div class="lightbox__details">
              <div class="lightbox__details--left">
                <ul>
                  <li>Titlu:</li>
                  <li>An:</li>
                  <li>Lansat:</li>
                  <li>Durata:</li>
                  <li>Premii:</li>
                  <li>Bilete:</li>
                  <li>Tara:</li>
                  <li>DVD:</li>
                  <li>Director:</li>
                  <li>Limba:</li>
                  <li>Productie:</li>
                  <li>Scriitor:</li>
                  <li>Vot IMDb:</li>
                  <li>Actori:</li>
                </ul>
              </div>
              <div class="lightbox__details--right">
                <ul>
                  <li>${theMovie.Title || 'indisponibil'}</li>
                  <li>${theMovie.Year || 'indisponibil'}</li>
                  <li>${theMovie.Released || 'indisponibil'}</li>
                  <li>${theMovie.Runtime || 'indisponibil'}</li>
                  <li>${theMovie.Awards || 'indisponibil'}</li>
                  <li>${theMovie.BoxOffice || 'indisponibil'}</li>
                  <li>${theMovie.Country || 'indisponibil'}</li>
                  <li>${theMovie.DVD || 'indisponibil'}</li>
                  <li>${theMovie.Director || 'indisponibil'}</li>
                  <li>${theMovie.Language || 'indisponibil'}</li>
                  <li>${theMovie.Production || 'indisponibil'}</li>
                  <li>${theMovie.Writer.split(',')[0] || 'indisponibil'}</li>
                  <li>${theMovie.imdbVotes || 'indisponibil'}</li>
                  <li>${theMovie.Actors || 'indisponibil'}</li>
                </ul>
              </div>
            </div>
            <a href="http://imdb.com/title/${theMovie.imdbID}" target="_blank" class="btn btn--yellow">Vezi pe IMDB</a>
            </div>
          </div>
        </div>
      </div>
      `;

      console.log(theMovie);
      lightBox.innerHTML = theResult;
    }
  }

  xhr3.onerror = function(){
    lightBox.InnerHTML = 'Request error...';
  }

  xhr3.send();
}
      
// ================================== lightbox event listener ==================================
lightBox.addEventListener('click', function() {
  this.removeChild(this.firstElementChild);
});

// ================================== getLightBoxPoster() function ==================================
function getLightBoxPoster(data) {
  if(data.Poster === 'N/A') {
    return '';
  } else {
    return `<img class="lightbox__img" src="${data.Poster}" alt="${data.Title} poster">`;
  }
}