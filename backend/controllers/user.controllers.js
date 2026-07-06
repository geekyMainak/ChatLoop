import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Current user error: ${error.message}`,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (userName) updateData.userName = userName;
    if (image) updateData.image = image;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      {
        new: true,
      }
    ).select("-password");

    console.log("editProfile req.userId:", req.userId);
    console.log("editProfile user found:", user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Profile error ${error}`,
    });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: `Get other users error ${error}`,
    });
  }
};