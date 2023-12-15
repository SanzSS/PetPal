import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/TokenContext';
import { useState, useEffect } from 'react';
import { useUserType } from '../../contexts/UserTypeContext';

const Keyword = ({keyword, setKeywords, index}) => {
    const { token } = useAuth();
    const { userType } = useUserType();

    const [word, setWord] = useState(
        keyword.keyword
    );

    const [weight, setWeight] = useState(
        keyword.weight
    );

    const handleWordChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        setWord(
          value
        );
        setKeywords(prevKeywords => {
            const updatedKeywords = [...prevKeywords];
            updatedKeywords[index] = { ...updatedKeywords[index], keyword: value };
            return updatedKeywords;
        });
    };

    const handleWeightChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        setWeight(
          value
        );
        setKeywords(prevKeywords => {
            const updatedKeywords = [...prevKeywords];
            updatedKeywords[index] = { ...updatedKeywords[index], weight: value };
            return updatedKeywords;
        });
    };

    const handleDelete = () => {
        if (keyword.id) {
            axios.delete(`http://127.0.0.1:8000/keywords/edit/${keyword.id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            })
          .then(() => {
            // Update the keywords state to remove the deleted keyword
            setKeywords(prevKeywords => prevKeywords.filter((_, i) => i !== index));
            })
          .catch(error => {
            console.error(error);
            });
        } else {
          // If the keyword doesn't have an id, it hasn't been saved to the backend yet
          // Simply remove it from the state
          setKeywords(prevKeywords => prevKeywords.filter((_, i) => i !== index));
        }
    };
    

    return <>
        <div id="keyword" className="my-2">
            <input type="text" name="keyword" onChange={(event) => handleWordChange(event, index)} value={word} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
            <input type="number" name="weight" onChange={(event) => handleWeightChange(event, index)} value={weight} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
        </div>
        <button onClick={handleDelete} id='delete-keyword' className="text-white rounded-md mb-4 p-2 px-4 mx-4 font-bold cursor-pointer hover:bg-white border-2 border-[#9A0007]">
            Delete
        </button>
    </>
}

export default Keyword;

