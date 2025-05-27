import { useState, useEffect } from "react";

const STYLES = [
  "All",
  "Adaptive",
  "Damaging Alteration",
  "Damaging",
  "Enhancing & Weakening",
  "Enhancing Skill",
  "Healing Alteration",
  "Weakening Alteration",
  "Weakening Skill",
  "Weakening",
];

const EASkills = () => {
  const [filters, setFilters] = useState({
    style: "All",
    searchQuery: "",
  });
  const [skills, setSkills] = useState([]);
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
    fetch(`https://eredan-arena-database.onrender.com/api/skills`)
      .then((response) => {
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("json")
        ) {
          return response.json();
        }
        throw new Error("Failed to fetch skills");
      })
      .then(setSkills)
      .catch(console.error);
  }, []);

  const sortedSkills = [...skills].sort((a, b) => {
    if (filters.orderBy === "ReleaseDate") {
      return new Date(a.releasedate) - new Date(b.releasedate);
    } else {
      return a.fullname.localeCompare(b.fullname);
    }
  });

  const filteredSkills = sortedSkills.filter((card) => {
    const matchesStyle =
      filters.style === "All" || card.style === filters.style;
    const matchesSearch =
      card.fullname.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      card.description.some((description) =>
        description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );

    return matchesStyle && matchesSearch;
  });

  return (
    <div>
      <header>
        <h1>Eredan Arena Database</h1>
        <p>Results: {filteredSkills.length}</p>
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by name or description"
          value={filters.searchQuery}
          onChange={handleChange}
        />
      </header>
      <section className="selectors">{renderSelect("styles", STYLES)}</section>
      <h2>Skill Results</h2>
      <section className="cardResults">
        {filteredSkills.length === 0 ? (
          <div>No Skills found.</div>
        ) : (
          filteredSkills.map((card) => (
            <div className="cardResult" key={card.id}>
              {card.skillImage ? (
                <img
                  src={card.skillImage}
                  alt={card.fullname}
                  style={{ maxWidth: 200, height: "auto" }}
                />
              ) : (
                <p>No image available.</p>
              )}
              <h3>{card.fullname}</h3>
              <p>{card.description}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default EASkills;
