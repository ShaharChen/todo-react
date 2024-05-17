import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToDo } from './ToDo';
import Login from './Login';

export const Routers = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/ToDo" element={   <ToDo />} />
            </Routes>
        </Router>
    )
};