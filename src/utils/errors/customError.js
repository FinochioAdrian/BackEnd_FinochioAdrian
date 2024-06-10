export default class CustomError extends Error {
    /**
     * 
     * @param {name,cause,message,code} error 
     */
    constructor({name,cause,message,code,status}){
        super(message)
        this.message=message
        this.name=name
        this.cause=cause
        this.code=code || 1
        this.status=status 
    }
    
}