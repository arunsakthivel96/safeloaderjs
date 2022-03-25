let getsafeloader = require('./core/Safeloader');
let safepath = module.parent;
safepath = safepath != null ? safepath.filename : module.filename;

const safeloader = getsafeloader.getInstance(safepath);
module.exports = safeloader;