import jwt from "jsonwebtoken";
import { usersService } from "../users/repository/users.service.js";
import { createHash, generateToken, isValidPassword } from "../../utils.js";
import { logger } from "../../utils/loggerMiddleware/logger.js";
import envConfig from "../../config/config.js";
import { sendEmail, transportGmailNodemailer } from "../../utils/sendEmail.js";

async function register(req, res) {
  // Verificar si el cliente acepta HTML
  if (req.accepts("html")) {
    req.flash("infoMsg", "Inicie Sesión");
    return res.redirect("/login");
  }

  // Si el cliente no acepta HTML, devolver respuesta JSON
  return res.status(200).json({ status: "success", message: "Usuario registrado exitosamente" });
}

async function login(req, res, next) {
  try {
    const user = req.user;
    const access_token = generateToken(user);
    /* Registrar el login */

    const userData = {
      _id: user._id,
      last_connection: {
        name: 'login',
        date: new Date().toISOString()
      }

    }
    const login = await usersService.updateLast_connection(userData)
    if (req.accepts("html")) {
      return res
        .cookie("jwt", access_token, {
          signed: true,
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        })
        .redirect("/products");
    }
    return res
      .cookie("jwt", access_token, {
        signed: true,
        httpOnly: true,
        maxAge: 3 * 60 * 60,
      })
      .json({ status: "success", msg: "Logged in" });
  } catch (error) {
    next(error)
  }
}

async function passwordReset(req, res, next) {
  try {
    let { email, password, token } = req.body;


    if (!email || !password || !token) {
      if (req.accepts("html")) {
        req.flash("errorEmptyField", "Values name o password is empty");

        return res.redirect(`/password-reset?token=${token}`);
      }

      return res.status(400).send({
        status: "error",
        msg: "Error Empty Values: Field name o password is empty",
      });
    }
    let emailToken;
    try {
      let credentiales = jwt.verify(token, envConfig.PRIVATE_KEY_JWT)
      const { user: userToken } = credentiales
      emailToken = userToken.email
    } catch (error) {
      if (err) {
        if (req.accepts("html")) return res.redirect("/findEmail");
        return res.status(403).send({ error: "Not authorized", redirect: "/findEmail" });
      }
    }


    if (!(email.toLowerCase() == emailToken.toLowerCase())) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "Not authorized");
        return res.redirect("/login");
      }

      return res.status(403).send({ status: "error", msg: "Not authorized" });
    }

    let user = await usersService.getUserByEmail(email);

    if (!user) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "User not Found");
        return res.redirect("/findEmail");
      }

      return res.status(400).send({ status: "error", msg: "User not found" });
    }
    if (isValidPassword(user, password)) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "The password cannot be the same as the old password");
        return res.redirect(`/password-reset?token=${token}`);
      }

      return res.status(400).send({ status: "error", msg: "The password cannot be the same as the old password" });
    }

    user.password = createHash(password);

    await usersService.newPassword(user);

    delete req.body.password;
    delete user.password;

    if (req.accepts("html")) {
      req.flash("infoMsg", "Inicie Sesión");
      return res.redirect("/login");
    }

    return res.send({ status: "success" });
  } catch (error) {
    logger.error("❌ ~ router.post ~ error:", error);

    next(error)
  }
}
async function forgotEmailAndPassword(req, res, next) {

  try {
    let { email } = req.body;

    if (!email) {
      if (req.accepts("html")) {
        req.flash("errorEmptyField", "Values Email is empty, this is required");
        return res.redirect("/findEmail");
      }

      return res.status(400).send({
        status: "error",
        msg: "Error Empty Values: Values Email is empty, this is required",
      });
    }
    const message = 'Check your email for a link to reset your password.'



    let user = await usersService.getUserByEmail(email);

    if (!user) {
      if (req.accepts("html")) {
        req.flash("infoMsg", message);
        return res.redirect("/login");
      }

      return res.send({ status: "success", message });
    }

    delete user.password;
    const token = generateToken({ _id: user._id, email: user.email }, "1h")
    const verificationLink = `${envConfig.HOST}:${envConfig.PORT}/password-reset?token=${token}`
    sendEmail(transportGmailNodemailer, {
      from: "recoveryPasswordTiendaCoder",
      to: user.email,
      subject: "Recovery Password From Tienda Coder",
      html: `
      <div> <h1>Recuperacion de Password </h1></div>
        <div>  <h4>Usted Solicito Recuperacion de su password</h4></div>
        <div> <h4>Haga Click en el siguiente boton</h4></div>
        
        <td align="center" valign="middle" style="color:#17a2b8; font-family:Helvetica, Arial, sans-serif; font-size:16px; font-weight:bold; letter-spacing:-.5px; line-height:150%; padding-top:15px; padding-right:30px; padding-bottom:15px; padding-left:30px;">
  <a href="${verificationLink}" target="_blank" style="color:#ffc107; text-decoration:none;">Recovery Password</a>
</td>
        <div> <h4>o copie y pegue el siguiente enlace en el navegador</h4> ${verificationLink}</div>
        
        
        <div> <h4>si usted no solicito la recuperacion de su password, ignore este mensaje</h4></div>
      `,
      attachments: [],

    })

    if (req.accepts("html")) {
      req.flash("infoMsg", message);
      return res.redirect("/login");
    }

    return res.send({ status: "success", message });
  } catch (error) {
    logger.error("❌ ~ router.post ~ error:", error);

    next(error)
  }
}

async function githubcallback(req, res) {
  const user = req.user;
  if (!user) {
    if (req.accepts("html"))
      return res.render("401", {
        title: "Oops! Access Denied",
        stylesheet: "/css/errorPage.css",
      });

    return res
      .status(401)
      .send({ status: "error", error: "Invalid credentials" });
  }

  const access_token = generateToken(user);

  if (req.accepts("html")) {
    return res
      .cookie("jwt", access_token, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .redirect("/products");
  }

  res
    .cookie("jwt", access_token, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    })
    .json({ status: 200, msg: "Logged in" });
}

async function logout(req, res, next) {
  try {


    /* Registrar logout */

    const user = req.user;
    const userData = {
      _id: user._id,
      last_connection: {
        name: 'logout',
        date: new Date().toISOString()
      }
    }

    await usersService.updateLast_connection(userData)
    res.clearCookie("jwt");

    if (req.accepts("html")) return res.redirect("/login");
    res.status(200).json({ status: 200, msg: "Logged out" });
  } catch (error) {
    next(error)
  }


}

async function failRegister(req, res) {
  if (req.accepts("html"))
    return res.render("403", {
      title: "Oops! Access Denied",
      stylesheet: "/css/errorPage.css",
    });
  return res.status(403).send({ error: "Failed register" });
}

async function failLogin(req, res) {
  if (req.accepts("html"))
    return res.render("401", {
      title: "Oops! Access Denied",
      stylesheet: "/css/errorPage.css",
    });
  return res.status(401).send({ error: "Failed login" });
}

async function current(req, res) {
  res.json({ status: "success", payload: req.user });
}

export default {
  register,
  login,
  passwordReset,
  forgotEmailAndPassword,
  githubcallback,
  logout,
  failRegister,
  failLogin,
  current,
};
