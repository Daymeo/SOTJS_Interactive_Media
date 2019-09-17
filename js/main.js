var oWidth = 20;
var oHeight = 10; //Ocean Height (in ellipses)

var theta = 0.0; // stores the current angle of the wave
var amplitude = 9.0; //The height of the waves
var frequency = 0.2; //Not used but you could increase 'theta' by 'period/1000' to change the wave speed.  if you divide this by
var objectX = 0;
var objectY = 0;
var gradient = 155 / oHeight;
var xObjectLocation = 10; //Stores the y location (on the scope of oWidth) of the tweet
var yObjectLocation = 5; //Stores the y location (in the scope of the oHeight) of the tweet
var hostname = 'localhost'; //TODO: Add VPS ip so it runs on the VPS
var hairline;


/*
~~~~~~~~~~~~~~~~GLOBAL VARIABLES~~~~~~~~~~~~~~~~~~~~~``
*/

//Global OBJECTS (to render)
var boatManager;
var trumpBallon, clintonBalloon;
var trumpTweet, clintonTweet;
var trumpDisplay, clintonDisplay; //stores the names of the candidate objects in global namespace;
var clintonTweet, trumpTweet;
var clintonSpeech, trumpSpeech;
var comparer;
var trumpObject;
var clintonObject;

//Global DATA OBJECTS (to get information from, just console.log(pollData); to explore them)
var pollData;
var trumpUserObject, clintonUserObject;
var trumpTimeline, clintonTimeline;
var tweets = new Array(0);

//Global VARIABLES (to refer to)
var tweetCount = 100; //keeps track of which tweet will be displayed on either side, also number of tweets to get from API
var maxTweets = tweetCount;
var speed; //This stores the speed of the waves once calculated
var xSpacing;
var ySpacing;
var majorities; // used to render where the markers show up, set to 477
var oceanMajorities;  //this is just the 'majorities' variable mapped to oWidth (ocean width) so the ocean can be calculated faster
var wonLastRound = 'clinton'; //stores who won the previous round so that the ordering of tweets can change

//Global LISTS (to itterate through)
var trumpImgArray = [];
var clintonImgArray = [];
var scene = [];
//var trumpConfettiArray = [];
//var clintonConfettiArray = [];
var guiCounter = 0;

//Global MEDIA (to display/play)
var pop; // mp3 of the pop sound when the tweets are displayed
var waves;  //wave sound in bacckground
var wawa;

function preload(){
    //load all necessary resources
    imgTrumpDefault = [loadImage('img/trump_default.png')];
    imgTrumpTalkingArray = [loadImage('img/trump_frame_1.png'),
                    loadImage('img/trump_frame_3.png'),
                    loadImage('img/trump_frame_2.png'),
                    loadImage('img/trump_frame_1.png')];
    imgTrumpCryingArray = [loadImage('img/trump_crying_1.png'),
                        loadImage('img/trump_crying_2.png'),
                        loadImage('img/trump_crying_3.png')];
    imgTrumpLaughingArray = [loadImage('img/trump_laughing_1.png'),
                        loadImage('img/trump_laughing_2.png'),
                        loadImage('img/trump_laughing_3.png')];
    imgClintonDefault = [loadImage('img/clinton_default.png')];
    clintonTalkingArray = [loadImage('img/clinton_frame_1.png'),
                    loadImage('img/clinton_frame_3.png'),
                    loadImage('img/clinton_frame_2.png'),
                    loadImage('img/clinton_frame_1.png')];
    clintonCryingArray = [loadImage('img/clinton_crying_3.png'),
                          loadImage('img/clinton_crying_2.png'),
                          loadImage('img/clinton_crying_1.png')];
    clintonLaughingArray = [loadImage('img/clinton_laughing_3.png'),
                            loadImage('img/clinton_laughing_2.png'),
                            loadImage('img/clinton_laughing_1.png')];


    trumpConfettiArray = [loadImage('img/confetti_trump_1.png'),
                          loadImage('img/confetti_trump_2.png'),
                          loadImage('img/confetti_trump_3.png')];
    clintonConfettiArray = [loadImage('img/confetti_clinton_1.png'),
                            loadImage('img/confetti_clinton_2.png'),
                            loadImage('img/confetti_clinton_3.png')];

    imgTrumpBoat = loadImage('img/boat_trump.png');
    imgClintonBoat = loadImage('img/boat_clinton.png');
    imgTrumpBoatWOMask = loadImage('img/boat_trump_without_mast.png');
    imgClintonBoatWOMask = loadImage('img/boat_clinton_without_mast.png');

    imgPersonArray = [loadImage('img/person_1.png'),
                      loadImage('img/person_2.png'),
                      loadImage('img/person_1.png'),
                      loadImage('img/person_3.png')];

    imgTrumpBalloonArray = [loadImage('img/balloon_trump.png'),
                            loadImage('img/balloon_trump_deflated_2.png')];
    imgClintonBalloonArray = [loadImage('img/balloon_clinton.png'),
                              loadImage('img/balloon_clinton_deflated_2.png')];
    imgSpeakerTableTrump = loadImage('img/speaker_table_trump.png');
    imgSpeakerTableClinton = loadImage('img/speaker_table_clinton.png');


    imgCloudTrump = loadImage('img/cloud_trump.png');
    imgCloudClinton = loadImage('img/cloud_clinton.png');

    imgBackground = loadImage('img/background.png');

    pop = loadSound('sounds/pop.mp3');
    waves = loadSound('sounds/waves.wav');
    wawa = loadSound('sounds/wawa.mp3');
}

function setup() {
    var canvas = createCanvas(1920, 1080);
    canvas.parent('canvas-container'); //Places it in the right div in the page
    frameRate(30);
    background(20, 20, 20);
    noStroke();
    hairline = loadFont('geomancy_hairline.otf');


    xSpacing = width / oWidth; //'width' isn't initialised until AFTER createCavas so we can't put it at the top :
    ySpacing = height / oHeight / 2; //'height' isn't initialised until AFTER createCavas so we can't put it at the top :
    speed = (frequency * 1000) / 1000; //Divides period by ms

    //Get all required data
    trumpTimeline = getUserTimeline('realDonaldTrump', tweetCount);
    clintonTimeline = getUserTimeline('HillaryClinton', tweetCount);
    pollData = getPollData();
    trumpUserObject = getUserObject('realDonaldTrump');
    clintonUserObject = getUserObject('HillaryClinton');
    tweetCount = 0; //resets tweet count so we can use it as an indexer

    trumpObject = new CandidateFigure(1440,-420,100,0,'conservative',trumpImgArray, trumpUserObject);
    clintonObject = new CandidateFigure(-100, -420, 100,0,'democratic', clintonImgArray, clintonUserObject);
    trumpObject.stopJabber();
    clintonObject.stopJabber();

    //Check if all data has been received
    var checkTimeline = setInterval(function(){
        if(trumpTimeline.readyState==4&&clintonTimeline.readyState==4&&pollData.readyState==4&&trumpUserObject.readyState==4&&clintonUserObject.readyState==4){
            initializeScene();
            clearInterval(checkTimeline);
        }
    },1000);
}
/**
 * This will only run once all necessary data has been received.
 * This builds scene and starts the event loop.
 * @return {[type]} [description]
 */
function initializeScene(){
    tweetCount = 0;

    trumpUserObject = JSON.parse(trumpUserObject.responseText);
    trumpTimeline = JSON.parse(trumpTimeline.responseText);

    clintonUserObject = JSON.parse(clintonUserObject.responseText);
    clintonTimeline = JSON.parse(clintonTimeline.responseText);


    pollData = JSON.parse(pollData.responseText);
    oceanMajorities =   [Math.round((pollData[53].estimates[0].value)/5),
                        Math.round((pollData[53].estimates[2].value)/5),
                        Math.round((pollData[53].estimates[1].value)/5)];
    majorities = [(pollData[53].estimates[0].value),
                  (pollData[53].estimates[2].value),
                  (pollData[53].estimates[1].value)];
    console.log("majorities:  "+majorities);
    waves.loop();

    /*
     *  SCENE CONSTRUCTOR
     */
    //scene.push(new Boat(new Boat(1000,300,6000,0,'conservative')));
    for (var z = 0; z < oHeight; z++) {
        scene.push(new OceanRow(1,z*5,z*ySpacing,1));
        //console.log('Creating a new ocean row at '+z*ySpacing);
    }
    //creates the trump Oject and gives it the tweet and speech objects as children.
    trumpDisplay = insertObject(trumpObject);
    //trumpTweet = displayTweet(trumpTimeline[0],'left');
    trumpSpeech = insertObject(new SpeechBubble(1440,-320,120,0,'conservative'));

    //creates the clinton object and gives it the tweet and sspeach objects as children
    clintonDisplay = insertObject(clintonObject);
    //clintonTweet = displayTweet(clintonTimeline[0],'right');
    clintonSpeech = insertObject(new SpeechBubble(500,-380,120,0,'democratic'));
    //insertObject(new Boat(1000,0,300,0,'conservative'));
    boatManager = insertObject(new BoatManager(0,0,0,0,trumpUserObject[0].followers_count, clintonUserObject[0].followers_count));

    trumpBalloon = insertObject(new Balloon(width/1.85, 600, 400, 0,'conservative'));
    clintonBalloon = insertObject(new Balloon(width/3, 600, 400, 0, 'democratic'));

    comparer = insertObject(new GreaterThan(width/1.95 ,-200,200,0));
    $('#trump-tweet').css('display','none');
    $('#clinton-tweet').css('display','none');

    //console.log(boatTest);
    console.log(scene);

    //creates the majority marker for all sides
    //
    cloud = insertObject(new CloudManager(0,-650,0,0));

    insertObject(new MajorityMarker(0,0,500,0,'democrat',true));
    insertObject(new MajorityMarker(0,0,500,0,'conservative',true));

    //Do this last because it relies on the scene array not being deleted after;
    boatManager.generateBoats();
    setTimeout(function(){
      eventLoop();
      setInterval(function(){
        eventLoop();
      },44000);
    },5000);

}

function eventLoop(){
  console.log('new  eventLoop initiating, current tweetCount  = '+tweetCount+'| wonLast = '+wonLastRound);
  clintonObject.stopJabber();
  trumpObject.stopJabber();
  if(wonLastRound=="clinton"){
    //Trump's actions
    trumpDisplay.startJabber();
    setTimeout(function(){
      trumpSpeech.grow();
    setTimeout(function(){
      trumpDisplay.stopJabber();
      boatManager.trumpSupport(trumpTimeline[tweetCount].retweet_count);
    setTimeout(function(){
    setTimeout(function(){
      trumpBalloon.countScore(boatManager.trumpBoats);
      trumpSpeech.shrink();
    setTimeout(function(){
      //Clinton's actions
      clintonDisplay.startJabber();
    setTimeout(function(){
      clintonSpeech.grow();
    setTimeout(function(){
      clintonDisplay.stopJabber();
      boatManager.clintonSupport(clintonTimeline[tweetCount].retweet_count);
    setTimeout(function(){

    setTimeout(function(){
      clintonBalloon.countScore(boatManager.clintonBoats);
      clintonSpeech.shrink();
    setTimeout(function(){
      wonLastRound = comparer.compare(clintonBalloon.retweetCount, trumpBalloon.retweetCount);
      cloud.updateData(trumpTimeline[tweetCount].retweet_count, clintonTimeline[tweetCount].retweet_count);
    setTimeout(function(){
      if(wonLastRound=="trump"){
        clintonBalloon.deflate();
        trumpBalloon.confetti();
      } else {
        trumpBalloon.deflate();
        clintonBalloon.confetti();
      }
    setTimeout(function(){
      if(wonLastRound=="trump"){
        trumpBalloon.triumph();
      } else {
        clintonBalloon.triumph();
      }

    setTimeout(function(){
      boatManager.reset();
      cleanUp();
    },5000);
    },4000);
    },4000);
    },3000);
    },1000);
    },5000);
    },5000);
    },1000);
    },1000);
    },1000);
    },5000); //stop talking --> balloon starts raising
    },5000); //tweet being displayed --> stop talking and boats showing support
    },1000); //start talking --> display speechbubble
  } else {
    //clintons's actions
    clintonDisplay.startJabber();
    setTimeout(function(){
      clintonSpeech.grow();
    setTimeout(function(){
      clintonDisplay.stopJabber();
      boatManager.clintonSupport(clintonTimeline[tweetCount].retweet_count);
    setTimeout(function(){

    setTimeout(function(){
      clintonBalloon.countScore(boatManager.clintonBoats);
      clintonSpeech.shrink();
    setTimeout(function(){
      //trumps's actions
      trumpDisplay.startJabber();
    setTimeout(function(){
      trumpSpeech.grow();
    setTimeout(function(){
      trumpDisplay.stopJabber();
      boatManager.trumpSupport(trumpTimeline[tweetCount].retweet_count);
    setTimeout(function(){

    setTimeout(function(){
      trumpBalloon.countScore(boatManager.trumpBoats);
      trumpSpeech.shrink();
    setTimeout(function(){
      wonLastRound = comparer.compare(clintonBalloon.retweetCount, trumpBalloon.retweetCount);
      cloud.updateData(trumpTimeline[tweetCount].retweet_count, clintonTimeline[tweetCount].retweet_count);
    setTimeout(function(){
      comparer.reset();
      if(wonLastRound=="trump"){
        clintonBalloon.deflate();
      } else {
        trumpBalloon.deflate();
      }
    setTimeout(function(){
      if(wonLastRound=="trump"){
        trumpBalloon.triumph();
      } else {
        clintonBalloon.triumph();
      }
    setTimeout(function(){
      boatManager.reset();
      cleanUp();
    },5000);
    },4000);
    },4000);
    },3000);
    },1000);
    },5000);
    },5000);
    },1000);
    },1000);
    },1000);
    },5000); //stop talking --> balloon starts raising
    },5000); //tweet being displayed --> stop talking and boats showing support
    },1000); //start talking --> display speechbubble
  }
  function cleanUp(){
    tweetCount++;
    if(tweetCount>=100){
      location.reload();  //reloads the page, we could have a thank you message if we have time :)
    }
    clintonBalloon.reset();
    trumpBalloon.reset();
    boatManager.reset();
    $('#clinton-tweet').remove();
    $('#trump-tweet').remove();
  }
}

function resetScene(){

}

function draw() {
    background('#7FB2F0');
    image(imgBackground,0,0);
    translate(width * 0.025, height / 1.8); //The ocean is offset a really arbitrary ammount so it fits on the screen
    theta += speed;
    sceneObjectRender();
    function sceneObjectRender(){
        for(var i = 0; i < scene.length;i++){
            scene[i].render();
        }
    }
    if(guiCounter < 90 ){
      image(imgTrumpBoat,-30, 370,174/2,210/2);
    } else {
      image(imgClintonBoat,-30, 370,174/2,210/2);
      if(guiCounter > 180){
        guiCounter = 0;
      }
    }
    textSize(20);
    textFont('Helvetica');
    textAlign(LEFT);
    fill('255');
    text('100,000',-30,335);
    text('followers',-30,365);
    guiCounter++;
}
