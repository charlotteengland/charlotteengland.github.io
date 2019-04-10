'use strict';

const app_key = 'abd0b0265f32659fd57f4c9185cb9543';
const app_id = '702fddab';
const searchURL = 'https://api.edamam.com/search';

//still not understanding whhy params goes in the oObject.keys method
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key =>
        `${encodeURIComponent (key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}

function displayResults (responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    let allRecipes = "";
    if ( responseJson.count > 0){
      for (let i = 0; i < responseJson.hits.length; i++)  {
          
          allRecipes += 
              `<div class="recipeContainer">
                  <h3>${responseJson.hits[i].recipe.label}</h3>
                  <p>
                  <img class="recipeImage" src="${responseJson.hits[i].recipe.image}"
                  </p>
                  <p class="calories">Calories: ${responseJson.hits[i].recipe.calories}</p>
                  <p class="ingredients-title">Ingredients list</p>
                  <ul>
              `;
          
          for (let j = 0; j < responseJson.hits[i].recipe.ingredients.length; j++) {
              console.log(responseJson.hits[i].recipe.ingredients[j]);

            allRecipes += 
                `<li class="ingredients-list">${responseJson.hits[i].recipe.ingredients[j].text}</li>`
          
          }

          allRecipes += 
              `</ul>
               <p class="recipeLink">
                  <a class="recipeImage" href="${responseJson.hits[i].recipe.url}" target="blank">See Full Recipe by ${responseJson.hits[i].recipe.source}</h3> Here</a>
               </p>
               </div>`
          
    
      }
      $('#results-list').html(allRecipes);
    }
    else{
      $('#results-list').html(`<p> There are no results with your search terms </p>`);
    }   
    
    $('#results').removeClass('hidden');
    
}


function getRecipeList(query, currentDiet) {
    const params = {
        app_id: app_id,
        app_key: app_key,
        q: query
    };

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString + ( (currentDiet == "") ? "" : `&diet=${currentDiet}` );
    console.log(url);

    fetch (url)
        .then (response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error (response.statusJson);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong:
        ${err.message}`);
    });
}

function watchForm() {
    $('form').submit(event => {
        $('.appStart').remove();
        $('.header-image').remove();
        $('#results-list').removeClass('hidden');
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const currentDiet = $('#js-diet').val();
        getRecipeList(searchTerm, currentDiet);
        });
}
$(watchForm);