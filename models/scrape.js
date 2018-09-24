const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ScrapeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "comment"
    }
});
const Scraping = mongoose.model("Scraping", ScrapeSchema);

module.exports = Scraping;