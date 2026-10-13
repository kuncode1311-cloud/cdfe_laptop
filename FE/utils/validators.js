export const laSoDienThoaiHopLe = (sdt) => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(String(sdt || '').replace(/\s+/g, ''));
