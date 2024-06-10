import multer from "multer";

const storageProducts = multer.diskStorage({
    destination: "src/public/images/products/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ".webp");
    }
    
});


const storageProfileImg = multer.diskStorage({
    destination: "src/public/images/profiles/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ".webp");
    }
});

const storageDocuments = multer.diskStorage({
    destination: "src/public/documents/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const mimeType = file.mimetype.split('/'); // Extraer el tipo MIME (ej: "application/pdf")
        const extension = mimeType[1]; // Obtener la extensión (ej: "pdf")
        const extesionSoport = ["pdf"]
        
        if (!extesionSoport.includes(extension) ) {
            // Error de extensión no permitida
            cb(new Error(`Extension de archivo no permitida: ${extension}`), null);
          } else if(mimeType[0]=="image"){
            cb(null, uniqueSuffix + ".webp");
          }else{
            cb(null, uniqueSuffix + '.' + extension);
          }
    }
});

const uploadDocuments = multer({ storage: storageDocuments })
const uploadProducts = multer({ storage: storageProducts });
const uploadProfileimg = multer({ storage: storageProfileImg })

export { uploadProducts, uploadDocuments, uploadProfileimg }; 