import { useState, useEffect } from 'react';
import ListingCard from '../../components/ListingCard';
import ListingFilterOptions from '../../components/ListingFilterOptions';
import ListingSortOptions from '../../components/ListingSortOptions';
import ListingFilterOptionsResponsive from '../../components/ListingFilterOptionsResponsive';
import ListingSortOptionsResponsive from '../../components/ListingSortOptionsResponsive';
import { fetchWithAuthorization } from '../../fetch';
import { useNavigate } from 'react-router-dom';

const LISTINGS_PER_PAGE = 16

const Search = () => {
    const [query, setQuery] = useState({search: '', filters: {status: 'available'}, sort: {}, page: 1});
    const [listings, setListings] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [input, setInput] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const {search, filters, sort, page} = query;
        let url = `/listings/listing/?search=${search}&page=${page}`
        if (Object.keys(filters).length > 0) {
            const filters_url = Object.keys(filters)
            .filter((key) => filters[key] !== '')
            .map((key) => `${key}=${filters[key]}`)
            .join("&");
        
            url += `&${filters_url}`;
        }

        const sort_url = Object.keys(sort)
        .filter((key) => sort[key] === true)
        .map((key) => `${key}=${sort[key]}`)
        .join("&");
    
        url += `&${sort_url}`;

        fetchWithAuthorization(url, {method: 'GET'}, navigate)
        .then(response => response.json())
        .then(json => {
            setListings(json.results);
            setTotalPages(Math.ceil(json.count/LISTINGS_PER_PAGE))
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
                    <ListingSortOptions setQuery={setQuery}/>
                    <ListingFilterOptions setQuery={setQuery}/>
                </div>
                {/* Search Column */}
                <div className="h-full w-full gap-4">
                    {/* Search */}
                    <form className="col-span-2 lg:p-4">
                        <div className="flex justify-between">
                            <input onChange={(event) => setInput(event.target.value)} type="text" placeholder="Search pets" className="h-16 md:w-[83%] w-[75%] text-2xl p-4 rounded-xl shadow-md" />
                            <a onClick={() => setQuery({...query, search: input, page: 1})} 
                                className="text-center md:w-[15%] w-[22%] bg-blue3 text-white font-extrabold text-2xl flex justify-center items-center rounded-xl shadow-md cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-black">
                                Search
                            </a>
                        </div>
                    </form>
                    {/* Mobile Filter By Dropdown */}
                    <details className="pt-4 lg:hidden">
                        <summary className="mb-2 text-white bg-blue3 font-bold rounded p-2 shadow-md inline-block cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-black border-2 border-blue3">Filter By:</summary>
                        <ListingFilterOptionsResponsive setQuery={setQuery}/>
                    </details>
                    <details className="pt-4 lg:hidden">
                        <summary className="mb-2 text-white bg-blue3 font-bold rounded p-2 shadow-md inline-block cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-black border-2 border-blue3">Sort By:</summary>
                        <ListingSortOptionsResponsive setQuery={setQuery}/>
                    </details>
                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:p-2">
                        {listings.map((listing) => (
                            <ListingCard listing={listing} key={listing.id}/>
                        ))} 
                    </div>
                    <div className="text-center flex justify-center mt-4">
                        {query.page > 1 ? <a onClick={() => setQuery({...query, page: query.page - 1})} className="inline button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-pointer">&lt;</a> : <a className="inline button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-default">&lt;</a> }
                        <p className="inline text-white bg-blue3 font-bold rounded h-8 shadow-md px-2 py-1 mx-2">Page {query.page}</p>
                        {query.page < totalPages ? <a onClick={() => setQuery({...query, page: query.page + 1})} className="inline button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-pointer">&gt;</a> : <a className="inline button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-default">&gt;</a> }
                    </div>
                </div>
            </div>
        </main>
    </>
}

export default Search