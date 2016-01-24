export default (transactions, currentIndex) => {
  for (let i = currentIndex; i < transactions.length; i++) {
    if (transactions[i].element === 'httpResponse' && transactions[i].content.length) {
      return transactions[i];
    }
  };
  return null;
};
