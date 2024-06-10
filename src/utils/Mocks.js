import {faker} from '@faker-js/Faker'
faker.location= "es"
    export const generateListProducts = async ()  => {
        let numOfProducts = 100
        let products = []

        for (let i =0 ; i<numOfProducts; i++){
             products.push(await generateProduct())
        }

        return products
    }
export const generateProduct = async() => {
    
   return {
    _id:faker.database.mongodbObjectId(),
    title:faker.commerce.productName(),
    description:faker.commerce.productDescription(),
    code:faker.string.alphanumeric(5),
    price:faker.commerce.price(),
    status:faker.datatype.boolean({probability:0.9}),
    stock:faker.number.int({ max: 100 }) ,
    category:faker.commerce.department(),
    thumbnails:faker.image.url(),
   }


}
