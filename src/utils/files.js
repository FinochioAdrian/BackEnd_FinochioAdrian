import fs from 'node:fs/promises'
export async function borrarArchivo(filePath) {
    try {
        if (!filePath) {
            return
        }
        
        await fs.unlink(filePath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return; // Don't re-throw the error
          }
        throw err
    }
}

export async function BorrarImagenesAlmacenadas(products) {
    for (const product of products) {
        if (product.thumbnails.length > 0) {
            for (const ruta of product.thumbnails) {
                await borrarArchivo(ruta);
            }
        }
    }
}
export async function BorrarDocumentsAlmacenados(documents) {

    for (const ruta of documents) {

        await borrarArchivo(ruta);
    }

}