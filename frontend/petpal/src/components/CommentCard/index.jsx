const CommentCard = ({comment, username}) => {
    if (!comment) {
        // Handle the case where review is undefined or null
        return <></>; 
    }

    return <>
        {comment.user === username ? (
        // on the right
        <div id="self">
            <p id="from-self" className="font-bold block capitalize">From: {comment.user}</p>
            {/* if it's the user, then put it on the right, otherwise, put it on the left */}
            <span className="block">{comment.content}</span>
        </div>
        ) : (
        // on the left
        <div id="others">
            <p id="from-others" className="font-bold block capitalize">From: {comment.user}</p>
            <span className="block">{comment.content}</span>
        </div>
        )}
    </>
}

export default CommentCard;