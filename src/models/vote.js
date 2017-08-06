import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const Option = new Schema({
    content: {
        type: String,
        required: true
    },
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll'
    }
}, {
    timestamps: true
});


export default mongoose.model('Option', Option);
