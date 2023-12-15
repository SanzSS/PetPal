import { Link } from 'react-router-dom'

const ShelterCard = ({shelter}) => {
    console.log("hello");
    return <>
        <Link to={`/shelter/${shelter.pk}`} className="card">
            {shelter.avatar.length !== 0 ? <img src={shelter.avatar} className="w-full h-[400px] object-cover" /> : <div className="w-full h-[400px] flex justify-center items-center"><p>No Image Available</p></div>}
            <div className="p-2">
                <span className="font-bold block capitalize">{ shelter.name }</span>
            </div>
        </Link>
    </>
}

export default ShelterCard;