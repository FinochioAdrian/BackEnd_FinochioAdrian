# Desafío Final Tienda Online (Ecommerce)

## Features

|Feature_Number |  Status       | Action |  Description |
|---------------|---------------|--------|--------------|
| 15_*          |   Finished     | Modify |  modify la logica de carrito para que un usuario premiun NO pueda agregar a su carrito un producto que le pertenece|
| 13_*          |   pending     | Modify |  modify customizar errores, crear diccionario errores comunes|
| 14_*          |   pending     | Modify |  modify ruta /loggerTest|
| 18_06         |   Finished     | Modify |  modify /api/users/premium/:uid para que actualize al usuario como premium solo si ha cargado los siguientes documentos identificacion, Comprobante de domicilio, comprobante de estado de cuenta, devolver error indicando que el usuario no ha terminado de procesar su documentacion. |
|19_01          |   Finished   | Add    |In /api/users add router GET / deberá retornar todos los usuarios, solo datos principales (name,email,rol)|
|19_02          |   started   | Add    |In /api/users add router Delete / deberá limpiar a todos los usuarios que no hayan tenido conexión en los utlimos 2 días, Deberá enviar correo indicando al usuario que su cuenta ha sido eliminada por inactividad|
|19_03          |   unstarted   | Add    | View /views/  visualizar , modificar rol, y eliminar|
|19_04          |   unstarted   | Modify | Delete /api/products/:pid para que cuando el producto que se elimina si pertenece a un usuario premiun, le envie un correo indicandole que el producto fue eliminado |
|19_05          |   unstarted   | Update | finalizar las vistas para el flujo completo de compra|
|19_06          |   unstarted   | deploy | realizar el despliegue de tu aplicativo en la plataforma|
| 14_*          |   pending     | Modify |  modify all console.log|
| 16_*          |   pending     | Modify |  modify Documentacion para que fucione con la seguridad e incluya los endpoint add y modify|

## Instalación y configuración del entorno de desarrollo

1. Clonar el folder del repositorio en tu máquina local:
        - git init
        - git remote add origin <https://github.com/FinochioAdrian/Desafios_BackEnd_FinochioAdrian_CoderHouse.git>
        - git config core.sparseCheckout true
        - git sparse-checkout set Desafio19_Clase46
        - git pull origin main

2. Instalar dependencias "npm i"

3. Ejecutar con:
        - inicio Guiado => "npm start";
        - ambiente production => npm run prod
        - ambiente developer => npm run dev
        - ambiente test => npm run test
