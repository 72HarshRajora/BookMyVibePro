import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) =>{
    const token = req.cookies["BookMyVibe-token"]
    
    if(!token){
        return res.status(401).json({
            message: "Unauthorised user."
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized user."
        })
    }
}

export default verifyToken;