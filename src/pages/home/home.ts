import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import * as L from 'leaflet';
import Routing from 'leaflet-routing-machine';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: L.Map;
  center: L.PointTuple;
  latlngs: any;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  theMarker : any;
  // department = [ 'UBIT', 'Pharmacy' ,'KUBS', 'Commerce', 'Public Administration', 'Mathematics'];
  selectedDepart  = {};
  
  department = [{
    name: "UBIT",
    lat: "24.9454",
    lon: "67.1150"
}, {
  name: "Pharmacy",
  lat: "24.9445",
  lon: "67.1160"
}, {
  name: "KUBS",
  lat: "24.9382",
  lon: "67.1112"
}, {
  name: "Commerce",
  lat: "24.9395",
  lon: "67.1138"
}, {
  name: "Public Administration",
  lat: "24.9390",
  lon: "67.1123"
}, {
  name: "Mathematics",
  lat: "24.9403",
  lon: "67.1216"
}];



  constructor(public navCtrl: NavController,
    private geolocation : Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy
  ) {
  

  }

 

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.center = [resp.coords.latitude, resp.coords.longitude];
      //set map center
      this.initMap();
    }).catch((error) => {
      alert('Error getting location');
      //console.log('Error getting location', error);
    });

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      (result) => {
        //console.log('Has permission?',result.hasPermission);

        //To switch on the GPS location
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {

          if (canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              (gpsEnabledReq) => {
                //console.log('Request successful')
                this.geolocation.getCurrentPosition().then((resp) => {
                  this.lat = resp.coords.latitude;
                  this.lng = resp.coords.longitude;
                  this.center = [resp.coords.latitude, resp.coords.longitude];
                  //set map center
                  this.initMap();
                }).catch((error) => {
                  //console.log('Error getting location', error);
                });
              },
              (gpsEnabledError) => {
                //console.log('Error requesting location permissions', gpsEnabledError)
              }
            )
          }
        });
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        (result) => {
          //console.log('USER RESULT SELECT?',result);
        },
        (myError) => {
          //console.log('USER RESULT SELECT?',myError);
        }
      )
    );
  }
 
  initMap() {
    this.map = L.map('map1', {
      center: this.center,
      zoom: 25
    });

    //Add OSM Layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    var myIcon = L.icon({
      iconUrl: 'assets/imgs/marker.png',
      iconSize: [50, 65]
      // iconAnchor: [22, 64],
      // popupAnchor: [-3, -76]
    });
    this.theMarker = L.marker({lat: this.lat, lng: this.lng},{icon: myIcon}).addTo(this.map)
  }

  getRoute(){
  console.log(L);console.log(Routing);
  // var map = L.map('map2');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(this.map);

L.Routing.control({
  waypoints: [
    L.latLng(this.lat, this.lng ),
          L.latLng(this.selectedDepart['lat'],this.selectedDepart['lon'])
  ],
  routeWhileDragging: true
}).addTo(this.map);
    console.log(this.selectedDepart)
  }

}
