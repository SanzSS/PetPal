import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/TokenContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';
import Keyword from '../../components/Keyword';

const EditKeywords = () => {
    let navigate = useNavigate();
    const { token } = useAuth();
    console.log(token);
    const { userType } = useUserType();
    const [keywords, setKeywords] = useState([]);
    const { petID } = useParams();
    const [error, setError] = useState('');

    if (userType === 'seeker') {
        navigate('*');
    }

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
                    
                });
            } catch (error) {
                console.error(error)
                if (error.response) {
                        if (error.response.status < 500) {
                            navigate("*");
                        }
                }
            }
        }
    }, [petID, token]);

    useEffect(() => {
        fetchKeywords();
    }, []);

    const fetchKeywords = () => {
        let url = `http://127.0.0.1:8000/keywords/${petID}`;

        axios.get(url, 
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
            setKeywords(data.results);
        })
        .catch(error => {
            console.error(error)
        });
    }

    const addBlankKeyword = () => {
        setKeywords(prevKeywords => [
          ...prevKeywords,
          { id: null, keyword: '', weight: '' },
        ]);
      };
    
    const saveKeyword = (keyword) => {
        console.log(keyword);
        if (keyword.id) {
            // patch
            axios.patch(`http://127.0.0.1:8000/keywords/edit/${keyword.id}/`, {
                keyword: keyword.keyword,
                weight: keyword.weight,
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                fetchKeywords();
                setError("Success!");
            })
            .catch(error => {
                console.error('Error updating keyword', error);
            });
        } else {
            axios.post(`http://127.0.0.1:8000/keywords/${petID}/`, {
            keyword: keyword.keyword,
            weight: keyword.weight
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })
            .then(response => {
                if (response.status !== 201) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                fetchKeywords();
                setError("Success!");
            })
            .catch(error => {
                console.error('Error adding new keyword', error);
            });
        }
    };

    const validateKeywords = () => {
        keywords.forEach(keyword => {
            if (keyword.keyword === '') {
                setError('One or more keywords are blank');
                return false;
            }
        });
        return true;
    }
    
    const handleSave = () => {
        if (validateKeywords()) {
            keywords.forEach(keyword => {
                saveKeyword(keyword);
            });
            console.log('saved');
        }
    };
    

    return <> 
        <main className="flex flex-col items-center pb-16">
            <div id="content">
                <h1 className="text-6xl my-12 text-blue3 font-extrabold text-center">Keywords</h1>
                <button onClick={addBlankKeyword} className="text-center p-3 bg-blue3 text-white font-extrabold text-xl flex justify-center items-center rounded-xl shadow-md cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-blue3">
                    Add a new keyword
                </button>
                <div className="h-1/2 rounded-md border-blue3 border-4 bg-blue2 shadow-lg flex p-3 mt-4 flex-col w-[100%]">
                    <div id="keyword" className="my-2">
                        <h3 className="w-full p-3 text-2xl font-extrabold text-center">Word</h3>
                        <h3 className="w-full p-3 text-2xl font-extrabold text-center">Weight</h3>
                    </div>
                    {Array.isArray(keywords) && keywords.map((keyword, index) => (
                    <Keyword keyword={keyword} key={keyword.id} setKeywords={setKeywords} index={index} />))}
                    <button onClick={handleSave} className="text-white bg-blue3 rounded-md mt-4 p-2 px-4 font-extrabold cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-blue3">
                        Save Keywords
                    </button>
                    <p className="error mt-4">{error}</p>
                </div>
            </div>
        </main>
        </>
}

export default EditKeywords;
