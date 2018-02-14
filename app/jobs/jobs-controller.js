function JobsController() {
    var jobsService = new JobsService()

    this.formTemplate = `
        <div class="add-form px-4">
            <form>
                <h4 class="form-title">Add a Job</h4>
                <div class="title form-group">
                    <label for="job-title">Title: </label>
                    <input type="text" class="form-control" id="job-title" placeholder="Title" name="title">
                </div>
                <div class="location form-group">
                    <label for="job-location">Location: </label>
                    <input type="text" class="form-control" id="job-location" placeholder="Location" name="location">
                </div>
                <div class="description form-group">
                    <label for="job-description">Desciption: </label>
                    <input type="text" class="form-control" id="job-description" placeholder="Description" name="description">
                </div>
                <div class="salary form-group">
                    <label for="job-salary">Salary: </label>
                    <input type="number" class="form-control" id="job-salary" placeholder="Salary" name="salary">
                </div>
                <button type="submit" class="submit btn btn-primary btn-block">Submit</button>
            </form>
            <hr>
        </div>
    `

    this.getItemsTemplate = function() {
        var template = `<div class="items-list row justify-content-center pb-5">`
        jobsService.getItems().forEach( job => {
            template += `
                <div class="job-card card text-center col-12 col-sm-4 col-md-3">
                    <h5 class="card-title">${job.title} position available in ${job.location}</h5>
                    <p class="card-text">${job.description}</p>
                    <p class="card-text">Salary: $${job.salary}</p>
                    <button type="button" class="deleteItem btn btn-danger btn-block mb-2" data-itemID="${job.id}">Remove</button>
                </div>
            `
        })
        template += `</div>`
        return template
    }

    this.makeItemObject = function() {
        var $form = $('.add-form form').get(0)
        return {
            title: $form.title.value,
            location: $form.location.value,
            description: $form.description.value,
            salary: $form.salary.value
        }
    }

    this.drawItemsList = function() {
        Controller.prototype.drawItemsList.call(this)
        this.activateDeleteButtons(jobsService)
    }

    this.drawInitialPageState = function() {
        var jobsMenuButton = $('.jobs-btn')
        this.activateMenuButton(jobsMenuButton, jobsService)
    }

    this.drawInitialPageState()
}

JobsController.prototype = new Controller()
JobsController.prototype.constructor = JobsController
