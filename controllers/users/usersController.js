const CryptoJS = require("crypto-js");
const connection = require("../../config/db");
const jwt = require('jsonwebtoken');

const login = async (req , res) => {
    const {email , password} = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    try{
        if(!email || !password){
            await res.status(400).json({message: "All fields are required"});
        }else if(!regex.test(email)){
            await res.status(400).json({message: "Invalid email"});
        }else{
            connection.query(`SELECT * FROM users WHERE email = '${email}'` , async (err , result) => {
                if(err){
                    await res.status(400).json({message: "Something went wrong"});
                }else if(result.length == 0){
                    await res.status(400).json({message: "User not found"});
                }else{
                    let bytes  = CryptoJS.AES.decrypt(result[0].password, process.env.SECRET_KEY);
                    let originalPassword = bytes.toString(CryptoJS.enc.Utf8);
                    if(originalPassword == password){
                        const userData = {
                            id: result[0].id,
                        }
                        const authToken = jwt.sign(userData , process.env.SECRET_KEY , {expiresIn: '1h'});
                        await res.status(200).json({message: "User logged in successfully" , data: {authToken}});
                    }else{
                        await res.status(400).json({message: "Invalid password"});
                    }
                }
            })
        }
    }catch(err){
        res.status(400).json({message: "Internal server error"});
    }
}

const register = async (req , res) => {

    const {name , email , password} = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    try{
        if(!name || !email || !password){
            await res.status(400).json({message: "All fields are required"});
        }else if(!regex.test(email)){
            await res.status(400).json({message: "Invalid email"});
        }else{
            connection.query(`SELECT * FROM users WHERE email = '${email}'` , async (err , result) => {
                if(err){
                    await res.status(400).json({message: "Something went wrong"});
                }else if(result.length > 0){
                    await res.status(400).json({message: "Email already exists"});
                }else{
                    const hashPassword = CryptoJS.AES.encrypt(password , process.env.SECRET_KEY).toString();
                    const data = {
                        name,
                        email,
                        password: hashPassword
                    }
                    connection.query(`INSERT INTO users SET ?` , data , async (err , result) => {
                        if(err){
                            await res.status(400).json({message: "Something went wrong"});
                        }else{
                            await res.status(200).json({message: "User created successfully"});
                        }
                    })
                }
            })
        }
    }catch(err){
        res.status(400).json({message: "Internal server error"});
    }
}

const getUser = async (req , res) => {
    const id = req.id;
 // const id = CryptoJS.AES.decrypt(req.header('id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    try{
        if(!id){
            await send.status(400).json({message: "Id is required"});
        }else{
            connection.query(`SELECT * FROM users WHERE id = '${id}'` , async (err , result) => {
                if(err){
                    await res.status(400).json({message: "Something went wrong"});
                }else if(result.length == 0){
                    await res.status(400).json({message: "User not found"});
                }else{
                    await res.status(200).json({message: "User found" , data: result});
                }
            })
        }
    }catch(err){
        res.status(400).json({message: "Internal server error"});
    }
}


module.exports = {
   login,
   register,
   getUser
}