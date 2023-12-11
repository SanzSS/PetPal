import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/TokenContext';
import ShelterCard from '../../components/ShelterCard';
import { Link } from 'react-router-dom'



const Shelters = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/accounts/shelters/');
    const { token } = useAuth();
    const [shelters, setShelters] = useState([]);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    

    useEffect(() => {axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        setNext(response.data.next);
        setPrev(response.data.previous);
        let temp = [...shelters]
        for (let i = 0; i < response.data.results.length; i++) {
            temp.push(response.data.results[i]);
          
        };
        setShelters(temp);
    
    })
    .catch((error) => {
        console.log(error);
    });}, [url]);
    return <>
    <body className="min-h-screen bg-blue1 flex flex-col">
            <div className="flex flex-col items-center justify-center text-left">
                <h1 className="lg:text-6xl my-12 text-blue3 font-extrabold md:text-6xl text-6xl self-center">
                    Shelters
                </h1>
            </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:p-2">

        {shelters.map((shelt) => {
                if (shelt.avatar == null){
                    shelt.avatar = '';
                console.log(shelt);}
               return (
                <>
                    <ShelterCard key={shelt.pk} shelter={shelt} />
                </>
               );})}
    </div>
    <div className="flex flex-row gap-4">
        <button onClick={() => {
            if (prev != null) {
                setUrl(prev);
                setShelters([]);
            }
        }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Previous</button>
        <button onClick={() => {
            console.log(next);
            if (next != null) {
                setUrl(next);
                setShelters([]);
            }
        }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Next</button>
        </div>
         
        </body>
    </>

    

}

export default Shelters;