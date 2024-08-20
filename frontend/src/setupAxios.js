import axios from 'axios';
import {Cookies} from "react-cookie";

const getCsrfToken = async () => {
    const cookies = new Cookies();

    try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'csrf-token');
        const csrfToken = response.data.csrfToken;
        //TODO: Выбрать где хранить
        localStorage.setItem('csrf_token', csrfToken);
        //   cookies.set('csrf_token', csrfToken);
        return csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

export default getCsrfToken;