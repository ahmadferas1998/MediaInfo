import { loginAction } from "./loginSlice.js";
import { decrypt } from "../utils/EncryptionAndDecreption.js";
const Host ="https://localhost:7273/"
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


  
  export const AddRoleAction =  async (RoleAr, RoleEn) => {
    const token = decrypt(localStorage.getItem("token"));
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id:0,
                RoleAr: RoleAr,
                RoleEn: RoleEn,
              
            }),
            redirect: "follow",
          };
  
          const response = await fetch(
            Host + "api/Role",
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


  export const UpdateRoleAction =  async (RoleEn, RoleAr,id) => {
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
          roleAr: RoleAr,
          roleEn: RoleEn,
        }),
        redirect: "follow",
      };

      const response = await fetch(
        Host + "api/Role",
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

  export const GetAllRoles =  async () => {
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
        Host + "api/Role",
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

export const DeleteRole = async (id) => {
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

    const response = await fetch(`${Host}api/Role/${id}`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); 
    ;
    return result;
    
  } catch (error) {
    console.error("Error deleting Role:", error);
    return undefined;
  }
};
