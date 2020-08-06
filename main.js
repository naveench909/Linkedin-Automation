let ld = require("./linkedin");

let name = ["Mridul Singh"];
(async () => {
    await ld.intialization();
    await ld.login();
    
    // await ld.sendConnectionRequest(name);
    // await ld.post();
    // await ld.sendRefferalMessage("New Delhi");
})();

//"hihos28508@inbov03.com"