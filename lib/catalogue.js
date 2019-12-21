//
// MetalSmith Custom Local Plugin
//
// loads the catalogue from the JSON file
//
//

const catalogue = require('../data/catalogues.json')
const businessCapabilities = require('../data/business-capabilities.json')
const businessServices = require('../data/business-services.json')
const businessTerms = require('../data/business-terms.json')
const businessProducts = require('../data/business-products.json')
const definitions = require('../data/definitions.json')
const technologyComponents = require('../data/technology-components.json')
var listPages = []

module.exports = function() {
    return function(files, metalsmith, done) {
        setImmediate(done)

        Object.keys(files).forEach(function(file) {
            var data = files[file]
            var filePath = file.replace("/index.md.njk", "")
            var section = data.section

            if (data.catalogue_page) {
                // add specific entries in catalogue to frontmatter data
                data.name = catalogue[data.catalogue_name].name
                var entries = catalogue[data.catalogue_name].entries.filter(function(el) {
                    return el.sub_category === data.catalogue_sub_category
                })
                data.entries = entries

                if (data.entries) {
                    data.entries.forEach(entry => {
                        addEntries(listPages, entry.name, entry.description + " " + entry.category + " " + entry.sub_category, filePath, section)
                    })
                }
            }

            if (data.business_capabilities_page) {
                data.entries = businessCapabilities
                if (data.entries) {
                    data.entries.forEach(entry => {
                        addEntries(listPages, entry.capability, entry.area + " " + entry.location + " " + entry.definition, filePath, section)
                    })
                }
            }

            if (data.business_services_page) {
                data.entries = businessServices

                if (data.entries) {
                    data.entries.forEach(entry => {
                        addEntries(listPages, entry.service, entry.definition, filePath, section)
                    })
                }
            }
            if (data.business_terms_page) {
                data.entries = businessTerms

                if (data.entries) {
                    data.entries.forEach(entry => {
                        addEntries(listPages, entry.term, entry.definition, filePath, section)
                    })
                }
            }
            if (data.business_products_page) {
                data.entries = businessProducts

                if (data.entries) {
                    data.entries.forEach(entry => {
                        addEntries(listPages, entry.product, entry.definition, filePath, section)
                    })
                }

            }
            if (data.definitions_page) {
                data.entries = definitions

                if (data.entries) {
                    data.entries.forEach(entry => {
                        addEntries(listPages, entry.term, entry.meaning, filePath, section)
                    })
                }

            }
            if (data.technology_components_page) {
                data.entries = technologyComponents

                if (data.entries) {
                    data.entries.forEach(entry => {
                        addEntries(listPages, entry.component, entry.description, filePath, section)
                    })
                }

            }
        })

        files["additional-search-items.json"] = {
            contents: JSON.stringify({
                listPages
            })
        }

        done()
    }
}

module.exports.getList = listPages;

function addEntries(list, label, alias, url, section) {
    list.push({
        label: label,
        aliases: alias,
        path: url,
        section: section
    })
}