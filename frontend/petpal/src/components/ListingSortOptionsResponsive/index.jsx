import { useState } from 'react';

const ListingSortOptionsResponsive = ({setQuery}) => {

    const [newFilters, setNewFilters] = useState({
        sort_by_breed: false,
        sort_by_age: false,
        sort_by_size: false,
        sort_by_listing_date: false,
    });

    const handleInputChange = (e) => {
        const {name, checked} = e.target;
        setNewFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked
        }));

        setQuery((prevQuery) => ({
            ...prevQuery,
            sort: {
                ...prevQuery.sort,
                [name]: checked
            },
            page: 1
        }));
    };

    return <form className="lg:flex lg:flex-col lg:justify-start lg:pt-[120px]">
        <p className="mb-2">Sort By:</p>
        <div className="sort-div">
            <label for="sort-by-breed">Breed</label>
            <input className="transform scale-125 cursor-pointer" type="checkbox" id="sort-by-breed" name="sort_by_breed" onChange={handleInputChange} />
        </div>
        <div className="sort-div">
            <label for="sort-by-age">Age</label>
            <input className="transform scale-125 cursor-pointer" type="checkbox" id="sort-by-age" name="sort_by_age" onChange={handleInputChange} />
        </div>
        <div className="sort-div">
            <label for="sort-by-size">Size</label>
            <input className="transform scale-125 cursor-pointer" type="checkbox" id="sort-by-size" name="sort_by_size" onChange={handleInputChange} />
        </div>
        <div className="sort-div">
            <label for="sort-by-listing-date">Listing Date</label>
            <input className="transform scale-125 cursor-pointer" type="checkbox" id="sort-by-listing-date" name="sort_by_listing_date" onChange={handleInputChange} />
        </div>
    </form>
}

export default ListingSortOptionsResponsive;
