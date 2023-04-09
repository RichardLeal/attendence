const mongoose = require('mongoose');

const historyCheckInSchema = new mongoose.Schema({
    student: {
        name: String,
        registration: String
    },
    semester: {
        name: String
    },
    checkIn: [{
        class: {
            code: String,
            name: String
        },
        date: Date
    }]
});

module.exports = mongoose.model('HistoryCheckIn', historyCheckInSchema, 'history_check_ins');
