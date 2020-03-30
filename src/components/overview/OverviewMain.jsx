import React from 'react';
import ImageCarousel from './sub-Components/imageCarousel/carouselMain.jsx';
import ProductRating from './sub-Components/ProductRating';
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
        maximized: false,
        zoomed: false
      },
      starRating: undefined,
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
      cart: {
        cartSize: undefined,
        cartNumber: undefined,
        favorited: undefined
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
        this.setState({
          images: {
            currentImage: 0,
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
    if (direction === 'left') {
      this.setState({
        images: {
          currentImage: this.state.images.currentImage - 1,
          otherImagesInStyle: this.state.images.otherImagesInStyle,
          currentThumbnailRow: this.state.images.currentThumbnailRow
        }
      });
    } else if (direction === 'right') {
      this.setState({
        images: {
          currentImage: this.state.images.currentImage + 1,
          otherImagesInStyle: this.state.images.otherImagesInStyle,
          currentThumbnailRow: this.state.images.currentThumbnailRow
        }
      });
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

  componentDidMount() {
    //when the component mounts, this gets the API data, sets it as the store, and
    //then organizes it and saves it as the state
    let product_id = 3; //filler
    //componentDidMount, grab the API data for the product info
    Axios.get(`http://3.134.102.30/products/${product_id}`)
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
      })
      .catch(err => {
        console.log(err);
      });

    //componentDidMount, grab the API data for styles
    Axios.get(`http://3.134.102.30/products/${product_id}/styles`)
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
            otherImagesInStyle: API_Styles.data.results[2].photos,
            currentThumbnailRow: 0
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div style={{ marginBottom: '30px' }}>
        <div className="columns">
          <span className="column is-half">
            <ImageCarousel
              state={this.state.images}
              onImageArrowClick={this.onImageArrowClick}
              onNavArrowClick={this.onNavArrowClick}
              changeImageOnThumbnailClick={this.changeImageOnThumbnailClick}
            />
          </span>
          <span className="column is-half">
            <ProductRating state={this.state} />
            <BasicDetails state={this.state} />
            <StyleSelection
              state={this.state}
              changeStyleOnClick={this.changeStyleOnClick}
            />
            <AddToBag state={this.state} />
          </span>
        </div>
        <Description state={this.state} />
      </div>
    );
  }
}

export default overviewMain;
