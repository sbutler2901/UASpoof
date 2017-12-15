'use strict';


//********************* Local variables *********************

const bgpage = browser.extension.getBackgroundPage();

// storage keys
var skeyDisabled = "disabled";
var skeyShouldChange = "should_change";
var skeyChangeFreq = "change_freq";
var skeyOSLinux = "os_filter_linux";
var skeyOSMac = "os_filter_mac";
var skeyOSWin = "os_filter_win";
var skeyBrowserFF = "browser_filter_ff";
var skeyBrowserChr = "browser_filter_chrome";
var skeyBrowserSaf = "browser_filter_safari";
var skeyBrowserOp = "browser_filter_opera";
var skeyBrowserEdg = "browser_filter_edge";
var skeyBrowserIE = "browser_filter_ie";

//********************* Init *********************

init();


//********************* Function Declarations *********************

// Initializes the page
function init() {
    document.addEventListener("DOMContentLoaded", restoreOptions);
    document.querySelector("form").addEventListener("submit", saveOptions);
}

// Saves user's options on submit
function saveOptions(e) {
    e.preventDefault();

    var shouldDisable = document.querySelector("#disabled").checked;
    var shouldChangeFreq = document.querySelector("#chng-freq-chk").checked;
    var changeFreqTime = Number.parseInt(document.querySelector("#chng-freq-time").value, 10);

    var shouldOSLinux = document.querySelector("#os-linux").checked;
    var shouldOSMac = document.querySelector("#os-mac").checked;
    var shouldOSWin = document.querySelector("#os-win").checked;

    var shouldBrowserFF = document.querySelector("#browser-ff").checked;
    var shouldBrowserChr = document.querySelector("#browser-chrome").checked;
    var shouldBrowserSaf = document.querySelector("#browser-safari").checked;
    var shouldBrowserOp = document.querySelector("#browser-opera").checked;
    var shouldBrowserEdg = document.querySelector("#browser-edge").checked;
    var shouldBrowserIe = document.querySelector("#browser-ie").checked;
    
    if ( Number.isNaN(changeFreqTime) ||
        changeFreqTime < bgpage.changeFreqTimeMin ||
        changeFreqTime > bgpage.changeFreqTimeMax
    ) changeFreqTime = bgpage.defaultChangeFreq;

    // Updating storage
    browser.storage.local.set({
        skeyShouldChange: shouldChangeFreq,
        skeyChangeFreq: changeFreqTime,
        skeyOSLinux: shouldOSLinux,
        skeyOSMac: shouldOSMac,
        skeyOSWin: shouldOSWin,
        skeyBrowserFF: shouldBrowserFF,
        skeyBrowserChr: shouldBrowserChr,
        skeyBrowserSaf: shouldBrowserSaf,
        skeyBrowserOp: shouldBrowserOp,
        skeyBrowserEdg: shouldBrowserEdg,
        skeyBrowserIE: shouldBrowserIe
    }).then(function () {

        // Check isDisabled change
        if ( shouldDisable != bgpage.isDisabled ) {
            if ( shouldDisable )
                bgpage.disable();
            else
                bgpage.enable();
        }

        // Only run parser and update UAs if settings have changed
        //if ( shouldSameOS != bgpage.onlySameOS || shouldSameBrowser != bgpage.onlySameBrowser )
            bgpage.setAvailableUAs();

    }, bgpage.onError);

}

// Restore's user's options on page load
function restoreOptions() {
    
    document.querySelector("#current-ua").innerText = bgpage.currentUA;

    browser.storage.local.get().then((res) => {
        
        document.querySelector("#disabled").checked = res[skeyDisabled];
        document.querySelector("#chng-freq-chk").checked = res[skeyShouldChange];
        document.querySelector("#chng-freq-time").value = res[skeyChangeFreq];
    
        document.querySelector("#os-linux").checked = res[skeyOSLinux];
        document.querySelector("#os-mac").checked = res[skeyOSMac];
        document.querySelector("#os-win").checked = res[skeyOSWin];

        document.querySelector("#browser-ff").checked = res[skeyBrowserFF];
        document.querySelector("#browser-chrome").checked = res[skeyBrowserChr];
        document.querySelector("#browser-safari").checked = res[skeyBrowserSaf];
        document.querySelector("#browser-opera").checked = res[skeyBrowserOp];
        document.querySelector("#browser-edge").checked = res[skeyBrowserEdg];
        document.querySelector("#browser-ie").checked = res[skeyBrowserIE];
 
    }, bgpage.onError);
}
