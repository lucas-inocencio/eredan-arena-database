import React, { useState, useEffect } from 'react';

const EredanArenaDatabase = () => {
  const [filters, setFilters] = useState({
    guild: 'All',
    class: 'All',
    race: 'All',
    level: 'All',
    rarity: 'All',
    orderBy: 'Name',
    searchQuery: ''
  });

  const [cards, setCards] = useState([]);

  // Set filters from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters = { ...filters };
    for (const key of Object.keys(newFilters)) {
      if (params.has(key)) {
        newFilters[key] = params.get(key);
      }
    }
    if (params.has('search')) {
      newFilters.searchQuery = params.get('search');
    }
    setFilters(newFilters);
    // Optionally, trigger search immediately if params exist
    if ([...params.keys()].length > 0) {
      search(newFilters);
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Accept optional argument for initial search
  const search = (customFilters) => {
    const activeFilters = customFilters || filters;
    const params = new URLSearchParams();
    ['guild', 'class', 'race', 'level', 'rarity', 'orderBy'].forEach(key => {
      if (activeFilters[key] && activeFilters[key] !== 'All') {
        params.append(key, activeFilters[key]);
      }
    });
    if (activeFilters.searchQuery) {
      params.append('search', activeFilters.searchQuery);
    }
    fetch(`http://localhost:5000/api/cards?${params.toString()}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json();
        } else {
          throw new Error('Received non-JSON response from server');
        }
      })
      .then(cards => {
        setCards(cards);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    // Initial fetch (all cards)
    fetch('http://localhost:5000/api/cards')
      .then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json();
        } else {
          throw new Error('Received non-JSON response from server');
        }
      })
      .then(cards => {
        setCards(cards);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // Sort cards by fullname before rendering
  const sortedCards = [...cards].sort((a, b) => {
    if (!a.fullname) return 1;
    if (!b.fullname) return -1;
    return a.fullname.localeCompare(b.fullname);
  });

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
            {['Name', 'ReleaseDate'].map(opt => (
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
      <section id="cardResults" className="cardResultsRow">
        {sortedCards.length === 0 ? (
          <div>No cards found.</div>
        ) : (
          sortedCards.map(card => (
            <div className="cardResult" key={card.id || card.fullname}>
              {card.imagelink ? (
                <img src={card.imagelink} alt={card.fullname} style={{ maxWidth: '200px', height: 'auto' }} />
              ) : (
                <p>No image available.</p>
              )}
              <h3>{card.fullname}</h3>
            </div>
          ))
        )}
      </section>
    </div>
  );
};


export default EredanArenaDatabase;
