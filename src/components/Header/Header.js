import React, {Component} from "react";


class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a href="#" className="nav-link">Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">About</a>
                        </li>
                        <li className="nav-item">
                            <form className="form-inline my-2 my-lg-0">
                                <input className="form-control mr-sm-2" type="search" placeholder="Search"
                                       aria-label="Search">
                                </input>
                            </form>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </li>
                    </ul>
                </nav>
            </>
    );
    }
    }

    Header.propTypes = {};

    export default Header;