const fetch = require('node-fetch');
const state = require('./state.js')

const NOBELPRIZEAPIURL = "http://api.nobelprize.org/2.0/nobelPrize/phy/"

async function robot() {
    console.log('> [Nobel Prize Module] Starting...');

    const content = await fetchAllPhysicsNobelPrizeLaureates();

    state.save(content);

    console.log('> [Nobel Prize Module] Finishing...');

    async function fetchAllPhysicsNobelPrizeLaureates() {
        // For each year, get laureates, since 1901 to 2019
        const nobel = {};
        nobel.laureates = [];
        /*
            >>> 1901 a 1905 - OK
            >>> 1906 a 1930 - OK
            >>> 1931 a 1960 - OK
            >>> 1961 a 1990 - OK
            >>> 1991 a 2019
        */
        for (year=1991;year<=2019;year++) {
            
            const resp = await fetch(NOBELPRIZEAPIURL + "/" + year);
            const respData = await resp.json();
        
            console.log(respData);

            const awardYear = respData[0].awardYear;

            if (typeof respData[0].laureates !== 'undefined') {
                respData[0].laureates.forEach((laureate) => {
                    var l = new Object();
                    l.awardYear = awardYear;
                    l.knownName = laureate.knownName.en;
                    l.id = laureate.id;
                    nobel.laureates.push(l);
                });
            } else {
                var l = new Object();
                l.awardYear = awardYear;
                l.knownName = "";
                l.id = "";
                nobel.laureates.push(l);
            }
        }
        var jsonString= JSON.stringify(nobel);
        console.log(jsonString);
        var jsonObj = JSON.parse(jsonString)
        console.log(jsonObj);
        return jsonString;
    }
}  

module.exports = robot