var currentHost = 'nothing';
var startTime = moment();
var endTime = null;
var alarmTime = null;

// Create alarm to fire at midnight (fires once on install/ after update)
chrome.runtime.onInstalled.addListener(function(details){
    alarmTime = new Date();
    alarmTime.setHours(24, 0, 0, 0);
    chrome.alarms.create("new_date", { when: alarmTime.getTime()});
});

// Alarm Listener to reset startTime and alarm
chrome.alarms.onAlarm.addListener(function(alarm){
    if(alarm.name == "new_date") {
        startTime = moment();
        chrome.alarms.clear("new_date");
        alarmTime = new Date();
        alarmTime.setHours(24, 0, 0, 0);
        chrome.alarms.create("new_date", { when: alarmTime.getTime()});
    }
});

// New tab opened listener
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        recordTime(tab.url, 'activated');
    });
});

// URL changed in the tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
    chrome.tabs.query({'active': true}, function (activeTabs) {
        var activeTab = activeTabs[0];

        if (activeTab.url == updatedTab.url) {
            recordTime(activeTab.url, 'updated');
        }
    });
});

// Chrome window out of focus listener
chrome.windows.onFocusChanged.addListener(function(window)
{
    if (window == chrome.windows.WINDOW_ID_NONE) {
        recordTime('nothing');
    }
    else {
        startTime = moment();
    }
});

function extractDomainName(url) {
    var parsed_url = purl(url);
    return parsed_url;
}

function recordTime(newUrl) {

    host = extractDomainName(newUrl).attr('host');

    if (host.substr(0,4) === "www.") {
        host = host.substr(4, host.length);
    }

    if(host == "nothing"){
        endTime = moment();
        timeSpent = endTime.diff(startTime);
    }
    else {
        if (host != currentHost) {
            endTime = moment();
            timeSpent = endTime.diff(startTime);
            startTime = moment();
        }
        else {
            return;
        }
    }

    logs_key_name = "prody_logs_" + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY')
    chrome.storage.local.get(logs_key_name, function(result) {
        // The log_dd_mm_yyyy key doesn't exist
        if (result[logs_key_name] === undefined) {
            var logs = {};
            var data_point = {};
            data_point[currentHost] = timeSpent;
            data_point = JSON.stringify(data_point);
            logs[logs_key_name] = data_point;
            chrome.storage.local.set(logs, function(result) {
                currentHost = host;
            });
        }
        // The log_dd_mm_yyyy key exists
        else {
            var logs = {};
            data_points = result[logs_key_name];
            data_points = JSON.parse(data_points);

            if (data_points[currentHost] === undefined) {
                data_points[currentHost] = timeSpent;
            }
            else {
                data_points[currentHost] = data_points[currentHost] + timeSpent;
            }

            data_points = JSON.stringify(data_points);
            logs[logs_key_name] = data_points;
            chrome.storage.local.set(logs, function(result) {
                currentHost = host;
            });
        }

    });
}

