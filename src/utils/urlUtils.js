import {BasicUrlContent} from '../ApiServices/SharedInterface.tsx'
 
 const extractContent = (url) => {
    if (!url) {
      return "";
    }
    const start = BasicUrlContent;
    const startIndex = url.indexOf(start) + start.length;
    const endIndex = url.indexOf('.', startIndex);
    const encodedContent = url.substring(startIndex, endIndex);
    return decodeURIComponent(encodedContent);
  };
  export default  extractContent