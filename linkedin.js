let puppeteer = require("puppeteer");
let fs = require("fs");
let BASE_URL = "https://www.linkedin.com/login"
let cFile = process.argv[2];
let RMFile = process.argv[3]
// let pFile = process.argv[3];

const Linkedin = {

    intialization : async() => {
        browser = await puppeteer.launch({
            headless : false,
            defaultViewport: null,
            args : ["--incognito" , "--start-maximized"]
        })

        let pages = await browser.pages();
        page = pages[0];
    },

    login : async() => {
        try{
            await page.goto(BASE_URL , {waitUntil : 'networkidle2'});

            let credentialFile = await fs.promises.readFile(cFile);
            let {username , password} =  JSON.parse(credentialFile);

            await page.waitForSelector(".form__input--floating");
            await page.type('.form__input--floating input[name=session_key]', username, { delay: 50 });
            await page.type('.form__input--floating input[name=session_password]', password, { delay: 50 });

            await Promise.all([
                page.click("button[type=submit]", {delay : 50}),
                page.waitForNavigation({waitUntil : 'networkidle2'})
            ]);
            sleep(2000);

        }catch(err){
            console.log(err);
        }
    },

    sendConnectionRequest : async (connectionName) => {
        try{
            for(let i = 0 ; i < connectionName.length ; i++){
                console.log(connectionName[i]);
                await page.waitForSelector("#ember41");
                await page.type("input[type=text]" , connectionName[i] , {delay:100});
                await page.keyboard.press("Enter");

                sleep(2000);
                await page.waitForSelector(".search-result.search-result__occluded-item.ember-view");
                let people = await page.$$(".search-result.search-result__occluded-item.ember-view");
                console.log(people.length);
                let connectBtn = await page.$(".search-result.search-result__occluded-item.ember-view button[type=button]")
                await connectBtn.click();
                await page.waitForSelector(".ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view");
                let sendInvitation = await page.$(".ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view");
                await sendInvitation.click();
                sleep(3000);

                await page.click("#ember41");

                await page.keyboard.down('Control');
                await page.keyboard.press('a');
                await page.keyboard.up('Control');
                await page.keyboard.press('Backspace');

            }

        }catch(err){
            console.log(err)
        }
    },

    post : async () => {
        try{
            await page.goto("https://www.linkedin.com/feed/", {waitUntil:"networkidle2"});
            await page.click( ".share-box-feed-entry__trigger.t-16.t-black--light.t-bold.share-box-feed-entry__trigger-no-border", {delay:100});
            let postFile = await fs.promises.readFile(pFile);
            let {post} = JSON.parse(postFile);
            console.log(post);
            await page.waitForSelector(".editor-content.ql-container");
            
            let messageFile = await fs.promises.readFile(pFile);
            let {message1} = JSON.parse(messageFile);
            console.log(message1)
            await page.keyboard.type(message1, {delay:100});
            sleep(3000);
            let sendInvitation = await page.$x("/html/body/div[4]/div/div/div[2]/div/div[2]/div[2]/button");
            // console.log(sendInvitation)
            await sendInvitation[0].click();

            await page.close();

        }catch(err){
            console.log(err)
        }
    },

    sendRefferalMessage : async(companyName) => {
       try{
        await page.waitForSelector(".profile-rail-card__actor-link.t-16.t-black.t-bold");
        await page.click(".profile-rail-card__actor-link.t-16.t-black.t-bold" , {waitUntil:"networkidle2"});
        await page.waitForNavigation();

        await page.waitForSelector(".pv-top-card--list.pv-top-card--list-bullet.mt1 .inline-block a");
        let allConnections = await page.$$(".pv-top-card--list.pv-top-card--list-bullet.mt1 .inline-block a");
        console.log(allConnections.length);
        
            let connectionLink = await page.evaluate(function (el) {
                return el.getAttribute("href");
              }, allConnections[0]);
              connectionLink = "https://www.linkedin.com"+connectionLink;
            console.log(connectionLink);
            await page.goto(connectionLink, {waitUntil:"networkidle2"})
        // await page.click("#ember7725" , {waitUntil:"networkidle2"});
        // let url = "https://www.linkedin.com/search/results/people/?facetNetwork=%5B%22F%22%5D&origin=MEMBER_PROFILE_CANNED_SEARCH";
        // await page.goto(url , {waitUntil:"networkidle2"});
        
        await page.waitForSelector(".search-global-typeahead__input.always-show-placeholder");
        await page.click(".search-global-typeahead__input.always-show-placeholder");
        await page.type(".search-global-typeahead__input.always-show-placeholder" , companyName , {delay:100});
        await page.keyboard.press("Enter");
        sleep(3000);
        await page.waitForSelector(".search-results__list.list-style-none");
        let allPeopleMsgBtn = await page.$$(".search-results__list.list-style-none button[type=button]");
        let size = 100;
        
        console.log(allPeopleMsgBtn.length);
        
        for(let i = 0 ; i < size ; i++){
            await page.waitForSelector(".search-results__list.list-style-none");
            let allPeopleMsgBtn = await page.$$(".search-results__list.list-style-none button[type=button]");
            if(allPeopleMsgBtn.length==i) break;
            let element = await allPeopleMsgBtn[i];
            // console.log(element);
            // await page.click(element , {delay:100});
            await element.click();
            
            await page.waitForSelector(".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.notranslate");
            await page.click(".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.notranslate" , {delay : 100});
            let referalmessageFile = await fs.promises.readFile(RMFile);
            let message =await JSON.parse(referalmessageFile);
            console.log(message.message);
            await page.type(".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.notranslate",message.message , {delay : 100});
            sleep(3000);
            let sendMsg = await page.$x("/html/body/div[8]/aside/div[2]/div[1]/form/footer/div[2]/div[1]/button");
            await sendMsg[0].click();
            sleep(1000);

            await page.waitForSelector(".msg-overlay-bubble-header__control.js-msg-close.artdeco-button.artdeco-button--circle.artdeco-button--inverse.artdeco-button--1.artdeco-button--tertiary.ember-view");
            let allCancel = await page.$(".msg-overlay-bubble-header__control.js-msg-close.artdeco-button.artdeco-button--circle.artdeco-button--inverse.artdeco-button--1.artdeco-button--tertiary.ember-view");
            await allCancel.click();
        }

       }catch(err){
           console.log(err);
       }
        
    }
}
function sleep(duration){ 
    var cur = Date.now();
    var limit = cur+duration;
    while(cur<limit){
        cur = Date.now();
    }
}

module.exports = Linkedin;