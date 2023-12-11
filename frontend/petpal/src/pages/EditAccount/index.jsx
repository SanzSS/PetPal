import '../GetAccount/style.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';


const EditAccount = () => {
    const { token } = useAuth();
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

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
                    setAvatar(avatar);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [userId, token]);
    const handleSubmit = (e) => {
        console.log("hello");
        axios.patch(`http://127.0.0.1:8000/accounts/${userId}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }});
        // navigate('/my_profile');
    } 
    return <> 
    <main className="items-center justify-center text-left flex flex-col">
<div className="items-center flex justify-center flex-col">
    <div className="flex justify-center items-center flex-col">
    <h1 className="text-6xl mt-12 text-blue3 font-extrabold text-center mb-10">
        Account Settings
    </h1>
    {/* <div id="avatar-container">
        {avatar && <img src={avatar} alt="User Avatar" id="avatar" className="rounded-full"/>}
    </div> */}
</div>
</div>
<div id="profile-container" className="h-1/2 rounded-md border-blue3 border-4 bg-blue2 shadow-lg flex items-left p-3 mt-4 lg:w-[70%] flex-col w-[70%] md:w-[70%]">

<form onSubmit={handleSubmit}>
<p id='account-attribute'>
    Email address: 
</p>
<div>
    <input type="email" id='account-value' className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2" placeholder={email} onChange={(e) => setEmail(e.target.value)} />
</div>
<p id='account-attribute'>
    Name:
</p>
<div>
    <input type="text" id='account-value' className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2" placeholder={name} onChange={(e) => setName(e.target.value)}/>
</div>
<p id='account-attribute'>
    Password:
</p>
<div>
    <input type="password" id='account-value' className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2" onChange={(e) => setPassword(e.target.value)} />
</div>
<div className=' text-center'>
<input type="submit" value="Update" id='account-value' className=" bg-gray-500 border border-black rounded-md w-[8%] mt-3 text-center font-bold hover:bg-white"/>
</div>
</form>
</div>
</main>
</>
}

export default EditAccount;