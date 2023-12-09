import axios from 'axios';
import { jwtDecode } from "jwt-decode";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// import { fetchWithAuthorization } from '../../fetch';
import { useAuth } from '../../contexts/TokenContext';
// import { useUserType } from '../../contexts/UserTypeContext';

import CommentCard from '../../components/CommentCard';


const Comments = () => {
    const { token } = useAuth();

    const{applicationID} = useParams();
    const [ application, setApplication] = useState({});
    const [comments, setComments] = useState([])
    const [userID, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [url, setUrl] = useState(`http://127.0.0.1:8000/comments/application/${applicationID}/`);




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

        const fetchData = async () => {
            try {
                if (applicationID) {
                    const response_app = await axios.get(`http://127.0.0.1:8000/applications/${applicationID}/`, {
                        headers: {
                          "Authorization": `Bearer ${token}`
                        }
                    });
                    setApplication(response_app.data);

                    // get userID
                    const response_user_info = await axios.get(`http://127.0.0.1:8000/accounts/${userID}/`, {
                        headers: {
                          "Authorization": `Bearer ${token}`
                        }
                    });
                    setUsername(response_user_info.data.name);

                    // get comments
                    const response_comments = await axios.get(url, {
                        headers: {
                          "Authorization": `Bearer ${token}`
                        }
                    });
                    setComments(response_comments.data);
                    setNext(response_comments.data.next);
                    setPrev(response_comments.data.previous);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [applicationID, userID, url, token]);

    return <>
        <div className="container" id="content">
            <div>
                <h1 id="convo-title">Conversation about {application.pet?.name}</h1>
            </div>
            <div className="w-full" id="chatbox">
                    <form action="../application/conversation-sent.html" className="flex justify-between items-center flex-row">
                        <input id="message" name="message" placeholder="Type your message" required className="p-3 border border-solid border-teal-900 border-2 rounded-md"></input>
                        <input type="submit" value="Send" id="send" className="p-3 rounded-md font-bold text-lg border-solid border-yellow-400 border-2 cursor-pointer p-3 justify-center inline-flex items-center no-underline text-center"></input>
                        </form>
            </div>
            <div id="comments" className="rounded-md ">
                {comments.results?.map((comment) => (
                        <CommentCard comment={comment} username={username}/>
                ))}
            </div>
            <div className="flex flex-row gap-4">
                <button onClick={() => {
                    if (prev != null) {
                        setUrl(prev);
                        setComments([]);
                    }
                }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Previous</button>
                <button onClick={() => {
                    // console.log(next);
                    if (next != null) {
                        setUrl(next);
                        setComments([]);
                    }
                }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Next</button>
            </div>
        </div>
    </>
}
export default Comments;