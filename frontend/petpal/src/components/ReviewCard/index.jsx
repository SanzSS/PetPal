const ReviewCard = ({review}) => {
    return <>
        <div class="p-2">
            <span class="font-bold block">{ review.user }</span>
            <span class="card-description">{ review.content }</span>
            <span class="card-description">{ review.rating }</span>
        </div>
    </>
}

export default ReviewCard;