import { useEffect, useState } from "react";
import axios from "axios";



const useFetch = ({ keyword }:{keyword:string}) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          api_key: process.env.GIPHY_KEY,
          q: keyword.split(" ").join(""),
          limit: 1,
        },
      });

      const data = response.data.data;
      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (error) {
      setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
