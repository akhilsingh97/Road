function initialize() {
    var map;
    var json;

    var url = "http://43.252.91.54:6015/iview";
    $.ajax({
        data: {
            apiKey: "Bh8drTfg4jqDFKGK8L"
        },
        type: 'POST',
        url: url,
        cache: true,
        dataType: 'jsonp',
        success: function(response) {
            console.log(response.latitude);
            json = $.parseJSON(response);
        },

        error: function() {
            $('#text').html('Data could not be retrieved.');
        }
    });

    var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(40.8075, 73.9626),
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

        $('#btn').click( function() {
         map.setZoom(3);

       });




    var Location = function(id, timestamp, long, lat) {
        var self = this;
        this.id = id;
        this.timestamp = timestamp;
        this.long = long;
        this.lat = lat;


        this.getContent = function() {
            self.content = self.id;
        }();

        this.infowindow = new google.maps.InfoWindow();
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(self.long, self.lat),
            map: map,
            id: self.id,
            animation: google.maps.Animation.DROP
        });




        // Opens the info window for the location marker.
        this.populateInfoWindow = function() {
            for (var i = 0; i < locationsModel.locations.length; i++) {
                locationsModel.locations[i].infowindow.close();
            }
            map.panTo(self.marker.getPosition())

            self.infowindow.setContent(self.content);
            self.infowindow.open(map, self.marker);
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.marker.setAnimation(null);
            }, 2200);

        };

        // this.wikiWindow = function() {
        //     // value entered by the user
        //     var link = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + self.title + "&format=json&callback=?"; // url to look for using the search input by the user
        //     $.ajax({
        //             type: "GET",
        //             url: link,
        //             async: true,
        //             dataType: "json"
        //         })
        //         .done(function(data) {
        //             var articleList = data[0];
        //             var url = "http://en.wikipedia.org/wiki/" + articleList;
        //             name = ('<a href="' + url + '">' + articleList + '</a>');
        //             self.infowindow.setContent(name);
        //         })
        //
        //         .fail(function(errorMessage) {
        //             alert("Error");
        //         });


        this.addListener = google.maps.event.addListener(self.marker, 'click', (this.populateInfoWindow));
        //this.addListener = google.maps.event.addListener(self.marker, 'click', (this.wikiWindow));



    };

    // Contains all the locations and search function.
    for (var i = 0; i < json.length(); ++i) {
          var locationsModel = {

                  locations: [


                      new Location(json[i].objectID, json[i].timestamp, json[i].latitude, json[i].longitude),
                  ],


        //  new Location('Google', 37.3861, 122.0839),
        // new Location('Facebook', 37.4163, -122.153),
        // new Location('Yahoo', 37.3688, 122.0363),
        // new Location('Microsoft', 47.6740, 122.1215),
        // new Location('Redhat', 35.7796, 78.6382),
        // new Location('Columbia University', 40.8075, 73.9626)

        query: ko.observable(''),
    };
}
setInterval(initialize, 10000);

    locationsModel.search = ko.dependentObservable(function() {
        var self = this;
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(self.locations, function(location) {
            var isMatch = location.title.toLowerCase().indexOf(search) >= 0;
            if (isMatch) {
                // show marker here
                location.marker.setVisible(true);

            } else {
                // hide marker here
                location.marker.setVisible(false);

            }

            return isMatch;;
        });
    }, locationsModel);

    ko.applyBindings(locationsModel);

}
