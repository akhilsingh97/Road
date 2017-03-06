
var binding_applied = false;
function initialize() {
    var map;
    var json;

    var repeat=function(){
    var url = "http://43.252.91.54:6015/iview";
    $.ajax({
        data: {
            apiKey: "Bh8drTfg4jqDFKGK8L"
        },
        type: 'POST',
        url: url,
        success: function(response) {
            var json = response;

            // Contains all the locations and search function.

            var locations = [];
            for (var i = 0; i < response.length; ++i) {
                locations.push(new Location(json[i].objectID, json[i].timestamp, json[i].latitude, json[i].longitude))
            }


            window.locationsModel = {
                locations: locations,
                query: ko.observable(''),
            };

            for (var i = 0; i < window.locationsModel.locations.length; i++) {
                window.locationsModel.locations[i].infowindow.close();
            }

            locationsModel.search = ko.dependentObservable(function() {
                var self = this;
                var search = this.query().toLowerCase();
                return ko.utils.arrayFilter(self.locations, function(location) {
                    var isMatch = location.id.toLowerCase().indexOf(search) >= 0;
                    if (isMatch) {
                        // show marker here
                        location.marker.setVisible(true);

                    } else {
                        // hide marker here
                        location.marker.setVisible(false);

                    }

                    return isMatch;
                });
            }, locationsModel);
            if(!binding_applied){
                            ko.applyBindings(locationsModel);
                            binding_applied = true;
                        }

        },

        error: function() {
            alert('Data could not be retrieved.');
        }
    });
  }
  repeat();
  setInterval(repeat, 10000);

    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(19.6412, 72.9154),
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $('#btn').click( function() {
              map.setZoom(6);
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
            for (var i = 0; i < window.locationsModel.locations.length; i++) {
                window.locationsModel.locations[i].infowindow.close();
            }
            map.panTo(self.marker.getPosition());
            self.infowindow.setContent(self.content);
            map.setZoom(9);
            self.infowindow.open(map, self.marker);
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.marker.setAnimation(null);
            }, 2200);
        };




        this.addListener = google.maps.event.addListener(self.marker, 'click', (this.populateInfoWindow));
        //this.addListener = google.maps.event.addListener(self.marker, 'click', (this.wikiWindow));



    };

}
//setInterval(initialize, 10000);
