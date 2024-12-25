import axios from 'axios';
import {createContext, useEffect, useState} from 'react';

const ArtistsContext = createContext();

const ArtistsProvider = ({children}) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getArtists = async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/search/',
      params: {
        q: 'Türkiye de popüler',
        type: 'artists',
        offset: '0',
        limit: '10',
        numberOfTopResults: '5',
      },
      headers: {
        'x-rapidapi-key': '36adc9c89cmsh9a29989a171b9afp13b519jsn97cd3c63fb9f',
        'x-rapidapi-host': 'spotify23.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const data = response.data.artists.items;
      setArtists(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getArtists();
  }, []);
  return (
    <ArtistsContext.Provider value={{artists, loading, error}}>
      {children}
    </ArtistsContext.Provider>
  );
};

export {ArtistsContext, ArtistsProvider};
