import TicketRepository from "./tickets.repository.js";
import {Tickets} from '../../factoryDAO.js'


export const ticketsService = new TicketRepository (new Tickets())