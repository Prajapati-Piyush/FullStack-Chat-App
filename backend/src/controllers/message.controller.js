import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar : ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const sendMessage = async (req, res) => {
  try {
    const { text, media, mediaType } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let mediaUrl;
    // if (image) {
    //   // Upload base64 image to cloudinary
    //   const uploadResponse = await cloudinary.uploader.upload(image);
    //   imageUrl = uploadResponse.secure_url;
    // }


    if (media) {
      if (mediaType === "image") {
        const uploadResponse = await cloudinary.uploader.upload(media, { resource_type: "image" });
        mediaUrl = uploadResponse.secure_url;
      }
      else if (mediaType === "video") {
        const uploadResponse = await cloudinary.uploader.upload(media, { resource_type: "video", resource_type: "auto", });
        mediaUrl = uploadResponse.secure_url;
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      mediaUrl,
      mediaType,
    });
    console.log(newMessage)

    await newMessage.save();


    const recieverSocketId = getRecieverSocketId(receiverId);

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controlller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
