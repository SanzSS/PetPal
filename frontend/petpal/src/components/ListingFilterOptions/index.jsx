import { useEffect, useState } from 'react';

const ListingFilterOptions = ({setSearchParams, speciesFilter, breedsFilter, sheltersFilter, query}) => {

    const [newFilters, setNewFilters] = useState({shelter: query.shelter, status: query.status, species: query.species, breed: query.breed, age: query.age, gender: query.gender, size: query.size});

    useEffect(() => {
        setNewFilters({shelter: query.shelter, status: query.status, species: query.species, breed: query.breed, age: query.age, gender: query.gender, size: query.size});
    }, [query]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSaveFilters = () => {
        setSearchParams(() => ({
            ...query,
            status: newFilters.status, 
            species: newFilters.species, 
            breed: newFilters.breed, 
            age: newFilters.age, 
            gender: newFilters.gender, 
            size: newFilters.size,
            page: 1
        }));

    };

    return <form className="hidden lg:flex lg:flex-col lg:justify-start lg:pt-[50px]">
        <p className="mb-2">Filter By:</p>
        <div className="filter-div">
            <label for="filter-by-shelter">Shelter</label>
            <select id="filter-by-shelter" name="shelter" className="filter-menu cursor-pointer" value={newFilters.shelter}  onChange={handleInputChange}>
                <option value=""></option>
                {sheltersFilter && (sheltersFilter.map((shelter, index) => (<option key={index} value={shelter} className="capitalize">{shelter.name}</option>)))}
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-status">Status</label>
            <select id="filter-by-status" name="status" className="filter-menu cursor-pointer" value={newFilters.status}  onChange={handleInputChange}>
                <option value="available" selected>Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="">All</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-species">Species</label>
            <select id="filter-by-species" name="species" className="filter-menu cursor-pointer capitalize" value={newFilters.species}  onChange={handleInputChange}>
                <option value=""></option>
                {speciesFilter && (speciesFilter.map((species, index) => (<option key={index} value={species} className="capitalize">{species}</option>)))}
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-breed">Breed</label>
            <select id="filter-by-breed" name="breed" className="filter-menu cursor-pointer capitalize" value={newFilters.breed}  onChange={handleInputChange}>
                <option value=""></option>
                {breedsFilter && (breedsFilter.map((breed, index) => (<option key={index} value={breed} className="capitalize">{breed}</option>)))}
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-age">Age</label>
            <select id="filter-by-age" name="age" className="filter-menu cursor-pointer" value={newFilters.age}  onChange={handleInputChange}>
                <option value=""></option>
                <option value="baby">Baby (0-11 months)</option>
                <option value="juvenile">Juvenile (1-3 years)</option>
                <option value="adult">Adult (4-11 years)</option>
                <option value="senior">Senior (12+ years)</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-gender">Gender</label>
            <select id="filter-by-gender" name="gender" className="filter-menu cursor-pointer" value={newFilters.gender} onChange={handleInputChange}>
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
        <div className="filter-div">
            <label for="filter-by-size">Size</label>
            <select id="filter-by-size" name="size" className="filter-menu cursor-pointer" value={newFilters.size}  onChange={handleInputChange}>
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
