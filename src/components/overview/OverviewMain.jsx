import React from 'react';
import ImageCarousel from './sub-Components/imageCarousel/carouselMain.jsx';
import BasicDetails from './sub-Components/BasicDetails';
import StyleSelection from './sub-Components/StyleSelection';
import AddToBag from './sub-Components/AddToBag';
import Description from './sub-Components/Description';
import Axios from 'axios';

class overviewMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: {
        currentImage: undefined,
        otherImagesInStyle: [],
        currentThumbnailRow: undefined,
        maximized: false
      },
      basicDetails: {
        id: undefined,
        category: undefined,
        name: undefined,
        price: undefined
      },
      selectedStyle: {
        selectedStyleId: undefined,
        selectedStyleColor: undefined,
        selectedReducedPrice: undefined
      },
      allStyles: [],
      zoom: false,
      cart: {
        cartSize: undefined,
        cartNumber: undefined
      },
      description: {
        slogan: undefined,
        productDescription: undefined,
        features: []
      }
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.changeStyleOnClick = this.changeStyleOnClick.bind(this);
    this.onImageArrowClick = this.onImageArrowClick.bind(this);
    this.onNavArrowClick = this.onNavArrowClick.bind(this);
    this.changeImageOnThumbnailClick = this.changeImageOnThumbnailClick.bind(
      this
    );
    this.zoomImage = this.zoomImage.bind(this);
    this.selectProductSize = this.selectProductSize.bind(this);
    this.handleSeeAllReviewsClick = this.handleSeeAllReviewsClick.bind(this);
    this.selectProductStock = this.selectProductStock.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  //this changes the style when you click it!
  changeStyleOnClick(newStyleId) {
    for (let i = 0; i < this.state.allStyles.length; i++) {
      if (this.state.allStyles[i].style_id === newStyleId) {
        this.setState({
          selectedStyle: {
            selectedStyleId: this.state.allStyles[i].style_id,
            selectedStyleColor: this.state.allStyles[i].name,
            selectedReducedPrice: this.state.allStyles[i].sale_price
          }
        });

        //conditional logic to keep index positioning when changing styles
        var currentStyleIndex;
        if (
          this.state.allStyles[i].photos[this.state.images.currentImage] !==
          undefined
        ) {
          currentStyleIndex = this.state.images.currentImage;
        } else {
          currentStyleIndex = 0;
        }
        this.setState({
          images: {
            currentImage: currentStyleIndex,
            otherImagesInStyle: this.state.allStyles[i].photos,
            currentThumbnailRow: 0,
            maximized: false,
            zoomed: false
          }
        });
        break;
      }
    }
  }

  //this function is attached to the thumbnail images in the image carousel and
  //changes the selected image when these images are clicked.
  //My logic is needlessly complex--I'm using an index for my current image when I should be
  //using the url. Will change perhaps in the future
  changeImageOnThumbnailClick(newThumbnailUrl) {
    for (let i = 0; i < this.state.images.otherImagesInStyle.length; i++) {
      if (
        this.state.images.otherImagesInStyle[i].thumbnail_url ===
        newThumbnailUrl
      ) {
        this.setState({
          images: {
            currentImage: i,
            otherImagesInStyle: this.state.images.otherImagesInStyle,
            currentThumbnailRow: this.state.images.currentThumbnailRow
          }
        });
        break;
      }
    }
  }

  //this function changes the displayed image when you click the arrow
  onImageArrowClick(direction) {
    //conditional logic for direction and thumbnail row changing
    if (direction === 'left') {
      let newImageNumber = this.state.images.currentImage - 1;
      let newRowNumber = Math.floor(newImageNumber / 4);

      this.setState({
        images: {
          currentImage: newImageNumber,
          otherImagesInStyle: this.state.images.otherImagesInStyle,
          currentThumbnailRow: newRowNumber
        }
      });
    } else if (direction === 'right') {
      let newImageNumber = this.state.images.currentImage + 1;
      let newRowNumber = Math.floor(newImageNumber / 4);

      this.setState({
        images: {
          currentImage: newImageNumber,
          otherImagesInStyle: this.state.images.otherImagesInStyle,
          currentThumbnailRow: newRowNumber
        }
      });
    }
  }

  //this function zooms the entire image to fill the screen
  zoomImage() {
    if (this.state.zoom) {
      this.setState({ zoom: false });
    } else if (!this.state.zoom) {
      this.setState({ zoom: true });
    }
  }

  //this function changes the displayed thumbnail images when you click the arrow
  onNavArrowClick(direction) {
    if (direction === 'left') {
      this.setState({
        images: {
          currentImage: this.state.images.currentImage,
          otherImagesInStyle: this.state.images.otherImagesInStyle,
          currentThumbnailRow: this.state.images.currentThumbnailRow - 1
        }
      });
    } else if (direction === 'right') {
      this.setState({
        images: {
          currentImage: this.state.images.currentImage,
          otherImagesInStyle: this.state.images.otherImagesInStyle,
          currentThumbnailRow: this.state.images.currentThumbnailRow + 1
        }
      });
    }
  }

  //click to see all reviews
  handleSeeAllReviewsClick = e => {
    e.preventDefault();
    window.scrollTo({
      top: 2250,
      left: 0,
      behavior: 'instant'
    });
  };

  //get data from API and save it
  getData(page_id) {
    Axios.get(`http://3.134.102.30/products/${page_id}`)
      .then(API_details => {
        //input data into store
        this.props.storeProductDetails(API_details.data);

        //input this data into currentView
        this.setState({
          basicDetails: {
            id: API_details.data.id,
            category: API_details.data.category,
            name: API_details.data.name,
            price: API_details.data.default_price
          }
        });
        this.setState({
          description: {
            slogan: API_details.data.slogan,
            productDescription: API_details.data.description,
            features: API_details.data.features
          }
        });
        console.log('Tristan is a cottonheaded ninnymuggins');
      })
      .catch(err => {
        console.log(err);
      });

    Axios.get(`http://3.134.102.30/products/${page_id}/styles`)
      .then(API_Styles => {
        //input data into store
        this.props.storeProductStyles(API_Styles.data);
        //input this data into currentView
        //set style data in state
        this.setState({
          selectedStyle: {
            selectedStyleId: API_Styles.data.results[0].style_id,
            selectedStyleColor: API_Styles.data.results[0].name,
            selectedReducedPrice: API_Styles.data.results[0].sale_price
          }
        });
        this.setState({
          allStyles: API_Styles.data.results
        });
        //set state for images
        this.setState({
          images: {
            currentImage: 0,
            otherImagesInStyle: API_Styles.data.results[0].photos,
            currentThumbnailRow: 0
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  //add to cart functions to change state
  //selected size
  selectProductSize(event) {
    this.setState({
      cart: {
        cartSize: event.target.value,
        cartNumber: this.state.cart.cartNumber
      }
    });
  }

  //selected stock
  selectProductStock(event) {
    this.setState({
      cart: {
        cartSize: this.state.cart.cartSize,
        cartNumber: event.target.value
      }
    });
  }

  //submit add to cart on button click
  addToCart() {
    //need to create API request
    console.log('this.cart', this.state.cart);
  }

  componentDidUpdate(prevProps) {
    if (this.props.paramsId !== prevProps.paramsId) {
      this.getData(this.props.paramsId);
    }
  }

  componentDidMount() {
    //when the component mounts, this gets the API data, sets it as the store, and
    //then organizes it and saves it as the state
    //componentDidMount, grab the API data for the product info
    this.getData(this.props.paramsId);
  }

  render() {
    //conditional rendering to make sure everything is loaded
    var zoomStyling;
    if (this.props.storeState.reviewsMetadata.product_id) {
      //conditional rendering for zoom view
      if (this.state.zoom === true) {
        zoomStyling = <div></div>;
      } else if (this.state.zoom === false) {
        zoomStyling = (
          <div className="tile is-child">
            <BasicDetails
              state={this.state}
              reviews={this.props.storeState.reviewsMetadata}
              handleSeeAllReviewsClick={this.handleSeeAllReviewsClick}
            />
            <StyleSelection
              state={this.state}
              changeStyleOnClick={this.changeStyleOnClick}
            />
            <AddToBag
              state={this.state}
              selectProductSize={this.selectProductSize}
              selectProductStock={this.selectProductStock}
              addToCart={this.addToCart}
            />
          </div>
        );
      }
    }

    return (
      <div className="tile is-ancestor " style={{ marginBottom: '30px' }}>
        <div className="tile is-vertical is-parent">
          <div className="tile is-child">
            <div className="tile is-parent">
              <div className="tile is-child">
                <ImageCarousel
                  state={this.state.images}
                  onImageArrowClick={this.onImageArrowClick}
                  onNavArrowClick={this.onNavArrowClick}
                  changeImageOnThumbnailClick={this.changeImageOnThumbnailClick}
                  zoomImage={this.zoomImage}
                />
              </div>
              {zoomStyling}
            </div>
          </div>
          <div>
            <Description state={this.state} />
          </div>
        </div>
      </div>
    );
  }
}

export default overviewMain;
