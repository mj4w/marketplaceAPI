import dotenv from 'dotenv'
dotenv.config()



const environment = {
    port: process.env.PORT,
    mongo_uri: `mongodb+srv://${process.env.HOST_NAME}:${process.env.HOST_PASS}@fiverrbe.rhksrxa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=FiverrBE`,
    access_token: process.env.ACCESS_TOKEN_KEY,
    refresh_token: process.env.REFRESH_TOKEN_KEY,
    reset_token: process.env.RESET_TOKEN_KEY,
    user_email: process.env.USER_EMAIL,
    app_pass: process.env.APP_PASS,

}


export default environment