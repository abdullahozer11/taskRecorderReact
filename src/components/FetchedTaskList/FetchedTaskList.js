import React from "react";
import axios from "axios";
import {ListGroup} from "react-bootstrap";
import {API_URL} from "../../constants";


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

    dragStart(event, index) {
        // remember source tasks id
        event.dataTransfer.setData('index', index);
    };

    dragOver(event) {
        // prevent default in case of wrong drag action
        event.preventDefault();
    };

    drop = async (event, targetIndex) => {
        // Get the source index and task
        const sourceIndex = parseInt(event.dataTransfer.getData('index'));
        const tasks = this.state.tasks;
        const sourceTask = tasks.find(task => task.index === sourceIndex);
        const targetTask = tasks.find(task => task.index === targetIndex);
        if (sourceTask.isCompleted !== targetTask.isCompleted) {
            return
        }
        try {
            await axios.all([
                    this.state.tasks.map(task => {
                        if (targetIndex > sourceIndex && task.index > sourceIndex && task.index <= targetIndex) {
                            return axios.put(`${API_URL}${task.id}/`, {index: task.index - 1});
                        } else if (targetIndex < sourceIndex && task.index < sourceIndex && task.index >= targetIndex) {
                            return axios.put(`${API_URL}${task.id}/`, {index: task.index + 1});
                        } else {
                            return null
                        }
                    }),
                    axios.put(`${API_URL}${sourceTask.id}/`, {index: targetIndex}),
                ]
            ).then(() => {
                this.resetState();
            })
        } catch (error) {
            // Handle any errors that may have occurred during the API requests
            console.error(error);
        } finally {
            this.resetState();
        }
    };

    deleteTask = async (id) => {
        const removedIndex = this.state.tasks.find(task => task.id === id).index;
        try {
            await axios.all([
                this.state.tasks.map(task => {
                    if (task.index > removedIndex) {
                        return axios.put(`${API_URL}${task.id}/`, {index: task.index - 1})
                    } else {
                        return null
                    }
                }),
                axios.delete(`${API_URL}${id}/`),
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            this.resetState();
        }

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
        // Find the task with the specified id in the tasks list
        const task = this.state.tasks.find(task => task.id === id);
        // send put request to update task
        axios.put(`${API_URL}${id}/`, {
            isCompleted: !task.isCompleted,
        }).then(() => {
            this.resetState();
        });
    };

    addTask = () => {
        if (this.state.newTaskDescription.length) {
            axios.post(API_URL, {
                description: this.state.newTaskDescription,
                index: (this.state.tasks.length + 1),
            }).then(() => {
                this.setState({
                    newTaskDescription: "",
                });
                this.resetState();
            });
        }
    }

    render() {
        const tasksPrioritized = this.state.tasks.sort((a, b) => b.index - a.index);
        const tasksSorted = tasksPrioritized.sort((a, b) => {
            if (a.isCompleted === b.isCompleted) {
                return 0;
            }
            if (a.isCompleted) {
                return 1;
            }
            return -1;
        });
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
                                                    {tasksSorted.map((task) => (
                                                        <ListGroup.Item
                                                            key={task.id}
                                                            draggable
                                                            onDragStart={(event) => this.dragStart(event, task.index)}
                                                            onDragOver={this.dragOver}
                                                            onDrop={(event) => this.drop(event, task.index)}
                                                        >
                                                            <li key={task.id}
                                                                className={(task.isCompleted ? 'completed' : '')}>
                                                                <div className="form-check">
                                                                    <label className="form-check-label">
                                                                        <input className="checkbox"
                                                                               type="checkbox"
                                                                               checked={task.isCompleted}
                                                                               onChange={(event) => this.toggleCheckbox(event, task.id)}
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