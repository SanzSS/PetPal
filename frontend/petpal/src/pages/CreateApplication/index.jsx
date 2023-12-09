import './style.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from 'react-router-dom';

const CreateApplication = () => {
    const { token } = useAuth();
    const { listingID } = useParams();
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
                    setAvatar(avatar);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [userId, token]);
    
    return <> 
    <main>
        <div className="w-[75%] md:w-[75%] lg:w-3/4">
        <form>
        <h1 className="lg:text-6xl md:text-6xl text-4xl my-12 text-blue3 font-extrabold text-center justify-center items-center">
            Adoption Application
        </h1>

        <p>
            Your address: <span>*</span>
        </p>
        <div>
            <input type="text" className="border rounded-md shadow-md" required/>
        </div>

        <p>
            City: <span>*</span>
        </p>
        <div>
            <input type="text" className="border rounded-md shadow-md" required/>
        </div>

        <p>
            Postal Code: <span>*</span>
        </p>
        <div>
            <input type="text" className="border rounded-md shadow-md" required/>
        </div>

        <p>
            Phone number: <span>*</span>
        </p>
        <div>
            <input type="text" className="border rounded-md shadow-md" required/>
        </div>

        <p>
            Email: <span>*</span>
        </p>
        <div>
            <input type="email" className="border rounded-md shadow-md" required/>
        </div>

        <p>
            Are you 21 years of age and over?: <span>*</span>
        </p>
        <div>
            <select className="border rounded-md shadow-lg" required>
                <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>

        <p>
            List all members of your household including number of children and their ages. 
            Who will be primarily responsible for the care of this pet?
        </p>
        <div>
            <textarea name="" id="" cols="80" rows="10" className="border rounded-md shadow-md" required></textarea>
        </div>

        <p>
            Do you live in a house, apartment, condominium or townhouse?: <span>*</span>
        </p>
        <div>
            <select className="border rounded-md shadow-md" required>
                <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
            </select>
        </div>

        <p>
            Do you own or rent your home?: <span>*</span>
        </p>
        <div>
            <select className="border rounded-md shadow-md" required>
                <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="Own">Own</option>
                <option value="Rent">Rent</option>
            </select>
        </div>

        <p>
            How long have you lived at your current address (in years)?: <span>*</span>
        </p>
        <div>
            <input type="number" className="border rounded-md shadow-md" required/>
        </div>

        <p>
            Do you have plans to move from your current address within the next 3 months?: <span>*</span>
        </p>
        <div>
            <select className="border rounded-md shadow-md" required>
            <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>

        <p>
            Do you have a securely fenced in yard?: <span>*</span>
        </p>
        <div>
            <select className="border rounded-md shadow-md" required>
            <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>

        <p>
            Do you have a pool?: <span>*</span>
        </p>
        <div>
            <select className="border rounded-md shadow-md" required>
            <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>

        <p>
            Why have you chosen this particular dog?: <span>*</span>
        </p>
        <div>
            <textarea name="" id="" cols="80" rows="10" className="border rounded-md shadow-md" required></textarea>
        </div>
        
        <p>
            Please explain your reasons for wanting to adopt a dog: <span>*</span>
        </p>
        <div>
            <textarea name="" id="" cols="80" rows="10" className="border rounded-md shadow-md" required></textarea>
        </div>

        <p>
            For whom are you adopting a dog? For you or for someone else? (If for someone else, who?): <span>*</span>
        </p>
        <div>
            <textarea name="" id="" cols="80" rows="10" className="border rounded-md shadow-md" required></textarea>
        </div>

        <p>
            What experience do you have as a dog owner? If you have been a dog owner, please tell us about your previous dogs: <span>*</span>
        </p>
        <div>
            <textarea name="" id="" cols="80" rows="10" className="border rounded-md shadow-md"></textarea>
        </div>

        <p>
            How long has it been since you've had a dog in your life?: <span>*</span>
        </p>
        <div>
            <input type="number" className="border rounded-md shadow-md" required/>
        </div>

        <p>
            Do you have dog training experience? And if so, what training do you have?: <span>*</span>
        </p>
        <div>
            <textarea name="" id="" cols="80" rows="10" className="border rounded-md shadow-md" required></textarea>
        </div>

        <p>
            Do you currently have any pets?: <span>*</span>

        </p>
        <div>
            <select className="border rounded-md shadow-md" required>
            <option value="" disabled="" selected="selected" className="placeholder border rounded-md shadow-md">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>

        <p>
            Is any member of your family allergic to dogs?: <span>*</span>
        </p>

        <div>
            <select className="border rounded-md shadow-md" required>
            <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>

        <p>
            Are you applying for a young puppy (6 months old or younger)? <span>*</span>
        </p>

        <div>
            <select className="border rounded-md shadow-md" required>
            <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>

          <div className="items-center justify-center flex mt-4">
            <input type="submit" value="Submit" id="submit" className="text-center w-[50%] bg-blue3 text-white font-extrabold text-2xl flex justify-center items-center rounded-md shadow-md mb-4 hover:bg-white hover:text-blue3 border border-blue3 hover:border hover:border-black lg:w-[50%] md:w-[50%]"/>
          </div>
        </form>
    </div>
    </main>
        </>
}

export default CreateApplication;
