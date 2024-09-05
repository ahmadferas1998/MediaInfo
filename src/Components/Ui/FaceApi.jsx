// src/faceApi.js
import axios from "axios";

const baseURL = "https://knowledgemining-faceapi.cognitiveservices.azure.com";
const subscriptionKey = "ebfb267ea95d43af874eb7a25a985381";
const faceAttributes = "glasses";
const detectionModel = "";

export const faceApiForUrl = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  headers: {
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    "Content-Type": "application/json",
  },
  params: {
    returnFaceId: true,
    returnFaceLandmarks: false,
    returnFaceAttributes: faceAttributes,
    detectionModel: detectionModel,
  },
});

export const FaceId = async (id) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Ocp-Apim-Subscription-Key",
      "ebfb267ea95d43af874eb7a25a985381"
    );
    myHeaders.append("content-type", "application/json");
  
    const raw = JSON.stringify({
      faceIds: [id],
      largePersonGroupId: "74",
      maxNumOfCandidatesReturned: 9,
      confidenceThreshold: 0.7,
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(
        "https://knowledgemining-faceapi.cognitiveservices.azure.com/face/v1.0/identify",
        requestOptions
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
     
      
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error calling FaceId API:', error);
      throw error; // rethrow the error after logging it
    }
  };
export const PersoneDetails = async (id) => {
    const myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
    myHeaders.append(
      "Ocp-Apim-Subscription-Key",
      "ebfb267ea95d43af874eb7a25a985381"
    );
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(
        `https://knowledgemining-faceapi.cognitiveservices.azure.com/face/v1.0/largepersongroups/74/persons/${id}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error calling PersoneDetails API:', error);
      throw error; 
    }
  };
  

  
