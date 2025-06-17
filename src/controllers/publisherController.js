import { StatusCodes } from "http-status-codes";
import Publisher from "../models/publisher.js"; // Điều chỉnh path nếu cần

// Hiển thị nhà xuất bản
export const getAllPublishers = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 5,
      sortBy = "name",
      order = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const sortOrder = order === "desc" ? -1 : 1;

    const sortOptions = {};
    if (sortBy === "name") sortOptions[sortBy] = sortOrder;

    const query = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {};

    const [totalDocuments, publishers] = await Promise.all([
      Publisher.countDocuments(query),
      Publisher.find(query).sort(sortOptions).limit(limit).skip(skip),
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    if (page < 1 || page > totalPages)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Khong tim thay nha xuat ban ban muon",
      });

    res
      .status(StatusCodes.OK)
      .json({ publishers, totalPages, currentPage: page, totalDocuments });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Không có nhà xuất bản!", error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    console.log("object");
    const publishers = await Publisher.find();

    if (publishers.length === 0)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "khong co ban ghi nao",
      });

    res.status(StatusCodes.OK).json(publishers);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error!", error: error.message });
  }
};

export const getPublisherById = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản!" });
    }
    res.status(200).json(publisher);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Không có nhà xuất bản!", error: error.message });
  }
};

// Thêm nhà xuất bản
export const createPublisher = async (req, res) => {
  try {
    const publisher = new Publisher(req.body);
    const savedPublisher = await publisher.save();
    res.status(201).json(savedPublisher);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Thêm không thành công!", error: error.message });
  }
};

// UPDATE nhà xuất bản
export const updatePublisher = async (req, res) => {
  try {
    const updatedPublisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPublisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản !" });
    }
    res.status(200).json(updatedPublisher);
  } catch (error) {
    res.status(400).json({ message: "Update thất bại!", error: error.message });
  }
};

// xóa nhà xuất bản
export const deletePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy NXB." });
    }

    let defaultPublisher = await Publisher.findOne({ name: "Không rõ" });

    if (!defaultPublisher) {
      defaultPublisher = await Publisher.create({
        name: "Không rõ",
      });
    }

    await Book.updateMany(
      { publisher: id },
      { $set: { publisher: defaultPublisher._id } }
    );

    await Publisher.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      message: "Đã xoá NXB",
    });
  } catch (error) {
    res.status(500).json({ message: "Delete thất bại!", error: error.message });
  }
};
