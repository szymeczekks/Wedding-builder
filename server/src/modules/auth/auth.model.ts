import { Schema, model } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  layout?: object;
}

const UserSchema =  new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'viewer'
    },
    layout: {
        type: Schema.Types.ObjectId,
        ref: 'Layout'
    }
});

export default model('User', UserSchema);