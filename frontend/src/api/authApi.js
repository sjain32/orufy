import api from './api';

export const requestOtp = async (email) => {
    try{
        const response = await api.post('/auth/request-otp', { email });
        return response.data;
    }catch(error){
        throw error;
    }
};

export const verifyOtp = async (email, otp) => {
    try{
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    }
    catch(error){
        throw error;
    }
};
