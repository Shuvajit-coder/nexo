import uploadOnCloudinary from '../config/cloudinary.js'
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import Flick from '../models/flick.model.js'
import { getSocketId, io } from '../socket.js'


export const uploadFlick = async(req, res)=>{
    try {
        const {caption}= req.body
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path)
        }else{

            return res.status(400).json({
                message:"media is required"
            })
        }

        const flick = await Flick.create({
            caption,media,author:req.userId
        })

        const user = await User.findById(req.userId)
        user.flick.push(flick._id)
        await user.save()
        const populatedFlick = await Flick.findById(flick._id).populate("author","name userName profileImage")

        return res.status(201).json(populatedFlick)

    } catch (error) {
        return res.status(500).json({
            message:`uploadFlick error ${error}`
        })
    }
}

export const like = async(req, res)=>{
    try {
        const flickId = req.params.flickId

        const flick = await Flick.findById(flickId)

        if(!flickId){
            return res.status(400).json({
                message:"flick not found"
            })
        }

        const alreadyLiked= flick.likes.some(id=>id.toString() == req.userId.toString())
        if(alreadyLiked){
            flick.likes=flick.likes.filter(id=>id.toString() != req.userId.toString())
        }else{
            flick.likes.push(req.userId)
              if(flick.author._id != req.userId){
                            const notification = await Notification.create({
                                sender:req.userId,
                                receiver:flick.author._id,
                                type:"like",
                                flick:flick._id,
                                message:"Likes your flick  "
                            })
                            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver flick")
                            const receiverSocketId=getSocketId(flick.author._id)
                            if(receiverSocketId){
                                io.to(receiverSocketId).emit("newNotification",populatedNotification)
                            }
                        }
        }

        await flick.save()
         await flick.populate("author","name userName profileImage")
        

            
        io.emit("likedFlick",{
                   flickId:flick._id,
                   likes:flick.likes
               })
           
        return res.status(200).json(flick)

    } catch (error) {
         return res.status(500).json({
            message:`like flick error ${error}`
        })
    }
}

export const comment = async (req,res)=>{
 try {
       const {message} = req.body
       const flickId = req.params.flickId
   
       const flick = await Flick.findById(flickId)
       if(!flick){
               return res.status(400).json({
                   message:"flick not found"
               })
       }
       flick.comments.push({
           author: req.userId,
           message
       })

          if(flick.author._id != req.userId){
                            const notification = await Notification.create({
                                sender:req.userId,
                                receiver:flick.author._id,
                                type:"comment",
                                flick:flick._id,
                                message:"Commented on  your flick  "
                            })
                            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver flick")
                            const receiverSocketId=getSocketId(flick.author._id)
                            if(receiverSocketId){
                                io.to(receiverSocketId).emit("newNotification",populatedNotification)
                            }
                        }


       await flick.save()
       await flick.populate("author","name userName profileImage")
       await flick.populate("comments.author")
        
          
        io.emit("commentedFlick",{
                   flickId:flick._id,
                   comments:flick.comments
               })
           

       return res.status(200).json(flick)
    } catch (error) {
    return res.status(500).json({
            message:`comments flick error ${error}`
        })
    }
}

export const getAllFlicks = async(req,res)=>{
    try {
        const flick = await Flick.find({}).populate("author","name userName profileImage").populate("comments.author")
        

        return res.status(200).json(flick)
    } catch (error) {
         return res.status(500).json({
            message:`getAllFlicks error ${error}`
        })
    }
}