import Handlebars from "express-handlebars";
import __dirname from "../utils.js";

const handlebars_config = (app)=>{
    app.engine("handlebars", Handlebars.engine());
    app.set("views", __dirname + "/views");
    app.set("view engine", 'handlebars');

}
export default handlebars_config