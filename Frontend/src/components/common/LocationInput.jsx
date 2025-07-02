import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";

const LocationInput = ({ locationQuery, setLocationQuery, onKeyPress }) => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:9999/api/locations")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("Failed to fetch locations:", err));
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationQuery(value);

    const matched = locations
      .filter(loc =>
        `${loc.city}, ${loc.state}`.toLowerCase().startsWith(value.toLowerCase())
      )
      .slice(0, 10);

    setFilteredLocations(matched);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (loc) => {
    setLocationQuery(`${loc.city}, ${loc.state}`);
    setShowSuggestions(false);
  };

  return (
    <div className="flex-1 relative">
      <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
        <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
        <input
          type="text"
          placeholder="City, state, zip code, or remote"
          value={locationQuery}
          onChange={handleLocationChange}
          onKeyPress={onKeyPress}
          onFocus={() => setShowSuggestions(locationQuery.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
        />
      </div>

      {showSuggestions && filteredLocations.length > 0 && (
        <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {filteredLocations.map((location, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(location)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {location.city}, {location.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
