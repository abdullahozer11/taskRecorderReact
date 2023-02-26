import React, {Component} from "react";

import './TaskList.css';
import { v4 as uuidv4 } from 'uuid';

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            newTaskDescription: '',
        };
    };

    componentDidMount = () => {
        window.addEventListener('keydown', this.handleKeyDown);
        const tasks = JSON.parse(window.localStorage.getItem('tasks'));
        if (tasks) {
            this.setState({
                tasks: tasks,
            });
        }
    }

    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.addTask();
        }
    }

    deleteTask = (id) => {
        const copyTasks = [...this.state.tasks];
        const index = copyTasks.findIndex((item) => item.id === id);
        copyTasks.splice(index, 1);
        this.setState({
            tasks: copyTasks,
        });
        window.localStorage.setItem('tasks', JSON.stringify(copyTasks));
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.addTask();
    };

    handleTaskDescriptionChange = (event) => {
        this.setState({newTaskDescription: event.target.value});
    };

    toggleCheckbox(event, id) {
        const copyTasks = [...this.state.tasks];
        const index = copyTasks.findIndex((item) => item.id === id);
        copyTasks[index].isCompleted = event.target.checked;
        this.setState({
            tasks: copyTasks,
        });
    };

    addTask = () => {
        const newTaskDescription = this.state.newTaskDescription;
        if (newTaskDescription) {
            const newTask = {
                id: uuidv4(),
                description: newTaskDescription,
                isCompleted: false,
            };
            const copyTasks = [...this.state.tasks];
            copyTasks.unshift(newTask);
            this.setState({
                tasks: copyTasks,
                newTaskDescription: '',
            });
            window.localStorage.setItem('tasks', JSON.stringify(copyTasks));
        }
    };

    render() {
        const tasks = this.state.tasks;
        return (
            <div className="container">
                <div className="header">
                    <h1>Todo List</h1>
                </div>
                <div className="content">
                    <div className="input">
                        <input type="text" id="input" value={this.state.newTaskDescription}
                               onChange={this.handleTaskDescriptionChange}
                               placeholder="Enter your todo"/>
                        <button id="add" onClick={this.addTask}>Add</button>
                    </div>
                    <div className="todo-list">
                        <ul className="tasks">
                            {tasks.map((task) => (
                                <li key={task.id}>
                                    <input type="checkbox" id={task.id}
                                           onChange={(event) => this.toggleCheckbox(event, task.id)}/>
                                    <label htmlFor={task.id}>{task.description}</label>
                                    <a className="trash-icon" href="" onClick={(event) => {
                                        event.preventDefault();
                                        this.deleteTask(task.id);
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width={"20"} height={"20"}>
                                            <path
                                                d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"/>
                                                fill="#666"/>
                                        </svg>
                                    </a>
                                </li>))}
                        </ul>
                    </div>
                </div>
            </div>);
    };
}

export default TaskList;