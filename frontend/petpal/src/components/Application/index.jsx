import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/TokenContext';
import { useState, useEffect } from 'react';
import { useUserType } from '../../contexts/UserTypeContext';

const Application = ({application}) => {
    const { token } = useAuth();
    const { userType } = useUserType();

    const answersDict = {};
    application.answers.forEach(answer => {
        answersDict[answer.question_num] = answer.answer;
    });

    console.log(application);

    return <>
        <div id="app-container" class="border border-2 border-teal-900 border-solid rounded-md w-10/12 flex items-center mb-4 mt-10">
            <details class="w-full flex items-center pl-6 pr-6">
                <summary class="text-center cursor-pointer w-full text-lg mt-3 mb-3" id="app">{application.pet.name}</summary>
                <a href="../application/conversation.html" class="font-bold text-yellow-400 border-solid border-yellow-400 border-2 rounded-md cursor-pointer bg-teal-900 p-3 justify-center inline-flex items-center no-underline text-center hover:bg-yellow-400 hover:text-teal-900 hover:border-teal-900">
                    Chat
                </a>
                <p class="text-left">
                    Date applied: {(new Date(application.date)).toDateString()}
                </p>
                {userType === 'shelter' ? (<Link to={`/user/${application.user.id}`}>See user</Link>) : (
        <Link to={`/listing/${application.pet.id}`}>See pet</Link>
      )}
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
            <p type="text" name="question2" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[2]}</p>
        </div>

        <p>
            Postal Code: <span>*</span>
        </p>
        <div>
            <p type="text" name="question3"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[3]}</p>
        </div>

        <p>
            Phone number: <span>*</span>
        </p>
        <div>
            <p type="text" name="question4"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[4]}</p>
        </div>

        <p>
            Email: <span>*</span>
        </p>
        <div>
            <p type="email" name="question5"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[5]}</p>
        </div>

        <p>
            Are you 21 years of age and over?: <span>*</span>
        </p>
        <div>
            <p name="question6"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[6]}
            </p>
        </div>

        <p>
            List all members of your household including number of children and their ages. 
            Who will be primarily responsible for the care of this pet?
        </p>
        <div>
            <p name="question7"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[7]}</p>
        </div>

        <p>
            Do you live in a house, apartment, condominium or townhouse?: <span>*</span>
        </p>
        <div>
            <p name="question8"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[8]}
            </p>
        </div>

        <p>
            Do you own or rent your home?: <span>*</span>
        </p>
        <div>
            <p name="question9"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[9]}
            </p>
        </div>

        <p>
            How long have you lived at your current address (in years)?: <span>*</span>
        </p>
        <div>
            <p name="question10"  type="number" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[10]}</p>
        </div>

        <p>
            Do you have plans to move from your current address within the next 3 months?: <span>*</span>
        </p>
        <div>
            <p name="question11"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[11]}
            </p>
        </div>

        <p>
            Do you have a securely fenced in yard?: <span>*</span>
        </p>
        <div>
            <p name="question12"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[12]}
            </p>
        </div>

        <p>
            Do you have a pool?: <span>*</span>
        </p>
        <div>
            <p name="question13"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[13]}
            </p>
        </div>

        <p>
            Why have you chosen this particular dog?: <span>*</span>
        </p>
        <div>
            <p name="question14"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[14]}</p>
        </div>
        
        <p>
            Please explain your reasons for wanting to adopt a dog: <span>*</span>
        </p>
        <div>
            <p name="question15"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[15]}</p>
        </div>

        <p>
            For whom are you adopting a dog? For you or for someone else? (If for someone else, who?): <span>*</span>
        </p>
        <div>
            <p name="question16"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[16]}</p>
        </div>

        <p>
            What experience do you have as a dog owner? If you have been a dog owner, please tell us about your previous dogs: <span>*</span>
        </p>
        <div>
            <p name="question17"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white">{answersDict[17]}</p>
        </div>

        <p>
            How long has it been since you've had a dog in your life?: <span>*</span>
        </p>
        <div>
            <p name="question18"  type="number" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[18]}</p>
        </div>

        <p>
            Do you have dog training experience? And if so, what training do you have?: <span>*</span>
        </p>
        <div>
            <p name="question19"  id="" cols="80" rows="10" className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>{answersDict[19]}</p>
        </div>

        <p>
            Do you currently have any pets?: <span>*</span>

        </p>
        <div>
            <p name="question20"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
            {answersDict[20]}
            </p>
        </div>

        <p>
            Is any member of your family allergic to dogs?: <span>*</span>
        </p>

        <div>
            <p name="question21"  className="border rounded-md shadow-md p-3 border-solid border-teal-900 border-2 bg-white" required>
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
            </details>
        </div>
    </>
}

export default Application;

