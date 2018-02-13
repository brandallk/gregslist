function Controller() {}

Controller.prototype.drawAddForm = function() {
    if ($('div.add-form').length > 0) {
        $('div.add-form').remove()
    }
    $('div#app').append(this.formTemplate)
}

Controller.prototype.drawItemsList = function() {
    if ($('div.items-list').length > 0) {
        $('div.items-list').remove()
    }
    $('div#app').append(this.getItemsTemplate())
    this.activateDeleteButtons(this.service)
}

Controller.prototype.activateMenuBtn = function(btnElt, service) {
    btnElt.off()
    btnElt.on('click', () => {
        this.drawAddForm()
        this.drawItemsList()
        this.activateSubmitButton(service)
    })
}

Controller.prototype.activateSubmitButton = function(service) {
    $('button.submit').on('click', (evt) => {
        evt.preventDefault()

        var itemObj = this.makeItemObject()
        
        service.addItem(itemObj)
        this.drawItemsList()
        $('.add-form form').get(0).reset()
    })
}

Controller.prototype.activateDeleteButtons = function(service) {
    $('button.deleteItem').on('click', () => {
        var itemID = $(this).attr('data-itemID')
        service.deleteItem(itemID)
        this.drawItemsList()
    })
}
