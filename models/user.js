const {Schema} = require("mongoose")

const userSchema = new Schema({
    fullNmae:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique: true,
    },
    // for password
    salt:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required: true
    },
    profileimageurl:{
        type: String,
        default: "/images/userimg.png"
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "USER"
    }
}, {timestamps: true}
)

const user = model('user', userSchema);
module.exports = user;