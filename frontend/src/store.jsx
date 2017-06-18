import {observable, computed, autorun} from 'mobx';


class ObservableAppStore {
    constructor() {
        autorun(() => console.log(this.report));
    }

    @observable user = null;
    @observable projects_bar = false;
    @observable project_current = -1;
    @observable project_new = null/*{
        name: '',
        type: '',
        language: '',
        events: []
    }*/;
    @observable projects = [
        {
            name: 'Foo project',
            type: 'Mobile app',
            language: 'Java',
            events: []
        }, {
            name: 'HaPen',
            type: 'Web app',
            language: 'D, JavaScript',
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


    @observable step_current = -1;//todo better


    @computed
    get
    currentProject() {
        if(this.project_current===-1)return null;
        return this.projects[this.project_current];
    }

    @computed
    get
    events() {
        let events = [];
        this.projects.forEach((project)=>{
            project.events.forEach((event)=>{
                events.push({
                    type:event.type,
                    message:event.message,
                    date:event.date,
                    project
                })


            });

        });
        return events;

        //return [].concat(...this.projects.map((project)=>project.events.map((event=>Object.extend({project},event)))));
    }



    @computed
    get
    logged() {
        return this.user?true:false;
    }

    nextStep(task) {
        this.step_current++;
    }

    previousStep(task) {
        this.step_current--;
    }

    toggleProjectsBar() {
        this.projects_bar=!this.projects_bar;
    }

    setCurrentProject(project_current){
        this.projects_bar=false;
        this.project_current = project_current;
    }

    setNewProjectKey(key,value) {
        this.project_new[key]=value;
    }
    commitNewProject(key,value) {
        this.projects.push(this.project_new);
        this.cancelNewProject();
    }
    cancelNewProject() {
        this.project_new=null;
    }
    createNewProject() {
        this.project_new={
            name: '',
            type: '',
            language: '',
            events: []
        };
    }
    setCurrentProjectKey(key,value) {
        this.currentProject[key]=value;
    }


}


export default new ObservableAppStore();