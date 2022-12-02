import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    name: {type : String, required: true},
    phone: {type : Number, required: true},
    documentNumber: {type : String, required: true},    
    email: {type : String, required: true},
    password: {type : String, required: true},
    ativo: {type : Boolean, required: true}
});

export const UserModel = mongoose.models.users
    || mongoose.model('users', UserSchema);