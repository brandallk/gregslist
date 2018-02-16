function AutosService() {
    var items = []
    var nextID = 0
    var conditions = ['"new"', 'like-new', 'fair', 'rust-bucket', 'you got a tow truck?']

    function Car(formData) {
        this.make = formData.make.value
        this.year = formData.year.value
        this.model = formData.model.value
        this.price = formData.price.value
        this.condition = formData.condition.value
        this.img = formData.img.value
    }

    this.getAutoManufacturers= function(cb) {
        $.get("https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json")
         .done( function(data) {
             cb(data)
         })
    }

    this.getMakeOptions = function(mfrName, year, cb) {
        $.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForManufacturerAndYear/${mfrName}?year=${year}&format=json`)
         .done( function(data) {
             cb(mfrName, data)
         })
    }

    this.getModelOptions = function(makeName, cb) {
        $.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${makeName}?format=json`)
         .done( function(data) {
             cb(data)
         })
    }

    this.getItems = function(cb) {
        $.get("https://inspire-server.herokuapp.com/api/" + "brk83604cars")
        .then( res => {
            items = res // update local data copy
            cb(items) // drawItemsList(items)
        })
    }

    this.addItem = function(form, cb) {
        var newCar = new Car(form)
        $.post("https://inspire-server.herokuapp.com/api/" + "brk83604cars", newCar)
        .then( res => {
            items.push(res.data) //update items arr
            cb(items) // drawItemsList(items)
        })
    }

    this.deleteItem = function(itemID, cb) {
        $.ajax({
            url: "https://inspire-server.herokuapp.com/api/" + "brk83604cars" + "/" + itemID,
            method: "DELETE"
        }).then( res => {
            var itemIndex = items.indexOf(items.find( item => item.id === itemID ))
            items.splice(itemIndex, 1) //update items arr
            cb(items) // drawItemsList(items)
        })
    }
}
