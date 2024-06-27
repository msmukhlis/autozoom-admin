import { Form, Input, Modal, Select, Upload, message } from "antd";
import styles from "../brands/Brands.module.css"
import { IoMdAddCircle } from "react-icons/io";
import { MdDeleteForever } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";

export const Brands = () => {
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState('');
  // const [fileList, setFileList] = useState([
  // ]);
  // const handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  // };
  // const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  // const uploadButton = (
  //   <button
  //     style={{
  //       border: 0,
  //       background: 'none',
  //     }}
  //     type="button"
  //   >
  //     <PlusOutlined />
  //     <div
  //       style={{
  //         marginTop: 8,
  //       }}
  //     >
  //       Upload
  //     </div>
  //   </button>
  // );

  const[brands, setBrands] = useState([])
  const imgURL = `https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images`
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [open, setOpen] = useState(false)

  const getBrands = () => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/brands`)
    .then(res => res.json())
    .then(data => {
      setBrands(data?.data || []);
    }).catch(err => {
      console.log(err);
      toast.error("Failed to fetch brands");
    });
  }

  useEffect(() => {
    getBrands();
  }, []);

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
      <h2>Brands</h2>
      <button className={styles.addBtn} onClick={setOpen}>
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
              {console.log(item)}
              <img src={`${imgURL}/${item?.image_src}`} alt="Car Image" />
            </td>
            <td>
              <div className={styles.btns}>
                <button className={`${styles.btn} ${styles.btnRed}`}>
                  <MdDeleteForever className="delete-icon" />
                </button>
                <button className={`${styles.btn} ${styles.btnBlue}`}>
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
      onCancel={handleCancel}
    >
      <form>
        <div className={styles.row}>
          <label>Brand Name</label>
          <Input/>
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
    {/* <Modal
      open={open2}
      onOk={handleOpen2}
      footer={null}
      confirmLoading={confirmLoading}
      onCancel={handleClose2}
    >
      <p className={styles.deleteText}>Are you sure to delete?</p>
      <button className={styles.btnAdd} onClick={deleteCars}>Delete</button>

    </Modal> */}
    {/* <Modal
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
    </Modal> */}


  </div>
  )
}
