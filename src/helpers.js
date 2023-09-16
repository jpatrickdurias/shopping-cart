const fs = require('fs')

module.exports = {
  getPromos: function() {
    const jsonFile = fs.readFileSync("./config/Promos.json")
    return JSON.parse(jsonFile)
  },
  getPricing: function() {
    const jsonFile = fs.readFileSync("./config/ItemPrices.json")
    return JSON.parse(jsonFile)
  }
}
