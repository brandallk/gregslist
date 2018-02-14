function AutosController() {
    var autosService = new AutosService()

    this.formTemplate = `
        <div class="add-form px-4">
            <form class="">
                <h4 class="form-title">Add a Car</h4>
                <div class="make form-group">
                    <label for="auto-make">Make: </label>
                    <input type="text" class="form-control query-param" id="auto-make" placeholder="Make" name="make">
                </div>
                <div class="model form-group">
                    <label for="auto-model">Model: </label>
                    <input type="text" class="form-control query-param" id="auto-model" placeholder="Model" name="model">
                </div>
                <div class="year form-group">
                    <label for="auto-year">Year: </label>
                    <input type="number" class="form-control query-param" id="auto-year" placeholder="Year" name="year">
                </div>
                <div class="contition form-group">
                    <label for="auto-condition">Condition: </label>
                    <select class="form-control" id="auto-condition" name="condition">
                        <option value="0">"new"</option>
                        <option value="1">like new</option>
                        <option value="2">fair</option>
                        <option value="3">rust-bucket</option>
                        <option value="4">you got a tow truck?</option>
                    </select>
                </div>
                <div class="price form-group">
                    <label for="auto-price">Price: </label>
                    <input type="number" class="form-control query-param" id="auto-price" placeholder="Price" name="price">
                </div>
                <div class="img form-group">
                    <label for="auto-img">Photo URL: </label>
                    <input type="text" class="form-control" id="auto-img" placeholder="Photo URL" name="img">
                </div>
                <button type="submit" class="submit btn btn-info btn-block">Submit</button>
            </form>
            <hr>
        </div>
    `

    // this.drawSuggestion = function(suggestion) {
    //     console.log(suggestion)
    // }

    // this.activateInputTracker = function() {
    //     var requestParams = {}
    //     var formInputs = Array.from(document.querySelectorAll('.query-param'))

    //     formInputs.forEach( input => {
    //         input.addEventListener('keyup', (event) => {
    //             requestParams[event.target.name] = event.target.value
    //             var suggestion = autosService.getFormSuggestions(requestParams, this.drawSuggestion)
    //         })
    //     })
    // }

    this.getItemsTemplate = function() {
        var template = `<div class="items-list row justify-content-center pb-5">`
        autosService.getItems().forEach( car => {
            template += `
                <div class="auto-card card text-center col-12 col-sm-4 col-md-3">
                    <img class="card-img-top mt-2" src="${car.img}" alt="car photo">
                    <h5 class="card-title">${car.year} ${car.make} ${car.model}</h5>
                    <p class="card-text">Condition: ${car.condition}</p>
                    <p class="card-text">$${car.price}</p>
                    <button type="button" class="deleteItem btn btn-danger btn-block mb-2" data-itemID="${car.id}">Remove</button>
                </div>
            `
        })                
        template += `</div>`
        return template
    }

    this.makeItemObject = function() {
        var $form = $('.add-form form').get(0)
        return {
            make: $form.make.value,
            year: $form.year.value,
            model: $form.model.value,
            price: $form.price.value,
            condition: $form.condition.value,
            img: $form.img.value
        }
    }

    this.drawItemsList = function() {
        Controller.prototype.drawItemsList.call(this)
        this.activateDeleteButtons(autosService)
    }

    this.drawInitialPageState = function() {        
        var template = `
            <div class="container">
                <h1 class="text-center">Greg's List</h1>
                <div class="Menu py-3 px-5 d-flex justify-content-center">
                    <button type="button" class="autos-btn btn btn-info btn-block mt-0 rounded-0 border-right">Autos</button>
                    <button type="button" class="properties-btn btn btn-info btn-block mt-0 rounded-0 border-right">Properties</button>
                    <button type="button" class="jobs-btn btn btn-info btn-block mt-0 rounded-0">Jobs</button>
                </div>
                <hr>
            </div>
        `
        this.appDiv.html(template)
        
        var autosMenuButton = $('.autos-btn')
        this.activateMenuButton(autosMenuButton, autosService)
        autosMenuButton.click()

        // this.activateInputTracker()
    }

    this.drawInitialPageState()
}

AutosController.prototype = new Controller()
AutosController.prototype.constructor = AutosController
