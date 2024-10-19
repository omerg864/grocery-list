import './ImagesList.css'


interface ImagesListProps {
    images: string[];
}
function ImagesList(props: ImagesListProps) {
  return (
    <div className='images-list' style={{minWidth: `${props.images.length * 5 - (props.images.length - 1) * 2}rem`}}>
        {props.images.map((img, index) => (
            <img src={img} style={{ left: `${index * 3}rem`}} alt={`item ${index}`} className='bundle-item-img' key={index} />
        ))}
    </div>
  )
}

export default ImagesList