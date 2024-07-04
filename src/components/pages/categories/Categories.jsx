import { MdDeleteForever } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import styles from './Categories.module.css';
import { useEffect, useState } from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { Form, Modal, Upload, message, Input } from 'antd';
import { toast } from 'react-toastify';
import { PlusOutlined } from '@ant-design/icons';

const Categories = () => {
    const [category, setCategory] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [image, setImage] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [id, setId] = useState(null);
    const [data, setData] = useState({ name_en: "", name_ru: "", images: "" });

    const token = localStorage.getItem('accessToken');

    const getCategory = () => {
        fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories`)
            .then(res => res.json())
            .then(data => {
                setCategory(data?.data || []);
            }).catch(err => {
                console.log(err);
                toast.error("Failed to fetch categories");
            });
    };

    useEffect(() => {
        getCategory();
    }, []);

    const createCategory = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name_en", nameEn);
        formData.append("name_ru", nameRu);
        formData.append("images", image);

        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    getCategory();
                    setOpen(false);
                    setNameEn("");
                    setNameRu("");
                    setImage(null);
                    toast.success("Successfully added category");
                } else {
                    toast.error(data.message);
                }
            })
            .catch((err) => {
                console.log(err.message);
                toast.error("Something went wrong!");
            });
    };

    const deleteCategory = (e) => {
        e.preventDefault();
        fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const newCategory = category.filter(item => item.id !== id);
                    setCategory(newCategory);
                    setOpen2(false);
                    toast.success("Category deleted successfully");
                } else {
                    toast.error("Failed to delete category");
                }
            })
            .catch(err => {
                console.log(err);
                toast.error("An error occurred: " + err.message);
            });
    };

    const editCategory = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name_en", data.name_en);
        formData.append("name_ru", data.name_ru);
        if (image) {
            formData.append("images", image);
        }

        fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
            method: 'PUT',
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    toast.success("Category updated successfully");
                    getCategory();
                    setOpen3(false);
                    setData({ name_en: "", name_ru: "", images: "" });
                    setImage(null);
                } else {
                    toast.error("Failed to update category: " + response.message);
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
        setOpen(false);
        setNameEn("");
        setNameRu("");
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
            name_en: item?.name_en || "",
            name_ru: item?.name_ru || "",
            images: item?.image_src || ""
        });
    };

    const handleClose3 = () => {
        setOpen3(false);
        setData({ name_en: "", name_ru: "", images: "" });
        setImage(null);
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

    return (
        <div className={styles.tableContainer}>
            <nav className={styles.navbar}>
                <h2>Categories</h2>
                <button className={styles.addBtn} onClick={handleOpen}>
                    <IoMdAddCircle />
                </button>
            </nav>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name_EN</th>
                        <th>Name_RU</th>
                        <th>Images</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {category?.map((item, index) => (
                        <tr key={index}>
                            <td>{item?.name_en}</td>
                            <td>{item?.name_ru}</td>
                            <td><img src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item?.image_src}`} alt="description" /></td>
                            <td>
                                <div className={styles.btns}>
                                    <button className={`${styles.btn} ${styles.btnRed}`} onClick={() => handleOpen2(item.id)}>
                                        <MdDeleteForever className="delete-icon" />
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
                title="Add Category"
                open={open}
                // onOk={handleOk}
                footer={null}
                confirmLoading={confirmLoading}
                onCancel={handleClose}
            >
                <form onSubmit={createCategory}>
                    <div className={styles.row}>
                        <label>Name_EN</label>
                        <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                    </div>
                    <div className={styles.row}>
                        <label>Name_RU</label>
                        <Input value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
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
                title="Delete Category"
                open={open2}
                footer={null}
                confirmLoading={confirmLoading}
                onCancel={handleClose2}
            >
                <p className={styles.deleteText}>Are you sure you want to delete this category?</p>
                <button onClick={deleteCategory} className={styles.btnAdd}>Delete</button>
            </Modal>
            <Modal
                title="Edit Category"
                open={open3}
                footer={null}
                confirmLoading={confirmLoading}
                onCancel={handleClose3}
            >
                <form onSubmit={editCategory}>
                    <div className={styles.row}>
                        <label>Name_EN</label>
                        <Input value={data.name_en} onChange={(e) => setData({ ...data, name_en: e.target.value })} />
                    </div>
                    <div className={styles.row}>
                        <label>Name_RU</label>
                        <Input value={data.name_ru} onChange={(e) => setData({ ...data, name_ru: e.target.value })} />
                    </div>
                    <Form.Item
                        label="Upload car images"
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

export default Categories;
