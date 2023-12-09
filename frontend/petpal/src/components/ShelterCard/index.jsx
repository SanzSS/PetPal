import { Link } from 'react-router-dom'

const ShelterCard = ({shelter}) => {
    return <>
        <Link to={`../listing/${shelter.id}`} class="card">
            {shelter.avatar.length !== 0 ? <img src={shelter.avatar} class="w-full h-[250px] object-cover" /> : <div className="w-full h-[250px] flex justify-center items-center"><p>No Image Available</p></div>}
            <div class="p-2">
                <span class="font-bold block capitalize">{ shelter.name }</span>
            </div>
        </Link>
    </>
}

export default ShelterCard;