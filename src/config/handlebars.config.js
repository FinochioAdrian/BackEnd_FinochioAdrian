import expressHandlebars from "express-handlebars";
import __dirname from "../utils.js";

const handlebars_config = (app) => {
    const hbs = expressHandlebars.create({
        
    });

    app.engine("handlebars", hbs.engine);
    app.set("views", __dirname + "/views");
    app.set("view engine", "handlebars");

    // Registrar el helper
    hbs.handlebars.registerHelper('eq', eq);
    hbs.handlebars.registerHelper('neq', neq);

};

function eq(value1, value2) {
    return value1 === value2;
  }
function neq(value1, value2) {
    return value1 !== value2;
  }

export default handlebars_config

