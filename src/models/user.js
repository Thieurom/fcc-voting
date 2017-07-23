import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';


const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    passwordHash: String
});

User.plugin(passportLocalMongoose);

export default mongoose.model('User', User);
