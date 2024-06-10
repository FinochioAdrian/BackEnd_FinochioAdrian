 import passport from "passport";
 const passportCall = (strategy,options={}) =>{
    const { session = false ,failureRedirect="/",failureFlash } = options;
  
   
    return async (req,res,next) => {

      passport.authenticate(strategy,{session,failureRedirect,failureFlash},function(err,user,info){
          
          if(err)return next(err);
          if(!user){
           
          if(req.accepts("html")&&req.path=="/login",req.method=="GET") {
            return next ()
          }
          /* Redirige a la direccion fe failureRedirect si acepta html  */
          if(req.accepts("html")&&failureRedirect) {
            failureFlash && req.flash(info?.type||"error", info?.message||info);
            return res.redirect(failureRedirect)
          }
           
          return res.status(401).send({error:info.messages||info})
        }
        req.user= user;
        
        next()
      })(req,res,next)
    }
  }

  export default passportCall