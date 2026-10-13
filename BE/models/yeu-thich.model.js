const mongoose = require('mongoose');

const YeuThichSchema = new mongoose.Schema(
    {
        id_nguoi_dung: { type: String, required: true, trim: true },
        id_san_pham: { type: String, required: true, trim: true }
    },
    { timestamps: true, versionKey: false }
);

YeuThichSchema.index({ id_nguoi_dung: 1, id_san_pham: 1 }, { unique: true });

const YeuThich = mongoose.model('YeuThich', YeuThichSchema, 'yeu_thich');

module.exports = YeuThich;
