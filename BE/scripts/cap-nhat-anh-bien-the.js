const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const SanPham = require('../models/san-pham.model');

async function run() {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const dbPath = path.join(__dirname, '..', '..', 'FE', 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    let count = 0;
    for (const sp of db.san_pham) {
        if (sp.tuy_chon_phien_ban && sp.tuy_chon_phien_ban.length > 1) {
            await SanPham.updateOne(
                { id: sp.id },
                { 
                    $set: { 
                        tuy_chon_phien_ban: sp.tuy_chon_phien_ban,
                        thu_vien_hinh_anh: sp.thu_vien_hinh_anh
                    } 
                }
            );
            count++;
        }
    }
    console.log(`Updated ${count} products in MongoDB Atlas successfully!`);
    await mongoose.disconnect();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
