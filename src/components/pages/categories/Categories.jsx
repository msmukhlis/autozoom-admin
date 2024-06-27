import { MdDeleteForever } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import styles from './Categories.module.css';
import { useEffect, useState } from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { Modal } from 'antd';
import Input from 'antd/es/input/Input';
import { toast } from 'react-toastify';


const Categories = () => {

    const [category, setCategory] = useState([])
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [nameEn, setNameEn] = useState()
    const [nameRu, setNameRu] = useState()
    const [image, setImage] = useState()
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [id, setId] = useState(null)

    const token = localStorage.getItem('accessToken')
 
    const handleOpen = (id) => {
        setId(id)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen2 = (id) => {
        setId(id)
        setOpen2(true);
    };
    const handleClose2 = () => {
        setOpen2(false);
    }

    useEffect(() => {
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories')
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCategory(data?.data)
            });
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
        e.preventDefault()
        const formData = new FormData()
        formData.append("name_en", nameEn)
        formData.append("name_ru", nameRu)
        formData.append("images", image)
    
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                getCategory()
                setOpen(false)
                setNameEn("")
                setNameRu("")
                setImage("")
                toast.success("Succesfully")
            })
            .catch((err) => {
                console.log(err.message);
                toast.error("Something wrong!")
            });
    }

    const deleteCategory = (e) => {
        e.preventDefault()
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
              toast.error(data.message);
            }
          })
          .catch(err => {
            console.log(err);
            toast.error("An error occurred: " + err.message);
          });
    
      }

    
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
                title="Add Category"
                visible={true}
                open={open}
                onOk={handleOk}
                footer={null}
                confirmLoading={confirmLoading}
                onCancel={handleClose}
            >
                <form onSubmit={createCategory}>
                    <div className={styles.row}>
                        <label>Name_En</label>
                        <Input onChange={(e) => setNameEn(e?.target?.value)} />
                    </div>
                    <div className={styles.row}>
                        <label>Name_Ru</label>
                        <Input onChange={(e) => setNameRu(e?.target?.value)} />
                    </div>
                    <input onChange={(e) => setImage(e?.target?.files[0])} type="file" accept='image/*' required />
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
                    <button onClick={deleteCategory} className={styles.btnAdd}>Delete</button>
                
            </Modal>
        </div>
    );
};

export default Categories;
