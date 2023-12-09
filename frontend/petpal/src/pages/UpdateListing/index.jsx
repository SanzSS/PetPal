import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from '../../components/ListingForm'
import { fetchWithAuthorization } from '../../fetch';
import { useAuth } from '../../contexts/TokenContext';

const UpdateListing = () => {
    const [ listing, setListing ] = useState({});
    const { listingID } = useParams();

    const navigate = useNavigate();

    const { token } = useAuth();

    useEffect(() => {
        fetchWithAuthorization(`/listings/listing/${listingID}/`, {method: 'GET'}, navigate, token)
        .then(response => response.json())
        .then(json => {
            setListing(json);
            console.log(json)
        })
    }, [listingID]);

    let initialValues = {
        listingID: listingID,
        status: listing.status,
        name: listing.name,
        species: listing.species,
        breed: listing.breed,
        years_old: listing.years_old,
        months_old: listing.months_old,
        gender: listing.gender,
        size: listing.size,
        description: listing.description,
        medical_history: listing.medical_history,
        behaviour: listing.behaviour,
        special_requirements: listing.special_requirements,
    }

    return <>
        <main class="flex flex-col items-center pb-16">
            <h1 class="text-4xl md:text-6xl my-12 text-blue3 font-extrabold">Update Pet Information</h1>
            <ListingForm initialValues={initialValues} create={false} />
        </main>
    </>
}

export default UpdateListing;