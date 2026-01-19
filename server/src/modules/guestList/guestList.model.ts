import { model, Schema, Types } from "mongoose";
import { GuestSchema, IGuest } from "../guest/guest.model";

export interface IGuestList {
    _id: Types.ObjectId
    name: string,
    type: string,
    projectId: Types.ObjectId,
}

export interface UpdateGuestListInput {
    name: string
};

export interface DeleteGuestListOutput {
    _id: string,
    success: boolean
};

const GuestListSchema = new Schema({
    projectId: { 
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Project"
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'guests',
    }
}, {
    timestamps: true
});

export const GuestList = model('GuestList', GuestListSchema);