import {Messages} from '../../factoryDAO.js'
import MessagesRepository from './messages.repository.js'

export const  messagesService = new MessagesRepository(new Messages())