import {Users} from "../../factoryDAO.js";
import UsersRepository from "./users.repository.js";
export const usersService= new UsersRepository(new Users())