import { useState, useEffect, useMemo } from 'react';
import ListingCard from '../../components/ListingCard';
import ListingFilterOptions from '../../components/ListingFilterOptions';
import ListingSortOptions from '../../components/ListingSortOptions';
import ListingFilterOptionsResponsive from '../../components/ListingFilterOptionsResponsive';
import ListingSortOptionsResponsive from '../../components/ListingSortOptionsResponsive';
import { fetchWithAuthorization } from '../../fetch';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';

const LISTINGS_PER_PAGE = 16

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [listings, setListings] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [input, setInput] = useState('');
    const [allFilters, setAllFilters] = useState({});

    const navigate = useNavigate();

    const query = useMemo(() => ({
        page: parseInt(searchParams.get("page") ?? 1),
        search: searchParams.get("search") ?? '',
        status: searchParams.get("status") ?? 'available',
        species: searchParams.get("species") ?? '',
        breed: searchParams.get("breed") ?? '',
        age: searchParams.get("age") ?? '',
        gender: searchParams.get("gender") ?? '',
        size: searchParams.get("size") ?? '',
        sort_by_breed: searchParams.get("sort_by_breed") ?? '',
        sort_by_age: searchParams.get("sort_by_age") ?? '',
        sort_by_size: searchParams.get("sort_by_size") ?? '',
        sort_by_listing_date: searchParams.get("sort_by_listing_date") ?? '',
    }), [searchParams]);

    const { token } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams();

        Object.keys(query).forEach((key) => {
            if (query[key]) {
                params.append(key, query[key]);
            }
        });

        let url = `/listings/listing/?${params}`;

        fetchWithAuthorization(url, {method: 'GET'}, navigate, token)
        .then(response => response.json())
        .then(json => {
            setListings(json.results);
            setTotalPages(Math.ceil(json.count/LISTINGS_PER_PAGE))
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });

        fetchWithAuthorization('/listings/filters/', {method: 'GET'}, navigate, token)
        .then(response => response.json())
        .then(json => {
            setAllFilters(json)
            setAllFilters({...allFilters, shelters: []})
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
    }, [query]);

    return <>
        <main className="flex flex-col items-center pb-16">
            <h1 className="text-6xl my-12 text-blue3 font-extrabold">Search</h1>
            <div className="grid lg:grid-cols-[15%_85%] gap-2 sm:w-3/4 w-10/12">
                {/* Filter Column */}
                <div>
                    <ListingSortOptions setSearchParams={setSearchParams} query={query}/>
                    <ListingFilterOptions setSearchParams={setSearchParams} sheltersFilter={allFilters.shelters} speciesFilter={allFilters.species} breedsFilter={allFilters.breeds} query={query}/>
                </div>
                {/* Search Column */}
                <div className="h-full w-full gap-4">
                    {/* Search */}
                    <form className="col-span-2 lg:p-4">
                        <div className="flex justify-between">
                            <input onChange={(event) => setInput(event.target.value)} type="text" placeholder="Search pets" className="h-16 md:w-[83%] w-[75%] text-2xl p-4 rounded-xl shadow-md" />
                            <a onClick={() => setSearchParams({...query, search: input, page: 1})} 
                                className="text-center md:w-[15%] w-[22%] bg-blue3 text-white font-extrabold text-2xl flex justify-center items-center rounded-xl shadow-md cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-blue3">
                                Search
                            </a>
                        </div>
                    </form>
                    {/* Mobile Filter By Dropdown */}
                    <details className="pt-4 lg:hidden">
                        <summary className="mb-2 text-white bg-blue3 font-bold rounded p-2 shadow-md inline-block cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-blue3 border-2 border-blue3">Filter By:</summary>
                        <ListingFilterOptionsResponsive setSearchParams={setSearchParams} sheltersFilter={allFilters.shelters} speciesFilter={allFilters.species} breedsFilter={allFilters.breeds} query={query}/>
                    </details>
                    <details className="pt-4 lg:hidden">
                        <summary className="mb-2 text-white bg-blue3 font-bold rounded p-2 shadow-md inline-block cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-blue3 border-2 border-blue3">Sort By:</summary>
                        <ListingSortOptionsResponsive setSearchParams={setSearchParams} query={query}/>
                    </details>
                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:p-2">
                        {listings.map((listing) => (
                            <ListingCard listing={listing} key={listing.id}/>
                        ))} 
                    </div>
                    <div className="text-center flex justify-center mt-4">
                        {query.page > 1 ? <a onClick={() => setSearchParams({...query, page: query.page - 1})} className="button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-pointer flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                            </svg>
                        </a> : <a className="text-white bg-gray-500 rounded h-8 shadow-md hover:border-2 px-2 py-1 border-2 border-gray-500 font-extrabold cursor-default flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                            </svg>
                        </a> }
                        <p className="inline text-white bg-blue3 font-bold rounded h-8 shadow-md px-2 py-1 mx-2">Page {query.page}</p>
                        {query.page < totalPages ? <a onClick={() => setSearchParams({...query, page: query.page + 1})} className="button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-pointer flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                            </svg>
                        </a> : <a className="text-white bg-gray-500 rounded h-8 shadow-md hover:border-2 px-2 py-1 border-2 border-gray-500 font-extrabold cursor-default flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                            </svg>
                        </a> }
                    </div>
                </div>
            </div>
        </main>
    </>
}

export default Search