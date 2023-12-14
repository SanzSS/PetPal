import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        if (formData.avatar) {
            toSend.append('avatar', formData.avatar);
        }
        
        if (validate_form()) {
            try {
                await axios.post('http://127.0.0.1:8000/accounts/', toSend);
                navigate("/");
            } catch (error) {
                console.error(error)
                if (error.response) {
                        if (error.response.status === 400) {
                            const errorString = error.response.data;
                            setSignupError(errorString);
                        } else {
                            setSignupError('An error occurred during signup.');
                        }
                }
            }
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
            <main className="flex flex-col justify-center items-center mt-8">
                <div className="grid grid-cols-1 w-10/12 xl:w-3/4 2xl:w-2/4 max-w-[836px] p-6" id="content">
                <h1 id="website-name" className="text-blue3 font-bold text-6xl pt-10 text-center">PetPal</h1>
                <br></br>
                <br></br>
                <form>
                    <input type="text" id="name" name="name" placeholder="Name" required onChange={handleInputChange} className="p-3 border-solid border-blue3 border-2 rounded-md w-full"/>
                    <br></br>
                    <p className="error">{formErrors.name}</p>
                    <br></br>
                    <input type="email" id="form-email" name="email" placeholder="Email" required onChange={handleInputChange} className="p-3 border-solid border-blue3 border-2 rounded-md w-full"/>
                    <br></br>
                    <p className="error">{formErrors.email}</p>
                    <br></br>
                    <input type="password" id="password1" name="password1" placeholder="Password" required onChange={handleInputChange} className="p-3 border-solid border-blue3 border-2 rounded-md w-full"/> 
                    <br></br>
                    <p className="error">{formErrors.password1}</p>
                    <br></br>
                    <input type="password" id="password2" name="password2" placeholder="Re-enter Password" required onChange={handleInputChange} className="p-3 border-solid border-blue3 border-2 rounded-md w-full"/> 
                    <br></br>
                    <p className="error">{formErrors.password2}</p>
                    <br></br>
                    <label htmlFor="user_type" className="pb-2">User type:   </label>
                    <select name="user_type" id="type" required onChange={handleInputChange} className="p-3 border-solid border-blue3 border-2 rounded-md w-full">
                        <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="seeker">Pet Seeker</option>
                        <option value="shelter">Pet Shelter</option>
                    </select>
                    <br></br>
                    <p className="error">{formErrors.user_type}</p>
                    <br></br>
                    <label htmlFor="avatar_field">Avatar:</label>
                    <br></br>
                    <input
                        type="file"
                        id="avatar_field"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="p-3 border-solid border-blue3 border-2 rounded-md bg-white w-full"
                    />
                    <br />
                    <p className="error">{formErrors.avatar}</p>
                    <br />
                    <input type="submit" onClick={(event) => signup(event)} className="button w-full cursor-pointer" value="Sign up" id="signup"/>
                    <br></br>
                    {signupError && <p className="error">{JSON.stringify(signupError)}</p>}
                    <br></br>
                </form>
                <br></br>
                <Link to="/login" id="login" className="underline mb-20 text-center">Login</Link>
                </div>
            </main>
        </>
}

export default Signup