import './style.css';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../../contexts/TokenContext';
import { Link } from 'react-router-dom';

const Login = () => {
    let navigate = useNavigate();
    const { setToken } = useContext(TokenContext);
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
                setToken(data.token);
                navigate("/search");
            })
            .catch(error => {
                if (error instanceof TypeError) {
                    // Network error or other issues
                } else {
                    // HTTP error
                    if (error.message.includes('401')) {
                        setLoginError('Email and password combination is invalid.');
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
        <main>
          <div className="container" id="content">
            <h1 id="website-name" className="text-teal-900 font-bold text-6xl pt-20">PetPal</h1>
            <br/>
            <br/>
            <form onSubmit={login}>
                <input type="email" id="form-email" name="email" placeholder="Email" onChange={handleInputChange} className="p-3 border border-solid border-teal-900 border-2 rounded-md" required/>
                <p className="error">{formErrors.email}</p>
                <br/>
                <input type="password" id="password" name="password" placeholder="Password" onChange={handleInputChange} className="p-3 border border-solid border-teal-900 border-2 rounded-md" required/> 
                <p className="error">{formErrors.password}</p>
                <br/>
                <input type="submit" value="Login" id="login" onClick={(event) => login(event)} className="w-full p-3 rounded-md font-bold text-lg border-solid border-yellow-400 border-2 cursor-pointer p-3 justify-center inline-flex items-center no-underline text-center"/>
                <br></br>
                <p className="error">{loginError}</p>
                <br></br>
            </form>
            <br></br>
            <Link to="/signup" className="text-teal-900 text-base underline mb-20">Sign up</ Link>
        </div>
      </main>
    </>
}

export default Login