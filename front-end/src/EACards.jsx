import { useState, useEffect } from "react";

const GUILDS = [
  "All",
  "Avalonians",
  "Desert Nomads",
  "Equinoxians",
  "Kotoba",
  "Mercenaries",
  "Nehantists",
  "Noz'Dingard Envoys",
  "Pirates",
  "Runic Legion",
  "Sap Hearts",
  "Stonelinkers",
  "Tempus",
  "The Council",
  "Winter Tribes",
  "Zil Warriors",
];
const CLASSES = [
  "All",
  "Bard",
  "Berserker",
  "Captain",
  "Colossus",
  "Craftsman",
  "Mage",
  "Marauder",
  "Priest",
  "Protector",
  "Sidekick",
  "Warrior",
  "Unknown",
];
const RACES = [
  "All",
  "Beast",
  "Dais",
  "Demon",
  "Dragon",
  "Elfine",
  "Eltarite",
  "Golem",
  "Guemelite",
  "Homchai",
  "Human",
  "Ice Elf",
  "Naga",
  "Solarian",
  "Undead",
  "Unknown",
];
//const LEVELS = ["All", "1", "2", "3"];
const RARITIES = [
  "All",
  "Basic",
  "Core Set",
  "Evolution",
  "Exclusive",
  "Prime",
  "Special",
  "Survival",
];
const ORDER_BY = ["Name", "ReleaseDate"];

const EACards = () => {
  const [filters, setFilters] = useState({
    guild: "All",
    class: "All",
    race: "All",
    //level: "All",
    rarity: "All",
    orderBy: "Name",
    searchQuery: "",
  });
  const [cards, setCards] = useState([]);
  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });
  const renderSelect = (name, options) => (
    <label>
      {name.charAt(0).toUpperCase() + name.slice(1)}:
      <select name={name} value={filters[name]} onChange={handleChange}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );

  useEffect(() => {
    fetch(`https://eredan-arena-database.onrender.com/api/cards`)
      .then((response) => {
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("json")
        ) {
          return response.json();
        }
        throw new Error("Failed to fetch cards");
      })
      .then(setCards)
      .catch(console.error);
  }, []);

  const sortedCards = [...cards].sort((a, b) => {
    if (filters.orderBy === "ReleaseDate") {
      return new Date(a.releasedate) - new Date(b.releasedate);
    } else {
      return a.fullname.localeCompare(b.fullname);
    }
  });

  // Filter cards based on selected filters
  const filteredCards = sortedCards.filter((card) => {
    const matchesGuild =
      filters.guild === "All" || card.guild === filters.guild;
    const matchesClass =
      filters.class === "All" || card.heroclass === filters.class;
    const matchesRace = filters.race === "All" || card.race === filters.race;
    const matchesRarity =
      filters.rarity === "All" || card.rarity === filters.rarity;
    const matchesSearch =
      card.fullname.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      card.skills.some((skill) =>
        skill.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );

    return (
      matchesGuild &&
      matchesClass &&
      matchesRace &&
      matchesRarity &&
      matchesSearch
    );
  });

  // Calculate results count based on level filter
  const resultsCount =
    filters.level === "All" ? filteredCards.length * 3 : filteredCards.length;

  const [cardImageLevels, setCardImageLevels] = useState({});

  const handleLevelClick = (cardId, level) => {
    setCardImageLevels((prev) => ({
      ...prev,
      [cardId]: level,
    }));
  };

  return (
    <div className="EACards">
      <header>
        <h1>Eredan Arena Database</h1>
        {/* Display number of results */}
        <p>Results: {resultsCount}</p>
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by name or description"
          value={filters.searchQuery}
          onChange={handleChange}
        />
      </header>
      <section className="selectors">
        {renderSelect("guild", GUILDS)}
        {renderSelect("class", CLASSES)}
        {renderSelect("race", RACES)}
        {/*renderSelect("level", LEVELS)*/}
        {renderSelect("rarity", RARITIES)}
        {renderSelect("orderBy", ORDER_BY)}
      </section>
      <h2>Card Results</h2>
      <section className="cardResults">
        {filteredCards.length === 0 ? (
          <div>No cards found.</div>
        ) : (
          filteredCards.map((card) => {
            let imgSrc = card.imagelink;
            if (cardImageLevels[card.id] === 1 && card.lvlone)
              imgSrc = card.lvlone;
            if (cardImageLevels[card.id] === 2 && card.lvltwo)
              imgSrc = card.lvltwo;
            if (cardImageLevels[card.id] === 3 && card.imagelink)
              imgSrc = card.imagelink;
            return (
              <div className="cardResult" key={card.id}>
                {imgSrc ? (
                  <>
                    <img
                      src={imgSrc}
                      alt={card.fullname}
                      style={{ maxWidth: 200, height: "auto" }}
                    />
                    <div className="levelButtons" style={{ marginTop: 8 }}>
                      <p>Lvl</p>
                      <button onClick={() => handleLevelClick(card.id, 1)}>
                        1
                      </button>
                      <button onClick={() => handleLevelClick(card.id, 2)}>
                        2
                      </button>
                      <button onClick={() => handleLevelClick(card.id, 3)}>
                        3
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No image available.</p>
                )}
                <h3>{card.fullname}</h3>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default EACards;
