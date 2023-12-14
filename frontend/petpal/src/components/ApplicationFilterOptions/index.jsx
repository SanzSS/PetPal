import { useEffect, useState } from 'react';

const ApplicationFilterOptions = ({setSearchParams, query}) => {

    const [filter, setFilter] = useState(query.filter);

    useEffect(() => {
        setFilter(query.filter);
    }, [query]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFilter(value);
    };

    const handleSaveFilters = () => {
        setSearchParams(() => ({
            ...query,
            filter: filter,
            page: 1
        }));
    };

    return <form className="lg:flex lg:flex-col lg:justify-start lg:pt-[50px]">
        <p className="mb-2">Filter By:</p>
        <div className="filter-div">
            <label htmlFor="filter-by-status">Status</label>
            <select id="filter-by-status" name="status" className="filter-menu cursor-pointer" value={filter} onChange={handleInputChange}>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="Denied">Denied</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="">All</option>
            </select>
        </div>
        <input onClick={handleSaveFilters} type="button" value="Save Filters" className="button mt-2 cursor-pointer" />
    </form>
}

export default ApplicationFilterOptions
