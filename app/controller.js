function Controller() {
    this.appDiv = $('div#app')
}

Controller.prototype.isInDOM = function(jQcollection) {
    return jQcollection.length > 0
}

Controller.prototype.drawAddForm = function() {
    var addItemForm = $('div.add-form')
    
    if (this.isInDOM(addItemForm)) {
        addItemForm.remove()
    }
    this.appDiv.append(this.formTemplate)
}

Controller.prototype.drawItemsList = function() {
    var itemsList = $('div.items-list')

    if (this.isInDOM(itemsList)) {
        itemsList.remove()
    }
    this.appDiv.append(this.getItemsTemplate())
}

Controller.prototype.activateMenuButton = function(button, service) {
    button.off()
    button.on('click', () => {
        this.drawAddForm()
        this.drawItemsList()
        this.activateSubmitButton(service)
    })
}

Controller.prototype.activateSubmitButton = function(service) {
    var form = $('.add-form form').get(0)
    var submitButton = $('button.submit')

    submitButton.on('click', (evt) => {
        evt.preventDefault()

        var itemObj = this.makeItemObject()
        
        service.addItem(itemObj)
        this.drawItemsList()
        form.reset()
    })
}

Controller.prototype.activateDeleteButtons = function(service) {
    var deleteButton = $('button.deleteItem')
    
    deleteButton.on('click', () => {
        var itemID = $(this).attr('data-itemID')
        service.deleteItem(itemID)
        this.drawItemsList()
    })
}
