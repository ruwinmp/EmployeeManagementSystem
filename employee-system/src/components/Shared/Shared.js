import React,{Component} from "react";
import {NavLink} from 'react-router-dom';

export class Shared extends Component{
    render(){
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <h3 className="navbar-brand">
                        <NavLink to="/" className="nav-link">Employee System</NavLink>
                    </h3>
                    <ul className="navbar-nav">
                        <li className="new-item">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                        </li>
                        <li className="new-item">
                            <NavLink to="/Employee" className="nav-link">Employee</NavLink>
                        </li>
                        <li className="new-item">
                            <NavLink to="/Department" className="nav-link">Department</NavLink>
                        </li>
                    </ul>
                </nav>
            </React.Fragment>   
        )
    }
}