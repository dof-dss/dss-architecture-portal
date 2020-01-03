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

//
// JavaScript libraries to call API endpoint
//
const axios = require('axios')
const https = require('https')

//
// load some configuration for use with the API
//
const config = require('../config/config.json')
const environment = process.env.NODE_ENV || 'development';

module.exports = function () {
  return function (files, metalsmith, done) {
    setImmediate(done)
    Object.keys(files).forEach(function (file) {
      var data = files[file]

      if (data.catalogue_page) {
        // add specific entries in catalogue to frontmatter data
        data.name = catalogue[data.catalogue_name].name
        //
        // call an API to get the catalogue entries and ignore https errors for self signed certs
        //
        const agent = new https.Agent({
          rejectUnauthorized: false
        });
        axios.get (config[environment].catalogue_api, { httpsAgent: agent })
          .then (function (response) {
              var entries = response.data.entries.filter(function (el) {
                return el.sub_category === data.catalogue_sub_category
              })
              data.entries = entries
          })
          .catch (function (error) {
            console.log ('ERROR: could not get data from catalogue API:', error)
          })
      }

      if (data.business_capabilities_page) {
        data.entries = businessCapabilities
      }
      if (data.business_services_page) {
        data.entries = businessServices
      }
      if (data.business_terms_page) {
        data.entries = businessTerms
      }
      if (data.business_products_page) {
        data.entries = businessProducts
      }
      if (data.definitions_page) {
        data.entries = definitions
      }
      if (data.technology_components_page) {
        data.entries = technologyComponents
      }
    })
    done()
  }
}
