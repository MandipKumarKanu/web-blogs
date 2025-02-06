const getErrorMessage = (error) => {
    if (!error || !error.response || !error.response.data) {
      return "An unknown error occurred";
    }
  
    const message = error.response.data.message;
    return Array.isArray(message) ? message.join(" ") : message;
  };
  
  export default getErrorMessage;