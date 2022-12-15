import React, {Component} from "react";
import TaskList from "../TaskList/TaskList";


class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        return (
            <>
                <TaskList/>
            </>
        );
    }
}

export default Board;