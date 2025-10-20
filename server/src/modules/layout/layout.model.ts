import { Schema, model } from "mongoose";

const LayoutSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    components: [
        {
            type: { type: String, required: true },
            props: { type: Object, required: true },
            position: { type: Number, required: true }
        }
    ]
});

export default model('Layout', LayoutSchema);