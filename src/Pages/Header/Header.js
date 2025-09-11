import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';
import twdalogo from "../../Assets/twdaLogo.jpeg";
import meillogo from "../../Assets/meillogo.png";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');

    const getSubtitle = (pathname) => {
        switch (pathname) {
            case '/gis-map':
                return 'GIS BASED MAP';
            case '/rwph-table':
                return 'RAW WATER PUMP STATION';
            case '/cwph-table':
                return 'CLEAR WATER PUMP STATION';
            case '/block-diagram':
                return 'BLOCK DIAGRAM';
            default:
                return 'SCADA SYSTEM';
        }
    };

    const subtitle = getSubtitle(location.pathname);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        const storedUsername = localStorage.getItem('username');
        toast.success(`${storedUsername || 'Guest'} logged out successfully!`, {
            position: 'top-right',
            autoClose: 2000,
            style: { fontFamily: "'Courier New', Courier, monospace", fontWeight: "bold" },
        });
        localStorage.clear();
        setTimeout(() => navigate('/'), 2000);
    };

    const navigateToBlockDiagram = () => {
        navigate('/block-diagram');
    };
    const navigateToHome = () => {
        navigate('/gis-map');
    };

    return (
        <>
            <header>
                <div className="logo-container">
                    <img src={twdalogo} alt="Logo" className="logo" />
                </div>
                <div className="header-content">
                    <div className="header-title">
                        WATER MANAGEMENT SOFTWARE
                    </div>
                    <div
                        className={`header-subtitle ${
                            subtitle === "RWPH" || subtitle === "CWPH" ? "blink" : ""
                        }`}
                    >
                        {subtitle}
                    </div>
                </div>
                <div className="right-section">
                    <div className="user-section">
                        <button className="Home" onClick={navigateToHome}>HOME</button>
                        <button className="block-diagram" onClick={navigateToBlockDiagram}>BLOCK DIAGRAM</button>
                        <div className="user-details">
                            <small className="user">
                                USER: <span className="username">{username || 'Guest'}</span>
                            </small>
                            <button className="logout" onClick={handleLogout}>LOGOUT</button>
                        </div>
                    </div>
                    <div className="logo-container-right">
                        <img src={meillogo} alt="Another Logo" className="logo" />
                    </div>
                </div>
            </header>
            <ToastContainer />
        </>
    );
};

export default Header;
