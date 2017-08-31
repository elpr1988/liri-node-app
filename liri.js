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
				var data = "Date: " + tweet.created_at + "\r\nTweet: " + tweet.text;
				console.log("Date:", tweet.created_at);
				console.log("Tweet:", tweet.text);
				fs.appendFile("log.txt", command + " " + title + "\r\n" + data + "\r\n", function(error) {
    			if (error) {
      			console.log(error);
    			}
  			});
			});
		}
	});
}
//	"spotify-this-song"
function spotifySong() {
	if (title.length < 1) {
		title = "The Sign Ace of Base";
	};
	spotify.search({ type: "track", query: title }, function(err, data) {
  	if (err) {
    	return console.log("Error occurred:", err);
  	} else {
  		var song = data.tracks.items[0];
			var	data = "Song: " + song.name + "\r\nArtist: " + song.artists[0].name +
  			"\r\nAlbum: " + song.album.name + "\r\nPreview Link: " + song.preview_url;
			console.log("Song:", song.name);
			console.log("Artist:", song.artists[0].name);
			console.log("Album:", song.album.name);
			console.log("Preview Link:", song.preview_url);
			fs.appendFile("log.txt", command + " " + title + "\r\n" + data + "\r\n", function(error) {
    		if (error) {
      		console.log(error);
    		}
  		});
		}
	});
}
//	"movie-this"
function movie() {
	if (title.length < 1) {
 		title = "Mr. Nobody";
 	};
	var omdb = "http://www.omdbapi.com/?t=" + title +
 	"&y=&plot=short&apikey=40e9cece";
	request(omdb, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var movie = JSON.parse(body);
			var data = "Title: " + movie.Title + "\r\nPlot: " + movie.Plot + "\r\nActors: " + movie.Actors +
			"\r\nYear: " + movie.Year + "\r\nCountry: " + movie.Country + "\r\nLanguage: " + movie.Language +
			"\r\nIMDB Rating: " + movie.imdbRating + "\r\nRotten Tomatoes Rating: " + movie.Ratings[1].Value;
			console.log("Title:",  movie.Title);
			console.log("Plot:", movie.Plot);
			console.log("Actors:", movie.Actors);
			console.log("Year:", movie.Year);
			console.log("Country:", movie.Country);
			console.log("Language:", movie.Language);
			console.log("IMDB Rating:", movie.imdbRating);
			console.log("Rotten Tomatoes Rating:", movie.Ratings[1].Value);
			fs.appendFile("log.txt", command + " " + title + "\r\n" + data + "\r\n", function(error) {
    		if (error) {
      		console.log(error);
    		}
  		});
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
