import styles from "../models/Models.module.css"
import { Form, Input, Modal, Select, Upload, message } from "antd";
import { IoMdAddCircle } from "react-icons/io";
import { MdDeleteForever } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Option } from "antd/es/mentions";

export const Models = () => {

  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const imgURL = `https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images`;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({ name: "", brand_id: "" });
  const token = localStorage.getItem("accessToken");

  const getModels = () => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/models`)
      .then(res => res.json())
      .then(data => {
        setModels(data?.data || []);
      })
      .catch(err => {
        console.log(err);
        toast.error("Failed to fetch models");
      });
  };

  useEffect(() => {
    getModels();
  }, []);

  useEffect(() => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/brands")
      .then((res) => res.json())
      .then((data) => {
        setBrands(data?.data);
      });
  }, []);

  const createModels = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand_id", brand);

    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    .then((res) => res.json())
    .then((data) => {
      if (data?.success) {
        toast.success(data?.message);
        getModels();
        handleClose();
      } else {
        toast.error(data?.message);
      }
    })
    .catch((err) => {
      toast.error("An error occurred: " + err.message);
    });
  };

  const editModels = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("brand_id", data.brand_id); // Ensure brand_id is used here

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/models/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        toast.success("Model updated successfully");
        getModels();
        setOpen3(false);
        setData({ name: "", brand_id: "" });
        setName("");
      } else {
        toast.error("Error updating model: " + response.message);
      }
    })
    .catch(error => {
      console.error("Update error:", error);
      toast.error("An error occurred: " + error.message);
    });
  };

  const deleteModels = (e) => {
    e.preventDefault();
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/models/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const newModels = models.filter(item => item.id !== id); // Fix filtering logic
        setModels(newModels);
        setOpen2(false);
        toast.success("Model deleted successfully");
      } else {
        toast.error("You can't delete this");
      }
    })
    .catch(err => {
      console.log(err);
      toast.error("An error occurred: " + err.message);
    });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setBrand("");
  };

  const handleOpen2 = (id) => {
    setId(id);
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleOpen3 = (item) => {
    setId(item?.id);
    setOpen3(true);
    setData({
      name: item.name,
      brand_id: item.brand_id // Ensure brand_id is used here
    });
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  return (
    <div className={styles.tableContainer}>
      <nav className={styles.navbar}>
        <h2>Models</h2>
        <button className={styles.addBtn} onClick={handleOpen}>
          <IoMdAddCircle />
        </button>
      </nav>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {models.map((item, index) => (
            <tr key={index}>
              <td>{item?.name}</td>
              <td>{item?.brand_title}</td> {/* Ensure brand_title is correctly populated */}
              <td>
                <div className={styles.btns}>
                  <button className={`${styles.btn} ${styles.btnRed}`} onClick={() => handleOpen2(item.id)}>
                    <MdDeleteForever className="delete-icon"/>
                  </button>
                  <button className={`${styles.btn} ${styles.btnBlue}`} onClick={() => handleOpen3(item)}>
                    <CiEdit className="edit-icon"/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={open}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose}
      >
        <form onSubmit={createModels}>
          <div className={styles.row}>
            <label>Name</label>
            <Input value={name} onChange={(e) => setName(e?.target?.value)}/>
          </div>
          <div className={styles.row}>
            <label>Brand</label>
            <Select value={brand} placeholder="Select brand" onChange={(e) => setBrand(e)}>
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.id}>{brand.title}</Option>
              ))}
            </Select>
          </div>
          <button type='submit' className={styles.btnAdd}>Add</button>
        </form>
      </Modal>
      <Modal
        open={open2}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose2}
      >
        <p className={styles.deleteText}>Are you sure you want to delete?</p>
        <button className={styles.btnAdd} onClick={deleteModels}>Delete</button>
      </Modal>
      <Modal
        title={"Vertically centered modal dialog"}
        open={open3}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose3}
      >
        <form onSubmit={editModels}>
          <div className={styles.row}>
            <label>Name</label>
            <Input
              value={data.name} 
              onChange={(e) => setData({...data, name: e.target.value})}            
            />
          </div>
          <div className={styles.row}>
            <label>Brand</label>
            <Select 
              value={data.brand_id} // Ensure brand_id is used here
              onChange={(e) => setData({...data, brand_id: e})}>
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.id}>{brand.title}</Option>
              ))}
            </Select>
          </div>
          <button type='submit' className={styles.btnAdd}>Update</button>
        </form>
      </Modal>
    </div>
  );
}
