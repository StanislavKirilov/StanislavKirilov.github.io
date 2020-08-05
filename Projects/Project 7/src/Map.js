import React, { Component } from 'react';
import {GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import CurrentLocation from './Location';


export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        restaurants: [],
        panorama: null,
        streetViewUrl: ''
    };

    onMarkerClick = (props, marker) => {
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true,
        streetViewUrl: `http://maps.googleapis.com/maps/api/streetview?key=AIzaSyDbj6WSJmv65nP3r7PGpx9-Zftfr-eBj3Q&size=640x480&location=${props.position.lat},${props.position.lng}&fov=120&heading=235&pitch=10&sensor=false`,
        name: props.name,
        newRestaurant: props.newRestaurant,
      });
    };

    onClose = () => {
        if(this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    render() {
        return (
          <CurrentLocation 
            centerAroundCurrentLocation
            google={this.props.google}
            onClick={this.props.onMapClick}
          >
            {
               this.props.restaurants.length && this.props.restaurants.map((restaurant, idx) => {
                 return (
                  <Marker onClick = {this.onMarkerClick} key={idx}
                  name={restaurant.name}
                  position={{lat: restaurant.geometry.location.lat, lng: restaurant.geometry.location.lng}} />
                 )
               })
            }
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}
              
            >
              <div>
                <h4>{this.state.selectedPlace.name}</h4>
                <div id="street-view">{this.state.selectedPlace.id}</div>
                {this.state.selectedPlace.position && <img src={this.state.streetViewUrl} width="300px" alt='Restaurant'/>}
              </div>
            </InfoWindow>
          </CurrentLocation>
        );
      }
    }

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDbj6WSJmv65nP3r7PGpx9-Zftfr-eBj3Q'
})(MapContainer);





