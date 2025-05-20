import React, { useState } from 'react';

const EredanArenaDatabase = () => {
  const [filters, setFilters] = useState({
    guild: 'All',
    class: 'All',
    race: 'All',
    level: 'All',
    rarity: 'All',
    orderBy: 'ReleaseDate',
    searchQuery: ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const search = () => {
    console.log('Searching with filters:', filters);
    // You can call your API here using fetch or axios
  };

  return (
    <div>
      <header>
        <h1>Eredan Arena Database</h1>
        <p>Coming soon...</p>
      </header>

      <section id="selectors">
        <label>
          Guild:
          <select name="guild" value={filters.guild} onChange={handleChange}>
            {['All', 'Avalonians', 'Desert Nomads', 'Equinoxians', 'Kotoba', 'Mercenaries', 'Nehantists', 'Noz Dingard Envoys', 'Pirates', 'Sap Hearts', 'Stonelinkers', 'Tempus', 'The Council', 'The Runic Legion', 'Winter Tribes', 'Zil Warriors'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Class:
          <select name="class" value={filters.class} onChange={handleChange}>
            {['All', 'Bard', 'Berserker', 'Captain', 'Colossus', 'Craftsman', 'Mage', 'Marauder', 'Priest', 'Protector', 'Sidekick', 'Warrior', 'Unknown Class'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Race:
          <select name="race" value={filters.race} onChange={handleChange}>
            {['All', 'Beast', 'Dais', 'Demon', 'Dragon', 'Elfine', 'Eltarite', 'Golem', 'Guemelite', 'Hom Chai', 'Human', 'Ice Elf', 'Naga', 'Solarian', 'Undead', 'Unknown Race'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Level:
          <select name="level" value={filters.level} onChange={handleChange}>
            {['All', '1', '2', '3'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Rarity:
          <select name="rarity" value={filters.rarity} onChange={handleChange}>
            {['All', 'Basic', 'Coreset', 'Evolution', 'Exclusive', 'Prime', 'Special'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Order by:
          <select name="orderBy" value={filters.orderBy} onChange={handleChange}>
            {['ReleaseDate', 'Name'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Search:
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleChange}
          />
        </label>

        <button onClick={search}>Search</button>
      </section>

      <h2>Card Results</h2>
      <section id="cardResults">
        {/* Map over search results here */}
      </section>
    </div>
  );
};

export default EredanArenaDatabase;
