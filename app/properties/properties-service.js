function PropertiesService() {
    var items = []
    var nextID = 0

    function Property(id, type, location, description, price, img) {
        this.id = id
        this.type = type
        this.location = location
        this.description = description
        this.price = price
        this.img = img
    }

    this.getItems = function() {
        return JSON.parse(JSON.stringify(items))
    }

    this.addItem = function(propertyObj) {
        nextID++
        var newProperty = new Property(nextID, propertyObj.type, propertyObj.location, propertyObj.description, propertyObj.price, propertyObj.img)
        items.push(newProperty)
    }

    this.deleteItem = function(itemID) {
        var itemIndex = items.indexOf(items.find( item => item.id === itemID ))
        items.splice(itemIndex, 1)
    }
}