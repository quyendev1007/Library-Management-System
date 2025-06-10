import { StatusCodes } from "http-status-codes";
import { Cart } from "../models/cart";

const getAllCardsByUserId = async (req, res) => {
  try {
    const cardsByUserId = await Cart.find({ user: req.params.id }).populate(
      "book"
    );

    res.status(StatusCodes.OK).json(cardsByUserId);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const { user, book } = req.body;

    const existingCartItem = await Cart.findOne({ user: user, book: book });

    if (existingCartItem) {
      if (existingCartItem.quantity < 3) {
        existingCartItem.quantity += 1;
        await existingCartItem.save();
      }

      return res.status(StatusCodes.OK).json(existingCartItem);
    }

    const newCart = await Cart.create(req.body);

    res.status(StatusCodes.CREATED).json(newCart);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user")
      .populate("book");

    res.status(StatusCodes.OK).json(updatedCart);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { ids } = req.body;

    await Cart.deleteMany({ _id: { $in: ids } });

    res.status(StatusCodes.OK).json({
      message: "Xóa thành công các mục đã chọn",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const CartController = {
  getAllCardsByUserId,
  createCart,
  updateCartQuantity,
  deleteCart,
};
