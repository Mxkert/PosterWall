import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const posters = [
  {
    title: 'Siri',
    genre: 'Hardstyle'
  },
  {
    title: 'Aad',
    genre: 'Hardstyle'
  },
  {
    title: 'Piet',
    genre: 'Hardstyle'
  },
  {
    title: 'Joost',
    genre: 'Hardstyle'
  },
  {
    title: 'Nosferatu',
    genre: 'Hardcore'
  },
  {
    title: 'Partyraiser',
    genre: 'Hardcore'
  }
];

export const Search = () => {

 const [searchTerm, setSearchTerm] = useState("");
 const [searchResults, setSearchResults] = useState([]);

 const [selectedGenre, setSelectedGenre] = useState("");

 const handleChange = event => {
    setSearchTerm(event.target.value);
  };

 const handleGenreFilter = event => {
    setSelectedGenre(event.target.value);
  };

  // Search title filter
  useEffect(() => {
    const results = posters.filter(poster =>
      poster.title.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  // Filter on genre
  useEffect(() => {
    const results = posters.filter(poster =>
      poster.genre.includes(selectedGenre)
    );
    setSearchResults(results);
  }, [selectedGenre]);

  return (
    <div className="App">
      
      <select onChange={handleGenreFilter} value={selectedGenre ? selectedGenre : null}>
        <option value="Hardstyle">Hardstyle</option>
        <option value="Hardcore">Hardcore</option>
        <option value="Metal">Metal</option>
      </select>

      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <ul>
         {searchResults.map(poster => (
          <li>{poster.title}</li>
        ))}
      </ul>
    </div>
  );
}