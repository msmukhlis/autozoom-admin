import { useState } from "react"
import styles from "../login/Login.module.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const[name, setName] = useState("")
    const[password, setPassword] = useState("")
    const navigate = useNavigate()
    const token = localStorage.getItem("accesstoken")

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                phone_number: name,
                password: password
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
             .then((response) => response.json())
             .then((data) => { 
                if(data?.success===true) {
                    toast.success("Successfully")
                    localStorage.setItem("accesstoken", data?.data?.tokens?.accessToken?.token)
                    navigate("/home")
                } else {
                    toast.error("error")
                }
             })
             .catch((err) => {
                console.log(err.message);
             });
    }
  return (
    <div className={styles.container}>
       <form className={styles.form}>
        <h2 className={styles.title}>Login</h2>
            <div className={styles.row}>
                <label className={styles.label}>
                    User name
                </label>
                <input onChange={(e)=>setName(e?.target?.value)} className={styles.input} type="text" />
            </div>
            <div className={styles.row}>
                <label className={styles.label}>
                    Password
                </label>
                <input  onChange={(e)=>setPassword(e?.target?.value)}  className={styles.input} type="password"  />
            </div>
            <button onClick={handleSubmit} className={styles.btn}>
                Log in
            </button>
       </form>
    </div>
  )
}
