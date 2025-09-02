import express from 'express';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

import { signupUser, loginUser } from '../controller/user-controller.js';
import { uploadImage,getImage } from '../controller/image-controller.js';
import upload from '../utils/upload.js';

const router = express.Router();

// User routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('file/:filename',getImage);
// File upload route
router.post('/file/upload', upload.single('file'), uploadImage);

// Route to serve GridFS files
router.get('/file/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'photos'
        });
        
        const downloadStream = bucket.openDownloadStreamByName(filename);
        
        downloadStream.on('error', (error) => {
            return res.status(404).json({ msg: 'File not found' });
        });
        
        downloadStream.on('file', (file) => {
            res.set('Content-Type', file.contentType);
        });
        
        downloadStream.pipe(res);
        
    } catch (error) {
        return res.status(500).json({ msg: 'Error retrieving file' });
    }
});

// Error handling middleware
router.use((error, req, res, next) => {
    if (error.message === 'Only image files (PNG, JPG, JPEG, GIF) are allowed!') {
        return res.status(400).json({ msg: error.message });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'File too large' });
    }
    
    return res.status(500).json({ msg: 'File upload error: ' + error.message });
});

export default router;
