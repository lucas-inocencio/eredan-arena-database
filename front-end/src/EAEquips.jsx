import { useState, useEffect } from "react";

const POSITIONS = ["All", "1st / Attacker", "2nd / Defender"];
//const LEVELS = ["All", "1", "2", "3"];
const RARITIES = ["All", "Common", "Epic", "Legendary", "Rare"];
const ORDER_BY = ["Name", "ReleaseDate"];

const EAEquips = () => {
  const [filters, setFilters] = useState({
    position: "All",
    rarity: "All",
    orderBy: "Name",
    searchQuery: "",
  });
  const [equips, setEquips] = useState([]);
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
    fetch(`https://eredan-arena-database.onrender.com/api/equips`)
      .then((response) => {
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("json")
        ) {
          return response.json();
        }
        throw new Error("Failed to fetch equips");
      })
      .then(setEquips)
      .catch(console.error);
  }, []);

  const sortedEquips = [...equips].sort((a, b) => {
    if (filters.orderBy === "ReleaseDate") {
      return new Date(a.releasedate) - new Date(b.releasedate);
    } else {
      return a.fullname.localeCompare(b.fullname);
    }
  });

  const filteredEquips = sortedEquips.filter((card) => {
    const matchesPosition =
      filters.position === "All" || card.position === filters.position;
    const matchesRarity =
      filters.rarity === "All" || card.rarity === filters.rarity;
    const matchesSearch =
      card.fullname.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      card.effect.some((effect) =>
        effect.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );

    return matchesPosition && matchesRarity && matchesSearch;
  });

  return (
    <div>
      <header>
        <h1>Eredan Arena Database</h1>
        <p>Results: {filteredEquips.length}</p>
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by name or description"
          value={filters.searchQuery}
          onChange={handleChange}
        />
      </header>
      <section className="selectors">
        {renderSelect("positions", POSITIONS)}
        {renderSelect("rarity", RARITIES)}
        {renderSelect("orderBy", ORDER_BY)}
      </section>
      <h2>Card Results</h2>
      <section className="cardResults">
        {filteredEquips.length === 0 ? (
          <div>No Equips found.</div>
        ) : (
          filteredEquips.map((card) => (
            <div className="cardResult" key={card.id}>
              {card.imagelink ? (
                <img
                  src={card.imagelink}
                  alt={card.fullname}
                  style={{ maxWidth: 200, height: "auto" }}
                />
              ) : (
                <p>No image available.</p>
              )}
              <h3>{card.fullname}</h3>
              <p>
                {card.effect && Array.isArray(card.effect)
                  ? card.effect.join(", ")
                  : card.effect}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default EAEquips;
