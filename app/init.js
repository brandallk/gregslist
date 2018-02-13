var app = {
    controllers: {
        autosCtrl: new AutosController(),
        propertiesCtrl: new PropertiesController(),
        jobsCtrl: new JobsController(),
    }
}

// console.log(app.controllers.autosCtrl instanceof Controller)
// console.log(app.controllers.autosCtrl.activateBtn)