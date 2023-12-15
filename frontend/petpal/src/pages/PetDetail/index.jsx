import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { fetchWithAuthorization } from '../../fetch';
import { useAuth } from '../../contexts/TokenContext';
import { jwtDecode } from "jwt-decode";
import { useUserType } from '../../contexts/UserTypeContext';

const PetDetail = () => {
    const [ listing, setListing ] = useState({});
    const [ shelter, setShelter ] = useState({});
    const { listingID } = useParams();
    const [ currentImageIndex, setCurrentImageIndex ] = useState(0);
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();

    const { token } = useAuth();
    const { userType } = useUserType();

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken) {
                    setUserId(decodedToken.user_id);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        fetchWithAuthorization(`/listings/listing/${listingID}/`, {method: 'GET'}, navigate, token)
        .then(response => response.json())
        .then(json => {
            setListing(json);
        })
    }, [listingID]);

    useEffect(() => {
        fetchWithAuthorization(`/accounts/${listing.shelter}/`, {method: 'GET'}, navigate, token)
        .then(response => response.json())
        .then(json => {
            setShelter(json);
        })
    }, [listing]);

    

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (listing?.images.length || 0));
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => {
            const newIndex = prevIndex - 1 < 0 ? listing?.images.length - 1 : prevIndex - 1;
            return newIndex;
        });
    };

    const listingDate = listing.listing_date;
    const date = new Date(listingDate);
    const formattedDate = date.toLocaleDateString();

    let statusColor = 'black'
    if (listing.status === 'available') {
        statusColor = 'text-green-600'
    }
    else if (listing.status === 'pending') {
        statusColor = 'text-yellow-600'
    }
    else if (listing.status === 'adopted') {
        statusColor = 'text-red-600'
    }
    else if (listing.status === 'withdrawn') {
        statusColor = 'text-gray-600'
    }

    const handleApply = () => {
        navigate(`../listing/${listingID}/apply`)
    };

    return <>
        <main className="flex flex-col justify-center items-center pb-16 mt-12">
            <div className="grid grid-cols-1 gap-4 w-10/12 xl:w-3/4 2xl:w-2/4 max-w-[836px] p-6 rounded-md border-blue3 border-4 bg-white">
                <div className="flex justify-between capitalize">
                    {userId === listing.shelter ? <Link to={`../update_listing/${listing.id}`} className="text-white bg-blue3 font-bold rounded shadow-md border-2 border-blue3 hover:border-black hover:text-blue3 hover:bg-white">Edit</Link> : <p></p>}
                    <p className={statusColor}>{listing?.status}</p>
                    <p>{shelter.name}</p>
                </div>
                <div className="relative group">

                    {listing.images && listing.images.length > 0 ? (<img className="h-[400px] w-full object-cover rounded-md border-blue3 border-4" src={`http://3.16.70.156:8000/api/${listing.images[currentImageIndex]}`} />) : <div className="text-center h-[400px] w-full object-cover rounded-md border-blue3 border-4 flex justify-center items-center"><p>No Image Available</p></div>}

                    {listing.images && listing.images.length > 1 && (
                    <button onClick={handlePreviousImage} className="absolute left-0 top-[50%] pl-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-arrow-left-circle-fill text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                        </svg>
                    </button>)}
                    {listing.images && listing.images.length > 1 && (
                        <button onClick={handleNextImage} className="absolute right-0 top-[50%] pr-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-arrow-right-circle-fill text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                            </svg>
                        </button>)
                    }
                </div>
                <p className="text-2xl font-bold text-center capitalize">{listing?.name}</p>
                <div className="grid grid-cols-4">
                    <div className='flex flex-col items-center capitalize'>
                        <h2 className="font-bold">Species</h2>
                        <p>{listing?.species}</p>
                    </div>
                    <div className='flex flex-col items-center capitalize'>
                        <h2 className="font-bold">Breed</h2>
                        <p>{listing?.breed}</p>
                    </div>
                    <div className='flex flex-col items-center capitalize'>
                        <h2 className="font-bold">Gender</h2>
                        <p>{listing?.gender}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <h2 className="font-bold">Size</h2>
                        <p>{listing?.size} lbs</p>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold">Age</h2>
                    <p>{listing?.years_old} years, {listing?.months_old} months old</p>
                </div>
                <div>
                    <h2 className="font-bold">Description</h2>
                    <p>{listing?.description || 'N/A'}</p>
                </div>
                <div>
                    <h2 className="font-bold">Behaviour</h2>
                    <p>{listing?.behaviour || 'N/A'}</p>
                </div>
                <div>
                    <h2 className="font-bold">Medical History</h2>
                    <p>{listing?.medical_history || 'N/A'}</p>
                </div>
                <div>
                    <h2 className="font-bold">Special Requirements</h2>
                    <p>{listing?.special_requirements || 'N/A'}</p>
                </div>
                <div>
                    <h2 className="font-bold">Listing Date</h2>
                    <p>{formattedDate}</p>
                </div>
                { userType === 'seeker' ? <div className="flex justify-center">
                    <button className="button w-1/2" onClick={handleApply}>Apply</button>
                </div>: <></>}
            </div>
        </main>
    </>
}

export default PetDetail;