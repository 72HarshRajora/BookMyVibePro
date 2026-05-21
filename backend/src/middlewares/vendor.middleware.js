const verifyVendor = (req, res, next) => {
    const userRole = req.user.role

    if(userRole !== "vendor"){
        return res.status(403).json({
            message: "You haven't access to work as vendor."
        })
    }

    next()
}

export default verifyVendor