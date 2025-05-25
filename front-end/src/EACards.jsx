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
const LEVELS = ["All", "1", "2", "3"];
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

const EredanArena = () => {
  const [filters, setFilters] = useState({
    guild: "All",
    class: "All",
    race: "All",
    level: "All",
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

  return (
    <div>
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
      <section id="selectors">
        {renderSelect("guild", GUILDS)}
        {renderSelect("class", CLASSES)}
        {renderSelect("race", RACES)}
        {renderSelect("level", LEVELS)}
        {renderSelect("rarity", RARITIES)}
        {renderSelect("orderBy", ORDER_BY)}
      </section>
      <h2>Card Results</h2>
      <section id="cardResults" className="cardResults">
        {filteredCards.length === 0 ? (
          <div>No cards found.</div>
        ) : (
          filteredCards.map((card) => (
            <div className="cardResult" key={card.id}>
              {(() => {
                if (filters.level === "1") {
                  return card.imagelink ? (
                    <>
                      <img
                        src={card.lvlone}
                        alt={card.fullname}
                        style={{ maxWidth: 200, height: "auto" }}
                      />
                    </>
                  ) : (
                    <p>No image available.</p>
                  );
                } else if (filters.level === "2") {
                  return card.imagelink ? (
                    <>
                      <img
                        src={card.lvltwo}
                        alt={card.fullname}
                        style={{ maxWidth: 200, height: "auto" }}
                      />
                    </>
                  ) : (
                    <p>No image available.</p>
                  );
                } else if (filters.level === "3") {
                  return card.imagelink ? (
                    <>
                      <img
                        src={card.imagelink}
                        alt={card.fullname}
                        style={{ maxWidth: 200, height: "auto" }}
                      />
                    </>
                  ) : (
                    <p>No image available.</p>
                  );
                } else {
                  return card.imagelink ? (
                    <>
                      <img
                        src={card.lvlone}
                        alt={card.fullname}
                        style={{ maxWidth: 200, height: "auto" }}
                      />
                      <h3>{card.fullname}</h3>
                      <img
                        src={card.lvltwo}
                        alt={card.fullname}
                        style={{ maxWidth: 200, height: "auto" }}
                      />
                      <h3>{card.fullname}</h3>
                      <img
                        src={card.imagelink}
                        alt={card.fullname}
                        style={{ maxWidth: 200, height: "auto" }}
                      />
                    </>
                  ) : (
                    <p>No image available.</p>
                  );
                }
              })()}
              <h3>{card.fullname}</h3>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
export default EredanArena;
