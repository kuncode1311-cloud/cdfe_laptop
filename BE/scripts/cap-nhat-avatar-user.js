const mongoose = require('mongoose');
require('dotenv').config();
const NguoiDung = require('../models/nguoi-dung.model');

async function fix() {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await NguoiDung.updateOne(
        { email: 'kun.learning01@gmail.com' },
        { 
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        }
    );
    console.log('UPDATE RESULT:', result);
    const user = await NguoiDung.findOne({ email: 'kun.learning01@gmail.com' });
    console.log('NEW AVATAR IN DB:', user.avatar);
    await mongoose.disconnect();
}
fix();
