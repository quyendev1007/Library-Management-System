import { StatusCodes } from "http-status-codes";
import Category from "../models/category.js";
import Book from "../models/books.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Không có danh mục!", error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select("name");
    if (!category)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy danh mục" });

    const books = await Book.find({ category: category._id });
    res.status(StatusCodes.OK).json({ ...category.toObject(), books });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const newCategory = await new Category(req.body).save();

    if (!newCategory)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Có lỗi xảy ra, vui lòng thử lại sau ít phút." });

    res.status(StatusCodes.CREATED).json(newCategory);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Danh mục không tồn tại" });

    res.status(StatusCodes.OK).json(updatedCategory);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteCategoryAndUpdateBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy danh mục." });
    }

    let defaultCategory = await Category.findOne({ name: "Chưa phân loại" });

    if (!defaultCategory) {
      defaultCategory = await Category.create({
        name: "Chưa phân loại",
        description: "Danh mục cho các sách không rõ thể loại",
      });
    }

    await Book.updateMany(
      { category: id },
      { $set: { category: defaultCategory._id } }
    );

    await Category.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      message: `Đã xoá danh mục và cập nhật sách liên quan về "${defaultCategory.name}"`,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server", error: error.message });
  }
};
