const connection = require("../../config/db");
const CryptoJS = require("crypto-js");

const getPost = async (req , res) => {
    const id = req.id;
    console.log(id);
    try{
        connection.query(`SELECT * FROM posts WHERE user_id = '${id}'` , async (err , result) => {
            if(err){
                await res.status(400).json({message: "Something went wrong"});
            }else if(result.length == 0){
                await res.status(400).json({message: "Post not found"});
            }else{
                await res.status(200).json({message: "Post found" , data: result , id : id});
            }
        })
    }catch(err){
        res.status(400).json({message: "Internal server error"});
    }
}

const createPost = async (req , res) => {
    const id = req.id;
    const {title , body} = req.body;
    console.log(id);
    try{
        if(!title || !body){
            await res.status(400).json({message: "All fields are required"});
        }else{
            connection.query(`INSERT INTO posts (title , body , user_id) VALUES ('${title}' , '${body}' , '${id}')` , async (err , result) => {
                if(err){
                    await res.status(400).json({message: "Something went wrong"});
                }else{
                    await res.status(200).json({message: "Post created successfully" , data: result , user_id : id});
                }
            })
        }
    }catch(err){
        res.status(400).json({message: "Internal server error"});
    }
}


const deletePost = async (req , res) => {
    const id = req.id;
    const p_id = req.header('post_id');
    const post_id = CryptoJS.AES.decrypt(p_id , process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    try{
        if(!post_id){
            await res.status(400).json({message: "Post id is required"});
        }else{
            connection.query(`SELECT * FROM posts WHERE id = '${post_id}'  and user_id = '${id}'` , async (err , result) => {
                if(err){
                    await res.status(400).json({message: "Something went wrong"});
                }else if(result.length == 0){
                    await res.status(400).json({message: "Post not found"});
                }else{
                    connection.query(`DELETE FROM posts WHERE id = '${post_id}'` , async (err , result) => {
                        if(err){
                            await res.status(400).json({message: "Something went wrong"});
                        }else{
                            await res.status(200).json({message: "Post deleted successfully"});
                        }
                    })
                }
            })
        }
    }catch(err){
        res.status(400).json({message: "Internal server error"});
    }
}

const updatePost = async (req , res) => {
    const id = req.id;
    const p_id = req.header('post_id');
    const post_id = CryptoJS.AES.decrypt(p_id , process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const {title , body} = req.body;
    try{
        if(!post_id){
            await res.status(400).json({message: "Post id is required"});
        }else{
            connection.query(`SELECT * FROM posts WHERE id = '${post_id}' and user_id = '${id}'` , async (err , result) => {
                if(err){
                    await res.status(400).json({message: "Something went wrong"});
                }else if(result.length == 0){
                    await res.status(400).json({message: "Post not found"});
                }else{
                    connection.query(`UPDATE posts SET title = '${title}' , body = '${body}' WHERE id = '${post_id}'` , async (err , result) => {
                        if(err){
                            await res.status(400).json({message: "Something went wrong"});
                        }else{
                            await res.status(200).json({message: "Post updated successfully"});
                        }
                    })
                }
            })
        }
    }catch(err){
        res.status(400).json({message: "Internal server error"});
    }
}

const encryption = async (req , res) => {
    const id = req.header('id');
    const encyptedId = CryptoJS.AES.encrypt(id , process.env.SECRET_KEY).toString();
    res.status(200).json({message: "Encrypted id" , data: encyptedId});
}

module.exports = {
    getPost,
    createPost,
    deletePost,
    updatePost,
    encryption
}