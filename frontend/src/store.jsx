import {observable, computed, mobx} from 'mobx';


class ObservableAppStore {
    @observable step = 0;


    constructor() {
        mobx.autorun(() => console.log(this.report));
    }


    nextStep(task){
        this.step++;
    }

    /*@computed get completedTodosCount() {
        return this.todos.filter(
            todo => todo.completed === true
        ).length;
    }

    @computed get report() {
        if (this.todos.length === 0)
            return "<none>";
        return `Next todo: "${this.todos[0].task}". ` +
            `Progress: ${this.completedTodosCount}/${this.todos.length}`;
    }

    addTodo(task) {
        this.todos.push({
            task: task,
            completed: false,
            assignee: null
        });
    }*/
}


export default new ObservableAppStore();