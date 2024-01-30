const axios = require('axios');
const fs = require('fs');

// Carrega as credenciais do Spotify do arquivo config.json
const configPath = './config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const spotifyClientId = config.clientId;
const spotifyClientSecret = config.clientSecret;

async function getSpotifyTrackId(nomeMusica, nomeArtista) {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64')}`,
        },
      }
    );

    const accessToken = response.data.access_token;

    const searchResponse = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `${nomeMusica} ${nomeArtista}`,
          type: 'track',
        },
      }
    );

    // Verifica se há resultados na resposta
    if (searchResponse.data.tracks.items.length > 0) {
      // Retorna o ID da primeira música encontrada
      return searchResponse.data.tracks.items[0].id;
    } else {
      // Se não houver resultados, retorna null ou algum valor indicativo de ausência de ID
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getFormattedMusicas() {
  try {
    // Faz a requisição para a API
    const response = await axios.get('https://api.music-flo.com/display/v1/browser/chart/1/list?mixYn=N');

    // Obtém as informações relevantes do JSON de resposta
    let rankCounter = 1;
    const musicas = response.data.data.trackList.map(async (track) => {
      const nomeMusica = track.name;
      const nomeArtista = track.representationArtist.name;

      // Obtém o ID da música no Spotify
      const spotifyTrackId = await getSpotifyTrackId(nomeMusica, nomeArtista);

      return {
        rank: rankCounter++,
        nomeMusica,
        nomeArtista,
        nomeAlbum: track.album.title,
        imagemAlbum: track.album.imgList[0].url,
        spotifyTrackId, // Adiciona o ID da música no Spotify ao objeto
      };
    });

    // Espera que todas as promessas sejam resolvidas antes de retornar
    return Promise.all(musicas);
  } catch (error) {
    throw error;
  }
}

module.exports = { getFormattedMusicas, getSpotifyTrackId };