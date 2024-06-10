export default class CartDto {
    constructor(cart){
        this._id=cart._id,
        this.products=cart.products||[]
    }
}