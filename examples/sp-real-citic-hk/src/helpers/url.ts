const entryPage = ['/home.html', '/trade.html'];

export const isEntryPage = () => {
  const { href } = window.location;

  return entryPage.some((page) => href.includes(page));
};
