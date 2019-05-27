class User {
    constructor(email) {
        this.email = email
    }
   static getEmail() {
        return this.email
    }
}

export default User;