import { StatusCodes } from "http-status-codes";
import { Cart } from "../models/cart";
import BorrowRecord from "../models/borrowRecord";

const getAllCardsByUserId = async (req, res) => {
  try {
    const cardsByUserId = await Cart.find({ user: req.params.id }).populate({
      path: "book",
      populate: [
        {
          path: "author",
          select: "name -_id",
        },
        {
          path: "publisher",
          select: "name -_id",
        },
        {
          path: "category",
          select: "name -_id",
        },
      ],
    });
    res.status(StatusCodes.OK).json(cardsByUserId);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const { book } = req.body;
    const userId = req.jwtDecoded.id;

    const borrowed = await BorrowRecord.findOne({
      user: userId,
      book,
      status: { $ne: "returned" },
    });
    if (borrowed) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ message: "Sách này bạn mượn chưa trả" });
    }

    const existingCartItem = await Cart.findOne({ user: userId, book: book });
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
    const { quantity } = req.query;

    const cart = await Cart.findById(req.params.id);

    if (quantity === "increase") {
      if (cart.quantity >= 3) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Bạn chỉ có thể mượn tối đa 3 bản mỗi sách" });
      }
      cart.quantity += 1;
    } else if (quantity === "decrease") {
      cart.quantity = Math.max(1, cart.quantity - 1);
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "URL không hợp lệ" });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("book");

    res.status(StatusCodes.OK).json(updatedCart);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.OK).json({
      message: "Xóa thành công",
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
