export const validateAccountAddress = (address) => {
  const addressError = {};
  if (address.trim() === '') {
    addressError.accountAddress = 'Receiver address must not be empty';
  } else {
    const regEx = /^0x[a-fA-F0-9]{40}$/;
    if (!address.match(regEx)) {
      addressError.accountAddress = 'Not a valid ethereum address';
    }
  }

  return {
    addressError,
    valid: Object.keys(addressError).length < 1
  }
};