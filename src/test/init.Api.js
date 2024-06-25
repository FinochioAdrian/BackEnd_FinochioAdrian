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
const requester = supertest('https://backendfinochioadrian-production.up.railway.app')

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
    first_name: 'Ezequiel',
    last_name: 'Finochio',
    age: 30,
    email: 'finochio.adrian@outlook.com',
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
        await usersModel.deleteMany({})
        await cartModel.deleteMany({})
        const products = await productModel.find()
        await BorrarImagenesAlmacenadas(products)
        await productModel.deleteMany({})
        this.timeout = 5000

    })
    after(async function () {
        /* 
                const products = await productModel.find()
                
                
                await BorrarImagenesAlmacenadas(products)
                await productModel.deleteMany({}) 
                await BorrarDocumentsAlmacenados(documents) */
        this.timeout = 10000

    })

    describe('Incialización de la DB', () => {
        it('La Tabla users Esta vacia', async () => {
            const users = await usersModel.find()
            expect(users).to.be.empty
        })
        it('La Tabla cart Esta vacia', async () => {
            const cart = await cartModel.find()
            expect(cart).to.be.empty

        })
        it('La Tabla product Esta vacia', async () => {
            const product = await productModel.find()
            expect(product).to.be.empty

        })
        it('Se creo un usuario Admin correctamente', async () => {
            let { email, password } = mockUserAdmin
            password = createHash(mockUserAdmin.password)


            await usersModel.create({ ...mockUserAdmin, password })

            const userAdmin = await usersModel.findOne({ email, password })
            expect(userAdmin.email).to.be.equal(mockUserAdmin.email)
            expect(userAdmin.role).to.be.equal(mockUserAdmin.role)

        })
        it('Se creo un usuario Premium correctamente', async () => {
            let { email, password } = mockUserPremiun
            password = createHash(mockUserPremiun.password)


            const User = new UsersDAO()
            const userPremiun = await User.insert({ ...mockUserPremiun, password })



            expect(userPremiun.email).to.be.equal(mockUserPremiun.email)
            expect(userPremiun.role).to.be.equal(mockUserPremiun.role)

        })
    })

    describe("Endpoint Session test", () => {
        it('/api/sessions/register Debe registrar correctamente a un usuario', async function () {



            const { statusCode, ok, _body } = await requester.post('/api/sessions/register').set('Accept', 'application/json').send(mockUser)



            expect(statusCode).to.be.equal(200)
            expect(_body).to.be.eql({ status: 'success', message: 'Usuario registrado exitosamente' })


        })
        it('/api/sessions/login Debe logear un usuario correctamente y DEVOLVER UNA COOKIE', async function () {


            const result = await requester.post('/api/sessions/login').set('Accept', 'application/json').send(mockUser)
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookieUser = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(result.statusCode).to.be.equal(200)
            expect(cookieUser.name).to.be.ok.and.eql('jwt')
            expect(cookieUser.value).to.be.ok
            expect(result._body).to.be.eql({ status: "success", msg: "Logged in" })






        })
        it('/api/sessions/login Debe logear un usuario Premiun correctamente y DEVOLVER UNA COOKIE', async function () {

            const { email, password } = mockUserPremiun


            const result = await requester.post('/api/sessions/login').set('Accept', 'application/json').send({ email, password })
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
        it('/api/sessions/login Debe logear un admin correctamente y DEVOLVER UNA COOKIE', async function () {

            const { email, password } = mockUserAdmin


            const result = await requester.post('/api/sessions/login').set('Accept', 'application/json').send({ email, password })
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookieAdmin = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(result.statusCode).to.be.equal(200)
            expect(cookieAdmin.name).to.be.ok.and.eql('jwt')
            expect(cookieAdmin.value).to.be.ok
            expect(result._body).to.be.eql({ status: "success", msg: "Logged in" })






        })
        it('/api/sessions/current Debe retornar los datos de un usuario correctamente', async function () {

            const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])

            expect(_body.payload.email).to.be.eql(mockUser.email)

        })
    })



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


        
        it("put /api/products permite modificar un producto con imagen", async () => {
            let newPrice = 50000
            let result = await requester.get(`/api/products/${pid}`).set('Accept', 'application/json').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`])
            const mockProducts = { ...result._body.product, price: newPrice }


            const { statusCode, _body } = await requester.put(`/api/products/${pid}`).set('Accept', 'application/json').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send(mockProducts)


            expect(statusCode).to.be.eq(200)
            expect(_body).to.be.an("object").and.to.have.property('payload')

            result = await requester.get(`/api/products/${pid}`).set('Accept', 'application/json').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`])

            expect(result._body.product.price).to.be.eq(newPrice)



        })
        



    })
    describe("Endpoint Carts test", () => {



    })

    describe("Endpoint Users test", () => {
        const mockDocument = {
            identification: "./src/test/documentsTest/identification.pdf",
            proofOfResidence: "./src/test/documentsTest/proofOfResidence.pdf",
            accountStatement: "./src/test/documentsTest/accountStatement.pdf"
        }

        it('/api/users/:uid/documents debe poder subir multiples documentos', async () => {


            const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])

            const { statusCode, _body: body } = await requester.post(`/api/users/${_body.payload._id}/documents`).set('Accept', 'application/json').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])
                .attach("identification", mockDocument.identification)
                .attach("proofOfResidence", mockDocument.proofOfResidence)
                .attach("accountStatement", mockDocument.accountStatement)

            body.payload.documents.forEach((document) => {
                if (!documents.includes(document.reference)) {

                    documents.push(document.reference)
                }

            })
            expect(statusCode).to.be.eq(201)
        })


        it('/api/users/:uid debe actualizar a un usuario como premium solo si ha cargado los 3 documentos', async () => {
            //el usuario previamente no es premium
            //el usuario previamente cargo todos los documentos

            const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])
            expect(_body.payload.role).to.be.eql(`user`)

            const uid = _body.payload._id

            const { statusCode, _body: body } = await requester.put(`/api/users/premium/${uid}`).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])

            expect(statusCode).to.be.eql(200)
            expect(body.newRole).to.be.eql(`premium`)


            const { _body: newBody } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])

            expect(newBody.payload.role).to.be.eql(`premium`)


        })


        it('GET /api/users/ deberá obtener todos los usuarios, éste sólo debe devolver los datos principales', async () => {

            const response = await requester.get('/api/users/').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`])
            expect(response.statusCode).to.be.eq(200)
            expect(response._body.payload).to.be.an('Array').to.not.be.empty





            expect(response._body.payload).to.deep.satisfy((elements) => {
                elements.forEach((element) => {
                    expect(element).to.have.all.keys('_id', 'age', 'email', 'first_name', 'last_name', 'role', 'last_connection');
                    expect(element.age).to.be.a('number');
                    expect(element.email).to.be.a('string');
                    expect(element.first_name).to.be.a('string');
                    expect(element.last_name).to.be.a('string');
                    expect(element.role).to.be.a('string');
                    expect(element.last_connection).to.be.a('object');
                });
                return true;
            });

        })
        /* it('DELETE /api/users/ deberá eliminar todos los usuarios que no hayan tenido conexion en los ultimos 2 días', async () => {

            try {
                const responseAllUsers = await requester.get('/api/users/').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`])



                const responseDeleteUsers = await requester.delete('/api/users/').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`])

                expect(responseDeleteUsers.statusCode).to.be.eq(200)
                expect(responseDeleteUsers._body.payload).to.be.an('object').to.have.property("cantUserDelete")

            } catch (error) {
                console.error(error)
            }

        }) */
    })










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