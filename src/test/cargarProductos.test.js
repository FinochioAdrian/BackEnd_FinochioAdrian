import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import usersModel from "../feature/users/users.model.js";
import cartModel from "../feature/carts/cart.model.js";
import productModel from "../feature/products/product.model.js";
import { createHash } from "../utils.js";
import { logger } from "../utils/loggerMiddleware/logger.js";
import fs from 'fs/promises'
import UsersDAO from "../feature/users/users.dao.js";
import path from "path";
import __dirname from "../utils.js";
const url = "mongodb+srv://eidrienhez33:K0DW1LhyMOcpSKZy@ecommercecluster.nmjs8p9.mongodb.net/ecommerce?retryWrites=true&w=majority"

mongoose.connect(url)
const requester = supertest('https://backendfinochioadrian-production.up.railway.app/')




const documents = []
let cookieUser;
let cookieUserPremiun;
let cookieAdmin;
let pidAddForPremiun
let mockUser = {
    first_name: 'Adrian',
    last_name: 'Finochio',
    age: 30,
    email: 'eidrienhez33@gmail.com',
    password: '123456789',
}
let mockUserPremiun = {
    first_name: 'facundo',
    last_name: 'sanchez',
    age: 22,
    email: 'facuujose10@gmail.com',
    password: '123456789',
    role: 'premium'
}
let mockUserAdmin = {
    first_name: 'Admin',
    last_name: 'Admin',
    age: 99,
    email: 'adminTiendita@gmail.com',
    password: '123456789',
    role: 'admin'
}
describe('Testing API', () => {
    before(async function () {
       
        this.timeout = 5000

    })
    after(async function () {
       
        this.timeout = 10000

    })

    
    describe("Endpoint Session test", () => {
       
       
        it('/api/sessions/login Debe logear un usuario Premium correctamente y DEVOLVER UNA COOKIE', async function () {

            const { email, password } = mockUserPremiun


            const result = await requester.post('/api/sessions/login').set('Accept', 'application/json').send({ email, password })
            console.log("🚀 ~ result:", result)
            
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookieUserPremiun = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(result.statusCode).to.be.equal(200)
            expect(cookieUserPremiun.name).to.be.ok.and.eql('jwt')
            expect(cookieUserPremiun.value).to.be.ok
            expect(result._body).to.be.eql({ status: "success", msg: "Logged in" })







        })
        
        
    })


/* 
    describe("Endpoint Products test", () => {
        const mockProducts = {
            title: "Notebook Chiken",
            description: "Nuevo Notebook Chiken",
            code: "Chiken1000",
            price: 10000,
            status: true,
            stock: 10,
            category: "IT",
            thumbnails: [
                "./src/test/ImgProductTest/NotebookChiken.webp"
            ]
        }
        let pid

       
        it("post /api/products permite añadir un producto con imagen a usuarios premium ", async () => {

            const { statusCode: code, _body: body } = await requester.post("/api/products/").set('Accept', 'application/json').set('Cookie', [`${cookieUserPremiun.name}=${cookieUserPremiun.value}`])
                .field('title', mockProducts.title)
                .field('description', mockProducts.description)
                .field('code', 'insertForPremiun')
                .field('price', mockProducts.price)
                .field('status', mockProducts.status)
                .field('stock', mockProducts.stock)
                .field('category', mockProducts.category)
                .attach("thumbnails", mockProducts.thumbnails[0])


            expect(code).to.be.eq(201)
            expect(body).to.be.an("object").and.to.have.property('payload')
            pidAddForPremiun = body.payload._id




        })
        it("post /api/products permite añadir un producto con imagen a usuarios admin", async () => {

            const { statusCode: code, _body: body } = await requester.post("/api/products/").set('Accept', 'application/json').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`])
                .field('title', mockProducts.title)
                .field('description', mockProducts.description)
                .field('code', 'insertForAdmin')
                .field('price', mockProducts.price)
                .field('status', mockProducts.status)
                .field('stock', mockProducts.stock)
                .field('category', mockProducts.category)
                .attach("thumbnails", mockProducts.thumbnails[0])


            expect(code).to.be.eq(201)
            expect(body).to.be.an("object").and.to.have.property('payload')
            pid = body.payload._id


        })


        it("get /api/products devuelve una lista de productos solo a usuarios logueados ", async () => {


            let result = await requester.get("/api/products/").set('Accept', 'application/json')

            expect(result.statusCode).to.be.eq(401)
            expect(result._body).to.have.property("error").with.eql('Unauthorized')

            result = await requester.get("/api/products/").set('Accept', 'application/json').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])




            expect(result.statusCode).to.be.eq(200)
            expect(result._body.payload).to.be.an("array").and.to.not.empty


        })
        it("get /api/products/:pid devuelve un unico producto por id de producto solo a usuarios logueados ", async () => {



            let result = await requester.get(`/api/products/${pid}`).set('Accept', 'application/json')


            expect(result.statusCode).to.be.eq(401)
            expect(result._body).to.have.property("error").with.eql('Unauthorized')


            result = await requester.get(`/api/products/${pid}`).set('Accept', 'application/json').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])



            expect(result.statusCode).to.be.eq(200)
            expect(result._body.product).to.be.an("object").and.to.not.empty
            expect(result._body.product._id).to.be.equal(pid)


        })
      
       


    }) */
  

    










})

async function borrarArchivo(filePath) {
    try {
        if (!filePath) {
            return
        }
        await fs.unlink(path.join(__dirname, '/public', filePath));
    } catch (err) {

        logger.error(
            `❌ ~ runValidation ~ err:
            error eliminando el archivo ${filePath} , ${err}
            `
        );
    }
}

async function BorrarImagenesAlmacenadas(products) {
    for (const product of products) {
        if (product.thumbnails.length > 0) {
            for (const ruta of product.thumbnails) {
                await borrarArchivo(ruta);
            }
        }
    }
}
async function BorrarDocumentsAlmacenados(documents) {

    for (const ruta of documents) {

        await borrarArchivo(ruta);
    }

}