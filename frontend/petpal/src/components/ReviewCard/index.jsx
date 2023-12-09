const ReviewCard = ({review}) => {
    if (!review) {
        // Handle the case where review is undefined or null
        return <></>; // or any other appropriate rendering or behavior
    }

    return <>
        <div className="p-2">
            <span className="card-description">Rating: { review.rating } </span>
            <span className="font-bold block">From: { review.user }</span>
            <span className="card-description">{ review.content }</span>
        </div>
    </>
}

export default ReviewCard;