import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./Style/Restaurants.css";

class Restaurants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredRestaurants: [],
            filterValue: null,
            selectMinimumRating: 0,
            selectMaximumRating: 5,
            clearFilter: false,
            errorMsg: "",
       }
    }
        
// Updates the restaurants by the filtered criteria 
    updateRestaurants = (restaurants) => {
        this.setState({
            filteredRestaurants: restaurants
        })
    }
    
    componentDidMount(){
        this.updateRestaurants(this.props.restaurants);
    }
// Event handler for filters minimum rating change
    handleChangeMinimumRating = (e) => {
        this.setState({
            selectMinimumRating: Number(e.target.value)
        });
    };
// Event handler for filters maximum rating change
    handleChangeMaximumRating = (e) => {
        this.setState({
            selectMaximumRating: Number(e.target.value)
        });
    };
// Event handler for Clear Filter button
    clearFilter = (e) => {
        this.setState({
            selectMinimumRating: 0,
            selectMaximumRating: 5,
            clearFilter: false,
            errorMsg: "",
        },
        () => {
            this.resetRestaurants();
            }
        );
        e.preventDefault();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.filterRestaurants();
    }

//Displays all the restaurants in the vicinity on the map
    resetRestaurants = () => {
        this.setState({
            filteredRestaurants: this.props.restaurants,
            clearFilter: false,
        }, () => {
            this.props.updateMapRestaurants(this.state.filteredRestaurants)
        })
    }
  
  
    filterRestaurants = () => {
        //  1. Checks if filter values are set correcltly. If not, error message is shown.
        if (this.state.selectMinimumRating <= this.state.selectMaximumRating) {
          //  2. Creates new array by filtering out restaurants matching filtering criteria.
          let restaurantsClone = JSON.parse(JSON.stringify(this.props.restaurants))
          restaurantsClone = restaurantsClone.filter((restaurant) => {
               return restaurant.rating >= this.state.selectMinimumRating && restaurant.rating <= this.state.selectMaximumRating
          })
          this.props.updateMapRestaurants(restaurantsClone)
          this.setState({
              filteredRestaurants: restaurantsClone,
              clearFilter: true,
          })
        } else {
          this.setState({
            clearFilter: true,
            errorMsg:
              "Minimum rating value has to be smaller than maximum. Please adjust."
          });
        }
      }; 
    
      componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.restaurants !== prevProps.restaurants) {
          this.updateRestaurants(this.props.restaurants);
        }
      }
     
    render(){
     if (!this.props.restaurants || !this.props.restaurants.length){
         return null;
        
     }
          let something = (<React.Fragment>
          <center><h1>Restaurants List</h1></center>
            <div>
                <div id="filterCard">
                    <h3>Filter results:</h3>
                        <form id="filterForm">
                            <label htmlFor="minRatingSelect">Minimum: </label>
                            <select id="minRating" name="minRatingSelect" value={this.state.selectMinimumRating} onChange={this.handleChangeMinimumRating}>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        <label htmlFor="maxRatingSelect">Maximum: </label>
                            <select id="maxRating" name="maxRatingSelect" value={this.state.selectMaximumRating} onChange={this.handleChangeMaximumRating}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        <input type="submit" value="Apply filter" onClick={this.handleSubmit}/>
                        <button id="btnClearFilterSearch" onClick={this.clearFilter} className={this.state.clearFilter === true ? "clearFilterActive" : "clearFilterDisabled"}>Clear filter</button>
                    </form>
                    <div className="filterErrorMsg">{this.state.errorMsg}</div>
                </div>
            </div>
            </React.Fragment>
          )
     // If there are no restaurants in the filtered search display the help info
     if(this.state.filteredRestaurants.length < 1) {
         return(
            <div>
                 {something}
                    <div id="sidebar">
                        <h3 id="alert">No restaurants with matching criteria were found.</h3>
                        <div id="sidebarInfo">
                            <h5>What you can do: </h5>
                            <p>
                                 1. Add a new restaurant by left-clicking place on a map and
                                submitting new restaurant details.
                            </p>
                             <p>2. Modify filter criteria.</p>
                         </div>
                    </div>
                </div> 
         )
         // Else display the restaurants
     } else {
        return(
            <div>
                {something}
                {this.state.filteredRestaurants.map((restaurant, idx) => {
                            let streetViewUrl = `http://maps.googleapis.com/maps/api/streetview?key=AIzaSyDbj6WSJmv65nP3r7PGpx9-Zftfr-eBj3Q&size=640x480&location=${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}&fov=120&heading=235&pitch=10&sensor=false` 
                            return (
                                <Card key={idx} id='cardContainer'>
                                    <Card.Header as="h5" className="d-flex justify-content-center" id='cardHeader'>{restaurant.name}</Card.Header>
                                        <Card.Body id='cardBody'>
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <Card.Img variant="top" src={streetViewUrl} />
                                                </div>
                                                <div className="col-sm-8">
                                                    <Card.Text>
                                                        <span id="cardTextSpan"> <strong>Rating: </strong> {restaurant.rating} ★</span> 
                                                        <span> <strong>Address: </strong>{restaurant.vicinity}</span></Card.Text>
                                                    <Button variant="secondary" 
                                                    onClick={() => {this.props.getReviews(restaurant.place_id, restaurant.newRestaurant, restaurant.name)}} >Reviews</Button>
                                                </div>  
                                            </div> 
                                        </Card.Body>
                                </Card>
                            )
                        }
                    )} 
            </div>
            )
                }
    }
 }
 
 export default Restaurants;