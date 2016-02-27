var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

var matches = [];
var url = 'http://www.livescore.com';


function parseData(str){
    var timeArray = str.split('  ');
    var result = [];
    for (var i = 0; i < timeArray.length; i++) {
        if (timeArray[i]!='') {

                    result.push(timeArray[i].trim());

        };
    };

    return result;
};

setInterval(function(){


request({uri:url, method:'GET', encoding:'binary'},
    function (err, res, page) {
        var $=cheerio.load(page);
       var min=$('div.content > div > div.min').text();
        //var min1=$('div.content > div > div.min');
       var ply=$('div.content > div > div.ply.name').text();
       var sco=$('div.content > div.row-gray > div.sco').text();
        var tour=$('div.content > div.mt4 > div.clear > div.left').text();
        var classDiv=$('div.content > div.cal-wrap').nextAll();
        var scoreLink=$('div.content > div > div.sco > a');
        var dataId=$('div.content > div.row-gray');

        var arTime = parseData(min);
        var arPly = parseData(ply);
        var arScore = parseData(sco);
        var tourData = parseData(tour);

        for(var i = 0; i < arTime.length; i++){
            arTime[i] = arTime[i].replace(/'/, '');
        };

        var dataIdMass = [];
        for (var i = 0; i < dataId.length; i++) {
            dataIdMass.push(parseInt(dataId[i].attribs['data-eid']));
        };
        var tourMass = [];
        var j = 0;
        for (var i = 0; i < classDiv.length; i++) {
            //console.log(classDiv[i].attribs.class);
            if(classDiv[i].attribs.class == 'row row-tall bt0'){
                continue;
            };
            if(classDiv[i].attribs.class == 'row row-tall mt4' && i !== 0 ){
                j++;
                //continue;
            };
            if( classDiv[i].attribs.class !== 'row row-tall mt4' && i !== 0 ){
                //console.log(tourData[j]);
                tourMass.push(tourData[j]);
            };
        };
        //console.log(tourMass);
        var teamHomeMass = [];
        for (var i = 0; i < arPly.length; i++) {
            teamHomeMass.push(arPly[i]);
            i++;
        };
        var teamGuestMass = [];
        for (var i = 0; i < arPly.length; i++) {
                i++;
            teamGuestMass.push(arPly[i]);
        };

        var scoreIdMass = [];
        for (var i = 0; i < scoreLink.length; i++) {
            scoreIdMass.push(scoreLink[i].attribs.href);
        };

                var linkObj = [];
                for(var i = 0; i < dataIdMass.length; i++){

                    for(var j = 0; j < scoreIdMass.length; j++){

                        if (scoreIdMass[j].indexOf(dataIdMass[i]) !== -1) {
                            linkObj[i] = {
                                eId:dataIdMass[i],
                                content:scoreIdMass[j]
                            };
                        };


                    };
                };

                for(var i = 0; i < dataIdMass.length; i++){
                        if (linkObj[i]== null) {
                            linkObj[i] = {
                                eId:dataIdMass[i],
                                content:''
                            };

                    };
                };


         for(var i = 0; i < arTime.length; i++){
           matches[i]={
               eId:dataIdMass[i],
               tournament:tourMass[i],
               teamHome:teamHomeMass[i],
               teamGuest:teamGuestMass[i],
               time:arTime[i],
               score:arScore[i],
               content: function(){
                   if(dataIdMass[i]==linkObj[i].eId){
                       return linkObj[i].content;
                   };
               }()
           };
        };
        console.log(matches);

        fs.writeFile('./src/server/db/matches.json', JSON.stringify(matches, '', 4), function(err){
            if(err){
                console.log(err);
            }else{
                console.log('Файл кэша сохранен');
            }
        });

    });

}, 30000);
