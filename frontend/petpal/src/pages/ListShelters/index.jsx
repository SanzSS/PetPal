import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/TokenContext';
import ShelterCard from '../../components/ShelterCard';


const Shelters = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/accounts/shelters/');
    const { token } = useAuth();
    const [shelters, setShelters] = useState([]);


    useEffect(() => {axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        let temp = []
        for (let i = 0; i < response.data.length; i++) {
            temp.push(response.data[i]);
          
        };
        setShelters(temp);
    
    })
    .catch((error) => {
        console.log(error);
    });}, [url]);

    return <>
        {shelters.map((shelter) => {
            <ShelterCard shelter={shelter} />
        })};
    
    
    </>

    

}

export default Shelters;