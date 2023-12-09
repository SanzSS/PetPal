import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';
import { jwtDecode } from "jwt-decode";

const ViewAccount = () => {
    const { token } = useAuth();

    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
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
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://127.0.0.1:8000/accounts/${userId}/`, {
                        headers: {
                          "Authorization": `Bearer ${token}`
                        }
                    });
                    const { email, name, avatar } = response.data;
                    setEmail(email);
                    setName(name);
                    setAvatar(avatar)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [userId, token]);
    
    return <> 
            <main className="items-center justify-center text-left flex flex-col">
        <div className="items-center flex justify-center flex-col">
            <div className="flex justify-center items-center flex-col">
            <h1 className="text-6xl mt-12 text-blue3 font-extrabold text-center mb-10">
                Account Settings
            </h1>
            <img src={`media/${avatar}`} alt="User Avatar" className="w-30 h-30 rounded-full"/>
    </div>
        </div>
    <div className="h-[20rem] rounded-md border-blue3 border-4 bg-blue2 shadow-lg flex items-left p-3 mt-4 lg:w-[70%] flex-col w-[70%] md:w-[70%]">
        <div className="self-end bg-gray-500 border border-black rounded-md w-14 text-center font-bold hover:bg-white">
        <Link to="/account/edit">Edit</Link>
        </div>
        <p>
            Email address: 
        </p>
        <div>
            <input type="email" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2" value={email} />
        </div>
        <p>
            Name:
        </p>
        <div>
            <input type="text" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2" value={name} />
        </div>
    </div>
    </main>
        </>
}

export default ViewAccount