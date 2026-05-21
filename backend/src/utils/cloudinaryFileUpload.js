import {v4 as uuid} from "uuid"
import cloudinary from "../config/cloudinary.config.js"

const uploadFile = async (file) => {
    let cleanName = file.originalname.replace(/\s+/g, "-")
    let dotIndex = cleanName.lastIndexOf(".")
    if(dotIndex !== -1){
        cleanName = cleanName.slice(0, dotIndex)
    }

    const public_id = `${uuid()}-${cleanName}`
    const uploadFile = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`

    const result = await cloudinary.uploader.upload(uploadFile, {
        public_id,
        folder: "BookMyVibePro",
        resource_type: "auto"
    })

    return result
}

export default uploadFile;