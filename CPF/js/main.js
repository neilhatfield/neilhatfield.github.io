/* Hold math parser in a variable */
var Parser = math.parser();

/* currentDistr will hold the current distribution. Get the first one to load the page */
var currentDistr;
for (var dist in distributions) {
    currentDistr = distributions[dist];
    break;
}

/* This function will reload the table appropriately */
function generateInputTable(dist) {
    var HTMLout = '';
    for (param in dist.params) {
        param = dist.params[param];
        HTMLout += '<tr>';
        HTMLout += '<td>' + param.paramName + '</td>'
        HTMLout += '<td> <input type="text" size=15 id="' + param.paramId + '" value="' + param.paramValue + '"/> </td>';
        HTMLout += '</tr>';
    }
    HTMLout += '<tr id="button-row"> <td colspan="2"><button type="button" id="compute" onclick="computeProbability();">Compute Probability</button>';
    HTMLout += '<button type="button" id="clearFields" onclick="clearFields();">Clear Fields</button> </td></tr>';

    document.getElementById("inputTable").innerHTML = HTMLout;
    document.getElementById("outputLabel").innerHTML = dist.outputLabel + ': ';
    document.getElementById('distr-description').firstElementChild.innerHTML = dist.displayName + ' Distribution';
    document.getElementById('distr-description').lastElementChild.innerHTML = dist.description;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "distr-description"]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "inputTable"]);

    /*Clear the output and hide the plot */
    document.getElementById('output').innerHTML = '';
    document.getElementById('plot_wrapper').style.display = 'none';

}

function computeProbability() {
    /* First set the parameters values in the current object by collecting input data */
    for (var param in currentDistr.params) {
        param = currentDistr.params[param];
        param.paramValue = document.getElementById(param.paramId).value;
    }
    /*Hide plotter*/
    document.getElementById('plot_wrapper').style.display = 'none';
    /*Try to compute probability*/
    var output = currentDistr.computeProbability();
    document.getElementById('output').innerHTML = output;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "outputContainer"]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "plot_notes"]);
}

function clearFields() {
    for (param in currentDistr.params) {
        param = currentDistr.params[param];
        param.paramValue = '';
        document.getElementById(param.paramId).value = '';
        document.getElementById('output').innerHTML = '';
        document.getElementById('plotter').style.display = 'none';
    }
}


/* When page is loaded...
 *Load the input table with first object in distributions object
 */
window.onload = function () {
    generateInputTable(currentDistr);
    /* When option is changed, make sure to change the table and output label */
    document.getElementById('dist-select').addEventListener('change', function () {
        generateInputTable(distributions[this.value]);
        currentDistr = distributions[this.value];
    });

    /* GeoGebra code */
    var GGBplot = new GGBApplet({
        material_id: '2500545'
    }, true);
    GGBplot.inject('plotter', 'preferHTML5');

}


/* This function will look at the distributions object, then write them as HTML options
 */
function writeOptions() {
    var HTMLout = '';
    for (var dist in distributions) {
        var distr = distributions[dist];
        HTMLout += '<option value="' + dist + '">' + distr.displayName + '</option>';
    }
    document.write(HTMLout);
    return;
}