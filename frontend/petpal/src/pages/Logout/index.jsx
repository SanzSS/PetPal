import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/TokenContext';
import { useUserType } from '../../contexts/UserTypeContext';

const Logout = () => {
    let navigate = useNavigate();
    const { setToken } = useAuth();
    const { setUserType } = useUserType();
    setToken('');
    setUserType('');
    navigate("/");

    return <>
    </>
}

export default Logout