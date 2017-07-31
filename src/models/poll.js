import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const Option = new Schema({
    content: {
        type: String,
        required: true
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Poll = Schema({
    question: {
        type: String,
        required: true
    },
    options: [Option],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


export default mongoose.model('Poll', Poll);
