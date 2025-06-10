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
const ORDER_BY = [
  "Name (A > Z)",
  "Name (Z > A)",
  "Release date (- > +)",
  "Release date (+ > -)",
];
const LEVELS = [1, 2, 3];

// Card component to manage its own state
const Card = ({ card }) => {
  // Each card now manages its own level state, defaulting to 3
  const [currentLevel, setCurrentLevel] = useState(3);

  // Determine the image source based on the card's internal level state
  let imgSrc = card.imagelink; // Default to max level image
  if (currentLevel === 1 && card.lvlone) imgSrc = card.lvlone;
  else if (currentLevel === 2 && card.lvltwo) imgSrc = card.lvltwo;
  else if (currentLevel === 3 && card.imagelink) imgSrc = card.imagelink;

  return (
    <div className="cardResult" key={card.id}>
      {imgSrc ? (
        <>
          <img
            className="cardImage"
            src={imgSrc}
            alt={card.fullname}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/200x280/cccccc/333333?text=Image+Not+Found";
            }}
          />
          <div className="levelButtons">
            <p>Lvl</p>
            {/* These buttons now only affect the state of this specific card instance */}
            <button onClick={() => setCurrentLevel(1)}>1</button>
            <button onClick={() => setCurrentLevel(2)}>2</button>
            <button onClick={() => setCurrentLevel(3)}>3</button>
          </div>
        </>
      ) : (
        <p>No image available.</p>
      )}
      <h3>{card.fullname}</h3>
    </div>
  );
};

// Main EACards component
const EACards = () => {
  const [filters, setFilters] = useState({
    guild: "All",
    class: "All",
    race: "All",
    rarity: "All",
    orderBy: "Name (A > Z)",
    level: 3,
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
    const queryParams = new URLSearchParams();
    if (filters.guild !== "All") queryParams.append("guild", filters.guild);
    if (filters.class !== "All") queryParams.append("heroclass", filters.class);
    if (filters.race !== "All") queryParams.append("race", filters.race);
    if (filters.rarity !== "All") queryParams.append("rarity", filters.rarity);

    const apiUrl = `http://localhost:5000/api/cards?${queryParams.toString()}`;

    fetch(apiUrl)
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
  }, [filters]);

  const sortedCards = [...cards].sort((a, b) => {
    switch (filters.orderBy) {
      case "Name (Z > A)":
        return b.fullname.localeCompare(a.fullname);
      case "Release date (- > +)":
        return new Date(a.release) - new Date(b.release);
      case "Release date (+ > -)":
        return new Date(b.release) - new Date(a.release);
      case "Name (A > Z)":
      default:
        return a.fullname.localeCompare(b.fullname);
    }
  });

  const filteredCards = sortedCards.filter(
    (card) =>
      card.fullname.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (card.skills &&
        card.skills.some((skill) =>
          skill.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ))
  );

  return (
    <div className="EA">
      <header>
        <h1>Eredan Arena Database</h1>
        <p>Results: {filteredCards.length}</p>
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
        {renderSelect("rarity", RARITIES)}
        {renderSelect("orderBy", ORDER_BY)}
        {renderSelect("level", LEVELS)}
      </section>
      <h2>Card Results</h2>
      <section className="cardResults">
        {filteredCards.length === 0 ? (
          <div>No cards found.</div>
        ) : (
          // Render the new Card component for each card
          filteredCards.map((card) => <Card key={card.id} card={card} />)
        )}
      </section>
    </div>
  );
};

export default EACards;
