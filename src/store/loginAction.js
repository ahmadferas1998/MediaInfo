import { loginAction } from "./loginSlice.js";
import { decrypt } from "../utils/EncryptionAndDecreption.js";
const Host ="https://localhost:7273/"
const myHeaders = new Headers();
const token = decrypt(localStorage.getItem("token"));
myHeaders.append("Content-Type", "application/json");

export const LoginAction = (UserName, Password) => {
    return async (dispatch) => {
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: UserName,
              password: Password,
            }),
            redirect: "follow",
          };
  
          const response = await fetch(
            Host + "api/Users/login",
            requestOptions
          );
  
          if (!response.ok) {
            return undefined;
          }
          const result = await response.json();
          return result;
        
        } catch (error) {
          console.error("Error fetching data:", error);
          return undefined;
        }
      };
      try {
        const data = await fetchData();
        if (data) {
          dispatch(
            loginAction.setContent({
              content: data || [],
            })
          );
          return data
        } else {
          throw new Error("No data returned from fetch");
        }
      } catch (error) {
        console.error("Error dispatching data:", error);
        dispatch({ type: "FETCH_DATA_FAILURE", error: error.message });
      }
    };
  }; 
  
  export const SignUpAction =  async (firstName,lastName,Email,genderId,UserName, Password,roleId) => {
    const token = decrypt(localStorage.getItem("token"));
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email:Email,
              genderId: genderId,
              username: UserName,
              password: Password,
              roleId:roleId
            }),
            redirect: "follow",
          };
  
          const response = await fetch(
            Host + "api/Users",
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          return result;
        
        } catch (error) {
          console.error("Error fetching data:", error);
          return undefined;
        }
   
  }; 


  export const UpdateUserAction =  async (firstName,lastName,Email,genderId,UserName, Password,roleId,id) => {
    const token = decrypt(localStorage.getItem("token"));
    try {
      const requestOptions = {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id:id,
          firstName: firstName,
          lastName: lastName,
          email:Email,
          genderId: genderId,
          username: UserName,
          password: Password,
          roleId:roleId
        }),
        redirect: "follow",
      };

      const response = await fetch(
        Host + "api/Users",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    
    } catch (error) {
      console.error("Error fetching data:", error);
      return undefined;
    }

}; 

  export const GetAllUsers =  async () => {
    const token = decrypt(localStorage.getItem("token"));
    try {
      const requestOptions = {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      const response = await fetch(
        Host + "api/Users",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    
    } catch (error) {
      console.error("Error fetching data:", error);
      return undefined;
    }

}; 

export const DeleteUser = async (id) => {
  const token = decrypt(localStorage.getItem("token"));
  try {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    const response = await fetch(`${Host}api/Users/${id}`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); 
    return result;
    
  } catch (error) {
    console.error("Error deleting user:", error);
    return undefined;
  }
};
