
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state.js')

const googleSearchCredentials = require('./credentials/google-search.json')

async function robot() {
  console.log('> [Image Module] Starting...')
  
  var content = state.load()

  //console.log(content)

  content = await fetchImagesOfNobelPrizes(JSON.parse(content))
  
  //console.log(content);
  
  state.save(content)

  
  // Get images
  async function fetchImagesOfNobelPrizes(content) {

    //console.log(content);
    
    for(let i = 0; i < content.laureates.length; i++) {
      let awardYear = content.laureates[i].awardYear;
      let knownName = content.laureates[i].knownName;
      if (knownName.length != 0) {
        query = knownName;
        console.log(`> [image-robot] Querying Google Images with: "${query}"`)
        sentenceIndex = 0;
        const result = await fetchGoogleAndReturnImagesLinks(query);
        //const result = "https://www.nobelprize.org/images/lorentz-13546-portrait-medium.jpg"
        console.log(awardYear + " -  " + knownName + " - " + result);
        content.laureates[i].imageurl = result;
      } else {
        console.log("No image");
        content.laureates[i].imageurl = "";
      }
    }
    
    //console.log(content);

    return JSON.stringify(content);
  }

  async function fetchGoogleAndReturnImagesLinks(query) {
    const response = await customSearch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: 'image',
      num: 1
    })

    const imagesUrl = response.data.items.map((item) => {
      return item.link
    })

    return imagesUrl
  }

}

module.exports = robot