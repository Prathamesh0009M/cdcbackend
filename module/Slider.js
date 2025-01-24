const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  currentInSlide: [
    {
      type: mongoose.Schema.Types.ObjectId, // Store references as ObjectIds
      required: true,
    },
  ],
  description: [
    {
      type: String, // Store the description of each entry
      required: true,
    },
  ],
});

module.exports = mongoose.model('Slider', sliderSchema);
