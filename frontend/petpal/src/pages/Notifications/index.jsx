import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/TokenContext';
import { Link } from 'react-router-dom';
const Notifications = () => {
    const URL = 'http://3.16.70.156/api/';
    const { token } = useAuth();
    const [currFilter, setCurrFilter] = useState('Unread');
    const [notifs, setNotifs] = useState([]);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [url, setUrl] = useState(URL + 'notifications/');
    const [sort, setSort] = useState(null);
    useEffect(() => {axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
            filter: currFilter,
            sort: sort
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
                text = 'updated your application!';
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
    });}, [url, currFilter, sort]);


    const handleButtonClick = (id) => {
  
        axios.delete(url + id + '/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then((response) => {
            console.log(response);
            window.location.reload();
        })
    };
    const handleFilterClick = () => {
        if (currFilter === 'Unread') {
            setCurrFilter('Read');
        } else{
            setCurrFilter('Unread');
        }
        setNotifs([]);
        setUrl('http://127.0.0.1:8000/notifications/');
    };
    const handleSortClick = () => {
        if (sort === null) {
            setSort('create_time');
        } else{
            setSort(null);
        }
        setNotifs([]);
        setUrl('http://127.0.0.1:8000/notifications/');
    };
    return <body className="min-h-screen bg-blue1 flex flex-col">
            <div className="flex-1 flex-col">
                    <main className="items-center justify-center text-left flex flex-col">
                <h1 className="lg:text-6xl my-12 text-blue3 font-extrabold md:text-6xl text-6xl">
                    Notifications
                </h1>
                <div className="flex flex-row gap-4">
                    <button onClick={handleFilterClick} className=' bg-blue3 border-2 border-blue3 text-white items-start font-bold py-2 px-4 rounded-md  mb-4 hover:bg-white hover:text-blue3 text-left'>{currFilter}</button>
                    <button onClick={handleSortClick} className=' bg-blue3 border-2 border-blue3 text-white items-start font-bold py-2 px-4 rounded-md  mb-4 hover:bg-white hover:text-blue3 text-left'>Sort By Time</button>

                </div>
                {notifs.map((obj, index) => {
                    let path = '';
                    let style = 'h-32 bg-slate-50 border border-gray-300 shadow-lg flex items-center p-3 gap-[75%] relative w-[100%] mb-[1rem] text-base xl:text-sm hover:bg-blue-400';
                    if (!obj.notif.state) {
                        style = 'h-32 bg-slate-50 border border-gray-300 shadow-lg flex items-center p-3 gap-[75%] border-l-blue-500 relative w-[100%] mb-[1rem] text-base xl:text-sm hover:bg-blue-400';
                    } 
                    if (obj.notif.content.type === 'comment') {
                        path = '/comments/'
                    }
                    
                    return (
                        <div className='w-[75%] flex flex-row gap-[1rem]'>
                        <Link onClick={
                            () => {
                                try {
                                    axios.get(url + obj.notif.pk + '/', {
                                        headers: {
                                          Authorization: `Bearer ${token}`
                                        }
                                      });
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        } key={index} to={path + obj.notif.content_id} className=" w-[90%]">
                        <div className={style}>
                            <div>
                                <p className="mb-3"> <span className="font-bold">{obj.notif.sender}</span> {obj.text}</p> 
                                <p className="font-extralight text-xs"> Sent at {obj.notif.creation_date}</p>
                            </div>
                            

                        </div>
                        
                        </Link>
                        <button onClick={() => handleButtonClick(obj.notif.pk)} className="h-[2rem] my-[3rem] w-[8.5%] bg-[#9A0007] border-2 border-[#9A0007] text-white items-center font-bold rounded-md hover:bg-white hover:text-[#9A0007] md:text-[1rem] text-[0.5rem]">Delete </button>
                        </div>
                     );})}
                
        <div className="flex flex-row gap-4">
        {prev != null && (
                    <button
                        onClick={() => {
                        setUrl(prev);
                        setNotifs([]);
                        }}
                        className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3"
                        >
                        Previous
                    </button>
                )}
                {next != null && (
                <button onClick={() => {
                    // console.log(next);
                    if (next != null) {
                        setUrl(next);
                        setNotifs([]);
                    }
                    }} className="bg-blue3 border border-blue3 text-white items-center font-bold py-2 px-4 rounded-md mt-8 mb-8 w-[6.5rem] hover:bg-white hover:text-blue3">Next</button>
                )}

        </div>
        
        </main>
        </div>
        </body>
        

    
    
};

export default Notifications;