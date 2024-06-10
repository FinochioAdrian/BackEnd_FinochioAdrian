import UserDto from "../user.dto.js";
export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAllUsers = async () => {
    const result = await this.dao.getAllUsers()
    return result
  }
  getUserByEmail = async (email) => {

    const regexEmail = new RegExp(email, 'i')
    const UserEmailToFind = new UserDto({ email: regexEmail });

    const result = await this.dao.getUserByEmail(UserEmailToFind);
    if (!result) return null;
    return new UserDto(result);
  };
  getUserByCreds = async (email, password) => {
    const regexEmail = new RegExp(email, 'i')

    const UserToFind = new UserDto({ email: regexEmail, password });
    const result = await this.dao.getUserByCreds(UserToFind);
    if (!result) return null;
    return new UserDto(result);
  };
  insert = async (userData) => {
    userData.email = userData.email.toLowerCase()

    const UserToInsert = new UserDto(userData);

    const result = await this.dao.insert(UserToInsert);
    if (!result) return null;
    return new UserDto(result);
  };
  update = async (userData) => {
    const UserToInsert = new UserDto(userData);

    const result = await this.dao.updateUser(UserToInsert);
    if (!result) return null;
    return new UserDto(result);
  };
  updateLast_connection = async (userData) => {

    const UserToInsert = new UserDto(userData);
    
    const result = await this.dao.updateLast_connection(UserToInsert);

    if (!result) return null;
    return new UserDto(result);
  };
  updateDocumentation = async (userData) => {

    const UserToInsert = new UserDto(userData);
    
    const result = await this.dao.updateDocumentation(UserToInsert);

    if (!result) return null;
    return new UserDto(result);
  };
  getUserByID = async (id) => {
    const UserToFind = new UserDto({ _id: id });
    const result = await this.dao.getUserByID(UserToFind);
    if (!result) return null;
    return new UserDto(result);
  };
  newPassword = async (user) => {
    const UserToInsert = new UserDto(user);
    const result = await this.dao.newPassword(UserToInsert);
    return result;
  };
}
