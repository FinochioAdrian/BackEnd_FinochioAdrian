# Desafío 19 Clase 46

## Feature Desafío 19
|Feature_Number |  Status        | Action |  Description |
|---------------|----------------|--------|---------|
| 18_06         |   pending      | Modify |  modify /api/users/premium/:uid para que actulize al usuario como premium solo si ha cargado los siguientes documentos identificacion, Comprobante de domicilio, comprobante de estado de cuenta, devolver error indicando que el usuario no ha terminado de procesar su documentacion. |

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
