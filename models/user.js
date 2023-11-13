const { createHmac, randomBytes } = require('crypto') // for hashing password
const {createTokenForUser} = require('../services/authentication')

const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    fullname:{
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
        // required:true,
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
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {timestamps: true}
)

userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString(); // a random string
    const hashedpassword = createHmac('sha256', salt).update(user.password).digest("hex"); // hashing key

    this.salt = salt;
    this.password =  hashedpassword;

    next();
})

userSchema.static("matchPasswordAndGenerateToken", async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedpassword = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest("hex");

    if(hashedpassword !== userProvidedHash)
    {
        throw new Error("Incorrect Password");
    }

    const token = createTokenForUser(user);
    return token;
})

const user = model('user', userSchema);
module.exports = user;