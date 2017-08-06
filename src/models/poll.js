import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const Option = new Schema({
    content: {
        type: String,
        required: [true, 'One or more options are not given.']
    },
    votes: {
        type: Number,
        defautl: 0
    }
}, {
    timestamps: true
});

const Poll = new Schema({
    question: {
        type: String,
        required: [true, 'Question is not given.']
    },
    options: [Option],
    voters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});


export default mongoose.model('Poll', Poll);
