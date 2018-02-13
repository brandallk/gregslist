function AutosService() {
    var items = []
    var nextID = 0
    var conditions = ['"new"', 'like-new', 'fair', 'rust-bucket', 'you got a tow truck?']

    function Car(id, make, year, model, price, condition, img) {
        this.id = id
        this.make = make
        this.year = year
        this.model = model
        this.price = price
        this.condition = conditions[condition]
        this.img = img
    }

    this.getItems = function() {
        return JSON.parse(JSON.stringify(items))
    }

    this.addItem = function(carObj) {
        nextID++
        var newCar = new Car(nextID, carObj.make, carObj.year, carObj.model, carObj.price, carObj.condition, carObj.img)
        items.push(newCar)
    }

    this.deleteItem = function(itemID) {
        var itemIndex = items.indexOf(items.find( item => item.id === itemID ))
        items.splice(itemIndex, 1)
    }
}
