import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = ({ userID }) => {

    return(
        userID ? <Outlet/> : <Navigate to="/login"/>
    );
}

export default PrivateRoutes;