var command = process.argv[2];
var title = process.argv.slice(3).join(" ");
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var client = new twitter(keys.twitterKeys);
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotifyKeys);

liri();
log();

function log() {
  fs.appendFile("log.txt", command + " " + title + "\r\n", function(error) {
    if (error) {
      console.log(error);
    }
  });
}

function liri() {
	if(command === "my-tweets") {
		tweets();
	} else if (command === "spotify-this-song") {
		spotifySong();
	} else if (command === "movie-this"){
		movie();
	} else if (command === "do-what-it-says"){
		random();
	}
}
//	"my-tweets"
function tweets() {
	var params = {
		screen_name: "88LP18",
		count: 20
	};
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (!error) {
			tweets.forEach(function(tweet){
				console.log("Date:", tweet.created_at);
				console.log("Tweet:", tweet.text);
			});
		}
	});
}
//	"spotify-this-song"
function spotifySong() {
	if (title != null) {
		title = "The Sign Ace of Base";
	};
	spotify.search({ type: "track", query: title }, function(err, data) {
  	if (err) {
    	return console.log("Error occurred:", err);
  	} else {
  		var song = data.tracks.items[0];
			console.log("Song:", song.name);
			console.log("Artist:", song.artists[0].name);
			console.log("Album:", song.album.name);
			console.log("Preview Link:", song.preview_url);
		}
	});
}
//	"movie-this"
function movie() {
	if (title != null) {
 		title = "Mr. Nobody";
 	};
	var omdb = "http://www.omdbapi.com/?t=" + title +
 	"&y=&plot=short&apikey=40e9cece";
	request(omdb, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var movie = JSON.parse(body);
			console.log("Title:",  movie.Title);
			console.log("Plot:", movie.Plot);
			console.log("Actors:", movie.Actors);
			console.log("Year:", movie.Year);
			console.log("Country:", movie.Country);
			console.log("Language:", movie.Language);
			console.log("IMDB Rating:", movie.imdbRating);
			console.log("Rotten Tomatoes Rating:", movie.Ratings[1].Value);
		} else {
			console.log("Error:", error);
		}
	});
}
//	"do-what-it-says"
function random() {
	fs.readFile("random.txt", "utf8", function(error, data) {
	if (error) {
		return console.log(error);
	}
	var dataArr = data.split(",");
	command = dataArr[0];
	title = dataArr[1];
	liri();
	});
}
