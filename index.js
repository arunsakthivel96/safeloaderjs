let getsafeloader = require('./core/Safeloader');
const safeloader = getsafeloader.getInstance(module.parent.filename || null);
module.exports = safeloader;