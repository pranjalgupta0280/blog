import React, { useState, useEffect, useContext } from 'react';
import { styled, Box, TextareaAutosize, Button, InputBase, FormControl } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import { API } from '../../services/api';
import { DataContext } from '../../context/DataProvider';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: '10px'
    }
}));

const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

const InputTextField = styled(InputBase)`
    flex: 1;
    margin: 0 30px;
    font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    margin-top: 50px;
    font-size: 18px;
    &:focus-visible {
        outline: none;
    }
`;

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    createdDate: new Date()
}

const CreatePost = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState('');
    const { account } = useContext(DataContext);

    const url = post.picture ? post.picture : 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';

    useEffect(() => {
        const getImage = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);

                // --- FIX: Added try-catch for robust error handling ---
                try {
                    const response = await API.uploadFile(data);
                    if (response.isSuccess) {
                        // --- FIX: Use setPost to update state immutably ---
                        setPost(prevPost => ({ ...prevPost, picture: response.data }));
                    }
                } catch (error) {
                    // This will now correctly log the error message string
                    console.error("Error uploading file:", error.msg);
                    // You could also set an error state here to show a message to the user
                }
            }
        }
        getImage();
        
        // --- FIX: Use setPost to update other post details without direct mutation ---
        setPost(prevPost => ({
            ...prevPost,
            categories: location.search?.split('=')[1] || 'All',
            username: account.username
        }));
    }, [file, account.username, location.search]); // Added dependencies to follow React best practices

    const savePost = async () => {
        try {
            const response = await API.createPost(post);
            if (response.isSuccess) {
                navigate('/');
            }
        } catch (error) {
            console.error("Error saving post:", error.msg);
        }
    }

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    }

    return (
        <Container>
            <Image src={url} alt="post" />

            <StyledFormControl>
                <label htmlFor="fileInput">
                    <Add fontSize="large" color="action" />
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <InputTextField name='title' placeholder="Title" onChange={(e) => handleChange(e)} />
                {/* --- FIX: Added onClick handler to the Publish button --- */}
                <Button onClick={() => savePost()} variant="contained" color="primary">Publish</Button>
            </StyledFormControl>

            <Textarea
                minRows={5}
                placeholder="Tell your story..."
                name='description'
                onChange={(e) => handleChange(e)}
            />
        </Container>
    )
}

export default CreatePost;

