import axios from 'axios';
import { useState, useEffect } from 'react';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyMDAwNjkxLCJpYXQiOjE3MDE5NzkwOTEsImp0aSI6IjllZDIzMmY4Y2UyMTRlNjc4OTQ2ODdkMTVkOThiZWFlIiwidXNlcl9pZCI6MX0.A2gpcpTMMzyX5Oa88ymjaEIXLAwuWWw3LXblY5FycxE";
const Notifications = () => {
    const [notifs, setNotifs] = useState([]);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [url, setUrl] = useState('http://127.0.0.1:8000/notifications/');
    useEffect(() => {axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        setNext(response.data.next);
        setPrev(response.data.previous);
        let text = 'hello';
        let temp = [...notifs];
        for (let i = 0; i < response.data.results.length; i++) {
            if (response.data.results[i].content.type === 'comment') {
                text = 'left you a comment!';
            } else if (response.data.results[i].content.type === 'review') {
                text = 'left you a review!';
            } else if (response.data.results[i].content.type === 'application') {
                text = 'submitted an application!';
            };
            const notification = {
                notif: response.data.results[i],
                text: text,
            };
            temp.push(notification);
          
        };
        setNotifs(temp);
    
    })
    .catch((error) => {
        console.log(error);
    });}, [url]);
    console.log(next);
    const handleButtonClick = (event) => {
        const notif_id = null
        axios.delete(url + notif_id, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then((response) => {
            console.log(response);
            window.location.reload();
        })
    };
    return <body className="min-h-screen bg-blue1 flex flex-col">
            <div className="flex-1 flex-col">
                    <main className="items-center justify-center text-left flex flex-col">
                <h1 className="lg:text-6xl my-12 text-blue3 font-extrabold md:text-6xl text-6xl">
                    Notifications
                </h1>
                {notifs.map((obj, index) => {
                    let style = 'h-32 bg-slate-50 border border-gray-300 shadow-lg flex items-center p-3 gap-[75%]';
                    if (!obj.notif.state) {
                        style = 'h-32 bg-slate-50 border border-gray-300 shadow-lg flex items-center p-3 gap-[75%] border-l-blue-500';
                    } return (
                        <a key={index} href="../shelter/shelter-info.html" className="w-[75%]">
                        <div id="notif" className={style}>
                            {/* <img src="./images/old-woman.jpeg" alt="User Avatar" className="w-9 h-9 rounded-full mr-4"></img> */}
                            <div>
                                <p className="mb-3"> <span className="font-bold">{obj.notif.sender}</span> {obj.text}</p> 
                                <p className="font-extralight text-xs"> Sent at {obj.notif.creation_date}</p>
                            </div>
                            <button onClick={handleButtonClick} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 hover:bg-white hover:text-blue3">Delete </button>
                        </div>
                        </a>
                    );})}
                
        <div className="flex flex-row gap-4">
        <button onClick={() => {
            if (prev != null) {
                setUrl(prev);
                setNotifs([]);
            }
        }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Previous</button>
        <button onClick={() => {
            console.log(next);
            if (next != null) {
                setUrl(next);
                setNotifs([]);
            }
        }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Next</button>
        </div>
        
        </main>
    </div>
         
        </body>
        

    
    
};

export default Notifications;