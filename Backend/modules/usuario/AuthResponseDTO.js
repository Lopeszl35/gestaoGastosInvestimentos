import UserPublicDTO from "./UserPublicDTO.js";


export default class AuthResponseDTO {
  constructor(userRow, token) {
    this.user = new UserPublicDTO(userRow);
    this.token = token;
  }
}
