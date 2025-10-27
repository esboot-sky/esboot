export const highlightText = (text: string, keyword: string) => {
  if (!keyword.trim() || !text) {
    return '';
  }
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return parts.map((part, index) => {
    if (part.toLowerCase() === keyword.toLowerCase()) {
      return (
        <span key={+index} className="text-[#BB874A]">
          {part}
        </span>
      );
    }
    return part;
  });
};
