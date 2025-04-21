const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search-results?q=${searchQuery}&location=${location}`);
    // fetch(`/api/search?q=${searchQuery}&location=${location}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     // Handle search results
    //     console.log("Search results:", data);
    //     // navigate('/search-results', { state: { results: data } });
    //   });
  };
  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="What job are you looking for?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <Link to="/advanced-search" className="advanced-search">
        Advanced search
      </Link>
    </div>
  );
};

export default Searchbar;
