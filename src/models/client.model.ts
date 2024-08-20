import { Schema, model } from 'mongoose';
import { USER_ROLE } from '../constants/user.constants';


const ClientSchema = new Schema(
    {
        role: { type: Number, enum: [USER_ROLE], default: USER_ROLE, index: true },
        full_name: { type: String, required: false, default: null, index: true },
        nick_name: { type: String, required: false, default: null, index: true },
        tag_line: { type: String, required: false, default: null, index: true },
        profile_pic: { type: String, default: null },
        country_code: { type: String, required: false, default: null },
        phone_number: { type: String, required: false, index: true },
        email: { type: String, required: true, default: null, index: true, unique: true },
        password: { type: String, required: false, default: null },
        is_deleted: { type: Boolean, default: false, index: true },
        is_blocked: { type: Boolean, default: false, index: true },
        device_token: { type: String, required: false, default: null },
    }, { timestamps: true, versionKey: false }
)
ClientSchema.index({ full_name: 1, nick_name: 1, tag_line: 1, phone_number: 1, email: 1, is_deleted: 1 });
export default model('clients', ClientSchema)


