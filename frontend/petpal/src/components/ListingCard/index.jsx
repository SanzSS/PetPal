import { Link } from 'react-router-dom'

const ListingCard = ({listing}) => {
    return <>
        <Link to={`../listing/${listing.id}`} class="card">
            {listing.images.length !== 0 ? <img alt={listing.name} src={listing.images[0].image} class="w-full h-[250px] object-cover" /> : <div className="w-full h-[250px] flex justify-center items-center"><p>No Image Available</p></div>}
            <div class="p-2">
                <span class="font-bold block capitalize">{ listing.name }</span>
                <span class="card-description capitalize">{ listing.breed }</span>
                <span class="card-description">{ (listing.years_old === 0 || listing.years_old === null) ? (listing.months_old == 1 ? `${listing.months_old} Month Old` : `${listing.months_old} Months Old`) : (listing.years_old == 1 ? `${listing.years_old} Year Old` : `${listing.years_old} Years Old`) }</span>
            </div>
        </Link>
    </>
}

export default ListingCard;