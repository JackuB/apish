export default (transactions, currentIndex) => {
  for (let i = currentIndex; i < transactions.length; i++) {
    if (transactions[i].element === 'httpResponse') {
      return transactions[i];
    }
  };
  return null;
};
