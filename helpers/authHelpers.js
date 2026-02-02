const bcrypt = require('bcrypt')

module.exports.hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword;
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.comparePassword = async (password, hashedPassword) => {
    try {
        const comparedPassword = await bcrypt.compare(password, hashedPassword)
        return comparedPassword;
    } catch (error) {
        console.log(error.message)
    }
}