import axios from 'axios';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// import { fetchWithAuthorization } from '../../fetch';
import ListingCard from '../../components/ListingCard'
import { useAuth } from '../../contexts/TokenContext';

import Reviews from '../../components/Reviews';


const ViewShelter = () => {
    const { token } = useAuth();

    const [ shelter, setShelter ] = useState({});
    const{shelterID} = useParams();


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (shelterID) {
                    const response = await axios.get(`http://127.0.0.1:8000/accounts/${shelterID}/`, {
                        headers: {
                          "Authorization": `Bearer ${token}`
                        }
                    });
                    setShelter(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [shelterID, token]);

    return <>
        <main className="flex flex-col items-center pb-16">
            <h1 className="text-6xl my-12 text-blue3 font-extrabold text-center px-1 capitalize">{shelter.name}</h1>
            <div className="grid gap-2 w-3/4">
                <h1 className="font-bold block text-4xl pb-3 text-blue3"> Our Pets </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
                    {shelter.pets?.map((pet) => (
                        <ListingCard listing={pet} key={pet.id}/>
                    ))}
                </div>

                <h1 className="font-bold block text-4xl pb-3 text-blue3 mt-16"> Reviews </h1>
                <div className="bg-blue2 rounded-md">
                    {/* paginated reviews*/}
                    <Reviews shelterID={shelterID}/>
                </div>
                <h1 className="font-bold block text-4xl	underline pb-3 text-blue3 mt-16"> Contact Information </h1>
                    <div className="p-2">
                    <span className="block"> Email: {shelter?.email}</span>
                </div>
            </div>
        </main>
    </>
}

export default ViewShelter;