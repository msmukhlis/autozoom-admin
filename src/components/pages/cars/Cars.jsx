import styles from "../cars/Cars.module.css"
import { useEffect, useState } from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { MdDeleteForever } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { Form, Input, Modal, Select, message } from "antd";
import { toast } from "react-toastify";
import { Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });



export const Cars = () => {

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([
  ]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );


  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [cars, setCars] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [locations, setLocations] = useState([])
  const [cities, setCities] = useState([])
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [location, setLocation] = useState("")
  const [color, setColor] = useState("")
  const [city, setCity] = useState("")
  const [category, setCategory] = useState("")
  const [year, setYear] = useState("")
  const [seconds, setSeconds] = useState("")
  const [deposit, setDeposit] = useState("")
  const [image, setImage] = useState("")
  const [image2, setImage2] = useState("")
  const [image3, setImage3] = useState("")
  const [speed, setSpeed] = useState("")
  const [people, setPeople] = useState("")
  const [motor, setMotor] = useState("")
  const [transmission, setTransmission] = useState("")
  const [side, setSide] = useState("")
  const [fuel, setFuel] = useState("")
  const [limit, setLimit] = useState("")
  const [price, setPrice] = useState("")
  const [aed, setAed] = useState("")
  const [usd, setUsd] = useState("")
  const [aed2, setAed2] = useState("")
  const [usd2, setUsd2] = useState("")
  const [id, setId] = useState(null)
  const [data, setData] = useState({ brand_id: "", model_id: "", color: "", city_id: "" });

  const token = localStorage.getItem("accessToken")

  const switchToggle = (checked) => {
    console.log(`switch to ${checked}`);
  };


  const getCars = () => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cars`)
      .then(res => res.json())
      .then(data => {
        setCars(data?.data || []);
      }).catch(err => {
        console.log(err);
        toast.error("Failed to fetch locations");
      });
  };

  useEffect(() => {
    getCars();
  }, []);

  useEffect(() => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data?.data);
      });
  }, []);

  useEffect(() => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/brands")
      .then((res) => res.json())
      .then((data) => {
        setBrands(data?.data);
      });
  }, []);

  useEffect(() => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models")
      .then((res) => res.json())
      .then((data) => {
        setModels(data?.data);
      });
  }, []);

  useEffect(() => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/cities")
      .then((res) => res.json())
      .then((data) => {
        setCities(data?.data);
      });
  }, []);

  useEffect(() => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data?.data);
      });
  }, []);

  const createCars = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brand_id", brand);
    formData.append("model_id", model);
    formData.append("city_id", city);
    formData.append("color", color);
    formData.append("year", year);
    formData.append("seconds", seconds);
    formData.append("category_id", category);
    formData.append("max_speed", speed);
    formData.append("max_people", people);
    formData.append("transmission", transmission);
    formData.append("motor", motor);
    formData.append("drive_side", side);
    formData.append("petrol", fuel);
    formData.append("limitperday", limit);
    formData.append("deposit", deposit);
    formData.append("premium_protection", price);
    formData.append("price_in_aed", aed);
    formData.append("price_in_usd", usd);
    formData.append("price_in_aed_sale", aed2);
    formData.append("price_in_usd_sale", usd2);
    formData.append("images", image);
    formData.append("images", image2);
    formData.append("images", image3);

    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/cars", {
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
          getCars();
          handleClose();
        } else {
          toast.error(data?.message);
        }
      })
      .catch((err) => {
        toast.error("An error occurred: " + err.message);
      });
  };

  const deleteCars = (e) => {
    e.preventDefault()
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cars/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const newCars = cars.filter(item => item.id !== id);
          setCars(newCars);
          setOpen2(false);
          toast.success("Cars deleted successfully");
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => {
        console.log(err);
        toast.error("An error occurred: " + err.message);
      });

  }

  const editCars = (e) => {
    e.preventDefault();

    console.log("Edit Cars Data:", data);

    const formData = new FormData();
    formData.append("brand_id", data.brand_id);
    formData.append("model_id", data.model_id);
    formData.append("city_id", data.city_id);
    formData.append("color", data.color);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cars/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          toast.success("Cars updated successfully");
          getCars();
          setOpen3(false);
          // Reset form state
          setData({ brand_id: "", model_id: "", color: "", city_id: "" });
          setBrand("");
          setModel("");
          setCity("");
          setColor("");
        } else {
          toast.error("Error updating cars: " + response.message);
        }
      })
      .catch(error => {
        console.error("Update error:", error);
        toast.error("An error occurred: " + error.message);
      });
  };


  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setBrand("");
    setModel("");
    setCity("");
    setColor("");
    setOpen(false)
  }
  const handleOpen2 = (id) => {
    setId(id)
    setOpen2(true);
  };
  const handleClose2 = () => {
    setBrand("");
    setModel("");
    setCity("");
    setColor("");
    setOpen2(false)
  }
  const handleEdit = (item) => {
    console.log(item);
    setId(item.id);
    setOpen3(true);
    setData({
      brand_id: item.brand_id,
      model_id: item.model_id,
      city_id: item.city_id,
      color: item.color,
    });
  };


  const handleClose3 = () => {
    setBrand("");
    setModel("");
    setCity("");
    setColor("");
    setOpen3(false)
  }

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
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
  }
  return (
    <div className={styles.tableContainer}>
      <nav className={styles.navbar}>
        <h2>Cars</h2>
        <button className={styles.addBtn} onClick={handleOpen}>
          <IoMdAddCircle />
        </button>
      </nav>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Color</th>
            <th>City</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars?.map((item, index) => (
            <tr key={index}>
              <td>{item?.brand?.title}</td>
              <td>{item?.model?.name}</td>
              <td>{item?.color}</td>
              <td>{item?.city?.name}</td>
              <td>
                <div className={styles.btns}>
                  <button className={`${styles.btn} ${styles.btnRed}`} onClick={() => handleOpen2(item.id)}>
                    <MdDeleteForever className="delete-icon" />
                  </button>
                  <button className={`${styles.btn} ${styles.btnBlue}`} onClick={() => handleEdit(item)}>
                    <CiEdit className="edit-icon" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      <Modal
        title={"Vertically centered modal dialog"}
        open={open}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={createCars}>
          <div className={styles.row}>
            <label>Category</label>
            <Select
              placeholder="Select Category"
              onChange={(e) => setCategory(e)}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>{category.name_en}</Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <label>Brand</label>
            <Select
              value={brand}
              onChange={(e) => setBrand(e)}
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.title}</option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <label>Model</label>
            <Select
              value={model}
              onChange={(e) => setModel(e)}
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <label>Location</label>
            <Select
              value={location}
              onChange={(e) => setLocation(e)}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <label>City</label>
            <Select
              value={city}
              onChange={(e) => setCity(e)}
            >
              {cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <label>Color</label>
            <Input onChange={(e) => setColor(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Year</label>
            <Input onChange={(e) => setYear(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Seconds</label>
            <Input onChange={(e) => setSeconds(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Speed</label>
            <Input onChange={(e) => setSpeed(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Max people</label>
            <Input onChange={(e) => setPeople(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Motor</label>
            <Input onChange={(e) => setMotor(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Transmission</label>
            <Input onChange={(e) => setTransmission(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Drive Side</label>
            <Input onChange={(e) => setSide(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Fuel</label>
            <Input onChange={(e) => setFuel(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Limit Per Day</label>
            <Input onChange={(e) => setLimit(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Deposite</label>
            <Input onChange={(e) => setDeposit(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Premium Protection Price</label>
            <Input onChange={(e) => setPrice(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Price in AED</label>
            <Input onChange={(e) => setAed(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Price in USD(Otd)</label>
            <Input onChange={(e) => setUsd(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Price in AED (Otd)</label>
            <Input onChange={(e) => setAed2(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Price in USD</label>
            <Input onChange={(e) => setUsd2(e?.target?.value)} />
          </div>
          <div className={styles.row}>
            <label>Inclusive</label>
            <Switch defaultChecked onChange={switchToggle} className={styles.switch} />
          </div>
          <div className={styles.row}>
            <label>Upload car images</label>
            <Form.Item
              name="images"
              label="Upload car images"
              rules={[{ required: true, message: 'Please upload images' }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              onChange={(e) => setImage(e.target.files[0])}
            >
              <Upload
                customRequest={({ onSuccess }) => {
                  onSuccess('ok');
                }}
                beforeUpload={beforeUpload}
                listType="picture-card"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item
              name="images"
              label="Upload car images"
              rules={[{ required: true, message: 'Please upload images' }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              onChange={(e) => setImage2(e.target.files[0])}
            >
              <Upload
                customRequest={({ onSuccess }) => {
                  onSuccess('ok');
                }}
                beforeUpload={beforeUpload}
                listType="picture-card"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item
              name="images"
              label="Upload car images"
              rules={[{ required: true, message: 'Please upload images' }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              onChange={(e) => setImage3(e.target.files[0])}
            >
              <Upload
                customRequest={({ onSuccess }) => {
                  onSuccess('ok');
                }}
                beforeUpload={beforeUpload}
                listType="picture-card"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </div>
          <button type='submit' className={styles.btnAdd}>Add</button>
        </form>
      </Modal>
      <Modal
        open={open2}
        onOk={handleOpen2}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose2}
      >
        <p className={styles.deleteText}>Are you sure to delete?</p>
        <button className={styles.btnAdd} onClick={deleteCars}>Delete</button>

      </Modal>
      <Modal
        title={"Vertically centered modal dialog"}
        open={open3}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleClose3}
      >
        <form onSubmit={editCars}>
          <div className={styles.row}>
            <label>Brand</label>
            <Select
              value={data.brand_id}
              onChange={(value) => setData({ ...data, brand_id: value })}
            >
              {brands.map((brand) => (
                <Select.Option key={brand.id} value={brand.id}>{brand.title}</Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <label>Model</label>
            <Select
              value={data.model_id}
              onChange={(value) => setData({ ...data, model_id: value })}
            >
              {models.map((model) => (
                <Select.Option key={model.id} value={model.id}>{model.name}</Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <label>Color</label>
            <Input value={data.color} onChange={(e) => setData({ ...data, color: e.target.value })} />
          </div>
          <div className={styles.row}>
            <label>City</label>
            <Select
              value={data.city_id}
              onChange={(value) => setData({ ...data, city_id: value })}
            >
              {cities.map((city) => (
                <Select.Option key={city.id} value={city.id}>{city.name}</Select.Option>
              ))}
            </Select>
          </div>
          <button type='submit' className={styles.btnAdd}>Update</button>
        </form>
      </Modal>


    </div>
  )
}
