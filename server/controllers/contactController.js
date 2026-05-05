const ContactMessage = require("../models/ContactMessage");

// POST /api/contact — public
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email, and message are required" });
    }
    const msg = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, id: msg._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/contact — admin
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/contact/:id/read — admin
exports.markRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id, { read: true }, { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Not found" });
    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/contact/:id — admin
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
