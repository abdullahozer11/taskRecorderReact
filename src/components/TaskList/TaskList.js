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
                    title: "Wash Car",
                    desc: "Vehicle needs serious cleaning including with sprays and sponges.",
                },
                {
                    id: 2,
                    title: "Fix Computer",
                    desc: "Computer needs opening and dusting inside.",
                },
                {
                    id: 3,
                    title: "Read Book",
                    desc: "Dune needs to be finished. Read the damn book.",
                },
            ],
            newTaskTitle: '',
            newTaskDescription: '',
        };
    };

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

    postponeTask = (id) => {
        // Create a shallow copy of the list of tasks
        const tasksCopy = [...this.state.tasks];
        // Determine the index of the item to remove
        const index = tasksCopy.findIndex((item) => item.id === id);
        // Remove the item from the copied list
        const [removed] = tasksCopy.splice(index, 1);
        // Add the removed item back to the end of the copied list
        tasksCopy.push(removed);
        // Update the component's state with the modified list of tasks
        this.setState({
            tasks: tasksCopy,
        });
    };

    handleSubmit = (event) => {
        // prevent default form submission behavior
        event.preventDefault();

        this.addTask();
    };

    handleTaskTitleChange = (event) => {
        // Update the value of the taskTitle state property with the value from the input field
        this.setState({newTaskTitle: event.target.value});
    };

    handleTaskDescriptionChange = (event) => {
        // Update the value of the taskDescription state property with the value from the input field
        this.setState({newTaskDescription: event.target.value});
    };

    addTask = () => {
        // shallow copy of the tasks list
        const tasksCopy = [...this.state.tasks];
        // check if new task title and new task description data are not empty
        if (this.state.newTaskTitle.length && this.state.newTaskDescription.length) {
            // create a new task object using the current state
            const newTask = {
                id: tasksCopy.length + 1,
                title: this.state.newTaskTitle,
                desc: this.state.newTaskDescription,
            };

            // add the new task to the tasks list
            tasksCopy.push(newTask);

            // update the state with the new tasks list
            this.setState({
                tasks: tasksCopy,
                newTaskTitle: '',
                newTaskDescription: '',
            });
        }
    };

    render() {
        const tasks = this.state.tasks;
        return (
            <>
                <ListGroup>
                    {tasks.map((task) => (
                        <ListGroup.Item
                            key={task.id}
                            draggable
                            onDragStart={(event) => this.dragStart(event, task.id)}
                            onDragOver={this.dragOver}
                            onDrop={(event) => this.drop(event, task.id)}
                        >
                            <div className="card">
                                <div key={task.id} className="card-body">
                                    <h5 className="card-title">{task.title}</h5>
                                    <p className="card-text">
                                        {task.desc}
                                    </p>
                                    <button onClick={() => this.postponeTask(task.id)}
                                            className="card-link btn btn-secondary">Postpone
                                    </button>
                                    <button onClick={() => this.terminateTask(task.id)}
                                            className="card-link btn btn-dark">Done
                                    </button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <div className="card">
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" id="task-title" className="card-text" placeholder={"Task Title"}
                                   value={this.state.newTaskTitle}
                                   onChange={this.handleTaskTitleChange}/>
                            <br/>
                            <textarea id="task-description" className="card-text" placeholder={"Task Description"}
                                      value={this.state.newTaskDescription}
                                      onChange={this.handleTaskDescriptionChange}/>
                            <br/>
                            <button id="task-add-button" type="submit" className="card-link btn btn-primary">Add</button>
                        </form>
                    </div>
                </div>
            </>
        );
    };
}

export default TaskList;