import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/TokenContext';
import { useState, useEffect } from 'react';
import { useUserType } from '../../contexts/UserTypeContext';

const Application = ({application}) => {
    const { token } = useAuth();
    const { userType } = useUserType();

    const [status, setStatus] = useState(
        application.status
    );

    const [statusError, setStatusError] = useState('');

    const answersDict = {};
    application.answers.forEach(answer => {
        answersDict[answer.question_num] = answer.answer;
    });

    console.log(application);

    const validate_form = () => {
        var isValid = true;

        var newErrors = '';

        if (status.trim() === '') {
            newErrors = 'Status cannot be blank';
            isValid = false;
        } else if (!['withdrawn', 'accepted', 'denied', 'pending'].includes(status)) {
            console.log(status);
            newErrors = 'Invalid status';
            isValid = false;
        } else {
            newErrors = '';
        }

        setStatusError(newErrors);
        return isValid;
    }

    const update = async (event) => {
        event.preventDefault();

        if (validate_form()) {
            try {
                await axios.patch(`http://127.0.0.1:8000/applications/${application.id}/`, 
                    JSON.stringify({"status": status}),
                    {headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                setStatusError('Success!');
            } catch (error) {
                console.error(error)
                if (error.response) {
                        if (error.response.status < 500) {
                            const errorString = error.response.data;
                            setStatusError(errorString);
                        } else {
                            setStatusError('An error occurred during the application process.');
                        }
                }
            }
        }
    }

    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        setStatus(
          value
        );
    };

    return <>
        <div id="app-container" class="border-2 border-blue3 border-solid rounded-md w-full flex items-center mb-4 mt-10">
            <details class="w-full flex items-center px-6">
                <summary class="text-center cursor-pointer w-full text-lg mt-3 mb-3 font-bold capitalize" id="app">{application.pet.name}</summary>
                <a href="../application/conversation.html" class="font-bold text-yellow-400 border-solid border-yellow-400 border-2 rounded-md cursor-pointer bg-blue3 p-3 justify-center inline-flex items-center no-underline text-center hover:bg-yellow-400 hover:text-blue3 hover:border-blue3">
                    Chat
                </a>
                <p class="text-left">
                    Date applied: {(new Date(application.date)).toDateString()}
                </p>
                {userType === 'shelter' ? (<Link to={`/user/${application.user.id}`}>See user</Link>) : (<Link to={`/listing/${application.pet.id}`}>See pet</Link>)}
                <p>
            Application Status: 
        </p>
    {userType === 'shelter' ? 
    (            <select onChange={handleInputChange} class="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white">
    <option value="" disabled="" selected="selected" class="placeholder border rounded-md shadow-md">{application.status}</option>
        <option value="accepted">accepted</option>
        <option value="denied">denied</option>
    </select>) : 
    (
        <select onChange={handleInputChange} class="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white">
    <option value="" disabled="" selected="selected" class="placeholder border rounded-md shadow-md">{application.status}</option>
        <option value="withdrawn">withdrawn</option>
    </select>
      )}
      <br></br>

{userType === 'shelter' ? 
    (            <p>Rating: {application.rating}</p>) : 
    (<p></p>)}
    <br></br>
                <p>
            Your address: <span>*</span>
        </p>
        <div>
            <p type="text" name="question1" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[1]}</p>
        </div>

                <p>
                    City: <span>*</span>
                </p>
                <div>
                    <p type="text" name="question2" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[2]}</p>
                </div>

                <p>
                    Postal Code: <span>*</span>
                </p>
                <div>
                    <p type="text" name="question3"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[3]}</p>
                </div>

                <p>
                    Phone number: <span>*</span>
                </p>
                <div>
                    <p type="text" name="question4"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[4]}</p>
                </div>

                <p>
                    Email: <span>*</span>
                </p>
                <div>
                    <p type="email" name="question5"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[5]}</p>
                </div>

                <p>
                    Are you 21 years of age and over?: <span>*</span>
                </p>
                <div>
                    <p name="question6"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[6]}
                    </p>
                </div>

                <p>
                    List all members of your household including number of children and their ages. 
                    Who will be primarily responsible for the care of this pet?
                </p>
                <div>
                    <p name="question7"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[7]}</p>
                </div>

                <p>
                    Do you live in a house, apartment, condominium or townhouse?: <span>*</span>
                </p>
                <div>
                    <p name="question8"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[8]}
                    </p>
                </div>

                <p>
                    Do you own or rent your home?: <span>*</span>
                </p>
                <div>
                    <p name="question9"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[9]}
                    </p>
                </div>

                <p>
                    How long have you lived at your current address (in years)?: <span>*</span>
                </p>
                <div>
                    <p name="question10"  type="number" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[10]}</p>
                </div>

                <p>
                    Do you have plans to move from your current address within the next 3 months?: <span>*</span>
                </p>
                <div>
                    <p name="question11"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[11]}
                    </p>
                </div>

                <p>
                    Do you have a securely fenced in yard?: <span>*</span>
                </p>
                <div>
                    <p name="question12"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[12]}
                    </p>
                </div>

                <p>
                    Do you have a pool?: <span>*</span>
                </p>
                <div>
                    <p name="question13"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[13]}
                    </p>
                </div>

                <p>
                    Why have you chosen this particular dog?: <span>*</span>
                </p>
                <div>
                    <p name="question14"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[14]}</p>
                </div>
                
                <p>
                    Please explain your reasons for wanting to adopt a dog: <span>*</span>
                </p>
                <div>
                    <p name="question15"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[15]}</p>
                </div>

                <p>
                    For whom are you adopting a dog? For you or for someone else? (If for someone else, who?): <span>*</span>
                </p>
                <div>
                    <p name="question16"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[16]}</p>
                </div>

                <p>
                    What experience do you have as a dog owner? If you have been a dog owner, please tell us about your previous dogs: <span>*</span>
                </p>
                <div>
                    <p name="question17"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white">{answersDict[17]}</p>
                </div>

                <p>
                    How long has it been since you've had a dog in your life?: <span>*</span>
                </p>
                <div>
                    <p name="question18"  type="number" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[18]}</p>
                </div>

                <p>
                    Do you have dog training experience? And if so, what training do you have?: <span>*</span>
                </p>
                <div>
                    <p name="question19"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[19]}</p>
                </div>

                <p>
                    Do you currently have any pets?: <span>*</span>

                </p>
                <div>
                    <p name="question20"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[20]}
                    </p>
                </div>

                <p>
                    Is any member of your family allergic to dogs?: <span>*</span>
                </p>

                <div>
                    <p name="question21"  className="border rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[21]}
                    </p>
                </div>

                <p>
                    Are you applying for a young puppy (6 months old or younger)? <span>*</span>
                </p>

        <div>
            <p name="question22"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[22]}
            </p>
        </div>
        {statusError && <p className="error">{JSON.stringify(statusError)}</p>}

        <div className="items-center justify-center flex mt-4">
            <input type="submit" onClick={(event) => update(event)} value="Save" id="submit" className="text-center w-[50%] bg-blue3 text-white font-extrabold text-2xl flex justify-center items-center rounded-md shadow-md mb-4 hover:bg-white hover:text-blue3 border border-blue3 hover:border hover:border-black lg:w-[50%] md:w-[50%]"/>
          </div>
            </details>
        </div>
    </>
}

export default Application;

