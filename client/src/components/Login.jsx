
import { useState } from 'react';
import {Box, TextField, Button,styled,Typography} from '@mui/material';
const Component=styled(Box)`
width:400px;
margin:auto;
box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
`;
const Image=styled('img')({
    width:100,
    margin:'auto',
    display:'flex',
    padding:'50px 0 0',

})
const Wrapper=styled(Box)`
    padding:25px 35px;
    display:flex;
    flex:1;
    flex-direction:column;
    &>div,&>button,&>p{
    margin-top:20px;
    }
`;
const LoginButton=styled(Button)`
    backgrodund:orange;
    color:#fff;
    height:48px;
    border-radius:2px;
    `
const Signup=styled(Button)`
    background:#fff;
    color:#2874f0;
    height:48px;
    border-radius:2px;
    box-shadow:0 2px 4px 0 rgb(0 0 0/ 20%);
`
const Text=styled(Typography)`
    color=#878787;
    font-size:16px;
`
const signupInitialValues={
    name:' ',
    username:' ',
    password:' '
}
const Login=()=>{
    const imageURL="https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png";
    const [account,toggleAccount]=useState('login');
    const [signup,setSignup]=useState('signupInitialValues')
    const toggleSignup=()=>{
        account==='signup'?toggleAccount('login'):toggleAccount('signup');
    }
    const onInputChange=(e)=>{
        setSignup({...signup,[e.target.name]:e.target.value});
    }
    return (
       <Component> 
        <Box>
        <Image src={imageURL} alt="login"/>
        {
            account==='login'?
        
        <Wrapper>
        <TextField variant='standard' label="Enter Username"/>
        <TextField variant='standard' label="Enter Password"/>
        <LoginButton variant='contained'>Login</LoginButton>
        <Text style={{textAlign:'center'}}>OR</Text>
        <Signup style={{background:'orange',color:'#fff'}} onClick={()=>toggleSignup()}>Create an account</Signup>
        </Wrapper>
        :
        <Wrapper>
        <TextField variant='standard' label="Enter Name"name='name' onChange={(e)=>onInputChange(e)}/>
        <TextField variant='standard' label="Enter Username"name='username' onChange={(e)=>onInputChange(e)}/>
        <TextField variant='standard' label="Enter Password" name='password' onChange={(e)=>onInputChange(e)}/>
        <LoginButton variant='contained'>Sign-Up</LoginButton>
        <Text style={{textAlign:'center'}}>OR</Text>
        <LoginButton style={{background:'orange'}} onClick={()=>toggleSignup()}>Already have an account</LoginButton>
        </Wrapper>
}
        </Box>
     </Component>
    )
}
export default Login;   