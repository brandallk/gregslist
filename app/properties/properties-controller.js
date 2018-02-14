function PropertiesController() {
    var propertiesService = new PropertiesService()

    this.formTemplate = `
        <div class="add-form px-4">
            <form>
                <h4 class="form-title">Add a Property</h4>
                <div class="type form-group">
                    <label for="property-type">Type: </label>
                    <input type="text" class="form-control" id="property-type" placeholder="Type" name="type">
                </div>
                <div class="location form-group">
                    <label for="property-location">Location: </label>
                    <input type="text" class="form-control" id="property-location" placeholder="Location" name="location">
                </div>
                <div class="description form-group">
                    <label for="property-description">Desciption: </label>
                    <input type="text" class="form-control" id="property-description" placeholder="Description" name="description">
                </div>
                <div class="price form-group">
                    <label for="property-price">Price: </label>
                    <input type="number" class="form-control" id="property-price" placeholder="Price" name="price">
                </div>
                <div class="img form-group">
                    <label for="property-img">Photo URL: </label>
                    <input type="text" class="form-control" id="property-img" placeholder="Photo URL" name="img">
                </div>
                <button type="submit" class="submit btn btn-info btn-block">Submit</button>
            </form>
            <hr>
        </div>
    `

    this.getItemsTemplate = function() {
        var template = `<div class="items-list row justify-content-center pb-5">`
        propertiesService.getItems().forEach( property => {
            template += `
                <div class="property-card card text-center col-12 col-sm-4 col-md-3">
                    <img class="card-img-top mt-2" src="${property.img}" alt="car photo">
                    <h5 class="card-title">${property.type} property available at ${property.location}</h5>
                    <p class="card-text">${property.description}</p>
                    <p class="card-text">$${property.price}</p>
                    <button type="button" class="deleteItem btn btn-danger btn-block mb-2" data-itemID="${property.id}">Remove</button>
                </div>
            `
        })
        template += `</div>`
        return template
    }

    this.makeItemObject = function() {
        var $form = $('.add-form form').get(0)
        return {
            type: $form.type.value,
            location: $form.location.value,
            description: $form.description.value,
            price: $form.price.value,
            img: $form.img.value
        }
    }

    this.drawItemsList = function() {
        Controller.prototype.drawItemsList.call(this)
        this.activateDeleteButtons(propertiesService)
    }

    this.drawInitialPageState = function() {
        var propertiesMenuButton = $('.properties-btn')
        this.activateMenuButton(propertiesMenuButton, propertiesService)
    }

    this.drawInitialPageState()
}

PropertiesController.prototype = new Controller()
PropertiesController.prototype.constructor = PropertiesController
