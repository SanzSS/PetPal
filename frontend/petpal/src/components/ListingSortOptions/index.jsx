import { useState } from 'react';

const ListingSortOptions = ({setSearchParams, query}) => {

    const [newSort, setNewSort] = useState({
        sort_by_breed: query.sort_by_breed,
        sort_by_age: query.sort_by_age,
        sort_by_size: query.sort_by_size,
        sort_by_listing_date: query.sort_by_listing_date,
    });

    const handleInputChange = (e) => {
        const {name, checked} = e.target;
        let sort = '';
        if (checked) {
            sort = checked;
        }
        setNewSort((prevSort) => ({
            ...prevSort,
            [name]: sort
        }));
    };

    const handleSaveSort = () => {
        setSearchParams(() => ({
            ...query,
            ...newSort,
            page: 1
        }));
    };

    return <form className="hidden lg:flex lg:flex-col lg:justify-start lg:pt-[120px]">
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
        <input onClick={handleSaveSort} type="button" value="Sort" className="button mt-2 cursor-pointer" />
    </form>
}

export default ListingSortOptions
