import { Command } from "commander";
import Inquirer from "inquirer";
import {spawn} from 'child_process'

const program = new Command()

program
  .option('-p, --port <port>', 'Specify port number')
  .option('-m, --mode <mode>', 'Specify mode')
  .parse(process.argv);

const questions = [
  {
    type: 'input',
    name: 'port',
    message: 'Enter port number:',
    default: program.opts().port || 3000, // Valor por defecto o el proporcionado por Commander
  },

  {
    type: 'list',
    name: 'mode',
    message: 'Enter work mode:',
    choices:["production","development"],
    default: program.opts().mode || 'development', // Valor por defecto o el proporcionado por Commander
  },
];

async function start() {

  const answers = await Inquirer.prompt(questions);

  const { port, mode } = answers;

  // Ejecutar el script index.js en un proceso secundario
  
  const childProcess = spawn("node", ['./index.js'], {
    stdio: 'inherit', // Utiliza los mismos flujos de entrada/salida que el proceso principal
    env: {
      ...process.env, // Copia las variables de entorno del proceso principal
      PORT: port, // Pasa el puerto como variable de entorno al proceso secundario
      NODE_ENV: mode, // Pasa el modo como variable de entorno al proceso secundario
    },
  });

  // Escuchar eventos del proceso secundario
  childProcess.on('exit', (code, signal) => {
    console.log(`Child process exited with code ${code} and signal ${signal}`);
  });

  // Finalizar el proceso principal después de iniciar el secundario
 /*  process.exit(); */
}

start();






