$(document).ready(function(){

    // Set a random background image
    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
    $('body').css({'background-image': 'url(backgrounds/' + images[Math.floor(Math.random() * images.length)] + ')'});
    $('body').css({'background-position': 'center center'});
    $('body').css({'background-repeat': 'no-repeat'});
    $('body').css({'background-attachment': 'fixed'});

    // Load the pie chart
    loadChart();

    // Load the list of top websites
    loadSites();
});

function loadChart() {

    // Get the logs for today
    logs_key_name = "prody_logs_" + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY');

    chrome.storage.local.get(logs_key_name, function(result) {

        logs = result[logs_key_name];
        logs = JSON.parse(logs);

        // Clean up
        delete logs["nothing"];
        delete logs["newtab"];
        delete logs["downloads"];
        delete logs["extensions"];
        delete logs["devtools"];

        // Get the map of websites to categories
        categories_map_key = '4prody_categories';

        chrome.storage.local.get(categories_map_key, function(result) {

            categories_map = JSON.parse(result[categories_map_key])

            chart_data = {}

            for (var logs_property in logs) {

                // Can't find a mapping
                if (categories_map[logs_property] === undefined) {
                    if (chart_data["Uncategorized"] === undefined) {
                        chart_data["Uncategorized"] = logs[logs_property]
                    }
                    else {
                        chart_data["Uncategorized"] = chart_data["Uncategorized"] + logs[logs_property];
                    }
                }
                // Mapping found
                else {
                    if (chart_data[categories_map[logs_property]] === undefined) {
                        chart_data[categories_map[logs_property]] = logs[logs_property]
                    }
                    else {
                        chart_data[categories_map[logs_property]] = chart_data[categories_map[logs_property]] + logs[logs_property];
                    }
                }
            }

            chart_data_percentages = [];
            total_time_spent = 0;

            // Compute total time spent in Chrome
            for (var category_name in chart_data) {
                total_time_spent = total_time_spent + chart_data[category_name];
            }

            // Compute percentages of total time spent for each category
            for (var category_name in chart_data) {
                chart_data_percentages.push({name: category_name, y: chart_data[category_name]/total_time_spent*100, sliced: true});
            }

            // Draw chart
            $(function () {
                $('#charts').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                        style: {
                            color: "#ffffff",
                            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'Breakup of Time Spent by Category',
                        style: {
                            color: '#fff',
                            font: 'bold 32px "Lato", "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    tooltip: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            borderWidth: 0,
                            slicedOffset: 5,
                            dataLabels: {
                                enabled: true,
                                color: '#ffffff',
                                style: { fontFamily: '\'Lato\', sans-serif', lineHeight: '18px', fontSize: '17px' },
                                connectorColor: '#ffffff',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '% of Time Spent',
                        data: chart_data_percentages
                    }]
                });
            });

        });
    });
}


function loadSites() {

    // Grab template to render
    content = $('#all-sites-template').html();
    template = Handlebars.compile(content);

    modal_content = $('#categories-list-template').html()
    modal_template = Handlebars.compile(modal_content)

    // Get the logs for today
    logs_key_name = "prody_logs_" + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY');

    chrome.storage.local.get(logs_key_name, function(result) {

        logs = JSON.parse(result[logs_key_name]);

        // Clean up
        delete logs["nothing"];
        delete logs["newtab"];
        delete logs["downloads"];
        delete logs["extensions"];
        delete logs["devtools"];

        // Get the map of websites to categories
        categories_key = '4prody_categories';

        chrome.storage.local.get(categories_key, function(result) {

            categories = result[categories_key];
            categories = JSON.parse(categories);
            sites = [];

            for (property in logs) {
                sites.push({
                    url: property,
                    category: categories[property],
                    time: time(logs[property]),
                    ms: logs[property]
                });
            }

            sites = _.sortBy(sites, function(site){ return site.ms; });
            sites.reverse();

            sites = sites.slice(0,10);

            categories_list_key = '10prody_categories_list'
            chrome.storage.local.get(categories_list_key, function(result) {
                categories_list_items = result[categories_list_key];


                context = {
                    sites: sites
                }

                modal_context = {
                    categories_list_items: categories_list_items
                }

                content_html = template(context);
                $("#visited-sites").html('').append(content_html);

                modal_content_html = modal_template(modal_context);
                $('#modal-body').html('').append(modal_content_html);

                $('.radio').click();

                addDropdownListener();
            });
        });
    });
}

function addDropdownListener() {

    $('.category-buttons').unbind();
    $('.change-category').unbind();

    $('.category-buttons').click(function(e) {
        e.preventDefault();
        category_radio_id = $(e.currentTarget).attr('category-id');
        site_url = $(e.currentTarget).attr('siteurl');


        $('#change-category-modal').modal({});

        $('.change-category').attr('siteurl', site_url)

        if (category_radio_id === '') {
            $('#Uncategorized').click();
        }
        else {
            $('#' + category_radio_id).click();
        }
    });

    $('.change-category').click(function(e) {
        e.preventDefault();
        site_url = $(e.currentTarget).attr('siteurl');

        $('#change-category-modal').modal('hide');

        category = $('input[name=optionsRadios]:checked').val();

        if (category === "create-new-category-input") {
            new_category_name = $("#new-category-name").val();
            categories[site_url] = new_category_name;

            categories_list_items.push(new_category_name)
            categories_list = {}
            categories_list[categories_list_key] = categories_list_items
            chrome.storage.local.set(categories_list)
        }
        else {
            categories[site_url] = category;
        }

        categories_store = {};
        categories_store[categories_map_key] = JSON.stringify(categories);
        chrome.storage.local.set(categories_store);
        loadChart();
        loadSites();
    });
}

// Helper method - returns a formatted string on the number of hours, minutes and seconds taken
function time(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    if(hrs == 0){
        if(mins == 0){
            return secs + 's';
        }
        else{
            return mins + 'm ' + secs + 's';
        }
    }
    else{
        return hrs + 'h ' + mins + 'm ' + secs + 's';
    }
}



