import { SearchResult } from "../ApiServices/SharedInterface.tsx";
const REACTAPP_SEARCH_KEY:any =process.env.REACT_APP_SEARCH_KEY



export const GetData = async (): Promise<SearchResult | undefined> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", REACTAPP_SEARCH_KEY);
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://knowledgeminingsearchservice.search.windows.net/indexes/azureblob-index3/docs?api-version=2024-05-01-preview", requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: SearchResult = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
};



export const GetDataSearch = async (value:any): Promise<SearchResult | undefined> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", REACTAPP_SEARCH_KEY);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`https://knowledgeminingsearchservice.search.windows.net/indexes/azureblob-index3/docs?api-version=2024-05-01-preview&search=${encodeURIComponent(value)}`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: SearchResult = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
};