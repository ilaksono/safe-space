import "styles/BusinessPage.scss"
export default function Photos(props) {
  return (
    <div class='photos'>
      <img src={props.photos} 
      onClick={(event) => props.clickPhoto(event.target.getAttribute('src'))} 
      alt='photos' 
      className='bus-images'/>
    </div>
  )
}