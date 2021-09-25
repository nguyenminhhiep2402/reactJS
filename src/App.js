import "./App.css";
import React, { Component } from "react";
import TaskForm from "./components/taskForm";
import TaskList from "./components/taskList";
import Control from "./controls/control";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isDisplayForm: true,
      taskEditting: null,
      filter: {
        name: "",
        status: -1,
      },
      keyword: "",
    };
  }

  // randomString(length) {
  //   let chars =
  //     "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");

  //   if (!length) {
  //     length = Math.floor(Math.random() * chars.length);
  //   }

  //   let str = "";
  //   for (let i = 0; i < length; i++) {
  //     str += chars[Math.floor(Math.random() * chars.length)];
  //   }
  //   return str;
  // }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  generateID() {
    return this.s4() + this.s4() + "-" + this.s4();
  }

  onGenerateData = () => {
    let tasks = [
      // { id: this.randomString(8), name: "Chemistry", state: true },
      // { id: this.randomString(8), name: "History", state: true },
      // { id: this.randomString(8), name: "Biological", state: true },
    ];
    // console.log(tasks);
    this.setState({ tasks: tasks });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  componentDidMount() {
    let Storage = localStorage.getItem("tasks");
    // console.log(Storage);
    if (Storage) {
      this.setState({
        tasks: JSON.parse(Storage),
      });
    }
  }
  onToggeForm = () => {
    if (this.state.isDisplayForm && this.state.taskEditting !== null) {
      this.setState({
        isDisplayForm: true,
        taskEditting: null,
      });
    } else {
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        taskEditting: null,
      });
    }
  };
  onCloseForm = () => {
    this.setState({ isDisplayForm: false });
  };
  onSubmit = (data) => {
    let { tasks } = this.state;
    if (data.id === "") {
      data.id = this.generateID();
      tasks.push(data);
    } else {
      let index = this.findIndex(data.id);
      tasks[index] = data;
    }

    this.setState({ tasks: tasks, taskEditting: null });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  onUpdateStatus = (id) => {
    let { tasks } = this.state;
    let index = this.findIndex(id);
    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({ tasks: tasks });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };
  onDelete = (id) => {
    // console.log(id);
    let { tasks } = this.state;
    let index = this.findIndex(id);
    if (index !== -1) {
      tasks.splice(index, 1);
      this.setState({ tasks: tasks });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    this.onCloseForm();
  };

  findIndex = (id) => {
    let { tasks } = this.state;
    let result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  };
  onShowForm = () => {
    this.setState({ isDisplayForm: true });
  };
  onUpdate = (id) => {
    let { tasks } = this.state;
    let index = this.findIndex(id);
    let taskEditting = tasks[index];
    this.setState({ taskEditting: taskEditting });
    this.onShowForm();
  };
  onFilter = (filterName, filterStatus) => {
    //console.log(filterName, ' - ', filterStatus);
    filterStatus = parseInt(filterStatus, 10);
    //console.log(typeof filterName)
    this.setState({
      filter: {
        name: filterName.toLowerCase(),
        status: filterStatus,
      },
    });
  };
  onSearch = (keyword) => {
    this.setState({ keyword: keyword });
  };
  render() {
    let { tasks, isDisplayForm, taskEditting, filter, keyword } = this.state;
    let elmTaskForm = isDisplayForm ? (
      <TaskForm
        onSubmit={this.onSubmit}
        onCloseForm={this.onCloseForm}
        task={taskEditting}
      />
    ) : (
      ""
    );
    if (filter) {
      if (filter.name) {
        tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      //lọc theo status
      tasks = tasks.filter((task) => {
        if (filter.status === -1) {
          return task;
        } else {
          // console.log(task.status === (filter.status === 1 ? true : false));
          return task.status === (filter.status === 1 ? true : false);
        }
      });
    }
    if (keyword) {
      tasks = tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      });
    }

    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row">
          <div
            className={
              isDisplayForm ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : ""
            }
          >
            {/* taskForm */}
            {/* <TaskForm /> */}
            {elmTaskForm}
          </div>
          <div
            className={
              isDisplayForm
                ? "col-xs-8 col-sm-8 col-md-8 col-lg-8"
                : "col-xs-12 col-sm-12 col-md-12 col-lg-12"
            }
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onToggeForm}
            >
              <span className="fa fa-plus mr-5"></span>Thêm Công Việc
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={this.onGenerateData}
            >
              <span className=""></span>Generate Data
            </button>
            {/* control */}
            <Control />
            <TaskList
              tasks={tasks}
              onUpdateStatus={this.onUpdateStatus}
              onDelete={this.onDelete}
              onUpdate={this.onUpdate}
              onFilter={this.onFilter}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
