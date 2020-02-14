const getStoryCode = title => {
  return typeof title === "string" && title.split("_")[1];
};

exports.getStoryCode = getStoryCode;
