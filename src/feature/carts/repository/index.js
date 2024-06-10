import {Carts} from '../../factoryDAO.js'
import CartRepository from './carts.repository.js'

export const cartsService = new CartRepository(new Carts())
