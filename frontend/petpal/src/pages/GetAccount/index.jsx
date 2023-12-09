import './style.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuth from '../../components/Auth/useAuth';
import { jwtDecode } from "jwt-decode";

const ViewAccount = () => {
    const token = useAuth();
    let navigate = useNavigate();

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

    useEffect(() => {axios.get(`http://127.0.0.1:8000/accounts/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
            const { email, name, avatar } = response.data;
            setEmail(email);
            setName(name);
            setAvatar(avatar)
        })
        .catch((error) => {
            console.error(error);
        });
    }, [userId, token]);
    
    return <> 
            <main class="items-center justify-center text-left flex flex-col">
        <div class="items-center flex justify-center flex-col">
            <div class="flex justify-center items-center flex-col">
            <h1 class="text-6xl mt-12 text-blue3 font-extrabold text-center mb-10">
                Account Settings
            </h1>
            <img src={avatar} alt="User Avatar" class="w-30 h-30 rounded-full"/>
    </div>
        </div>
    <div class="h-[40rem] rounded-md border-blue3 border-4 bg-blue2 shadow-lg flex items-left p-3 mt-4 lg:w-[70%] flex-col w-[70%] md:w-[70%]">
        <div class="self-end bg-gray-500 border border-black rounded-md w-14 text-center font-bold hover:bg-white">
        <button>Edit</button>
        </div>
        <p>
            Email address: 
        </p>
        <div>
            <input type="email" class="border rounded-md shadow-md" value={email} />
        </div>
        <p>
            Name:
        </p>
        <div>
            <input type="text" class="border rounded-md shadow-md" value={name} />
        </div>
    </div>
    </main>
        </>
}

export default ViewAccount