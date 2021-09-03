require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,  //dotenv -> process.env.
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', async (req, res) => {
    
    const data = await spotifyApi.searchArtists(req.query.artistName);
    console.log(data.body.artists);
    const allArtists = data.body.artists.items;
    res.render('artist-search-results', {artists: allArtists});
});

app.get('/albums/:artistId', async (req, res) => {
    const artistAlbums = await spotifyApi.getArtistAlbums(req.params.artistId);
    console.log(artistAlbums.body.items);
    res.render('albums', { artistAlbums:  artistAlbums.body.items});
});

app.get('/album-tracks/:albumId', async (req, res) => {
    const albumTracks = await spotifyApi.getAlbumTracks(req.params.albumId);
    console.log(albumTracks.body.items);
    res.render('tracks', {albumTracks: albumTracks.body.items});
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
