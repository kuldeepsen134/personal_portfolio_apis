const cloudinary = require('cloudinary');
const fs = require('fs');
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../config/config');

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

exports.uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};


exports.uploadOnCloudinaryArray = async (localFilePaths) => {
    try {
        if (!localFilePaths || !Array.isArray(localFilePaths)) return null;
        
        const uploadedFiles = [];
        for (const path of localFilePaths) {
            const response = await cloudinary.uploader.upload(path, {
                resource_type: "auto"
            });
            uploadedFiles.push(response);
            fs.unlinkSync(path);
        }
        
        return uploadedFiles;
    } catch (error) {
        // Handle error and cleanup
        for (const path of localFilePaths) {
            fs.unlinkSync(path);
        }
        return null;
    }
};