import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { YelpContext } from 'YelpContext';
import NewReview from 'components/Review/NewReview';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ReviewList from './ReviewList';
import Photos from './Photos';
import "styles/BusinessPage.scss";
import 'styles/ChartSection.scss';
import HoursTable from './HoursTable.js';
import StaticMap from './StaticMap.js';
import PhotoModal from './PhotoModal.js';
import ChartSection from 'components/UserProfile/ChartSection';
import ChartTab from './ChartTab';
import TogglePerDay from './TogglePerDay';
import useChartData from 'hooks/useChartData';


const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
})(Rating);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '270px',
    float: 'center',
    '& > *': {
      margin: theme.spacing(0.5),
      marginTop: '0px',
      marginBottom: '0px',
    },
  },
  favourite: {
    fontWeight: 'bold',
    color: '#FF717C',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
  },
  notFavouriteIcon: {
    color: 'rgba(0, 0, 0, 0.54)',
    '&:hover': {
      color: '#FF717C',
    },

  },
}));
const initPhoto = {
  open: false,
  url: ''
};
// const initData = {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [{
//     label: 'Andrew\'s body fat % ',
//     backgroundColor: '#1E0253',
//     // backgroundColor: 'rgb(255, 99, 132)',
//     borderColor: 'rgb(255, 99, 132)',
//     data: [0, 10, 5, 2, 20, 30, 45]
//   }],
//   ready: null
// };

// const initOptions = {
//   scales: {
//     yAxes: [{
//       ticks: {
//         min: 0,
//         max: 5
//       }
//     }]
//   }
// };

// const initChartSelect = {
//   options: ['Overall', 'Clean', 'Distancing', 'Process'],
//   select: 'Overall',
//   perDay: false
// };

export default function BusinessPage() {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [nextOpen, setNextOpen] = useState({ day: null, start: null, end: null});
  const [bigPhoto, setBigPhoto]
    = useState(initPhoto);
  // const [chartData, setChartData] = useState(initData);
  // const [chartOptions, setChartOptions] = useState(initOptions);
  // const [chartSelect, setChartSelect] = useState(initChartSelect);

  const {
    chartSelect,
    setChartSelect,
    chartOptions,
    chartData,
    setChartData
  } = useChartData();

  const clickChartTab = (value) => {
    setChartSelect({ ...chartSelect, select: value });
  };
  const {
    businessDetails,
    getIndividualBusinessData,
    appState
  } = useContext(YelpContext);


  const { id } = useParams();
  const clickPhoto = (url) => {
    setBigPhoto({ open: true, url });
  };
  const changePerDay = () => {
    setChartSelect({
      ...chartSelect,
      perDay: !chartSelect.perDay
    });
  };

  const hideBigPhoto = () => {
    setBigPhoto(initPhoto);
  };
  const primeChartData = (reviews, type) => {
    console.log(reviews, 'rev');
    if (reviews) {
      const key = {
        'overall_rating': 'Overall Rating',
        'cleanliness': 'Cleanliness',
        'socialdistancing': 'Social Distancing',
        'transactionprocess': 'Transaction Process'
      };
      const keyIndex = chartSelect.options.indexOf(type);
      const k = Object.keys(key)[keyIndex];
      let cpy = [...reviews];
      cpy = cpy.sort((a, b) => {
        const leftP = new Date(a.date).getTime();
        const rightP = new Date(b.date).getTime();
        if (isFinite(rightP - leftP)) {
          return leftP - rightP;
        } else {
          return isFinite(leftP) ? -1 : 1;
        }

      });
      let primedLabels = [];
      let primedVal = [];
      let prevDay = formatDateString(cpy[0].date);
      let acc = 0;
      let count = 0;
      if (chartSelect.perDay) {
        cpy.forEach(rev => {
          if (!primedLabels
            .includes(formatDateString(rev.date)))
            primedLabels.push(formatDateString(rev.date));
        });
        cpy.forEach((rev, index) => {
          if (formatDateString(rev.date) === prevDay && !(index === cpy.length - 1)) {
            acc += Number(rev[k]);
            count++;
          } else {
            prevDay = formatDateString(rev.date);
            primedVal.push(acc / count || 1);
            acc = Number(rev[k]);
            count = 1;
            if (index === cpy.length - 1 && cpy.length > 1) {
              if (prevDay === formatDateString(rev.date))
                primedVal.push((acc + Number(rev[k])) / (count + 1));
              else primedVal.push(Number(rev[k]));
            }

          }
        });

      } else {
        primedLabels = cpy.map(rev => {
          return formatDateString(rev.date);
        });
        primedVal = cpy.map(rev => rev[k]);
      }


      setChartData({
        labels: primedLabels,
        datasets: [{
          label: key[k],
          backgroundColor: '#1E0253',
          borderColor: '#1E0253',
          data: primedVal
        }],
        ready: true
      });
    }
  };

  const formatDateString = date => {
    return new Date(date).toUTCString().split('')
      .slice(5, 10).join('').replace(' ', '-');
  };

  useEffect(() => {
    if (!businessDetails.id) {
      getIndividualBusinessData(id);
    }
  }, []);

  useEffect(() => {
    if (businessDetails.reviews) {
      if (businessDetails.reviews.length)
        primeChartData(businessDetails.reviews, chartSelect.select);
    }
  }, [businessDetails, chartSelect]);

  const now = new Date();
  let dayNum = now.getDay() - 1; // 1 is monday
  if (dayNum < 0)
    dayNum += 7;
  const openNow = () => {
    const time = now.getHours() * 100 + now.getMinutes();
    if (businessDetails.hours[0].open[dayNum].end > time
      && businessDetails.hours[0].open[dayNum].start < time) {
        return businessDetails.hours[0].open[dayNum];
      }
  };

  const categoryList = businessDetails.categories.map((category, index) => {
    return (
      <div className="category">
        { businessDetails.categories.length === (index + 1) ? `${category.title}` : `${category.title},`}
      </div>
    )
  })

  return (
    <div className='business-page-container'>
      <div className="back-and-message-container">
      <Link to={'/search'}>
          <Button variant="contained" /* onClick={backButton} */><KeyboardBackspaceIcon /></Button>
      </Link>
        { open && (
          <Alert severity="success" className={classes.root} onClose={() => setOpen(false)}>Thanks for leaving a review!</Alert>
        )}
        <div className="right-offset"></div>
      </div>
      {!businessDetails.id && (
        <div className='loading-circle'>
          <CircularProgress size={140} />
        </div>
      )}
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
              <div className="bus-data">
                <div className="left-col">
                  <div className="bus-data-row">
                    <div className="rating-title">
                      Yelp Rating:
                    </div>
                    <Box component="fieldset" mb={0} pb={0} pt={0} borderColor="transparent">
                      <Rating name="read-only" precision={0.5} value={businessDetails.yelpRating} readOnly size="medium" />
                    </Box>
                    <div className="covid_review_count">
                      {businessDetails.yelpRatingCount} reviews
                    </div>
                  </div>
                  <div className="bus-data-row">
                    <div className="rating-title">
                      Safe Score:
                    </div>
                    <Box component="fieldset" mb={0} pb={0} pt={0} borderColor="transparent">
                      { isNaN(businessDetails.overall_rating) ? "N/A" 
                      : <StyledRating
                          name="customized-color"
                          size="medium"
                          value={businessDetails.overall_rating}
                          precision={0.5}
                          icon={<FavoriteIcon fontSize="inherit" />}
                          readOnly
                        />}
                    </Box>
                    <div className="covid_review_count">
                      {businessDetails.reviews.length} reviews
                    </div>
                  </div>
                  <div className="bus-data-row">
                    <div className="bus-price">
                      { businessDetails.price } &nbsp; &middot;
                    </div>
                    &nbsp; { categoryList }
                  </div>
                  <div className="bus-data-row">
                    { openNow() ? (
                      <div className="open">
                        Open Now
                      </div>
                    ) : (
                      <>
                        <div className="closed">
                          Closed Now &nbsp; &middot;
                        </div>
                        <div className="category">
                          &nbsp; { `Next Open: ${nextOpen.day}, ${nextOpen.start} - ${nextOpen.end}` }
                        </div>
                      </>
                    )} 
                  </div>
                </div>
                <div className="right-col">
                  <div className="row">
                    <div className="icon">
                      <LocationOnIcon />
                    </div>
                    <div className="data">
                    {businessDetails.address},
                    </div>
                  </div>
                  <div className="row">
                    <div className="icon">
                    </div>
                    <div className="data">
                    {businessDetails.city}
                    </div>
                  </div>
                  <div className="row">
                    <div className="icon">

                      <PhoneIcon />
                    </div>
                    <div className="data">
                    {businessDetails.phone}
                    </div>
                  </div>
                </div>
              </div>
              {appState.authorized &&
                <div className='bus-buttons'>
                  <NewReview venue_id={id} name={businessDetails.name} setOpen={setOpen} />

                  {/* RENDER THIS BUTTON WHEN A USER FAVOURITED THE VENUE */}
                  <Button variant="contained" startIcon={<FavoriteIcon />} className={classes.favourite} >Favourite</Button>

                  {/* RENDER THIS BUTTON WHEN A USER HAS NOT YET FAVOURITED THE VENUE */}
                  <Button variant="contained" startIcon={<FavoriteIcon />} className={classes.notFavouriteIcon}>Favourite</Button>
                </div>
              }

              <div className='location-hours'>
                <div className='map-label-group'>
                  <label className='loc-label'>
                    <b>Location &amp; Hours</b></label>
                  <div className='static-map-container'>
                    <StaticMap {...businessDetails} />
                  </div>
                </div>
                {businessDetails.hours &&
                  <div className='table-container'>
                    <HoursTable businessDetails={businessDetails} dayNum={dayNum} openNow={openNow} setNextOpen={setNextOpen} />
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
            <div className='business-chart-container'>
              {chartData.ready &&
                <>
                  <ChartTab chartSelect={chartSelect} clickChartTab={clickChartTab} />
                  <TogglePerDay chartSelect={chartSelect} changePerDay={changePerDay} message='per Day' />
                  {/* {parsedCharts} */}

                  <ChartSection data={chartData} options={chartOptions} />


                </>
              }
            </div>
          </div>
        </>}

    </div >
  );
}
