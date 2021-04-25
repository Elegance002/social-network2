const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle:'';
    data.status = !isEmpty(data.status) ? data.status:'';
    data.skills = !isEmpty(data.skills) ? data.skills:'';

    //validation start
    if(!Validator.isLength(data.handle,{min:2, max:40})){
        errors.handle = "Profile handle must be between 2 to 40 characters";
    }
    if(Validator.isEmpty(data.handle)){
        errors.handle = "Profile handle field is required!";
    }
    if(Validator.isEmpty(data.status)){
        errors.status = "Status field is required!";
    }
    if(Validator.isEmpty(data.skills)){
        errors.skills = "skills field is required!";
    }
    //website validation
    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = "Not a valid URL?";
        }
    }
    //youtube validation
    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube = "Not a valid URL?";
        }
    }
    //facebook validation
    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = "Not a valid URL?";
        }
    }
    //twitter validation
    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter = "Not a valid URL?";
        }
    }
    //linkedin
    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin = "Not a valid URL?";
        }
    }
    //instagram
    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.instagram = "Not a valid URL?";
        }
    }
    //return errors
    return{
        errors,
        isValid: isEmpty(errors)
    }
}