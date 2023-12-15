import './style.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/TokenContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';

const CreateApplication = () => {
    let navigate = useNavigate();
    const { token } = useAuth();
    const { userType } = useUserType();
    const { petID } = useParams();

    useEffect(() => {
        if (petID) {
            try {
                axios.get(`http://127.0.0.1:8000/listings/listing/${petID}/`, 
                    {headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.status !== 200) {
                        console.log(response);
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.data;
                })
                .then(data => {
                    if (data.status !== 'available') {
                        navigate(`/listing/${petID}`);
                    }
                });
            } catch (error) {
                console.error(error)
                if (error.response) {
                        if (error.response.status < 500) {
                            navigate("*");
                        } else {
                            setAnswersError('An error occurred during the application process.');
                        }
                }
            }
        }
    }, [petID, token]);

    useEffect(() => {
        if (userType === 'shelter') {
            navigate(`/listing/${petID}`);
        }
    }, [userType]);

    const [answers, setAnswers] = useState(
        {}
    );

    const [answersError, setAnswersError] = useState([]);

    const validate_form = () => {
        var isValid = true;

        var newErrors = '';

        for (var questionNum in answers) {
            if (answers[questionNum].trim() === '') {
                newErrors = 'One or more answers are blank';
                isValid = false;
            } else {
                newErrors = '';
            }
        }
  
        setAnswersError([newErrors]);
        return isValid;
    }

    const submit = async (event) => {
        event.preventDefault();

        const formattedArray = Object.entries(answers).map(([key, value]) => ({
            answer: value,
            question_num: parseInt(key, 10),
        }));
        
        const outputObject = { answers: formattedArray };

        if (validate_form()) {
            try {
                await axios.post(`http://127.0.0.1:8000/applications/pet/${petID}/`, 
                    JSON.stringify(outputObject),
                    {headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                navigate(`/listing/${petID}`);
            } catch (error) {
                console.error(error)
                if (error.response) {
                        if (error.response.status < 500) {
                            console.log(error.response);
                            if (error.response.data.message) {
                                const errorString = error.response.data.message;
                                setAnswersError([errorString]);
                            } else if (error.response.data.answers) {
                                setAnswersError(error.response.data.answers);
                            }
                        } else {
                            setAnswersError(['An error occurred during the application process.']);
                        }
                }
            }
        }
    }

    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        const questionNumber = parseInt(name.replace("question", ""));

        setAnswers({
          ...answers,
          [questionNumber]: value,
        });
    };
    
    return <> 
    <main className="flex flex-col justify-center items-center">
        <div>
            <h1 className="lg:text-6xl md:text-6xl text-4xl my-12 text-blue3 font-extrabold text-center justify-center items-center">
                Adoption Application
            </h1>
            <form className="grid grid-cols-1 max-w-[836px] p-6 pt-4 rounded-md border-blue3 border-4 bg-blue2 mb-16">
                <div className="my-2">
                    <p className="mb-1">Your address: <span>*</span></p>
                    <input type="text" name="question1" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
                </div>
                <div className="my-2">
                    <p className="mb-1">City: <span>*</span></p>
                    <input type="text" name="question2" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
                </div>
                <div className="my-2">
                    <p className="mb-1">Postal Code: <span>*</span></p>
                    <input type="text" name="question3" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
                </div>
                <div className="my-2">
                    <p className="mb-1">Phone number: <span>*</span></p>
                    <input type="text" name="question4" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
                </div>
                <div className="my-2">
                    <p className="mb-1">Email: <span>*</span></p>
                    <input type="email" name="question5" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
                </div>
                <div className="my-2">
                    <p className="mb-1">Are you 21 years of age and over?: <span>*</span></p>
                    <select name="question6" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                        <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">
                        List all members of your household including number of children and their ages.<br></br>
                        Who will be primarily responsible for the care of this pet?
                    </p>
                    <textarea name="question7" onChange={handleInputChange} id="" cols="80" rows="10" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required></textarea>
                </div>
                <div className="my-2">
                    <p className="mb-1">Do you live in a house, apartment, condominium or townhouse?: <span>*</span></p>
                    <select name="question8" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                        <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Condo">Condo</option>
                        <option value="Townhouse">Townhouse</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">Do you own or rent your home?: <span>*</span></p>
                    <select name="question9" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                        <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="Own">Own</option>
                        <option value="Rent">Rent</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">How long have you lived at your current address (in years)?: <span>*</span></p>
                    <input name="question10" onChange={handleInputChange} type="number" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
                </div>
                <div className="my-2">
                    <p className="mb-1">Do you have plans to move from your current address within the next 3 months?: <span>*</span></p>
                    <select name="question11" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                    <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">Do you have a securely fenced in yard?: <span>*</span></p>
                    <select name="question12" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                    <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">Do you have a pool?: <span>*</span></p>
                    <select name="question13" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                    <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">Why have you chosen this particular dog?: <span>*</span></p>
                    <textarea name="question14" onChange={handleInputChange} id="" cols="80" rows="10" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required></textarea>
                </div>
                <div className="my-2">
                    <p className="mb-1">Please explain your reasons for wanting to adopt a dog: <span>*</span></p>
                    <textarea name="question15" onChange={handleInputChange} id="" cols="80" rows="10" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required></textarea>
                </div>
                <div className="my-2">
                    <p className="mb-1">For whom are you adopting a dog? For you or for someone else? (If for someone else, who?): <span>*</span></p>
                    <textarea name="question16" onChange={handleInputChange} id="" cols="80" rows="10" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required></textarea>
                </div>
                <div className="my-2">
                    <p className="mb-1">What experience do you have as a dog owner? If you have been a dog owner, please tell us about your previous dogs: <span>*</span></p>
                    <textarea name="question17" onChange={handleInputChange} id="" cols="80" rows="10" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white"></textarea>
                </div>
                <div className="my-2">
                    <p className="mb-1">How long has it been since you've had a dog in your life?: <span>*</span></p>
                    <input name="question18" onChange={handleInputChange} type="number" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required/>
                </div>
                <div className="my-2">
                    <p className="mb-1">Do you have dog training experience? And if so, what training do you have?: <span>*</span></p>
                    <textarea name="question19" onChange={handleInputChange} id="" cols="80" rows="10" className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white" required></textarea>
                </div>
                <div className="my-2">
                    <p className="mb-1">Do you currently have any pets?: <span>*</span></p>
                    <select name="question20" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                    <option value="" disabled="" selected="selected" className="placeholder border rounded-md shadow-md">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">Is any member of your family allergic to dogs?: <span>*</span></p>
                    <select name="question21" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                    <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="my-2">
                    <p className="mb-1">Are you applying for a young puppy (6 months old or younger)? <span>*</span></p>
                    <select name="question22" onChange={handleInputChange} className="w-full rounded-md shadow-md p-3 border-solid border-blue3 border-2 bg-white cursor-pointer" required>
                    <option value="" className="placeholder" disabled="" selected="selected">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="items-center justify-center flex mt-4">
                    <input type="submit" onClick={(event) => submit(event)} value="Submit" id="submit" className="button w-1/2 text-xl cursor-pointer"/>
                </div>
                {answersError && (
                                    answersError.map((error, errorIndex) => (
                                        <>
                                        <p key={errorIndex} className="error">
                                        {error}
                                        </p>
                                        <br></br>
                                        </>
                                    ))
                            )}
            </form>
        </div>
    </main>
    </>
}

export default CreateApplication;
