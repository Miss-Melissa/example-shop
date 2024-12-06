import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductFilter = ({ filters, handleFilterChange, searchQuery }) => {
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    colors: [],
    brands: [],
    sizes: [],
    genders: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.color) queryParams.append("color", filters.color);
      if (filters.size) queryParams.append("size", filters.size);
      if (filters.brand) queryParams.append("brand", filters.brand);
      if (filters.gender) queryParams.append("gender", filters.gender);
      if (searchQuery) queryParams.append("searchQuery", searchQuery);

      const response = await axios.get(
        `http://localhost:5000/products/filters?${queryParams.toString()}`
      );

      setFilterOptions({
        categories: response.data.categories || [],
        colors: response.data.colors || [],
        brands: response.data.brands || [],
        sizes: response.data.sizes || [],
        genders: response.data.genders || [],
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [filters, searchQuery]); // Uppdatera när filter eller sökfråga ändras

  const handleSliderChange = (e) => {
    const { name, value } = e.target;

    if (name === "price_min") {
      const newValue = Math.min(value, filters.price_max - 10);
      handleFilterChange({ target: { name, value: newValue } });
    } else if (name === "price_max") {
      const newValue = Math.max(value, filters.price_min + 10);
      handleFilterChange({ target: { name, value: newValue } });
    }
  };

  return (
    <div>
      {loading && <p>Loading filter options...</p>}
      <select
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <option value="">Select Category</option>
        {filterOptions.categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select name="color" value={filters.color} onChange={handleFilterChange}>
        <option value="">Select Color</option>
        {filterOptions.colors.map((color, index) => (
          <option key={index} value={color}>
            {color}
          </option>
        ))}
      </select>

      <select name="brand" value={filters.brand} onChange={handleFilterChange}>
        <option value="">Select Brand</option>
        {filterOptions.brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select
        name="gender"
        value={filters.gender}
        onChange={handleFilterChange}
      >
        <option value="">Select Gender</option>
        {filterOptions.genders.map((gender, index) => (
          <option key={index} value={gender}>
            {gender}
          </option>
        ))}
      </select>

      <select name="size" value={filters.size} onChange={handleFilterChange}>
        <option value="">Select Size</option>
        {filterOptions.sizes.map((size, index) => (
          <option key={index} value={size}>
            {size}
          </option>
        ))}
      </select>

      {/* Price Range Filter */}
      <div>
        <label>Price Range:</label>
        <div>
          <input
            type="range"
            name="price_min"
            min="0"
            max="1000"
            step="10"
            value={filters.price_min}
            onChange={handleSliderChange}
          />
          <input
            type="range"
            name="price_max"
            min="0"
            max="1000"
            step="10"
            value={filters.price_max}
            onChange={handleSliderChange}
          />
        </div>
        <p>
          Min: {filters.price_min} - Max: {filters.price_max}
        </p>
      </div>
    </div>
  );
};

export default ProductFilter;
