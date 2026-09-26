import './App.css'
import { useState } from 'react'
import PokemonList from './components/PokemonList'
import findyourpokemon from './assets/findyourpokemon.png';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      setSearchTerm(inputValue.trim().toLowerCase());
    }
  }

  return (
    <div>
      <header>
        <nav>
          <div className="pokemon-logo">
            <img
              className="logo" src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg?utm_campaign" alt="pokemon-logo"
            />
          </div>
          <div className="nav-links">
            <input
              className="search-bar" type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Search Pokemon..."
            />
          </div>
        </nav>
        <div className="nav-line"></div>
      </header>

      <main>
        <img src={findyourpokemon} alt="findyourpokemon" className="findyourpokemon" />
        <PokemonList searchTerm={searchTerm} />
      </main>
    </div>
  );
}

export default App;