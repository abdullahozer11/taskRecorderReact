import React from "react";

import axios from "axios";
import {ListGroup} from "react-bootstrap";

import {API_URL} from "../../constants";
import './FetchedTaskList.css';


class FetchedTaskList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            newTaskDescription: '',
        };
    }

    componentDidMount = () => {
        // Add an event listener for keyboard events
        window.addEventListener('keydown', this.handleKeyDown);
        // fetch the data using axios
        this.getTasks();
    };

    // Remove the event listener when the component unmounts
    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    // send a get request the fetch the updated list of tasks
    getTasks = () => {
        axios.get(API_URL).then(res => this.setState({
            tasks: res.data.results
        }));
    };

    // reset state after certain actions
    resetState = () => {
        this.getTasks();
    };

    // This function will be called whenever a keyboard event occurs
    handleKeyDown = (event) => {
        // Check if the key pressed was the enter key
        if (event.key === 'Enter') {
            // Trigger the desired behavior for the button here
            this.addTask();
        }
    }

    dragStart(event, id) {
        // remember source tasks id
        event.dataTransfer.setData('id', id);
    };

    dragOver(event) {
        // prevent default in case of wrong drag action
        event.preventDefault();
    };

    drop = (event, targetId) => {
        // get initial task's id
        const id = event.dataTransfer.getData('id');
        // shallow copy the tasks list
        const tasksCopy = [...this.state.tasks];
        // find source index in order to get the task to move
        const sourceIndex = tasksCopy.findIndex((item) => item.id === parseInt(id));
        // find target index so that we can place the source task in the right place
        const targetIndex = tasksCopy.findIndex((item) => item.id === targetId);
        // splice the task from the source index
        const [removed] = tasksCopy.splice(sourceIndex, 1);
        // use again the splice method to inject our task in the right index
        tasksCopy.splice(targetIndex, 0, removed);
        // set state to finalize
        this.setState({
            tasks: tasksCopy,
        });
    };

    deleteTask = (id) => {
        axios.delete(`${API_URL}${id}/`).then(() => {
            this.resetState();
        })
    };

    handleSubmit = (event) => {
        // prevent default form submission behavior
        event.preventDefault();
        this.addTask();
    };

    handleTaskDescriptionChange = (event) => {
        // Update the value of the taskDescription state property with the value from the input field
        this.setState({
            newTaskDescription: event.target.value
        });
    };

    toggleCheckbox = async (event, id, isCompleted) => {
        // send put request to update task
        axios.put(`${API_URL}${id}/`, {
            isCompleted: !isCompleted,
        }).then(() => {
            this.resetState();
        });
    };

    addTask = () => {
        if (this.state.newTaskDescription.length) {
            axios.post(API_URL, {
                description: this.state.newTaskDescription,
            }).then(() => {
                this.setState({
                    newTaskDescription: "",
                });
                this.resetState();
            });
        }
    }

    render() {
        const tasks = this.state.tasks;
        return (
            <>
                <div className="page-content page-container" id="page-content">
                    <div className="padding">
                        <div className="row container d-flex justify-content-center">
                            <div className="col-md-12">
                                <div className="card px-3">
                                    <div className="card-body">
                                        <h4 className="card-title">Task List</h4>
                                        <div className="add-items d-flex">
                                            <input type="text"
                                                   className="form-control todo-list-input"
                                                   placeholder="What do you need to do today?"
                                                   onChange={this.handleTaskDescriptionChange}
                                                   value={this.state.newTaskDescription}
                                            />
                                            <button
                                                onClick={this.handleSubmit}
                                                className="add btn btn-primary font-weight-bold todo-list-add-btn">Add
                                            </button>
                                        </div>
                                        <div className="list-wrapper">
                                            <ul className="d-flex flex-column-reverse todo-list">
                                                <ListGroup>
                                                    {tasks.map((task) => (
                                                        <ListGroup.Item
                                                            key={task.id}
                                                            draggable
                                                            onDragStart={(event) => this.dragStart(event, task.id)}
                                                            onDragOver={this.dragOver}
                                                            onDrop={(event) => this.drop(event, task.id)}
                                                        >
                                                            <li key={task.id}
                                                                className={(task.isCompleted ? 'completed' : '')}>
                                                                <div className="form-check">
                                                                    <label className="form-check-label">
                                                                        <input className="checkbox"
                                                                               type="checkbox"
                                                                               onChange={(event) => this.toggleCheckbox(event, task.id, task.isCompleted)}
                                                                        />
                                                                        {task.description}
                                                                        <i className="input-helper"></i></label>
                                                                </div>
                                                                <div className="button-wrapper">
                                                                    <i onClick={() => this.deleteTask(task.id)}
                                                                       className="fa fa-trash fa-lg delete-task-button"
                                                                       aria-hidden="true">
                                                                    </i>
                                                                </div>
                                                            </li>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };
}

export default FetchedTaskList;
