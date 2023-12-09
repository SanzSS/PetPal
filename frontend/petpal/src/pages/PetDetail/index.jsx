import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './style.css';
import { fetchWithAuthorization } from '../../fetch';
import { useAuth } from '../../contexts/TokenContext';

const PetDetail = () => {
    const [ listing, setListing ] = useState({});
    const { listingID } = useParams();
    const [ currentImageIndex, setCurrentImageIndex ] = useState(0);

    const navigate = useNavigate();

    const { token } = useAuth();

    useEffect(() => {
        fetchWithAuthorization(`/listings/listing/${listingID}/`, {method: 'GET'}, navigate, token)
        .then(response => response.json())
        .then(json => {
            setListing(json);
        })
    }, [listingID]);

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

    return <>
        <main className="flex flex-col justify-center items-center pb-16 mt-12">
            <div className="grid grid-cols-1 gap-4 w-10/12 xl:w-3/4 2xl:w-2/4 max-w-[836px] p-6 rounded-md border-blue3 border-4 bg-white">
                <div className="flex justify-between capitalize">
                    <Link to={`../update_listing/${listing.id}`} className="text-white bg-blue3 font-bold rounded shadow-md border-2 border-blue3 hover:border-black hover:text-blue3 hover:bg-white">Edit</Link>
                    <p className={statusColor}>{listing?.status}</p>
                    <p>{listing?.shelter}</p>
                </div>
                <div className="relative group">
                    {listing.images && listing.images.length > 0 ? (<img className="h-[400px] w-full object-cover rounded-md border-blue3 border-4" src={`http://127.0.0.1:8000/${listing.images[currentImageIndex]}`} />) : <div className="text-center h-[400px] w-full object-cover rounded-md border-blue3 border-4 flex justify-center items-center"><p>No Image Available</p></div>}
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
                        <h2>Species</h2>
                        <p>{listing?.species}</p>
                    </div>
                    <div className='flex flex-col items-center capitalize'>
                        <h2>Breed</h2>
                        <p>{listing?.breed}</p>
                    </div>
                    <div className='flex flex-col items-center capitalize'>
                        <h2>Gender</h2>
                        <p>{listing?.gender}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <h2>Size</h2>
                        <p>{listing?.size} lbs</p>
                    </div>
                </div>
                <div>
                <h2>Age</h2>
                <p>{listing?.years_old} years, {listing?.months_old} months old</p>
                </div>
                <div>
                <h2>Description</h2>
                <p>{listing?.description || 'N/A'}</p>
                </div>
                <div>
                <h2>Behaviour</h2>
                <p>{listing?.behaviour || 'N/A'}</p>
                </div>
                <div>
                <h2>Medical History</h2>
                <p>{listing?.medical_history || 'N/A'}</p>
                </div>
                <div>
                <h2>Special Requirements</h2>
                <p>{listing?.special_requirements || 'N/A'}</p>
                </div>
                <div>
                    <h2>Listing Date</h2>
                    <p>{formattedDate}</p>
                </div>
            </div>
        </main>
    </>
}

export default PetDetail;