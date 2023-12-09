const ListingCard = ({listing}) => {
    return <>
        <a href="../pet/pet-details.html" class="card">
            <img src={ listing.image } class="w-full h-[250px] object-cover" alt={listing.name}/>
            <div class="p-2">
                <span class="font-bold block">{ listing.name }</span>
                <span class="card-description">{ listing.breed }</span>
                <span class="card-description">{ (listing.years_old === 0 || listing.years_old === null) ? listing.months_old : listing.years_old }</span>
            </div>
        </a>
    </>
}

export default ListingCard;