import styles from "../location/Location.module.css";
import { Form, Input, Modal, Upload, message } from "antd";
import { IoMdAddCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";

export const Location = () => {
  const [location, setLocation] = useState([]);
  const imgURL = `https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images`;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [id, setId] = useState("");
  const [data, setData] = useState({ name: "", slug: "", image: null });
  const token = localStorage.getItem("accessToken");

  const getLocation = () => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/locations`)
      .then((res) => res.json())
      .then((data) => {
        setLocation(data?.data || []);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch locations");
      });
  };

  useEffect(() => {
    getLocation();
  }, []);

  const createLocation = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("images", image);

    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/locations", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success(data?.message);
          getLocation();
          handleClose();
        } else {
          toast.error(data?.message);
        }
      })
      .catch((err) => {
        toast.error("An error occurred: " + err.message);
      });
  };

  const editLocations = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    if (image) {
      formData.append("images", image);
    }

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/locations/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          toast.success("Location updated successfully");
          getLocation();
          setOpen3(false);
          setData({ name: "", slug: "", image: null });
          setName("");
          setSlug("");
          setImage(null);
        } else {
          toast.error("Error updating location: " + response.message);
        }
      })
      .catch((error) => {
        console.error("Update error:", error);
        toast.error("An error occurred: " + error.message);
      });
  };

  const deleteLocations = (e) => {
    e.preventDefault();
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/locations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const newLocations = location.filter((item) => item.id !== id);
          setLocation(newLocations);
          setOpen2(false);
          toast.success("Location deleted successfully");
        } else {
          toast.error("You can't delete this");
        }
      })
      .catch((err) => {
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
    setName("");
    setSlug("");
    setImage(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setSlug("");
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
      name: item.name,
      slug: item.slug,
      image: item.image_src,
    });
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const beforeUpload = (file) => {
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isValidFile = allowedExtensions.includes(fileExtension);

    if (!isValidFile) {
      message.error("You can only upload JPG/JPEG/PNG files!");
    }

    return isValidFile;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div className={styles.tableContainer}>
      <nav className={styles.navbar}>
        <h2>Locations</h2>
        <button className={styles.addBtn} onClick={handleOpen}>
          <IoMdAddCircle />
        </button>
      </nav>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {location.map((item, index) => (
            <tr key={index}>
              <td>{item?.name}</td>
              <td>{item?.slug}</td>
              <td>
                <img src={`${imgURL}/${item?.image_src}`} alt="" />
              </td>
              <td>
                <div className={styles.btns}>
                  <button
                    className={`${styles.btn} ${styles.btnRed}`}
                    onClick={() => handleOpen2(item.id)}
                  >
                    <MdDeleteForever className="delete-icon" />
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnBlue}`}
                    onClick={() => handleOpen3(item)}
                  >
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
        <form onSubmit={createLocation}>
          <div className={styles.row}>
            <label>Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.row}>
            <label>Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <Form.Item
            label="Upload location images"
            rules={[{ required: true, message: "Please upload images" }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              customRequest={({ onSuccess }) => {
                onSuccess("ok");
              }}
              beforeUpload={beforeUpload}
              listType="picture-card"
              onChange={(info) => {
                if (info.file.status === "done") {
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
          <button type="submit" className={styles.btnAdd}>
            Add
          </button>
        </form>
      </Modal>
      <Modal
        open={open2}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose2}
      >
        <p className={styles.deleteText}>Are you sure you want to delete?</p>
        <button className={styles.btnAdd} onClick={deleteLocations}>Delete</button>
      </Modal>
      <Modal
        title={"Edit Location"}
        open={open3}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose3}
      >
        <form onSubmit={editLocations}>
          <div className={styles.row}>
            <label>Name</label>
            <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div className={styles.row}>
            <label>Slug</label>
            <Input value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} />
          </div>
          <Form.Item
            label="Upload location images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              customRequest={({ onSuccess }) => {
                onSuccess("ok");
              }}
              beforeUpload={beforeUpload}
              listType="picture-card"
              onChange={(info) => {
                if (info.file.status === "done") {
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
          <button type="submit" className={styles.btnAdd}>
            Update
          </button>
        </form>
      </Modal>
    </div>
  );
};
