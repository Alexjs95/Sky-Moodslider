/* Created by: Alex Scotson-Brierley
 * Last modified: 09/11/2018
 * Description: The functions necessary to work alongside index.html
 *              for a moodslider application that shows the user movies
 *              depending on their chosen mood.
 * Contraints: The application does not allow for multiple moods to be selected
 *             at any given time.
 */

var moods = ["Sad", "Happy", "Tired", "Energetic", "Restless", "Calm", "Scared", "Fearless"];
var selectedMoods = [];
var movieMoodList = [];

$('input[type="range"]').change(function () {
    /* This function detects the movement of the 4 sliders.
     * It takes the users input and checks the position.
     */
    var sliderVal;
    
    // Checks that a file has been uploaded.
    if (movieMoodList.length === 0) {
        alert("You must upload content before using the sliders.");
        sliderReset();
        return;
    }
    
    sliderVal = $(this).val();

    // Checks the slider position. 
    // If slider position is in the middle then unselected moods are removed.
    
    if (sliderVal % 1 === 0.5) {
        sliderReset();
        if (selectedMoods.length > 0) {
            sliderVal = moods.indexOf(selectedMoods[0]);
        } else {
            reset();
            return;
        }
    } 
    getMovies(moods[sliderVal]);
});



function getMovies(sliderVal) {
    /* This function accepts the chosen mood and compares that against 
     * an array of movies, selecting only those that match that mood. 
     * Those movies' names and images are then displayed on index.html.
     */
    var i, movies, name, image;
    
    selectedMoods.push(sliderVal);
    
    if (selectedMoods.length > 1) {
        alert("You can only select 1 mood at a time, Please try again");
        reset();
    } else{
        movies = movieMoodList[sliderVal];
 
        if (movies === undefined) {
            movies = null;
        }

        if (movies != null) {
            // Retrieves the relevant movies based on the selected mood.
            for (i = 0; i < movies.length; i++) {
                name = movieMoodList[sliderVal][i].movieName;
                image = movieMoodList[sliderVal][i].movieImage;
                // Amends the no content text and image with the movie name and movie image.
                $("#img" + i).attr("src", image);
                $("#name-" + i).text(name);
            } 
        }
    }
}

function sliderReset() {
    // Function to reset the position of the sliders.
    $('input[type="range"]').val("");
    selectedMoods = [];
}

function reset() {
    // This function resets the text and image of no content and the sliders.
    $(".img-movie").attr("src","images/blank.png");
    $(".name-movie").text("No Content");
    sliderReset();
}

$(".uploadContent").change(function (event) {
    /* this function reads a file and creates objects 
     * to be stored in an array allowing to get the
     * relavant movies based on the chosen mood.
     */
    var file = event.target.files;
    var fileRead = new FileReader();

    fileRead.readAsText(file[0]);

    fileRead.onload = function() {
        var xml = new DOMParser().parseFromString(this.result, "text/xml");
        var xmlMovies = $(xml.documentElement);
        
        $(xmlMovies).find('programme').each(function () { 
            var $movie = $(this);
            var movieName = $movie.find("name").text();
            var movieImage = $movie.find("image").text();
            var movieMood = $movie.find("mood").text();

            var movie = {
                movieName: movieName,
                movieImage: movieImage
            };

            var splitMood = movieMood.split("+");
            if(splitMood.length > 1){
                movieMood = splitMood.sort().join('+');
            }

            if(movieMoodList.indexOf(movieMood) == -1) {
                movieMoodList.push(movieMood);
                movieMoodList[movieMood] = [];
            }
            movieMoodList[movieMood].push(movie);
        });
        alert("File has been uploaded");
    };
});

