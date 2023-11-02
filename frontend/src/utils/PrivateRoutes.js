import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = ({ userData }) => {

    return(
        userData ? <Outlet/> : <Navigate to="/login"/>
    );
}

export default PrivateRoutes;