import multer, { diskStorage } from "multer"


const storage = multer.diskStorage({})

const upload = multer({ storage })

export default upload

