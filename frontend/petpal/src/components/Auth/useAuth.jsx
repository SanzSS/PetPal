import { useContext, useEffect } from 'react';
import { TokenContext } from '../../contexts/TokenContext';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const { token } = useContext(TokenContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    return token;
};

export default useAuth;
