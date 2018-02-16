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

Controller.prototype.drawItemsList = function(items) {
    var itemsList = $('div.items-list')

    if (this.isInDOM(itemsList)) {
        itemsList.remove()
    }
    this.appDiv.append(this.getItemsTemplate(items))
}

Controller.prototype.activateMenuButton = function(button, service) {
    button.off()
    button.on('click', () => {
        this.drawAddForm()
        this.getItems()
        this.activateSubmitButton(service)
    })
}

Controller.prototype.activateSubmitButton = function(service) {
    var form = $('.add-form form').get(0)
    var submitButton = $('button.submit')

    submitButton.on('click', (evt) => {
        evt.preventDefault()

        service.addItem(form, this.drawItemsList.bind(this))
        form.reset()

        if ($('select#auto-make')) {
            $('select#auto-make').html("")
            $('select#auto-model').html("")
        }
    })
}

Controller.prototype.activateDeleteButtons = function(service) {
    var deleteButton = $('button.deleteItem')
    
    deleteButton.on('click', (evt) => {
        var itemID = evt.target.getAttribute('data-itemID')
        service.deleteItem(itemID, this.drawItemsList.bind(this))
    })
}
