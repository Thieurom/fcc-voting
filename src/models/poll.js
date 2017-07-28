import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const Voter = new Schema({
    votedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Vote = new Schema({
    votes: [Voter]
}, {
    timestamps: true
});

const Option = new Schema({
    content: {
        type: String,
        required: true
    }
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
    },
    votes: [Vote]
}, {
    timestamps: true
});


export default mongoose.model('Poll', Poll);
