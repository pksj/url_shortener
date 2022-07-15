function guid(len) {
    var id = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length,
        length = len || 32;

    for (var i = 0; i < length; i++) {
        id[i] = chars[Math.floor(Math.random() * charlen)];
    }

    return id.join('');
}

module.exports = guid
