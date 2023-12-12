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
        e.preventDefault();
        
        const form = new FormData();

        form.append('email', email)
        form.append('name', name)
        form.append('password', password)

        axios.patch(`http://127.0.0.1:8000/accounts/${userId}/`, form, {
            headers: {
              Authorization: `Bearer ${token}`
            }})
            .then(() => {
                navigate('/account');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } 
    return <> 
    <main className="items-center justify-center text-left flex flex-col">
        <div className="items-center flex justify-center flex-col">
            <h1 className="text-6xl mt-12 text-blue3 font-extrabold text-center mb-10">
                Account Settings
            </h1>
            {/* <div id="avatar-container">
                {avatar && <img src={avatar} alt="User Avatar" id="avatar" className="rounded-full"/>}
            </div> */}
        </div>
        <div className="h-1/2 rounded-md border-blue3 border-4 bg-blue2 shadow-lg flex items-left p-3 mt-4 lg:w-[70%] flex-col w-[70%] md:w-[70%]">

        <form onSubmit={handleSubmit}>
            <div className="my-2">
                <p>Email address: </p>
                <input type="email" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 w-full my-2" placeholder={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="my-2">
                <p>Name:</p>
                <input type="text" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 w-full my-2" placeholder={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="my-2">
                <p>Password:</p>
                <input type="password" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 w-full my-2" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='text-center'>
                <input type="submit" onClick={handleSubmit} value="Update" className="button w-1/4 cursor-pointer"/>
            </div>
        </form>
    </div>
</main>
</>
}

export default EditAccount;