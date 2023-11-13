const jwt = require("jsonwebtoken");

const secret = "anything@1234";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileimageurl: user.profileimageurl,
        role: user.role,
    }

    const token = jwt.sign(payload, secret);
    return token;
}
function validateToken(token)
{
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {createTokenForUser, validateToken};