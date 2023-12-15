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
    const [url, setUrl] = useState(`http://3.16.70.156:8000/api/comments/shelter/${shelterID}`);

    const [newRating, setNewRating] = useState("");
    const [newContent, setNewContent] = useState("");
    const [error, setError] = useState("")

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
    
    const handleSubmit = async () => {

        const reviewJSON = {"content": newContent, "rating": newRating};
        try {
            await axios.post(`http://3.16.70.156:8000/apicomments/shelter/${shelterID}/`, 
                    JSON.stringify(reviewJSON),
                    {headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
            });
        } catch (APIerror) {
            console.log(APIerror);
            setError("Content may not be blank");
        }
        setNewContent("");
        setNewRating("");
        setUrl(`http://3.16.70.156:8000/api/comments/shelter/${shelterID}`);
    } 


    return <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
             {/* a section to write a new comment */}
             <div className="p-2 grid grid-cols-2 gap-2">
                    <p className="card-description">Rating: </p>
                    <input id="review-input" className="input h-5" value={newRating} placeholder="10" onChange={(e) => setNewRating(e.target.value)}/>
                    <input id="review-input" className="input col-span-2 h-5" placeholder="I love this place" value={newContent} onChange={(e) => setNewContent(e.target.value)}/>
                    <button onClick={() => {
                        handleSubmit();
                        }
                    } id="review-input" className="col-span-2 bg-blue3 border-2 border-blue3 text-white items-center font-bold rounded-md h-5 hover:bg-white hover:text-blue3">Submit</button>
                    <p className="col-span-2 self-center text-sm">{error}</p>
            </div>

            {reviews.map((review, index) => (
                <ReviewCard review={review} key={index}/>
            ))}
        </div>
        <div className="flex flex-row gap-4 justify-center">
            {prev != null && (
                <button
                    onClick={() => {
                    setUrl(prev);
                    setReviews([]);
                    }}
                    className="bg-blue3 border-2 border-blue3 text-white font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3"
                    >
                    Previous
                </button>
            )}
            {next != null && (
            <button onClick={() => {
                // console.log(next);
                if (next != null) {
                    setUrl(next);
                    setReviews([]);
                }
                }} className="bg-blue3 border-2 border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Next</button>
            )}
        </div>
    </>
}

export default Reviews;