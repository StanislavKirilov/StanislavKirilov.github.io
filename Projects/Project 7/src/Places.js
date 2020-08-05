import React, { Component } from 'react';
import Restaurants from './Restaurants';

class Places extends Component {

    state = {
        restaurants: null,
      
      }
      
      error = (err) => {
        window.alert(`ERROR(${err.code}): ${err.message}`);
      }

    componentDidMount() {
   
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(this.props.placesAPISuccess, this.error, options); 
      }
    
    render() {	
    return (
        <Restaurants restaurants={this.props.restaurants} getReviews={this.props.getReviews} updateMapRestaurants={this.props.updateMapRestaurants} />
        );
    }
}

export default Places;