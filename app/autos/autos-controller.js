function AutosController() {
    var autosService = new AutosService()

    this.formTemplate = `
        <div class="add-form px-4">
            <form class="">
                <h4 class="form-title">Add a Car</h4>
                <div class="year form-group">
                    <label for="auto-year">Year: </label>
                    <select class="form-control query-param" id="auto-year" name="year">
                        <option value="1998">1998</option>
                        <option value="1999">1999</option>
                        <option value="2000">2000</option>
                        <option value="2001">2001</option>
                        <option value="2002">2002</option>
                        <option value="2003">2003</option>
                        <option value="2004">2004</option>
                        <option value="2005">2005</option>
                        <option value="2006">2006</option>
                    </select>
                </div>
                <div class="manufacturer form-group">
                    <label for="auto-manufacturer">Manufacturer: </label>
                    <select class="form-control query-param" id="auto-manufacturer" data-next="make" name="manufacturer"></select>
                </div>
                <div class="make form-group">
                    <label for="auto-make">Make: </label>
                    <select class="form-control query-param" id="auto-make" data-next="model" name="make">
                    </select>
                </div>
                <div class="model form-group">
                    <label for="auto-model">Model: </label>
                    <select class="form-control" id="auto-model" name="model"></select>
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
                    <select class="form-control" id="auto-price" name="condition"></select>
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

    this.drawYearOptions = function() {
        var $selectYear = $('select#auto-year')
        var options = []

        var start = 1950, end = 2018, i = start
        while (i <= end) {
            options.push(i)
            i++
        }

        var template = ""
        options.forEach( year => {
            template += `<option value="${year}">${year}</option>`
        })
        $selectYear.html(template)
    }

    this.drawManufacturerOptions = function(data) {
        var $selectMfr = $('select#auto-manufacturer')
        var template = ""

        var mfrNames = data.Results.map( mfr => mfr.Mfr_CommonName ).sort()
        var uniqueNames = mfrNames.filter( (name, index) => {
            if (name === null) { return false }
            if (mfrNames[index - 1]) {
                return name != mfrNames[index - 1]
            }
            return true
        })

        uniqueNames.forEach( name => {
            template += `<option>${name}</option>`
        })
        $selectMfr.html(template)
    }

    this.activateMfrInputTracker = function() {
        var $trigger = $('select#auto-manufacturer')
        var $selectModel = $('#auto-model')
        $trigger.on('change', (event) => {
            $selectModel.html("")
            var mfrName = event.target.value
            var year = $('#auto-year').get(0).value
            autosService.getMakeOptions(mfrName, year, this.drawMakeOptions)
        })
    }

    this.drawMakeOptions = function(mfrName, data) {
        var $selectMake = $('#auto-make')
        var template = ""

        if (data.Results) {
            var makeNames = data.Results.map( make => make.MakeName ).sort()
            var uniqueNames = makeNames
            if (makeNames.length) {
                uniqueNames = makeNames.filter( (name, index) => {
                    if (makeNames[index - 1]) {
                        return name != makeNames[index - 1]
                    }
                    return true
                })
            }            
            uniqueNames.forEach( name => {
                template += `<option>${name}</option>`
            })
        }

        $selectMake.html(template)
    }

    this.activateMakeInputTracker = function() {
        var $makeElt = $('#auto-make')
        var $triggers = $('#auto-manufacturer, #auto-make')
        $triggers.on('change', (event) => {
            var makeName = $makeElt.get(0).value
            autosService.getModelOptions(makeName, this.drawModelOptions)
        })
    }

    // Still getting previous-manufacturer model numbers when manufacurer changes
    this.drawModelOptions = function(data) {
        var $selectModel = $('#auto-model')
        var template = ""

        if (data.Results) {
            var modelNames = data.Results.map( model => {
                return model.Model_Name ? model.Model_Name : "(any)"
            }).sort()
            modelNames.forEach( name => {
                template += `<option>${name}</option>`
            })
        }

        $selectModel.html(template)
    }

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

        this.drawYearOptions()
        this.activateMfrInputTracker()
        this.activateMakeInputTracker()

        autosService.getAutoManufacturers(this.drawManufacturerOptions.bind(this))
    }

    this.drawInitialPageState()
}

AutosController.prototype = new Controller()
AutosController.prototype.constructor = AutosController
