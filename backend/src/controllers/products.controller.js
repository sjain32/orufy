import Product from "../Models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const product = new Product({
      ...req.body,
      createdBy: req.user._id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    const { published, search } = req.query;

    const filter = { createdBy: req.user._id };

    if (published !== undefined) {
      filter.published = published === "true";
    }

    if (search) {
      filter.$or = [
        { Name: { $regex: search, $options: "i" } },
        { Brand_Name: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.published = !product.published;
    await product.save();

    res.json({ product });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};
