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

    return <>
        <div id="keyword" className="my-2">
            <input type="text" name="keyword" onChange={(event) => handleWordChange(event, index)} value={word} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
            <input type="number" name="weight" onChange={(event) => handleWeightChange(event, index)} value={weight} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
        </div>
        {/* <div className="items-center justify-center flex mt-4">
            <input type="submit" onClick={(event) => update(event)} value="Save" id="submit" className="button w-1/2 mb-6 text-xl cursor-pointer"/>
          </div> */}
    </>
}

export default Keyword;

