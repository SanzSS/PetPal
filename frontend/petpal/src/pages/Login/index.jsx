import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useUserType } from '../../contexts/UserTypeContext';

const Login = () => {
    let navigate = useNavigate();
    const { setToken } = useAuth();
    const { setUserType } = useUserType();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const [loginError, setLoginError] = useState('');

    const validate_form = () => {
        var isValid = true;

        const newErrors = { ...formErrors };
        const emailPattern = /^(?:"[^"\\]*(?:\\.[^"\\]*)*"|(?!.*\.\.)(?!.*_)[^\s@"]+(?:\.[^\s@"]+)*@[^\s@"]+\.((?![^.\s@"]*(_)[^.\s@"]*\.)[^\s@"]+)+)$/;
        const email = formData.email.trim();

        if (email === '') {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailPattern.test(email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        } else {
            newErrors.email = '';
        }
    
        if (formData.password.trim() === '') {
            newErrors.password = 'Password is required';
            isValid = false;
        } else {
            newErrors.password = '';
        }
    
        setFormErrors(newErrors);
        return isValid;
    }

    const login = (event) => {
        event.preventDefault();

        if (validate_form()) {
            fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST', 
                body: new URLSearchParams(formData).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setToken(data.access);
                const decodedToken = jwtDecode(data.access);
                var userID = null;
                if (decodedToken) {
                    userID = decodedToken.user_id;
                }
                if (userID) {
                    const response = axios.get(`http://127.0.0.1:8000/accounts/${userID}/`, {
                        headers: {
                            "Authorization": `Bearer ${data.access}`
                        }
                    });
                    return response;
                }
            })
            .then(response => {
                const { user_type } = response.data;
                setUserType(user_type);
                navigate("/search");
            })
            .catch(error => {
                if (error instanceof TypeError) {
                    // Network error or other issues
                } else {
                    // HTTP error
                    if (error.message.includes('401')) {
                        setLoginError('No active account found with the given credentials.');
                    } else if (error.message.includes('400')) {
                        setLoginError('Bad request. Check your credentials.');
                    } else {
                        setLoginError('An error occurred during login.');
                    }
                }
            });
        }
    }

    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
    
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    return <>
        <main className="flex flex-col justify-center items-center mt-8">
          <div className="grid grid-cols-1 w-10/12 xl:w-3/4 2xl:w-2/4 max-w-[836px] p-6" id="content">
            <h1 id="website-name" className="text-blue3 font-bold text-6xl pt-20 text-center">PetPal</h1>
            <br/>
            <br/>
            <form onSubmit={login}>
                <input type="email" id="form-email" name="email" placeholder="Email" onChange={handleInputChange} className="p-3 border-solid text-blue3 border-blue3 border-2 rounded-md w-full" required/>
                <p className="error">{formErrors.email}</p>
                <br/>
                <input type="password" id="password" name="password" placeholder="Password" onChange={handleInputChange} className="p-3 border-solid text-blue3 border-blue3 border-2 rounded-md w-full" required/> 
                <p className="error">{formErrors.password}</p>
                <br/>
                <input type="submit" value="Login" id="login" onClick={(event) => login(event)} className="button w-full cursor-pointer"/>
                <br></br>
                <p className="error">{loginError}</p>
                <br></br>
            </form>
            <br></br>
            <Link to="/signup" className="text-blue3 text-base underline mb-20 text-center">Sign up</ Link>
        </div>
      </main>
    </>
}

export default Login