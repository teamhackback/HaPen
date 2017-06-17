import {observable, computed, autorun} from 'mobx';


class ObservableAppStore {
    constructor() {
        autorun(() => console.log(this.report));
    }

    @observable user = null;
    @observable projects_bar = false;
    @observable project_current = 0;
    @observable projects = [
        {
            name: null,
            type: null,
            language: null,
            events: []
        }, {
            name: null,
            type: null,
            language: null,
            events: [{
                    type: 'COMMIT',
                    message: 'hello HaPen',
                    date: new Date(),
                },{
                    type: 'COMMIT',
                    message: 'hello 2017-05-05',
                    date: new Date('2017-05-05'),
                }]
        }

    ];


    @observable step_current = 0;//todo better


    @computed
    get
    currentProject() {
        return this.projects[this.project_current];
    }

    @computed
    get
    events() {
        return [].concat(...this.projects.map((project)=>project.events.map((event=>Object.extends({project},event)))));
    }



    @computed
    get
    logged() {
        return this.user?true:false;
    }

    nextStep(task) {
        console.log('nextStep');
        this.step_current++;
    }

    toggleProjectsBar() {
        this.projects_bar=!this.projects_bar;
    }


    setCurrentProjectName(name) {
        this.currentProject.name=name;
    }


}


export default new ObservableAppStore();