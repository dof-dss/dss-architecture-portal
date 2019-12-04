//
// MetalSmith Custom Local Plugin
//
// loads the catalogue from the JSON file
//
//

const catalogue = require('../data/catalogues.json')

module.exports = function () {
  return function (files, metalsmith, done) {

    setImmediate(done)
    Object.keys(files).forEach(function(file){
      var data = files[file]
      if (data.catalogue_page) {
        // add specific entries in catalogue to frontmatter data
        data.name = catalogue[data.catalogue_name].name
        var entries = catalogue[data.catalogue_name].entries.filter(function (el) {
          return el.sub_category == data.catalogue_sub_category
        })
        data.entries = entries
      }
    })
    done()
  }
}
