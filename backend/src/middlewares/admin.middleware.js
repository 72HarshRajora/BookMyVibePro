const verifyAdmin = async (req, res, next) => {
    const userRole = req.user.role

    if(userRole !== "admin"){
        return res.status(403).json({
            message: "You haven't access to work as admin."
        })
    }

    next()
}

export default verifyAdmin