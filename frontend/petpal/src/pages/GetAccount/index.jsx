import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';
import { jwtDecode } from "jwt-decode";

const ViewAccount = () => {
    const URL = 'http://3.16.70.156/api/';
    const { token } = useAuth();
    const { userID } = useParams();
    console.log(userID);
    
    const [userId, setUserId] = useState(userID || '');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userID) {
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    if (decodedToken) {
                        setUserId(decodedToken.user_id);
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }
        }
    }, [token, userID]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`${URL}accounts/${userId}/`, {
                        headers: {
                          "Authorization": `Bearer ${token}`
                        }
                    });
                    const { email, name, avatar } = response.data;
                    setEmail(email);
                    setName(name);
                    setAvatar(avatar);
                }
            } catch (error) {
                console.error(error);
                navigate("*");
            }
        };
        fetchData();
    }, [userId, token]);

    const handleDelete = () => {
        try {
            if (userId) {
                axios.delete(`${URL}accounts/${userId}/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                      }
                    })}
                navigate('/login');
        }
        catch (error) {
                        console.error(error);
                    }
                
                
    }
    
    return <> 
        <main className="items-center justify-center text-left flex flex-col">
            <div className="items-center flex justify-center flex-col">
                <h1 className="text-6xl mt-12 text-blue3 font-extrabold text-center mb-10">
                    Account Settings
                </h1>
                {avatar && 
                <div id="avatar-container">
                    <img src={avatar} alt="User Avatar" id="avatar" className="rounded-full"/>
                </div>}
            </div>
            <div className="h-1/2 rounded-md border-blue3 border-4 bg-blue2 shadow-lg flex items-left p-3 mt-4 flex-col w-[70%]">
                <div className="self-end">
                    {!userID && <Link to="/account/edit" className="button p-1">Edit</Link>}
                </div>
                <div className="my-2">
                    <p>Email address:</p>
                    <p className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 w-full my-2 bg-white">{email}</p>
                </div>
                
                <div className="my-2">
                    <p>Name:</p>
                    <p className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 w-full my-2 bg-white">{name}</p>
                </div>
            </div>
            {!userID &&
            <button onClick={() => handleDelete()} className='w-[9%] bg-red-600 border-2 border-red-600 text-white items-center font-bold rounded-md hover:bg-white hover:text-red-600 hover:border-red-600 md:text-[1rem] text-[0.5rem] my-16'>
                Delete Account
            </button>}
        </main>
    </>
}

export default ViewAccount