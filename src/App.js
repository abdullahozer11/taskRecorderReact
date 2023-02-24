import './App.css';
import TaskList from "./components/TaskList/TaskList";

function App() {
    return (
        <div className="App">
            <TaskList/>
            <div className="footer">
                <p>Created by <a href="http://www.instagram.com/aiwebtech" target="_blank">Abdullah Ozer</a></p>
            </div>
        </div>
    );
}

export default App;
