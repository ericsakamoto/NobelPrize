const imageDownloader = require('image-downloader')
const state = require('./state.js')

async function robot() {
    console.log('> [Download Module] Starting...')
    
    var content = state.load()
  
    //console.log(content)
  
    await downloadAllImages(JSON.parse(content))

    async function downloadAllImages(content) {
        
        for (i = 0; i < content.laureates.length; i++) {
            console.log(content.laureates[i].knownName);
            var url = content.laureates[i].imageurl;
            var filename = "physicsnobelprize-" +
                           content.laureates[i].awardYear + "-" +
                           content.laureates[i].id + ".png";
            
            console.log(filename);
            if(url.length != 0) {
                console.log("Downloading " + url);
                await downloadAndSave(url[0], filename);
            } else {
                console.log("No image");
            }
        }
    }
    
    async function downloadAndSave(url, fileName) {
        return imageDownloader.image({
            url: url,
            dest: `./content/${fileName}`
        })
    }
}

module.exports = robot