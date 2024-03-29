import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/TokenContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';
import Application from '../../components/Application';
import ApplicationSortOptions from '../../components/ApplicationSortOptions';
import ApplicationFilterOptions from '../../components/ApplicationFilterOptions';

const LISTINGS_PER_PAGE = 5;

const ListApplications = () => {
    let navigate = useNavigate();
    const { token } = useAuth();
    const { userType } = useUserType();
    const [searchParams, setSearchParams] = useSearchParams();
    const [applications, setApplications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const query = useMemo(() => ({
        page: parseInt(searchParams.get("page") ?? 1),
        filter: searchParams.get("filter") ?? '',
        sort: searchParams.get("sort") ?? 'create_time',
    }), [searchParams]);
    console.log(query);

    useEffect(() => {
        const params = new URLSearchParams();

        Object.keys(query).forEach((key) => {
            if (query[key]) {
                params.append(key, query[key]);
            }
        });

        let url = `http://3.16.70.156:8000/api/applications/?${params}`;
        console.log(url);

        axios.get(url, 
        {headers: {
            "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.data;
        })
        .then(data => {
            setApplications(data.results);
            setTotalPages(Math.ceil(data.count/LISTINGS_PER_PAGE));
        })
        .catch(error => {
            console.error(error)
        });
    }, [token, userType, query]);
    
    return <> 
        <main className="flex flex-col items-center pb-16">
            <div id="content">
                {userType === 'shelter' ? (<h1 className="text-6xl my-12 text-blue3 font-extrabold text-center">Received Applications</h1>) : (<h1 className="text-6xl my-12 text-blue3 font-extrabold text-center">Past Applications</h1>)}
                <div className="grid lg:grid-cols-[15%_85%] gap-8 sm:w-3/4 w-10/12">
                    <div>
                        <ApplicationSortOptions setSearchParams={setSearchParams} query={query}/>
                        <ApplicationFilterOptions setSearchParams={setSearchParams} query={query}/>
                    </div>
                    <div>
                        {Array.isArray(applications) && applications.map((application) => (<Application application={application} key={application.id} />))}
                        <div className="text-center flex justify-center mt-4">
                            {query.page > 1 ? <button onClick={() => setSearchParams({...query, page: query.page - 1})} className="button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-pointer flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                                </svg>
                            </button> : <button className="text-white bg-gray-500 rounded h-8 shadow-md hover:border-2 px-2 py-1 border-2 border-gray-500 font-extrabold cursor-default flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                                </svg>
                            </button> }
                            <p className="inline text-white bg-blue3 font-bold rounded h-8 shadow-md px-2 py-1 mx-2">Page {query.page}</p>
                            {query.page < totalPages ? <button onClick={() => setSearchParams({...query, page: query.page + 1})} className="button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold cursor-pointer flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                                </svg>
                            </button> : <button className="text-white bg-gray-500 rounded h-8 shadow-md hover:border-2 px-2 py-1 border-2 border-gray-500 font-extrabold cursor-default flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                                </svg>
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
}

export default ListApplications;
