import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';

const Logout = () => {
    let navigate = useNavigate();
    const { setToken } = useAuth();
    setToken('');
    navigate("/");

    return <>
    </>
}

export default Logout