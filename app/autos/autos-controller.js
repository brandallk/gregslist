function AutosController() {
    var autosService = new AutosService()

    this.formTemplate = `
        <div class="add-form px-4">
            <form class="">
                <h4 class="form-title">Add a Car</h4>
                <div class="year form-group">
                    <label for="auto-year">Year: </label>
                    <select class="form-control query-param" id="auto-year" name="year">
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
                        <option value="0">new</option>
                        <option value="1">like new</option>
                        <option value="2">fair</option>
                        <option value="4">needs work</option>
                    </select>
                </div>
                <div class="price form-group">
                    <label for="auto-price">Price: </label>
                    <input type="text" class="form-control" id="auto-price" placeholder="Price" name="price">
                </div>
                <div class="img form-group">
                    <label for="auto-img">Photo URL: </label>
                    <input type="url" class="form-control" id="auto-img" placeholder="Photo URL" name="img" value="https://i1.sndcdn.com/artworks-000119183399-sovq5a-t200x200.jpg">
                </div>
                <button type="submit" class="submit btn btn-info btn-block">Submit</button>
            </form>
            <hr>
        </div>
    `

    function drawYearSelectOptions() {
        var $yearSelectList = $('select#auto-year')
        var template = ""

        // Generate a list of years from present back to 1950
        var options = ["choose"]
        var start = new Date().getFullYear(), end = 1950, i = start
        while (i >= end) {
            options.push(i)
            i--
        }

        options.forEach( year => {
            template += `<option value="${year}">${year}</option>`
        })
        $yearSelectList.html(template)
    }

    function drawManufacturerOptions(data) {
        var $mfrSelectList = $('select#auto-manufacturer')
        var template = ""

        // Sort the list and eliminate repeats and nulls
        var mfrNames = data.Results.map( mfr => mfr.Mfr_CommonName ).sort()
        var uniqueNames = mfrNames.filter( (name, index) => {
            if (name === null) { 
                return false
            }
            if (index > 0) {
                return name != mfrNames[index - 1]
            }
            return true
        })

        uniqueNames.forEach( name => {
            template += `<option>${name}</option>`
        })
        $mfrSelectList.html(template)
    }

    function activateMfrSelectList() {
        var $mfrSelectList = $('select#auto-manufacturer')
        var $modelSelectList = $('select#auto-model')
        var $yearSelectList = $('select#auto-year')

        $mfrSelectList.on('change', (event) => {
            $modelSelectList.html("")
            var mfrName = event.target.value
            var year = $yearSelectList.get(0).value
            autosService.getMakeOptions(mfrName, year, drawMakeOptions)
        })
    }

    function drawMakeOptions(mfrName, data) {
        var $makeSelectList = $('select#auto-make')
        var currentMakeSelection = $makeSelectList.get(0).value
        var template = ""
        
        // Eliminate repeats
        if (data.Results) {
            var makeNames = data.Results.map( make => make.MakeName ).sort()
            var uniqueNames = makeNames
            if (makeNames.length) {
                uniqueNames = makeNames.filter( (name, index) => {
                    if (index > 0) {
                        return name != makeNames[index - 1]
                    }
                    return true
                })
            }            
            uniqueNames.forEach( name => {
                template += `<option>${name}</option>`
            })
        }

        $makeSelectList.html(template)

        // (Re)draw the modelSelectList options when the manufacturer selection changes
        autosService.getModelOptions(currentMakeSelection, drawModelOptions)
    }

    function activateMakeSelectList() {
        var $makeSelectList = $('select#auto-make')
        var $mfrSelectList = $('select#auto-manufacturer')
        var $triggers = $makeSelectList.add($mfrSelectList)

        $triggers.on('change', (event) => {
            var makeName = $makeSelectList.get(0).value
            autosService.getModelOptions(makeName, drawModelOptions)
        })
    }

    function drawModelOptions(data) {
        var $modelSelectList = $('#auto-model')
        var template = ""

        if (data.Results) {
            var modelNames = data.Results.map( model => model.Model_Name ).sort()
            modelNames.forEach( name => {
                template += `<option>${name}</option>`
            })
        }

        $modelSelectList.html(template)
    }

    this.getItemsTemplate = function() {
        var template = `<div class="items-list row justify-content-center pb-5">`
        autosService.getItems().forEach( car => {
            template += `
                <div class="auto-card card text-center col-7 col-sm-4 col-md-3">
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

        drawYearSelectOptions()
        activateMfrSelectList()
        activateMakeSelectList()

        autosService.getAutoManufacturers(drawManufacturerOptions)
    }

    this.drawInitialPageState()
}

AutosController.prototype = new Controller()
AutosController.prototype.constructor = AutosController
