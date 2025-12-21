import { model, Schema, Types } from "mongoose";

export interface IGuest {
  _id: Types.ObjectId,
  name: string | null,
  type: string,
  guestListId: Types.ObjectId
  projectId: Types.ObjectId
}

export interface IGuestUpdateInput {
  name?: string
}

export interface IGuestDeleteOutput {
  _id: string
  success: boolean
}

export const GuestSchema = new Schema({
  name: { type: String, default: null },
  type: { type: String, default: 'family' },
  guestListId: { type: Schema.Types.ObjectId, ref: "GuestList", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true }
}, { _id: true });

export const Guest = model('Guest', GuestSchema);