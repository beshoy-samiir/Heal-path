const multer = require("multer");
const path = require("path")

const upload = multer({ 
    dest: "upload/" 
})

module.exports= upload


