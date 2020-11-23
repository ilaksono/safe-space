import "styles/PlaceListItem.scss";
import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { YelpContext } from 'YelpContext';
import { useHistory } from 'react-router-dom';


const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
})(Rating);

/* 
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
})); */

const PlaceListItem = (props) => {
  const [value, setValue] = React.useState(2);
  const { getIndividualBusinessData, businessDetails } = useContext(YelpContext);

  const history = useHistory();
  const moveToNextPage = () => {
    getIndividualBusinessData(props.id)
      .then(() => {
        history.push(`/search/${props.id}`);
      });
  };

  return (
    <div>
      {props.name === "" && ""}
      {props.name && <div class='result-container'
        onClick={moveToNextPage}
        onMouseOver={() =>
          props.hoverMarker({id:props.id, lat: props.latitude, lng: props.longitude})}
        onMouseOut={() =>
          props.notHoverMarker()}>
        <div class="img-general-info-container">
          <div class='img-container'>
            <img src={props.image} alt="Logo" class='venue-image' />
          </div>
          <div class='general-info'>
          <h3 class="venue_name">{props.label}. {props.name}</h3>
          <div className="rating-outer-container">
            <div className="rating-title">
              Yelp Rating:
            </div>
            <Box component="fieldset" mb={0} pb={0} pt={0} borderColor="transparent">
              <Rating name="read-only" precision={0.5} value={props.yelpRating} readOnly size="small" />
            </Box>
            <div className="covid_review_count">
              ({props.yelpRatingCount})
            </div>
          </div>
          <div className="rating-outer-container">
            <div className="rating-title">
              Safe Score:
            </div>
            <Box component="fieldset" mb={0} pb={0} pt={0} borderColor="transparent">
              { isNaN(props.overall_rating) ? "N/A" 
              : <StyledRating
                  name="customized-color"
                  size="small"
                  value={props.overall_rating}
                  precision={0.5}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  readOnly
                />}
            </Box>
            <div className="covid_review_count">
              ({props.reviews.length})
            </div>
          </div>
          <div className="sample-review-container">
            {props.reviews.length > 0 && `"${props.reviews[0].description}"`}
            <div className="sample-review-user">
              {props.reviews.length > 0 && `-${props.reviews[0].user_id}`}
            </div>
          </div>
        </div>
        
      </div>
      <div class='location'> 
        {props.phone}<br />
        {props.address}<br />
        {props.city}
      </div>
    </div>}
    </div>
  );
};

export default PlaceListItem;
