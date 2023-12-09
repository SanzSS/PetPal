import axios from 'axios';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchWithAuthorization } from '../../fetch';
import ListingCard from '../../components/ListingCard'
import ReviewCard from '../../components/ReviewCard';
import { useAuth } from '../../contexts/TokenContext';


const ViewShelter = () => {
    const { token } = useAuth();

    const [ shelter, setShelter ] = useState({});
    const{shelterID} = useParams();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

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
            <h1 className="text-6xl my-12 text-blue3 font-extrabold md:text-4xl text-center px-1">{shelter.name}</h1>
            <div className="grid gap-2 w-3/4">
                <h1 className="font-bold block text-2xl pb-3 text-blue3"> Pets Here </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
                    {/* console.log(shelter.pets); */}
                    {shelter.pets?.map((pet) => (
                        <ListingCard listing={pet} key={pet.id}/>
                    ))}
                </div>

                <h1 className="font-bold block text-2xl pb-3 text-blue3"> Reviews </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
                    {shelter.reviews?.map((review, index) => (
                            <ReviewCard review={review} key={index}/>
                    ))}
                </div>

                <h1 className="font-bold block text-2xl	underline pb-3 text-blue3"> Contact Information </h1>
                    <div className="p-2">
                    <span className="block"> Email: {shelter?.email}</span>
                </div>
            </div>
        </main>
    </>
}

export default ViewShelter;