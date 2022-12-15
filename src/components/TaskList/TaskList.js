import React, {Component} from "react";
import {ListGroup} from 'react-bootstrap';

import './TaskList.css';

class TaskList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [
                {
                    id: 1,
                    desc: "Vehicle needs serious cleaning including with sprays and sponges.",
                    isCompleted: false,
                },
                {
                    id: 2,
                    desc: "Computer needs opening and dusting inside.",
                    isCompleted: false,
                },
                {
                    id: 3,
                    desc: "Dune needs to be finished. Read the damn book.",
                    isCompleted: false,
                },
            ],
            newTaskDescription: '',
        };
    };

    // Add an event listener for keyboard events
    componentDidMount = () => {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    // Remove the event listener when the component unmounts
    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

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

    terminateTask = (id) => {
        // remove the task by filtering the tasks
        const tasks = this.state.tasks.filter((t) => t.id !== id);
        // set back the tasks in state
        this.setState({tasks});
    };

    handleSubmit = (event) => {
        // prevent default form submission behavior
        event.preventDefault();

        this.addTask();
    };

    handleTaskDescriptionChange = (event) => {
        // Update the value of the taskDescription state property with the value from the input field
        this.setState({newTaskDescription: event.target.value});
    };

    toggleCheckbox(event, id) {
        const element = event.target;
        // Find the task with the specified id in the tasks list
        const task = this.state.tasks.find(task => task.id === id);
        // If the task was found, toggle its 'completed' property
        if (task) {
            task.isCompleted = !task.isCompleted;
        };
        // Find the closest parent element with the 'li' tag
        const listItem = element.closest("li");
        // Toggle the 'completed' class on the list item
        listItem.classList.toggle('completed');

        const sortedTasks =  this.state.tasks.sort((a, b) => {
            if (a.isCompleted && !b.isCompleted) {
                return 1;
            } else if (!a.isCompleted && b.isCompleted) {
                return -1;
            }
            return 0;
        });
        this.setState({
            tasks: sortedTasks,
        });
    };

    addTask = () => {
        // shallow copy of the tasks list
        const tasksCopy = [...this.state.tasks];
        // check if new task description data are not empty
        if (this.state.newTaskDescription.length) {
            // create a new task object using the current state
            const newTask = {
                id: tasksCopy.length + 1,
                desc: this.state.newTaskDescription,
            };

            // add the new task to the tasks list
            tasksCopy.unshift(newTask);

            // update the state with the new tasks list
            this.setState({
                tasks: tasksCopy,
                newTaskDescription: '',
            });
        }
    };

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
                                                            <li key={task.id}>
                                                                <div className="form-check">
                                                                    <label className="form-check-label">
                                                                        <input className="checkbox"
                                                                               type="checkbox"
                                                                               onChange={(event) => this.toggleCheckbox(event, task.id)}
                                                                        />
                                                                        {task.desc}
                                                                        <i className="input-helper"></i></label>
                                                                </div>
                                                                <i onClick={() => this.terminateTask(task.id)}
                                                                   className="fa fa-trash delete-task-button"
                                                                   aria-hidden="true"></i>
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
    }
    ;
}

export default TaskList;