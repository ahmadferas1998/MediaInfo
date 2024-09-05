import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  GetAllRoles,
  AddRoleAction,
  UpdateRoleAction,
  DeleteRole,
} from "../store/RoleAction.js";
import { useTranslation } from "react-i18next";
import { showSuccessAlert,showErrorAlert,showDeleteConfirmation } from '../utils/showSuccessAlert';
export default function Roles() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [RoleAr, setRoleAr] = useState("");
  const [RoleEn, setRoleEn] = useState("");
  const [role, setRole] = useState("");
  const [RoleArError, setRoleArError] = useState("");
  const [RoleEnError, setRoleEnError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const { t } = useTranslation();
  const fetchRoles = async () => {
    try {
      const response = await GetAllRoles();
      if (Array.isArray(response)) {
        const mappedData = response.map((Role) => ({
          id: Role.id,
          roleAr: Role.roleAr,
          roleEn: Role.roleEn,
     
        }));
        setRows(mappedData);
        setError(null);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError("Failed to fetch Roles: " + error.message);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);
  const handleUpdate = async (Role) => {
    setRoleAr(Role.roleAr);
    setRoleEn(Role.roleEn);
    setRole(Role.id);
    setSelectedRoleId(Role.id);
    setEditMode(true);
    setShowModal(true);
  };
  const AddNewRole = () => {
    setRoleAr("");
    setRoleEn("");
    setRole("");
    setSelectedRoleId(null);
    setEditMode(false);
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (id) {
      try {
        await DeleteRole(id);
        setError("Delete successful");
        setShowModal(false);
        await fetchRoles();
      } catch (error) {
        setError("Delete failed: " + error.message);
      }
    }
  };
  const handleDeleteClick = (id) => {
    showDeleteConfirmation(() => handleDelete(id));
  };
  const validateForm = () => {
    let isValid = true;

    setRoleArError("");
    setRoleEnError("");
    setRoleError("");



    if (!RoleEn) {
      setRoleEnError(t("RoleEn_required"));
      isValid = false;
    }

    if (!RoleAr) {
      setRoleArError(t("RoleAr_required"));
      isValid = false;
    }

    return isValid;
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (editMode) {
          const result =await  UpdateRoleAction(RoleEn, RoleAr,role);
          showSuccessAlert('Update successful');
          setShowModal(false);
          if(!result  || result.id ==-1){
            showErrorAlert('faild');
          }
          else{
            showSuccessAlert('Update successful');
            setShowModal(false);
          }
        } else {
          const response = await AddRoleAction(RoleAr, RoleAr);
          if (response.id === -1) {
            showSuccessAlert('Rolename Already Exists');
            return;
          } else {
            showSuccessAlert('Add successful');
            setRoleAr("");
            setRoleEn("");
            setRole("");
            setShowModal(false);
          }
        }
        await fetchRoles();
      } catch (error) {
        setError("Operation failed: " + error.message);
      }
    }
  };
  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 70,
      headerAlign: 'center', 
      align: 'center' 
    },
    { 
      field: "roleAr", 
      headerName: t("RoleAr"), 
      flex: 1,
      headerAlign: 'center', 
      align: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {params.value}
        </div>
      )
    },
    { 
      field: "roleEn", 
      headerName: t("RoleEn"), 
      flex: 1,
      headerAlign: 'center', 
      align: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "action",
      headerName: t("Action"),
      flex: 1,
      headerAlign: 'center', 
      align: 'center', 
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 16 }}
            onClick={() => handleUpdate(params.row)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            Delete
          </Button>
        </div>
      )
    },
  ];
  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        paddingTop: "5rem",
      }}
    >
      <div className="row">
        <div className="UsersCard">{t("Roles")}</div>
      </div>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <Button
          style={{
            width: "200px",
            margin: "20px",
            textAlign: "center",
          }}
          variant="contained"
          color="primary"
          size="large"
          onClick={AddNewRole}
        >
          {t("add_Role")}
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>{t(editMode ? "edit_Role" : "add_Role")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRoleAr">
              <Form.Label>{t("RoleAr")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("enter_RoleAr")}
                value={RoleAr}
                onChange={(e) => setRoleAr(e.target.value)}
                isInvalid={!!RoleArError}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRoleEn">
              <Form.Label>{t("RoleEn")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("enter_RoleEn")}
                value={RoleEn}
                onChange={(e) => setRoleEn(e.target.value)}
                isInvalid={!!RoleEnError}
              />
            </Form.Group>
          </Form>
          <div className="row pt-5">
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("close")}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {t(editMode ? "update" : "submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
