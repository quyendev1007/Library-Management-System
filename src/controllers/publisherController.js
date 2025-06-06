import Publisher from "../models/publisher.js"; // Điều chỉnh path nếu cần

// Hiển thị nhà xuất bản
export const getAllPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find();
    res.status(200).json(publishers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Không có nhà xuất bản!", error: error.message });
  }
};
// Hiển thị nhà xuất bản theo id
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
    const deletedPublisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!deletedPublisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản!" });
    }
    res.status(200).json({ message: "Xóa Thành Công!" });
  } catch (error) {
    res.status(500).json({ message: "Delete thất bại!", error: error.message });
  }
};
