import './editor.scss';

const controller = ['$scope', '$http', 'Upload', function ($scope, $http, Upload){
    // region State
    this.editorState = {
        defaultImages: '/test1.jpeg,'.repeat(3).split(',').slice(0, 3),
        showImages: false,
        history: [],
        showImageFrom: false,
        showTextForm: false,
        imageForm: {
            file: null
        },
        addTextForm: {
            text: '',
        }
    }

    this.savedDesigns = [];
    // endregion
    
    const historyLength = 5;
    const apiHost = `http://localhost:${process.env.PORT}`;

    // region Http API
    this.$onInit = () => {
        // TODO: extract API calls to a service
        $http.get(`${apiHost}/api/design`)
        .then(response=>{
            if(response.data.success){
                this.savedDesigns = response.data.outcome;
            } else {
                console.log(response);
                this.savedDesigns = [];
            }
        })
        .catch(error=>{
            console.log(error);
            this.savedDesigns = [];
        })
    }
    
    this.saveDesign = () => {
        $http.post(`${apiHost}/api/design`, {
            design: canvas.toDatalessJSON(),
        })
        .then(response=>{
            if(response.data.success){
                this.savedDesigns.push(response.data.outcome);
                console.log("Saved");
            } else {
                console.log("Save Failed")
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }
    // endregion


    // region Undo
    this.addToHistory = (eventData) => {
        if(this.editorState.history.length == historyLength){
            this.editorState.history.shift().push(eventData)
        } else {
            this.editorState.history.push(eventData)
        }

        $scope.$apply()
    }

    this.undo = () => {
        let historyLength = this.editorState.history.length
        if(historyLength){
            canvas.loadFromDatalessJSON(
                this.editorState.history[historyLength - 1].canvas
            );

            this.editorState.history = this.editorState.history.slice(0, historyLength - 1);
        }
    }
    // endregion
    
    
    // region Forms
    this.openImageForm = () => {
        this.hideForms();
        this.editorState.showImageFrom = true;
    }

    this.openTextForm = () => {
        this.hideForms();
        this.editorState.showTextForm = true;
    }

    this.addImage = (event) => {
        event.preventDefault();
        
        // TODO: Add a loader blocking further UI interactions

        
        Upload.upload({
            url: `${apiHost}/api/image`,
            data: { print: this.editorState.imageForm.file}
        })
        .then((response)=>{
            if(response.data.success){
                console.log(response);
                this._clearCanvas();
                this._addImageToCanvas(response.data.outcome);
            } else {
                // TODO: Show error;
                console.log(error);

            }
        }, (error)=>{
            // TODO: Show error;
            console.log(error);
        })

        this.hideForms();

    }

    this.addText = (event) => {
        event.preventDefault();
        
        this._clearCanvas();
        
        const text = new fabric.Text(this.editorState.addTextForm.text, { left: 100, top: 100 });
        canvas.add(text);

        this.hideForms();
    }

    this.hideForms = () => {
        this.editorState.showImageFrom = this.editorState.showTextForm = false;
    }
    // endregion


    // region Canvas
    this.loadDesign = (design) => {
        this._clearCanvas();
        canvas.loadFromDatalessJSON(JSON.parse(design.value))
    }

    this._clearCanvas = () => {
        canvas.clear();
        this.editorState.history = [];
        prevState = null;
    }

    this._addImageToCanvas = (url) => {
        fabric.Image.fromURL(`${apiHost}/${url}`, (img)=>{
            canvas.add(img);
        })
    }

    let canvas = new fabric.Canvas('main-editor');
    let prevState;

    canvas.on('object:modified', (event)=>{
        this.addToHistory({
            event,
            canvas: prevState,
        })

        prevState = canvas.toDatalessJSON();
    });

    fabric.Image.fromURL(this.editorState.defaultImages[0], function(oImg) {
        canvas.add(oImg);
        prevState = canvas.toDatalessJSON();
    });
    // endregion

}];

export default {
    saEditor: {
        controller,
        template: require('./editor.html'),
        controllerAs: 'ctrl',
    }
}