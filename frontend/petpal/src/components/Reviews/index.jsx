import axios from 'axios';
import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// import { fetchWithAuthorization } from '../../fetch';
import { useAuth } from '../../contexts/TokenContext';
import ReviewCard from '../ReviewCard';

const Reviews = ({shelterID}) => {
    const { token } = useAuth();
    const [reviews, setReviews ] = useState([]);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [url, setUrl] = useState(`http://127.0.0.1:8000/comments/shelter/${shelterID}`);

    const [newRating, setNewRating] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        // response = response.json();
        setNext(response.data.next);
        setPrev(response.data.previous);
        setReviews(response.data.results);
    })
    .catch((error) => {
        console.log(error);
    });}, [url, token]);
    console.log(next);
    

    return <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
            {reviews.map((review, index) => (
                <ReviewCard review={review} key={index}/>
            ))}
            {/* a section to write a new comment */}
            <div className="p-2 grid grid-cols-2">
                    <p className="card-description">Rating: </p>
                    <input id="review-input" className="input h-6 m-0 p-2" value={newRating} onChange={(e) => setNewRating(e.target.value)}/>
                    <input id="review-input" className="input col-span-2 h-6 m-0 p-2" value={newContent} onChange={(e) => setNewContent(e.target.value)}/>
            </div>
        </div>
        <div className="flex flex-row gap-4 justify-center">
            <button onClick={() => {
                if (prev != null) {
                    setUrl(prev);
                    setReviews([]);
                }
            }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Previous</button>
            <button onClick={() => {
                // console.log(next);
                if (next != null) {
                    setUrl(next);
                    setReviews([]);
                }
            }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Next</button>
        </div>
    </>
}

export default Reviews;