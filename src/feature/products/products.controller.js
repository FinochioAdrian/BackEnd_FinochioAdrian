import { generateListProducts } from "../../utils/Mocks.js";
import CustomError from "../../utils/errors/customError.js";
import EErrors from "../../utils/errors/enums.js";
import { customCauseErrorInfo } from "../../utils/errors/info.js";
import { sendEmail, transportGmailNodemailer } from "../../utils/sendEmail.js";
import { usersService as Users } from "../users/repository/users.service.js";
import { productsService as Products } from "./repository/index.js";
import envConfig from '../../config/config.js'
async function getAll(req, res, next) {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;
    const sort = req.query?.sort || "asc";
    const category = req.query?.category || null;
    const available = req.query?.available || true;

    let result = await Products.getAll(limit, page, sort, category, available);
    const payload = result.docs;
    delete result.docs;
    result.prevLink = result.hasPrevPage
      ? `http://localhost:8080/home?page=${result.prevPage}`
      : null;
    result.nextLink = result.hasNextPage
      ? `http://localhost:8080/home?page=${result.nextPage}`
      : null;

    res.send({ status: "sucess", payload, ...result });
  } catch (error) {
    next(error)
  }
}
async function getAllMockingProducts(req, res, next) {
  try {
    const result = await generateListProducts()


    res.send({ status: "sucess", payload: [...result] });
  } catch (error) {
    next(error)
  }
}

async function get(req, res, next) {
  try {
    let { pid } = req.params;

    let productFound = await Products.getById(pid);
    if (!productFound) {

      const msg = `Product with ID ${pid} not found.`
      throw new CustomError({ name: "PRODUCT_NOT_FOUND", cause: customCauseErrorInfo(msg), message: "Error getting product by id", code: EErrors.DATABASE_EXCEPTION, status: 404 })

    }
    // Product found, send it in the response
    return res.send({ product: productFound });
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  // Validate the request body against the schema
  const { body: product } = req;
  const { user } = req

  product.owner = {
    _id: user._id,
    admin: false
  }


  if (user.role == "admin") {
    product.owner.admin = true
  }


  try {
    const result = await Products.getWithCode(product.code);


    if (result?.length > 0) {
      const msg = `The 'code': ${product.code} $ field already exists in the database.`
      throw new CustomError({ name: "Error_Create", cause: customCauseErrorInfo(msg), message: "Error Created product", code: EErrors.DATABASE_EXCEPTION, status: 409 })

    }

    if (req.files && req.files.length > 0) {
      const filePath = req.files;
      const thumbnails = filePath.map((value) => {
        return value.path.replace(/\\/g, "/");
      });
      product.thumbnails = thumbnails;

    }

    const payload = await Products.add({ ...product });

    res.status(201).send({ status: "success", payload });
  } catch (error) {
    next(error)
  }
}

async function update(req, res, next) {
  try {
    const { pid } = req.params
    let { body: product, user } = req;
    let result = await Products.getWithCode(product.code);
    result = JSON.parse(JSON.stringify(result));

    if (result?.length > 0 && result._id !== pid) {
      return res.status(409).send({
        status: "fail",
        msg: `The 'code': ${product.code}, field already exists in the database.`,
      });
    }

    /*----  Update products ----*/



    if (user.role == "admin") {
      let productUpdate = await Products.update(pid, product);
      // Response Product not found
      if (!productUpdate) {
        return res
          .status(404)
          .send({ status: "fail", msg: `No product found with ID ${pid}` });
      }
      // Response Product found, send to response
      return res.send({ status: 200, payload: productUpdate });
    }
    const findProduct = await Products.getById(pid)
    if (!findProduct) {
      return res.status(404).send({
        status: "fail", msg: `No product found with ID ${pid}`,
      });
    }
    const { owner: ownerFind } = findProduct

    if ((!ownerFind.admin) && user._id == ownerFind._id) {


      let productUpdate = await Products.update(pid, product);
      // Response Product not found
      if (!productUpdate) {
        return res
          .status(404)
          .send({ status: "fail", msg: `No product found with ID ${pid}` });
      }
      // Response Product found, send to response
      return res.send({ status: 200, payload: productUpdate });
    }

    return res.status(403).send({
      status: "fail",
      msg: "You do not have permission to access this resource.",
    });




  } catch (error) {

    next(error)
  }
}

async function remove(req, res, next) {
  try {
    let { pid } = req.params;
    let { user } = req;

    // Delete product

    const findProduct = await Products.getById(pid)

    if (!findProduct) {
      return res.status(404).send({ status: "fail", msg: `No product found with ID ${pid}` });
    }


    //extraemos el id del creador del producto
    const { owner: ownerFind } = findProduct


    if (user.role != "admin" && user._id != ownerFind._id) {
      return res.status(403).send({
        status: "error",
        msg: ` "You do not have permission to access this resource." `,
      });
    }
    let productRemove
    if (user.role == "admin") {

      productRemove = await Products.remove(findProduct);


    }
    if (user.role == "premium" && !ownerFind.admin) {

      productRemove = await Products.remove(findProduct);

    } else
      if (user.role == "user") {
        return res.status(403).send({
          status: "error",
          msg: ` "You do not have permission to access this resource." `,
        });

      }

    if (!productRemove) {
      return res.status(404).send({
        status: "fail", msg: `No product found with ID ${pid}`
      });
    }

    const userFind = await Users.getUserByID(ownerFind._id)
    if (userFind?.role == 'premium') {
      let message = `
        <div> 
            <h2>Estimado usuario: <b>${user.last_name} ${user.first_name}</b></h2>
            <p>Un producto que usted ha añadido en nuestra tienda virtual <b> ${envConfig.TIENDA}</b>, ha sido <b> ELIMINADO </b> </p>
                  <table class="max-width:600px; margin: 0 auto;">
                    <thead>
                      <tr>
                        <th>Id Producto</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Codigo</th>
                        <th>Estado</th>
                        <th>Stock</th>
                        <th>Categoria</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>${findProduct._id}</td>
                        <td>${findProduct.title}</td>
                        <td>${findProduct.price}</td>
                        <td>${findProduct.code}</td>
                        <td>${findProduct.status}</td>
                        <td>${findProduct.stock}</td>
                        <td>${findProduct.category}</td>
                      </tr>
                    </tbody>
                  </table>

         </div>
        `

      const mail = {
        from: envConfig.USERMAIL,
        to: userFind.email,
        subject: `Eliminación de Producto de ${envConfig.TIENDA}`,
        html: message
      }

      const resp = await sendEmail(transportGmailNodemailer, mail)





    }




    return res.status(201).send({
      status: "success",
      msg: `Product with ID ${pid} has been deleted `,
    });


  } catch (error) {
    next(error)
  }
}

export { getAll, get, create, update, remove, getAllMockingProducts };
