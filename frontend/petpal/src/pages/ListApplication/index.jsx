import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/TokenContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';
import Application from '../../components/Application';

const ListApplications = () => {
    let navigate = useNavigate();
    const { token } = useAuth();
    const { userType } = useUserType();
    // const [searchParams, setSearchParams] = useSearchParams();
    const [applications, setApplications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [input, setInput] = useState('');
    const [allFilters, setAllFilters] = useState({});

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/applications/`, 
        {headers: {
            "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.data;
        })
        .then(data => {
            setApplications(data.results);
        })
        .catch(error => {
            console.error(error)
            if (error.response) {
                    // if (error.response.status < 500) {
                    //     const errorString = error.response.data;
                    //     setAnswersError(errorString);
                    // } else {
                    //     setAnswersError('An error occurred during the application process.');
                    // }
            }
        });
    }, [token, userType]);
    
    return <> 
<main>
          <div class="container" id="content">
          {userType === 'shelter' ? (
        <h1 className="mt-10">Applications for our pets</h1>
      ) : (
        <h1 className="mt-10">Past Applications</h1>
      )}
            
            {Array.isArray(applications) && applications.map((application) => (
  <Application application={application} key={application.id} />
))}
            </div>
        </main>
        </>
}

export default ListApplications;
