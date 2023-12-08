import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password1: '',
        password2: '',
        user_type: 'seeker',
        avatar: null
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        name: '',
        password1: '',
        password2: '',
        user_type: '',
        avatar: ''
    });

    const [signupError, setSignupError] = useState('');

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

        if (formData.name.trim() === '') {
            newErrors.name = 'Name is required';
            isValid = false;
        } else {
            newErrors.name = '';
        }
    
        if (formData.password1.trim() === '') {
            newErrors.password1 = 'Password is required';
            isValid = false;
        } else if (formData.password1.trim().length < 8) {
            newErrors.password1 = 'Password is too short';
            isValid = false; 
        } else {
            newErrors.password1 = '';
        }

        if (formData.password2.trim() !== formData.password1.trim()) {
            newErrors.password2 = 'Passwords do not match';
            isValid = false;
        } else {
            newErrors.password2 = '';
        }

        if (formData.user_type !== 'seeker' && formData.user_type !== 'shelter') {
            newErrors.user_type = 'Invalid user type';
            isValid = false;
        } else {
            newErrors.user_type = '';
        }

        if (formData.avatar) {
            if (!formData.avatar.type.startsWith('image/')) {
                newErrors.avatar = 'Selected file is not a valid image';
                isValid = false;
            } else {
                newErrors.avatar = '';
            }
        }

        setFormErrors(newErrors);
        return isValid;
    }

    const signup = async (event) => {
        event.preventDefault();

        const toSend = new FormData();

        // Append fields to the FormData object
        toSend.append('email', formData.email);
        toSend.append('name', formData.name);
        toSend.append('password1', formData.password1);
        toSend.append('password2', formData.password2);
        toSend.append('user_type', formData.user_type);
        toSend.append('avatar', formData.avatar);

        if (validate_form()) {
            fetch('http://127.0.0.1:8000/accounts/', {
                method: 'POST', 
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                    navigate("/");
                }
            })
            .catch(async (error) => {
                if (error instanceof TypeError) {
                    // Network error or other issues
                } else {
                    // HTTP error
                    if (error.response) {
                        if (error.status === 400) {
                            const errorString = error.data;
                            setSignupError(errorString);
                        } else {
                            setSignupError('An error occurred during signup.');
                        }
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

    const handleFileChange = (event) => {
        setFormData({
            ...formData,
            avatar: event.target.files[0],
        });
    };
    
    return <> 
            <main>
            <div className="container" id="content">
            <h1 id="website-name" className="text-teal-900 font-bold text-6xl pt-10">PetPal</h1>
            <br></br>
            <br></br>
            <form className="w-1/2">
                <input type="text" id="name" name="name" placeholder="Name" required onChange={handleInputChange} className="p-3 border border-solid border-teal-900 border-2 rounded-md"/>
                <br></br>
                <p className="error">{formErrors.name}</p>
                <br></br>
                <input type="email" id="form-email" name="email" placeholder="Email" required onChange={handleInputChange} className="p-3 border border-solid border-teal-900 border-2 rounded-md"/>
                <br></br>
                <p className="error">{formErrors.email}</p>
                <br></br>
                <input type="password" id="password1" name="password1" placeholder="Password" required onChange={handleInputChange} className="p-3 border border-solid border-teal-900 border-2 rounded-md"/> 
                <br></br>
                <p className="error">{formErrors.password1}</p>
                <br></br>
                <input type="password" id="password2" name="password2" placeholder="Re-enter Password" required onChange={handleInputChange} className="p-3 border border-solid border-teal-900 border-2 rounded-md"/> 
                <br></br>
                <p className="error">{formErrors.password2}</p>
                <br></br>
                <label htmlFor="user_type">User type:   </label>
                <select name="user_type" id="type" required onChange={handleInputChange} className="p-3 border border-solid border-teal-900 border-2 rounded-md">
                    <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                    <option value="seeker">Pet Seeker</option>
                    <option value="shelter">Pet Shelter</option>
                </select>
                <br></br>
                <p className="error">{formErrors.user_type}</p>
                <br></br>
                <label htmlFor="avatar">Avatar:</label>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="p-3 border border-solid border-teal-900 border-2 rounded-md"
                    />
                <br />
                <p className="error">{formErrors.avatar}</p>
                <br />
                <input type="submit" onClick={(event) => signup(event)} className="text-yellow-400 border-solid border-yellow-400 border-2 rounded-md cursor-pointer bg-teal-900 p-3 justify-center inline-flex items-center no-underline text-center w-full" value="Sign up" id="signup"/>
                <br></br>
                <p className="error">{signupError}</p>
                <br></br>
            </form>
            <br></br>
            <a href="login.html" id="login" className="underline mb-20">Login</a>
            </div>
            </main>
        </>
}


export default Signup