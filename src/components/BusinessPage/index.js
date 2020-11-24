import { Divider } from "@material-ui/core";
import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { YelpContext } from 'YelpContext';
import NewReview from 'components/Review/NewReview';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReviewList from './ReviewList';
import Photos from './Photos';
import "styles/BusinessPage.scss";
import HoursTable from './HoursTable.js';
import StaticMap from './StaticMap.js';
import PhotoModal from './PhotoModal.js';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
const initPhoto = {
  open: false,
  url: ''
};

export default function BusinessPage() {

  const classes = useStyles();
  const [bigPhoto, setBigPhoto]
    = useState(initPhoto);

  const {
    businessDetails,
    getIndividualBusinessData,
    appState
  } = useContext(YelpContext);

  const { id } = useParams();
  const clickPhoto = (url) => {
    setBigPhoto({ open: true, url });
  };

  const hideBigPhoto = () => {
    setBigPhoto(initPhoto);
  };

  useEffect(() => {
    if (!businessDetails.id) {
      getIndividualBusinessData(id);
    }
  }, []);

  const now = new Date();
  let dayNum = now.getDay() - 1; // 1 is monday
  if (dayNum < 0)
    dayNum += 7;
  const openNow = () => {
    const time = now.getHours() * 100 + now.getMinutes();
    if (businessDetails.hours[0].open[dayNum].end > time
      && businessDetails.hours[0].open[dayNum].start < time)
      return true;
    else return false;
  };

  return (
    <div className='business-page-container'>
      <div className='loading-circle'>
        {!businessDetails.id && <CircularProgress size={140} />}
      </div>
      {businessDetails.id &&
        <>
          <div className='images-container'>
            {businessDetails.photos.map(review => {
              return (
                <Photos photos={review} clickPhoto={clickPhoto} />
              );
            })}
          </div>
          {bigPhoto.open &&
            <PhotoModal
              url={bigPhoto.url}
              bigPhoto={bigPhoto}
              hideBigPhoto={hideBigPhoto}
            />}
          <div className='business-container'>
            <div className='info-section'>
              <div className='bus-title'>
                {businessDetails.name}
              </div>
              {appState.authorized &&
                <div className='review'>
                  <NewReview venue_id={id} name={businessDetails.name}
                  />
                </div>
              }

              <div className='location-hours'>
                <div className='map-label-group'>
                  <label className='loc-label'>
                    <b>Location &amp; Hours</b></label>
                  <div className='static-map-container'>
                    <StaticMap {...businessDetails} />
                  </div>
                  <div className='contact-info'>
                    <span>{businessDetails.address}</span>
                    <span>{businessDetails.city}</span>
                    <span>{businessDetails.phone}</span>
                  </div>
                </div>
                {businessDetails.hours &&
                  <div className='table-container'>
                    <HoursTable businessDetails={businessDetails} dayNum={dayNum} openNow={openNow} />
                  </div>
                }
              </div>
            </div>
            <div className='review-big-container'>

              <div className='rating'>
                <strong>Safe Score:</strong> {businessDetails.overall_rating}
                <strong>Yelp Rating:</strong> {businessDetails.yelpRating}
              </div>

              <div className='reviews'>
                {(businessDetails.reviews
                  && businessDetails.reviews.length === 0)
                  && <span>Be the first to write a review!</span>}
                {(businessDetails.reviews
                  && businessDetails.reviews.length > 0)
                  && <ReviewList reviews={businessDetails.reviews}
                  />}
              </div>
            </div>
          </div>
        </>}
    </div >
  );
}

/* <table>
  {businessDetails.hours[0].open[0] &&
    <tr>
      <td>Mon</td>
      <td>{`${businessDetails.hours[0].open[0].start} -
                        ${businessDetails.hours[0].open[0].end}`}</td>
    </tr>}
  {businessDetails.hours[0].open[1] &&
    <tr>
      <td>Tue</td><td>{`${businessDetails.hours[0].open[1].start} -
                        ${businessDetails.hours[0].open[1].end}`}
      </td>
    </tr>}
  {businessDetails.hours[0].open[2] &&
    <tr>
      <td>Wed</td>
      <td>{`${businessDetails.hours[0].open[2].start} -
                  ${businessDetails.hours[0].open[2].end}`}</td>
    </tr>}
  {businessDetails.hours[0].open[3] &&
    <tr>
      <td>Thu</td>
      <td>{`${businessDetails.hours[0].open[3].start} -
                      ${businessDetails.hours[0].open[3].end}`}
      </td>
    </tr>}
  {businessDetails.hours[0].open[4] && <tr>
    <td>Fri</td>
    <td>{`${businessDetails.hours[0].open[4].start} -
                      ${businessDetails.hours[0].open[4].end}`}
    </td>

  </tr>}
  {businessDetails.hours[0].open[5] &&
    <tr>
      <td>Sat</td>
      <td>{`${businessDetails.hours[0].open[5].start} -  ${businessDetails.hours[0].open[5].end}`}</td>

    </tr>}
  {businessDetails.hours[0].open[6] &&
    <tr>
      <td>Sun</td>
      <td>{`${businessDetails.hours[0].open[6].start} -  ${businessDetails.hours[0].open[6].end}`}</td>
    </tr>}
</table> */