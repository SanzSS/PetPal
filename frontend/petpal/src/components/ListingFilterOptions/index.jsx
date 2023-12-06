import { useState } from 'react';

const ListingFilterOptions = ({setQuery}) => {

    const [newFilters, setNewFilters] = useState({
        status: 'available',
        species: '',
        breed: '',
        age: '',
        gender: '',
        size: ''
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSaveFilters = () => {
        setQuery((prevQuery) => ({
            ...prevQuery,
            filters: newFilters,
            page: 1
        }));
        console.log(newFilters)
    };

    return <form className="hidden lg:flex lg:flex-col lg:justify-start lg:pt-[50px]">
        <p className="mb-2">Filter By:</p>
        <div className="filter-div">
            <label for="filter-by-status">Status</label>
            <select id="filter-by-status" name="status" className="filter-menu cursor-pointer" onChange={handleInputChange}>
                <option value="available" selected>Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="">All</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-species">Species</label>
            <select id="filter-by-species" name="species" className="filter-menu cursor-pointer" onChange={handleInputChange}>
                <option value=""></option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="hamster">Hamsters</option>
                <option value="turtle">Turtles</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-breed">Breed</label>
            <select id="filter-by-breed" name="breed" className="filter-menu cursor-pointer" onChange={handleInputChange}>
                <option value=""></option>
                <option value="husky">Husky</option>
                <option value="border collie">Border Collie</option>
                <option value="german shepard">German Shepard</option>
                <option value="chihuahua">Chihuahua</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-age">Age</label>
            <select id="filter-by-age" name="age" className="filter-menu cursor-pointer" onChange={handleInputChange}>
                <option value=""></option>
                <option value="baby">Baby (0-11 months)</option>
                <option value="juvenile">Juvenile (1-3 years)</option>
                <option value="adult">Adult (4-11 years)</option>
                <option value="senior">Senior (12+ years)</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-gender">Gender</label>
            <select id="filter-by-gender" name="gender" className="filter-menu cursor-pointer" onChange={handleInputChange}>
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-size">Size</label>
            <select id="filter-by-size" name="size" className="filter-menu cursor-pointer" onChange={handleInputChange}>
                <option value=""></option>
                <option value="0-20">0-20 lbs</option>
                <option value="20-40">20-40 lbs</option>
                <option value="40-60">40-60 lbs</option>
                <option value="60-up">60+ lbs</option>
            </select>
        </div>
        <input onClick={handleSaveFilters} type="button" value="Save Filters" className="button mt-2 cursor-pointer" />
    </form>
}

export default ListingFilterOptions
