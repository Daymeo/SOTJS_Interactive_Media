var hostname = '';

//var hostname = 'localhost';

/**
 * Gets the most recent tweets of a twitter account
 * @param  string screen_name enter the unique screen_name i.e @realDonaldTrump
 * @param  int count       number of tweets you want
 * @return array             An array of all the data twitter returns, notably the tweet text, profile  url and number of retweets.
 */

function getPollData(){
    return $.ajax({
        type: 'GET',
        url: '/cache/2016-president.json',
    });
}

function getUserTimeline(screen_name, count) {
    return $.ajax({
        type: 'GET',
        url: `/cache/timeline_${screen_name}.json`,
        success: function(returnData) {
            obj = jQuery.parseJSON(JSON.stringify(returnData));
            console.log(screen_name+'timeline got');
        }
    });

}

function getUserObject(screen_name) {
    return $.ajax({
        type: 'GET',
        url: `/cache/user_${screen_name}.json`,
    });

}

/**
 * Displays a tweet on the left or right side of the screen
 * @param  object tweet this is the tweet object from the array of getUserTimeline(), i.e. userTimeline[0] will render first tweet
 * @param  string side  'left' or 'right' hardcoded to fit in the speach bubbles
 * @return object       returns an object (variable) of the tweet.  This lets us do var trumpTweet=(userTimeline[0], 'left'); and then trumpTweet.remove(); to delete it from the scene.
 */
function displayTweet(tweet,side){
    console.log('displaying tweet', tweet);
    var tweetObject;
    if(side==='left'){
        tweetObject = $('<div id="trump-tweet"></div>');
    } else {
        tweetObject = $('<div id="clinton-tweet"></div>');
    }
    var domTweet =
    "<div class='tweet-container timeline-Tweet  u-cf js-tweetIdInfo' data-tweet-id='774337407692832769' data-rendered-tweet-id='774337407692832769' data-scribe='component:tweet'>"
    +"<div class='timeline-Tweet-brand u-floatRight'><div class='Icon Icon--twitter ' aria-label='' title='' role='presentation'></div></div>"
    +"<div class='timeline-Tweet-author'>"
    +"<div class='TweetAuthor' data-scribe='component:author'>"
    +"<a class='TweetAuthor-link Identity u-linkBlend' data-scribe='element:user_link' href='https://twitter.com/TwitterDev' aria-label='TwitterDev (screen name: TwitterDev)'>"
    +"<span class='TweetAuthor-avatar Identity-avatar'>"
    +"<img class='Avatar' data-scribe='element:avatar' src='"+tweet['user']['profile_image_url']+"'>"
    +"</span>"
    +"<span class='TweetAuthor-name Identity-name customisable-highlight' title='TwitterDev' data-scribe='element:name'>"+tweet['user']['name']+"</span>"
    +"<span class='TweetAuthor-verifiedBadge' data-scribe='element:verified_badge'><div class='Icon Icon--verified ' aria-label='Verified Account' title='Verified Account' role='img'></div><b class='u-hiddenVisually'>✔</b></span>"
    +"<span class='TweetAuthor-screenName Identity-screenName' title='@TwitterDev' data-scribe='element:screen_name' dir='ltr'>@"+"</span>"
    +"</a>"
    +"</div>"
    +"</div>"
    +"<p class='timeline-Tweet-text' lang='en' dir='ltr'>";
    try {
        domTweet+=tweet.retweeted_status.text;
    } catch (e) {
        domTweet+=tweet.text;
    }
    domTweet+="</p>"
    +"<div class='timeline-Tweet-metadata'>"
    +"<a href='https://twitter.com/TwitterDev/status/774337407692832769' class='timeline-Tweet-timestamp' data-scribe='element:mini_timestamp'>"
    +"<time class='dt-updated' datetime='2016-09-09T20:03:19+0000' pubdate='' title='Time posted: 09 Sep 2016, 20:03:19 (UTC)' aria-label='Posted on 09 Sep'> 09 Sep</time></a>"
    +"</div>"
    +"<ul class='timeline-Tweet-actions' data-scribe='component:actions' role='menu' aria-label='Tweet actions'>"
    +"<li class='timeline-Tweet-action'>"
    +"<a class='TweetAction TweetAction--heart web-intent' href='https://twitter.com/intent/like?tweet_id=774337407692832769' data-scribe='element:heart'><div class='Icon Icon--heart TweetAction-icon' aria-label='Like' title='Like' role='img'></div></a></li>"
    +"<li class='timeline-Tweet-action timeline-ShareMenu'>"
    +"<a class='TweetAction TweetAction--share js-showShareMenu' href='#' aria-haspopup='true' data-scribe='component:share'><div class='Icon Icon--share ' aria-label='Share Tweet' title='Share Tweet' role='img'></div></a>"
    +"<div class='timeline-ShareMenu-container'>"
    +"<div class='timeline-ShareMenu-caret'></div>"
    +"<h3 class='timeline-ShareMenu-title'>Share on</h3>"
    +"<ul role='menu'>"
    +"<li><a class='timeline-ShareMenu-option' href='https://twitter.com/intent/retweet?tweet_id=774337407692832769' role='menuitem' data-scribe='element:twitter'>Twitter</a></li>"
    +"<li><a class='timeline-ShareMenu-option' href='https://facebook.com/dialog/share?app_id=2231777543&amp;display=popup&amp;href=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:facebook'>Facebook</a></li>"
    +"<li><a class='timeline-ShareMenu-option' href='https://linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:linkedin'>LinkedIn</a></li>"
    +"<li><a class='timeline-ShareMenu-option' href='https://tumblr.com/widgets/share/tool?canonicalUrl=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:tumblr'>Tumblr</a></li>"
    +"</ul>"
    +"</div>"
    +"</li>"
    +"</ul>";
    tweetObject.append(domTweet).appendTo('body');
    tweetObject.fadeIn(100);
    return tweetObject;
}

/**
 * [insertObject description]
 * @param  object object this function inserts scene objects into the scene[] in order using the z variable of the object.
 * @return {[type]}        returns a pointer to the object so you can run scene.splice()
 */
function insertObject(object,returnIndex){
    //console.log(scene);
    lastZ = scene[0].z;
    for (var i = 1; i < Object.keys(scene).length; i++) {
        if (scene[i].hasOwnProperty(['z'])) {
            if(object.z>=lastZ && scene[i].z>=object.z){
                scene.splice(i, 0, object);
                //console.log('match',object.z,lastZ, scene[i].z);
                //console.log(scene[i]);
                if(returnIndex){
                    return i;
                } else{
                    return scene[i];
                }

            } else {
                //console.log('No match',object.z,lastZ, scene[i].z);
                lastZ = scene[i].z;
            }
            //console.log(scene[i]);
        }
    }

    scene.push(object);
    //console.log(scene[scene.length-1]);
    if(returnIndex){
        return scene.length-1;
    } else{
        return scene[scene.length-1];
    }

    console.log('This shouldnt happen');
}
