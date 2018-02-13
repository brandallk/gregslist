function JobsService() {
    var items = []
    var nextID = 0

    function Job(id, title, location, description, salary) {
        this.id = id
        this.title = title
        this.location = location
        this.description = description
        this.salary = salary
    }

    this.getItems = function() {
        return JSON.parse(JSON.stringify(items))
    }

    this.addItem = function(jobObj) {
        nextID++
        var newJob = new Job(nextID, jobObj.title, jobObj.location, jobObj.description, jobObj.salary)
        items.push(newJob)
    }

    this.deleteItem = function(itemID) {
        var itemIndex = items.indexOf(items.find( item => item.id === itemID ))
        items.splice(itemIndex, 1)
    }
}