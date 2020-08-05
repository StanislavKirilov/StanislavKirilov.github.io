import React from 'react';
import Map from './Map';
import Places from './Places';
import Modal from 'react-modal';
import "./Style/App.css";
import "./Style/ItemReview.css";
import Button from 'react-bootstrap/Button';

class App extends React.Component {

  state = {
    restaurants: [],
    filteredRestaurants: [],
    reviews: {},
    placeId: null,
    modalIsOpen: false,
    addRestaurantModalIsOpen: false,
    name: '',
    addErr: null,
    rating: 0,
    vicinity: '',
    newRestaurantLat: null,
    newRestaurantLng: null,
    restaurantName: '',
  }

  renderMarkers = (results) => {
      this.setState({
          restaurants: results
      })
  }

  //event handler for the Review button, accesses the APi after a request by the user to view the reviews
  getReviews = (placeId, isNewRestaurant, name) => {
    this.setState({
        placeId, 
        restaurantName : name,
    })
    
    //check if data is already present. If not make api request and get reviews. If its a newly added restaurant, skip. 
    if (!(placeId in this.state.reviews) && !isNewRestaurant){
      var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      var url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews,rating,geometry&key=AIzaSyDbj6WSJmv65nP3r7PGpx9-Zftfr-eBj3Q`;
      fetch(proxyUrl + url)
      .then(res => res.json())
      .then((info) => {
        //deep clone state
        let reviewsClone = JSON.parse(JSON.stringify(this.state.reviews));
        reviewsClone[placeId] = info.result.reviews;
  
        this.setState({
          reviews: reviewsClone, 
          placeId : placeId,
          modalIsOpen: true,
        });
      })
    }
    else if (isNewRestaurant) {
      //if no reviews are present for the newly added restaurant
      if (!(placeId in this.state.reviews)){
        //deep clone state, Takes a JavaScript Object and transform it to a JSON string
        let reviewsClone = JSON.parse(JSON.stringify(this.state.reviews));
        reviewsClone[`new_${this.state.newRestaurantLat}_${this.state.newRestaurantLng}`] = [];
        this.setState({
          modalIsOpen: true,
          reviews: reviewsClone,
          placeId: `new_${this.state.newRestaurantLat}_${this.state.newRestaurantLng}`, //create unique placeId for new restaurants
        });
      }
      //just open the modal with existing reviews
      else {
        this.setState({
          modalIsOpen: true,
          placeId: `new_${this.state.newRestaurantLat}_${this.state.newRestaurantLng}`
        });        
      }
    }
    //just open the modal with existing reviews
    else {
      this.setState({
        modalIsOpen: true,
      });
    }
   } 

   placesAPISuccess= (pos) => {
    var crd = pos.coords;
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${crd.latitude},${crd.longitude}&radius=15000&type=restaurant&key=AIzaSyDbj6WSJmv65nP3r7PGpx9-Zftfr-eBj3Q`;
    fetch(proxyUrl + url)
    .then(res => res.json())
    .then((data) => {
      this.setState({ 
        restaurants: data.results,
        filteredRestaurants: data.results,
       })
    })
    .catch((err) => alert(err))
  }
   
// On click Opens the Modal to add a New Restaurant 
  openAddRestaurantModal = (position) => {
    this.setState({
      addRestaurantModalIsOpen: true, 
      newRestaurantLat: position.lat,
      newRestaurantLng: position.lng,
    })
  }

// when clicking away from the modal it closes
   closeModal = () => {
       this.setState({modalIsOpen: false})
   }

// when clicking away from the modal it closes
   closeAddRestaurantModal = () => {
    this.setState({addRestaurantModalIsOpen: false})
   }

   //event handler for users added review
  updateNewReview = (e) => {
    e.preventDefault();
    this.setState({
      newReviewValue: e.target.value,
    })
  }

  //event handler for users added author
  updateNewAuthor = (e) => {
    e.preventDefault();
    this.setState({
      newAuthorName: e.target.value,
    })
  }

  //event handler for users rating
  updateRating = (e) => {
    e.preventDefault();
    this.setState({
      userRating: e.target.value,
    })
  }


  //event handler for the add Review button, adds the new review to the previous reviews 
  addNewReview = (e) => {
    e.preventDefault();
    let reviewsClone = JSON.parse(JSON.stringify(this.state.reviews));
    reviewsClone[this.state.placeId].push({
      text: this.state.newReviewValue,
      author_name: this.state.newAuthorName,
      rating: this.state.userRating
    })
    this.setState({
      reviews: reviewsClone,
      newReviewValue: '',
      newAuthorName: '',
      userRating: ''
    })
  }

  //event handler for New Restaurant Name
  handleNameChange = (e) => {
    e.preventDefault();
    this.setState({name: e.target.value})
  }

  //event handler for New Restaurant Rating
  handleRatingChange = (e) => {
    e.preventDefault();
    this.setState({rating: e.target.value})
  }

  //event handler for New Restaurant Address
  handleVicinityChange = (e) => {
    e.preventDefault();
    this.setState({vicinity: e.target.value})
  }

  //event handler for the add Restaurant on the map 
  onAddNewRestaurant = () => {
     let restaurantsClone = JSON.parse(JSON.stringify(this.state.restaurants))
     //Checks if all the inputs have been filled by the user, if not dislay an Error
      if (this.state.name === ''){
        this.setState({
          addErr: 'Add name please'
       })
      } 
      else if (this.state.rating === 0){
        this.setState({
          addErr: 'Add rating please'
       })
      } 
      else if (this.state.vicinity === ''){
        this.setState({
          addErr: 'Add vicinity please'
        })
      } 
      else {
        restaurantsClone.push({
          geometry: {
           location: {
             lat: this.state.newRestaurantLat,
             lng: this.state.newRestaurantLng
           }
         },
         name: this.state.name,
         rating: this.state.rating,
         vicinity: this.state.vicinity,
         newRestaurant: true,
         place_id: `new_${this.state.newRestaurantLat}_${this.state.newRestaurantLng}` 
       })
        this.setState({
          restaurants: restaurantsClone,
          addRestaurantModalIsOpen: false
        }, ()=> {
             this.updateMapRestaurants(this.state.restaurants)
        }) 
   
      }
  }

  // updates the restaurants so that the marker can appear on the map
  updateMapRestaurants = (newRestaurants) => {
    this.setState({
      filteredRestaurants: newRestaurants
    })
  }

  render(){
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        borderRadius: '20px',
        border: '5px solid wheat',
        backgroundColor: 'rgb(43, 43, 43)'
      }
    };

    const reviewStyle = {
      content : {
        position: 'absolute',
        top                   : '100px',
        left                  : '20%',
        right                 : '20%',
        bottom                : '100px',
        backgroundColor : 'black',
        padding: '20px',
        overflow: 'auto',
        borderRadius: '20px',
        border: '5px solid wheat',
        backgroundColor: 'rgb(43, 43, 43)'
      }
    };
    return (
      
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-8" id="mapDiv">
            <Map restaurants={this.state.filteredRestaurants}  onMapClick={this.openAddRestaurantModal} getReviews={this.getReviews} />
          </div>
          <div className="col-sm-4" id="listDiv">
            <Places placesAPISuccess={this.placesAPISuccess} updateMapRestaurants={this.updateMapRestaurants} restaurants={this.state.restaurants}  getReviews={this.getReviews}  />
          </div>
          <Modal isOpen={this.state.addRestaurantModalIsOpen} onRequestClose={this.closeAddRestaurantModal} ariaHideApp={false} style={customStyles}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="restaurantName">Restaurant Name:</label>
                  <input className="form-control" type="text" onChange={this.handleNameChange} value={this.state.name}/>
                </div>
                <div className="form-group">
                  <label htmlFor="restaurantRating">Restaurant Rating:</label>
                  <select className="form-control" type="number" onChange={this.handleRatingChange} value={this.state.rating} >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="restaurantVicinity">Restaurant Vicinity:</label>
                  <input className="form-control" type="text" onChange={this.handleVicinityChange} value={this.state.vicinity} />
                </div>
                <Button 
                variant="secondary" 
                onClick={this.onAddNewRestaurant} >Add Restaurant</Button>
                {
                  this.state.addErr && <div id="alertDiv">{this.state.addErr}</div>
                }
              </div>
          </Modal>
          <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} ariaHideApp={false} style={reviewStyle}>     
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{this.state.restaurantName}</h5>
                <button type="button" className="close" onClick={this.closeModal} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">     
             {
              this.state.modalIsOpen && this.state.reviews[this.state.placeId].map((review, idx) => {
                return (
                  <div className="reviewCard" key={idx}>
                    <div className="reviewCardHeader">
                      <div className="restaurantRating">{review.rating} ★</div>
                      <div className="authorName">Review by {review.author_name}</div>
                    </div>
                    <div className="reviewCardBody">
                      <p className="reviewText">{review.text}</p>
                    </div>
                  </div>     
                )
              })
            }
            <form onSubmit={this.addNewReview} id="newReviewCard" className="container">
              <div id="newReveiwHeader" className="row">
                <div className="col-sm-4">
                  <div className="form-group">
                    <label htmlFor="author">Name:</label>
                    <input className="form-control" placeholder="Your name" onChange={this.updateNewAuthor} type="text" value={this.state.newAuthorName} required />
                  </div>
                </div>
                
                <div className="col-sm-4 offset-4">
                  <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <select className="form-control" id="rating" value={this.state.userRating} onChange={this.updateRating} required>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>
              </div>
              <div id="newReviewBody" className="form-group">
                <label htmlFor="review">Review: </label>
                <textarea id="reveiwText" rows="5" className="form-control" placeholder="Your review goes here" onChange={this.updateNewReview} type="text" value={this.state.newReviewValue} required/>
              </div>
              <input id="submitInput" value="Add review" type="submit" />
            </form>
            
            

            </div>
            <div className="modal-footer d-flex justify-content-end" >
            <button onClick={this.closeModal}>close</button>
            </div>
        </Modal>
        </div>
      </div>
    );
  }
}

export default App;
