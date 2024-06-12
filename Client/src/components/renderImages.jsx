export const renderImages = (isNested = false, post = {}, firstHiddenData = null) => {
  console.log("renderimgs", firstHiddenData);

  let mediaUrl;
  if (isNested) {
    mediaUrl = post?.parentPostId
      ? post.parentPostId.mediaUrl
      : (firstHiddenData && firstHiddenData.mediaUrl) || [];
  } else {
    mediaUrl = post ? post.mediaUrl : [];
  }

  if (!mediaUrl || mediaUrl.length === 0) return null;

  if (mediaUrl.length === 1) {
    return (
      <div className="w-full">
        <img
          src={mediaUrl[0]}
          className="rounded-3xl w-full mt-4"
          alt="media"
        />
      </div>
    );
  } else if (mediaUrl.length === 2) {
    return (
      <div className="flex gap-2 w-full mt-4">
        {mediaUrl.map((url, index) => (
          <img
            key={index}
            src={url}
            className="rounded-3xl w-1/2 object-cover"
            alt="media"
          />
        ))}
      </div>
    );
  } else if (mediaUrl.length === 3) {
    return (
      <div className="flex gap-2 w-full mt-4">
        <div className="w-1/2">
          <img
            src={mediaUrl[0]}
            className="rounded-3xl h-full object-cover"
            alt="media"
          />
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          <img
            src={mediaUrl[1]}
            className="rounded-3xl w-full object-cover"
            alt="media"
          />
          <img
            src={mediaUrl[2]}
            className="rounded-3xl w-full object-cover"
            alt="media"
          />
        </div>
      </div>
    );
  } else if (mediaUrl.length === 4) {
    return (
      <div className="grid grid-cols-2 gap-2 w-full mt-4">
        {mediaUrl.map((url, index) => (
          <img
            key={index}
            src={url}
            className="rounded-3xl w-full object-cover"
            alt="media"
          />
        ))}
      </div>
    );
  }
};
