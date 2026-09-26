import { useState, useEffect, useRef, useCallback } from 'react';
import PokemonCard from './PokemonCard';

const PAGE_SIZE = 20;

function PokemonList({ searchTerm }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const observerRef = useRef(null);
  const fetchedOffsets = useRef(new Set()); 

  const fetchPokemon = useCallback(async () => {
    if (fetchedOffsets.current.has(offset)) return; 
    fetchedOffsets.current.add(offset);

    setLoading(true);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
      );
      if (!response.ok) throw new Error('Failed to fetch Pokémon');
      const data = await response.json();

      const formatted = data.results.map((poke) => {
        const id = poke.url.split('/').filter(Boolean).pop();
        return { id, name: poke.name };
      });

      setPokemonList((prev) => [...prev, ...formatted]);
      setHasMore(data.next !== null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    if (!searchTerm) {
      fetchPokemon();
    }
  }, [fetchPokemon, searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResult(null);
      setSearchError(null);
      return;
    }

    async function fetchSingle() {
      setLoading(true);
      setSearchError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const data = await response.json();
        setSearchResult({ id: data.id, name: data.name });
      } catch (err) {
        setSearchResult(null);
        setSearchError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSingle();
  }, [searchTerm]);

  const sentinelRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prev) => prev + PAGE_SIZE);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const displayedList = searchTerm
    ? (searchResult ? [searchResult] : [])
    : pokemonList;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {searchTerm && searchError && <p>{searchError}</p>}

      <div className="pokemon-grid">
        {displayedList.map((pokemon) => (
          <PokemonCard key={pokemon.id} id={pokemon.id} name={pokemon.name} />
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {!searchTerm && hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
    </div>
  );
}

export default PokemonList;