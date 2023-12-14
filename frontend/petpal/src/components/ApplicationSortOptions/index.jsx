import { useState } from 'react';

const ApplicationSortOptions = ({setSearchParams, query}) => {

    const [sort, setSort] = useState(query.sort);

    const handleInputChange = (e) => {
        const {name, checked} = e.target;
        let sort = '';
        if (checked) {
            sort = name;
        }
        setSort(sort);
    };

    const handleSaveSort = () => {
        setSearchParams(() => ({
            ...query,
            sort: sort,
            page: 1
        }));
    };

    return <form className="lg:flex lg:flex-col lg:justify-start lg:pt-[10px]">
        <p className="mb-2">Sort By:</p>
        <div className="sort-div">
            <label htmlFor="sort-by-create-time">Creation Time</label>
            <input className="transform scale-125 cursor-pointer" type="checkbox" id="sort-by-create-time" name="create_time" onChange={handleInputChange} />
        </div>
        <div className="sort-div">
            <label htmlFor="sort-by-update-time">Update Time</label>
            <input className="transform scale-125 cursor-pointer" type="checkbox" id="sort-by-update-time" name="update_time" onChange={handleInputChange} />
        </div>
        <input onClick={handleSaveSort} type="button" value="Sort" className="button mt-2 cursor-pointer" />
    </form>
}

export default ApplicationSortOptions
