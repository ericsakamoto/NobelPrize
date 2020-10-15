const robots = {
    state: require('./state.js'),
    nobel: require('./nobelprize.js'),
    images: require('./images.js'),
    download: require('./download.js')

  }
  
  async function start() {
    await robots.nobel()
    await robots.images()
    await robots.download()
  }
  
  start()