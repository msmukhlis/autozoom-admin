import { Form, Input, Modal, Upload, message } from "antd";
import styles from "../brands/Brands.module.css";
import { IoMdAddCircle } from "react-icons/io";
import { MdDeleteForever } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";

export const Brands = () => {
  const [brands, setBrands] = useState([]);
  const imgURL = `https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images`;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [id, setId] = useState("");
  const [data, setData] = useState({ title: "", images: ""})
  const token = localStorage.getItem("accessToken");


  const getBrands = () => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/brands`)
      .then(res => res.json())
      .then(data => {
        setBrands(data?.data || []);
      })
      .catch(err => {
        console.log(err);
        toast.error("Failed to fetch brands");
      });
  };
  useEffect(() => {
    getBrands();
  }, []);

  const createBrands = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", name);
    formData.append("images", image);

    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/brands", {
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
          getBrands();
          handleClose();
        } else {
          toast.error(data?.message);
        }
      })
      .catch((err) => {
        toast.error("An error occurred: " + err.message);
      });
  };

  const deleteBrands = (e) => {
    e.preventDefault();
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/brands/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const newBrands = brands.filter(item => item.id !== id);
          setBrands(newBrands);
          setOpen2(false);
          toast.success("Brand deleted successfully");
        } else {
          toast.error("You can't delete this");
        }
      })
      .catch(err => {
        console.log(err);
        toast.error("An error occurred: " + err.message);
      });
  };
  
  const editBrands = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", data.title); 
    if (image) {
      formData.append("images", image);
    }
  
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/brands/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          toast.success("Brand updated successfully");
          getBrands();
          setOpen3(false);
          setData({ title: "", images: null });
          setName("");
          setImage(null);
        } else {
          toast.error("Error updating brand: " + response.message);
        }
      })
      .catch(error => {
        console.error("Update error:", error);
        toast.error("An error occurred: " + error.message);
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

  const beforeUpload = (file) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidFile = allowedExtensions.includes(fileExtension);

    if (!isValidFile) {
      message.error('You can only upload JPG/JPEG/PNG files!');
    }

    return isValidFile;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setImage(null);
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
      title: item.title,
      images: item.image_src
    });
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  return (
    <div className={styles.tableContainer}>
      <nav className={styles.navbar}>
        <h2>Brands</h2>
        <button className={styles.addBtn} onClick={handleOpen}>
          <IoMdAddCircle />
        </button>
      </nav>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {brands?.map((item, index) => (
            <tr key={index}>
              <td>{item?.title}</td>
              <td>
                <img src={`${imgURL}/${item?.image_src}`} alt="Car Image" />
              </td>
              <td>
                <div className={styles.btns}>
                  <button className={`${styles.btn} ${styles.btnRed}`} onClick={() => handleOpen2(item.id)}>
                    <MdDeleteForever className="delete-icon"/>
                  </button>
                  <button className={`${styles.btn} ${styles.btnBlue}`} onClick={() => handleOpen3(item)}>
                    <CiEdit className="edit-icon" />
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
        <form onSubmit={createBrands}>
          <div className={styles.row}>
            <label>Brand Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Form.Item
            label="Upload car images"
            rules={[{ required: true, message: 'Please upload images' }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              customRequest={({ onSuccess }) => {
                onSuccess('ok');
              }}
              beforeUpload={beforeUpload}
              listType="picture-card"
              onChange={(info) => {
                if (info.file.status === 'done') {
                  setImage(info.file.originFileObj);
                }
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <button type='submit' className={styles.btnAdd}>Add</button>
        </form>
      </Modal>
      <Modal
        open={open2}
        onOk={deleteBrands}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose2}
      >
        <p className={styles.deleteText}>Are you sure you want to delete?</p>
        <button className={styles.btnAdd} onClick={deleteBrands}>Delete</button>
      </Modal>
      <Modal
        title={"Vertically centered modal dialog"}
        open={open3}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose3}
      >
        <form onSubmit={editBrands}>
          <div className={styles.row}>
            <label>Brand Name</label>
            <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          </div>
          <Form.Item
            label="Upload car images"
            rules={[{ required: true, message: 'Please upload images' }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              customRequest={({ onSuccess }) => {
                onSuccess('ok');
              }}
              beforeUpload={beforeUpload}
              listType="picture-card"
              onChange={(info) => {
                if (info.file.status === 'done') {
                  setImage(info.file.originFileObj);
                }
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <button type='submit' className={styles.btnAdd}>Update</button>
        </form>
      </Modal>
    </div>
  );
};
