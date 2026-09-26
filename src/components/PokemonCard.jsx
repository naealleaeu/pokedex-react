function PokemonCard({ id, name }) {
  return (
    <div class="card" id="pokemonCard">
        <div class="card-inner">
    
        <div class="card-art-frame">
            <div class="card-art">
            <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                alt={name}/>
            </div>
        </div>
    
        <div class="card-footer">
            <p class="card-name">{name}</p>
            <span class="card-id">#{id.toString().padStart(3, '0')}</span>
        </div>
    
        </div>
    </div>
  );
}

export default PokemonCard;