import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/config';


    // Configuration
    cloudinary.config({ 
        cloud_name:config.cloudinary_Cloud, 
        api_key:config.cloudinaryApikey, 
        api_secret: config.cloudinarySecret // Click 'View API Keys' above to copy your API secret
    });

    export default cloudinary;
