import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CarOutlined,
} from '@ant-design/icons';
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { RiMedalFill } from "react-icons/ri";
import { GrLocation } from "react-icons/gr";
import { PiBuildingsBold } from "react-icons/pi";
import { FaWordpressSimple } from "react-icons/fa";
import styles from "../home/Home.module.css"

import { Button, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Brands } from '../brands/Brands';
import { Cities } from '../cities/Cities';
import { Location } from '../location/Location';
import { Cars } from '../cars/Cars';
import { Models } from '../models/Models';
import Categories from '../categories/Categories';

const { Header, Sider, Content } = Layout;

const Home = () => {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical">
                    <h2 className={styles.logo}>Auto</h2>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                >
                    <Menu.Item key="1" icon={<HiOutlineClipboardDocument />}>
                        <Link to="categories">Categories</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<RiMedalFill />}>
                        <Link to="brands">Brands</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<PiBuildingsBold />}>
                        <Link to="cities">Cities</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<GrLocation />}>
                        <Link to="location">Location</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<CarOutlined />}>
                        <Link to="cars">Cars</Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<FaWordpressSimple />}>
                        <Link to="models">Models</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 15,
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Button className={styles.logOut} onClick={logout}>
                        <p>Logout</p>
                    </Button>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: "80vh",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Routes>
                        <Route path="categories" element={<Categories />} />
                        <Route path="brands" element={<Brands />} />
                        <Route path="cities" element={<Cities />} />
                        <Route path="location" element={<Location />} />
                        <Route path="cars" element={<Cars />} />
                        <Route path="models" element={<Models />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
