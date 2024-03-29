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

    const [rating, setRating] = useState(0);

    const [statusError, setStatusError] = useState('');

    const answersDict = {};
    application.answers.forEach(answer => {
        answersDict[answer.question_num] = answer.answer;
    });

    const validate_form = () => {
        var isValid = true;

        var newErrors = '';

        if (status.trim() === '') {
            newErrors = 'Status cannot be blank';
            isValid = false;
        } else if (!['withdrawn', 'accepted', 'denied', 'pending'].includes(status)) {
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
                await axios.patch(`http://3.16.70.156:8000/api/applications/${application.id}/`, 
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
                            const errorString = error.response.data["status:"];
                            setStatusError(errorString);
                        } else {
                            setStatusError('An error occurred during the application process.');
                        }
                }
            }
        }
    }

    useEffect(() => {
        try {
            axios.get(`http://3.16.70.156:8000/api/keywords/score/${application.id}/`, 
                {headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(response);
                return response.data;
            })
            .then(data => {
                setRating(data.score);
            });
        } catch (error) {
            console.error(error)
        }
    }, [application, token]);  

    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        setStatus(
          value
        );
    };

    return <>
        <div id="app-container" className="w-full flex items-center mb-4 mt-10">
            <details className="w-full flex items-center px-6 bg-white rounded-md border-2 border-blue3 border-solid">
                <summary className="text-center cursor-pointer w-full text-lg mt-3 mb-3 font-bold capitalize" id="app">{application.pet.name}</summary>
                <Link to={`/comments/${application.id}`} className="mb-4 font-bold border-solid border-2 rounded-md cursor-pointer text-white text-xl bg-blue3 p-3 justify-center inline-flex items-center no-underline text-center hover:text-blue3 hover:border-blue3 hover:bg-white">
                    Chat
                </Link>
                {userType === 'shelter' && application.status === 'pending' ? 
                (<Link to={`/user/${application.user.id}`} className='mb-4 font-bold border-solid border-2 rounded-md cursor-pointer text-white text-xl bg-blue3 p-3 justify-center inline-flex items-center no-underline text-center hover:text-blue3 hover:border-blue3 hover:bg-white'>
                    See user</Link>) 
                : userType === 'shelter' && application.status !== 'pending' ? (<></>) 
                : (<Link to={`/listing/${application.pet.id}`} className='mb-4 font-bold border-solid border-2 rounded-md cursor-pointer text-white text-xl bg-blue3 p-3 justify-center inline-flex items-center no-underline text-center hover:text-blue3 hover:border-blue3 hover:bg-white'>
                    See pet</Link>)}
                <p className="text-left mb-4">
                    Date applied: {(new Date(application.date)).toDateString()}
                </p>
        <p>
            Application Status: 
        </p>
    {userType === 'shelter' && (application.status !== 'pending') ? 
    (<select onChange={handleInputChange} defaultValue="" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer">
    <option value="" disabled="" className="placeholder border rounded-md shadow-md">{application.status}</option>
    </select>) 
    : userType === 'shelter' ? 
    (<select onChange={handleInputChange} defaultValue="" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer">
    <option value="" disabled="" className="placeholder border rounded-md shadow-md">{application.status}</option>
        <option value="accepted">accepted</option>
        <option value="denied">denied</option>
    </select>) 
    : userType === 'seeker' && (application.status === 'withdrawn' || application.status === 'denied') ?
    (<select onChange={handleInputChange} defaultValue="" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer">
        <option value="" disabled="" className="placeholder border rounded-md shadow-md">{application.status}</option>
    </select>)
    : (<select onChange={handleInputChange} defaultValue="" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer">
    <option value="" disabled="" className="placeholder border rounded-md shadow-md">{application.status}</option>
    <option value="withdrawn">withdrawn</option>
</select>)}
      <br></br>

{userType === 'shelter' ? 
    (            <p>Rating: {rating}</p>) : 
    (<p></p>)}
    <br></br>
                <p>
            Your address: <span>*</span>
        </p>
        <div>
            <p type="text" name="question1" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[1]}</p>
        </div>

                <p>
                    City: <span>*</span>
                </p>
                <div>
                    <p type="text" name="question2" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[2]}</p>
                </div>

                <p>
                    Postal Code: <span>*</span>
                </p>
                <div>
                    <p type="text" name="question3" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[3]}</p>
                </div>

                <p>
                    Phone number: <span>*</span>
                </p>
                <div>
                    <p type="text" name="question4" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[4]}</p>
                </div>

                <p>
                    Email: <span>*</span>
                </p>
                <div>
                    <p type="email" name="question5" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[5]}</p>
                </div>

                <p>
                    Are you 21 years of age and over?: <span>*</span>
                </p>
                <div>
                    <p name="question6" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[6]}
                    </p>
                </div>

                <p>
                    List all members of your household including number of children and their ages. 
                    Who will be primarily responsible for the care of this pet?
                </p>
                <div>
                    <p name="question7" id="application-answer" cols="80" rows="10" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[7]}</p>
                </div>

                <p>
                    Do you live in a house, apartment, condominium or townhouse?: <span>*</span>
                </p>
                <div>
                    <p name="question8" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[8]}
                    </p>
                </div>

                <p>
                    Do you own or rent your home?: <span>*</span>
                </p>
                <div>
                    <p name="question9" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[9]}
                    </p>
                </div>

                <p>
                    How long have you lived at your current address (in years)?: <span>*</span>
                </p>
                <div>
                    <p name="question10" id="application-answer" type="number" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[10]}</p>
                </div>

                <p>
                    Do you have plans to move from your current address within the next 3 months?: <span>*</span>
                </p>
                <div>
                    <p name="question11" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[11]}
                    </p>
                </div>

                <p>
                    Do you have a securely fenced in yard?: <span>*</span>
                </p>
                <div>
                    <p name="question12" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[12]}
                    </p>
                </div>

                <p>
                    Do you have a pool?: <span>*</span>
                </p>
                <div>
                    <p name="question13" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[13]}
                    </p>
                </div>

                <p>
                    Why have you chosen this particular dog?: <span>*</span>
                </p>
                <div>
                    <p name="question14" id="application-answer" cols="80" rows="10" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[14]}</p>
                </div>
                
                <p>
                    Please explain your reasons for wanting to adopt a dog: <span>*</span>
                </p>
                <div>
                    <p name="question15" id="application-answer" cols="80" rows="10" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[15]}</p>
                </div>

                <p>
                    For whom are you adopting a dog? For you or for someone else? (If for someone else, who?): <span>*</span>
                </p>
                <div>
                    <p name="question16" id="application-answer"cols="80" rows="10" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[16]}</p>
                </div>

                <p>
                    What experience do you have as a dog owner? If you have been a dog owner, please tell us about your previous dogs: <span>*</span>
                </p>
                <div>
                    <p name="question17" id="application-answer"cols="80" rows="10" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white">{answersDict[17]}</p>
                </div>

                <p>
                    How long has it been since you've had a dog in your life?: <span>*</span>
                </p>
                <div>
                    <p name="question18"  type="number" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[18]}</p>
                </div>

                <p>
                    Do you have dog training experience? And if so, what training do you have?: <span>*</span>
                </p>
                <div>
                    <p name="question19"  id="application-answer" cols="80" rows="10" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>{answersDict[19]}</p>
                </div>

                <p>
                    Do you currently have any pets?: <span>*</span>

                </p>
                <div>
                    <p name="question20" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[20]}
                    </p>
                </div>

                <p>
                    Is any member of your family allergic to dogs?: <span>*</span>
                </p>

                <div>
                    <p name="question21" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
                    {answersDict[21]}
                    </p>
                </div>

                <p>
                    Are you applying for a young puppy (6 months old or younger)? <span>*</span>
                </p>

        <div>
            <p name="question22" id="application-answer" className="rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required>
            {answersDict[22]}
            </p>
        </div>
        {statusError && <p className="error">{statusError}</p>}

        <div className="items-center justify-center flex mt-4">
            <input type="submit" onClick={(event) => update(event)} value="Save" id="submit" className="button w-1/2 mb-6 text-xl cursor-pointer"/>
          </div>
            </details>
        </div>
    </>
}

export default Application;

