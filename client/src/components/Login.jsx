import { useState } from 'react';
import { Box, TextField, Button, styled, Typography } from '@mui/material';
import { API } from '../services/api';

const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
`;

const Image = styled('img')({
    width: 100,
    margin: 'auto',
    display: 'flex',
    padding: '50px 0 0',
});

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
    background: orange;
    color: #fff;
    height: 48px;
    border-radius: 2px;
`;

const SignupButton = styled(Button)`
    background: #fff;
    color: #2874f0;
    height: 48px;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0/ 20%);
`;

const ErrorText = styled(Typography)`
    color: #ff6161;
    font-size: 14px;
    margin-top: 10px;
    font-weight: 600;
`

const Text = styled(Typography)`
    color: #878787;
    font-size: 16px;
`;

// Cleaned up initial values
const signupInitialValues = {
    name: '',
    username: '',
    password: ''
};

const loginInitialValues = {
    username: '',
    password: ''
};

const Login = () => {
    const imageURL = "https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png";
    
    const [account, toggleAccount] = useState('login');
    const [signup, setSignup] = useState(signupInitialValues);
    const [login, setLogin] = useState(loginInitialValues);
    const [error, setError] = useState('');

    const toggleView = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
        setError(''); // Clear errors when switching views
    }

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    const signupUser = async () => {
        try {
            const response = await API.userSignup(signup);
            if (response.isSuccess) {
                setError('');
                setSignup(signupInitialValues);
                toggleView('login'); // Switch to login screen on success
            }
        } catch (error) {
            if (error.isError) {
                setError('something went wrong');
            }
        }
    }

    const loginUser = async () => {
        try {
            const response = await API.userLogin(login);
            if (response.isSuccess) {
                setError('');
                setLogin(loginInitialValues);
                // TODO: Handle successful login (e.g., save session, redirect user)
                console.log('Login successful!', response.data);
            }
        } catch (error) {
            if (error.isError) {
                setError(error.msg);
            }
        }
    }

    return (
        <Component>
            <Box>
                <Image src={imageURL} alt="login" />
                {
                    account === 'login' ?
                        <Wrapper>
                            <TextField variant='standard' value={login.username} onChange={(e) => onValueChange(e)} name="username" label="Enter Username" />
                            <TextField variant='standard' type="password" value={login.password} onChange={(e) => onValueChange(e)} name="password" label="Enter Password" />
                            
                            { error && <ErrorText>{error}</ErrorText> }

                            <LoginButton variant='contained' onClick={() => loginUser()}>Login</LoginButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SignupButton style={{ background: 'orange', color: '#fff' }} onClick={() => toggleView()}>Create an account</SignupButton>
                        </Wrapper>
                    :
                        <Wrapper>
                            <TextField variant='standard' value={signup.name} label="Enter Name" name='name' onChange={(e) => onInputChange(e)} />
                            <TextField variant='standard' value={signup.username} label="Enter Username" name='username' onChange={(e) => onInputChange(e)} />
                            <TextField variant='standard' type="password" value={signup.password} label="Enter Password" name='password' onChange={(e) => onInputChange(e)} />

                            { error && <ErrorText>{error}</ErrorText> }

                            <LoginButton onClick={() => signupUser()} variant='contained'>Sign-Up</LoginButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <LoginButton style={{ background: 'orange' }} onClick={() => toggleView()}>Already have an account</LoginButton>
                        </Wrapper>
                }
            </Box>
        </Component>
    )
}

export default Login;