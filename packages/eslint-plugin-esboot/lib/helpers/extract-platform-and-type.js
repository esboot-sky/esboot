function extractPlatformAndType(filePath) {
  const regex = /src\/platforms\/(mobile|pc)\/(?:_(browser|native)\/)?/;
  const match = filePath.match(regex);
  if (match) {
    return {
      platform: match[1],
      pageType: match[2],
    };
  }
  return null;
}

exports.extractPlatformAndType = extractPlatformAndType;
