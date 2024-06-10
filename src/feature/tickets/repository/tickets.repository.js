import TicketDTO from "../ticket.dto.js";
export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
  get = async () => {
    const result = await this.dao.get();
    return result ? new TicketDTO(result) : result;
  };
  create = async (ticket) => {
    const ticketToInsert = new TicketDTO(ticket);
    return await this.dao.create(ticketToInsert);
  };
}
