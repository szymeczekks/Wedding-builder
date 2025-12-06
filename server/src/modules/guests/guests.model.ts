import { model, Schema } from "mongoose";

export interface IGuestItem {
    name: string,
    side: string,
    type: string
}

export interface IGuests {
    projectId: string,
    items: IGuestItem[] | []
}

const GuestItemSchema = new Schema({
  name: { type: String, required: true },
  side: { type: String, enum: ["bride", "groom"] },
  type: { type: String },
}, { _id: true }); 

const GuestsSchema = new Schema({
    projectId: { 
        type: String,
        required: true
    },
    items: {
        type: [GuestItemSchema],
        default: []
    }
}, {
    timestamps: true
});

export const Guests = model('Guests', GuestsSchema);