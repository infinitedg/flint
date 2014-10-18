refactorStepOrder = function () {
    if (Session.get('selectedDamageReport')) {
        console.log("Eh?");
        var stepList = [];
        var report = Session.get('selectedDamageReport');
        var template = Session.get('selectedSystem-damage').damageReportTemplates;
        $('.stepList').children().each(function (e, t) {
            var id = t.id;
            var i = report.steps.length;
            var step = {};
            while (i--) {
                if (report.steps[i] && report.steps[i].hasOwnProperty('id') && report.steps[i].id == id) {
                    step = report.steps[i];
                    stepList.push(step);
                }
            }
        });
        report.steps = stepList;

        var id = report.id;
        var i = template.length;
        while (i--) {
            if (template[i]) {
                if (template[i].hasOwnProperty('id')) {
                    if (template[i].id == id) {
                        template[i].steps = report.steps;
                    }
                }
            }
        }
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
    }
};
saveStep = function (context) {
    if (Session.get('selectedDamageStep') === '') {
        return null;
    }
    var step = Session.get('selectedDamageStep');
    var report = Session.get('selectedDamageReport');
    var template = Session.get('selectedSystem-damage').damageReportTemplates;

    step.textshort = context.find('.shortName').value;
    step.textfull = context.find('.stepInstructions').value;

    //Figure out the completion criteria later.

    var id = step.id;
    var i = report.steps.length;
    while (i--) {
        if (report.steps[i]) {
            if (report.steps[i].hasOwnProperty('id')) {
                if (report.steps[i].id == id) {
                    report.steps[i] = step;
                }
            }
        }
    }

    var rid = report.id;
    var j = template.length;
    while (j--) {
        if (template[j]) {
            if (template[j].hasOwnProperty('id')) {
                if (template[j].id == rid) {
                    template[j].steps = report.steps;
                }
            }
        }
    }
    Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
    Session.set('selectedDamageStep', step);
    Session.set('selectedDamageReport', report);
};

Template.card_flintdamagecontrol.rendered = function () {
    var context = this;
    $(this.find('.stepList')).sortable({ // uses the 'sortable' interaction from jquery ui
        stop: function (event, ui) { // fired when an item is dropped
            refactorStepOrder();
        }
    });
};

Template.card_flintdamagecontrol.helpers({
    systems: function () {
        return Flint.system();
    },
    systemValue: function () {
        if (Session.get('selectedSystem-damageSteps')) {
            var system = Session.get('selectedSystem-damageSteps');
            var output = [];
            for (var key in system) {
                var obj = {
                    'name': key
                };
                output.push(obj);
            }
            return output;
        } else {
            return ["--"];
        }
    },
    damageTemplates: function () {
        if (Session.get('selectedSystem-damage') !== undefined) {

            if (Flint.system(Session.get('selectedSystem-damage').name).damageReportTemplates === undefined) {
                Flint.system(Session.get('selectedSystem-damage').name, 'damageReportTemplates', []);
            }
            return Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates");
        } else {
            return false;
        }
    },
    reportName: function () {
        if (Session.get('selectedDamageReport') !== undefined) {
            if (Session.get('selectedDamageReport') !== undefined) {
                return Session.get('selectedDamageReport').name;
            }
        } else {
            return false;
        }
    },
    damageSteps: function () {
        if (Session.get('selectedDamageReport') !== undefined) {
            if (Session.get('selectedDamageReport') !== undefined) {
                return Session.get('selectedDamageReport').steps;
            }
        } else {
            return false;
        }
    },
    damageStepInfo: function (which) {
        if (Session.get('selectedDamageStep') !== undefined) {
            return Session.get('selectedDamageStep')[which];
        }
    },
    damageStepCriteria: function () {
        if (Session.get('selectedDamageStep') !== undefined) {
            return Session.get('selectedDamageStep').completionCriteria;
        }
    },
    criteriaId: function (e) {
        return this.id;
    },
    systemSelect: function (e) {
        return this.system;
    },
    systemValueSelect: function (e) {
        return this.systemValue;
    },
    criteriaValue: function (e) {
        return this.value;
    },
    templateBtnHidden: function () {
        if (Session.get('selectedSystem-damage') !== undefined) {
            return false;
        } else {
            return 'hidden';
        }
    },
    stepBtnHidden: function () {
        if (Session.get('selectedDamageReport') !== undefined) {
            return false;
        } else {
            return 'hidden';
        }
    }
});

Template.card_flintdamagecontrol.events({
    'click .system': function (e) {
        Flint.beep();
        Session.set('selectedSystem-damage', this);
        Session.set('selectedDamageReport', '');
        Session.set('selectedDamageStep', '');
    },
        'click .damageTemplate': function (e) {
        Flint.beep();
        Session.set('selectedDamageReport', this);
        Session.set('selectedDamageStep', '');
    },
        'click .addDamageTemplate': function (e) {
        var templates = Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates");
        if (templates === undefined) {
            templates = [];
        }
        var obj = {
            id: Meteor.uuid(),
            name: 'Report',
            type: 'short',
            steps: []

        };
        templates.push(obj);
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", templates);
    },
        'click .removeDamageTemplate': function () {
        var template = Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates");
        var id = Session.get('selectedDamageReport').id;
        var i = template.length;
        while (i--) {
            if (template[i]) {
                if (template[i].hasOwnProperty('id')) {
                    if (template[i].id === id) {
                        template.splice(i, 1);
                    }
                }
            }
        }
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
    },
        'click .damageStep': function (e) {
        Flint.beep();
        Session.set('selectedDamageStep', this);
    },
        'click .addDamageStep': function () {
        var report = Session.get('selectedDamageReport');
        var steps = report.steps;
        var obj = {
            'id': Meteor.uuid(),
                'textshort': 'Type the step short description here',
                'textfull': 'Type the full step instructions here',
                'completionCriteria': []
        };
        steps.push(obj);
        report.steps = steps;
        Session.set('selectedDamageReport', report);
        var template = Session.get('selectedSystem-damage').damageReportTemplates;
        var id = report.id;
        var i = template.length;
        while (i--) {
            if (template[i]) {
                if (template[i].hasOwnProperty('id')) {
                    //if (arguments.length > 2){
                    if (template[i].id == id) {
                        template[i].steps = steps;

                    }
                    //}
                }
            }
        }
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
    },
        'click .removeDamageStep': function () {
        var report = Session.get('selectedDamageReport');
        var step = Session.get('selectedDamageStep');
        var steps = report.steps;
        var id = step.id;
        var i = steps.length;
        while (i--) {
            if (steps[i] && steps[i].hasOwnProperty('id') && (steps[i].id === id)) {
                steps.splice(i, 1);
            }
        }
        report.steps = steps;
        Session.set('selectedDamageReport', report);
        var template = Session.get('selectedSystem-damage').damageReportTemplates;
        var rid = report.id;
        var j = template.length;
        while (j--) {
            if (template[j] && template[j].hasOwnProperty('id') && (template[j].id === rid)) {
                template[j].steps = steps;
            }
        }
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
    },
        'blur .shortName, blur .stepInstructions': function (e, t) {
        saveStep(t);
    },
        'click .addCriteriaItem': function () {
        if (Session.get('selectedDamageStep') === '') {
            return null;
        }
        var step = Session.get('selectedDamageStep');
        var report = Session.get('selectedDamageReport');
        var template = Session.get('selectedSystem-damage').damageReportTemplates;

        obj = {
            'id': Meteor.uuid(),
                'system': '',
                'systemValue': '',
                'value': ''
        };

        step.completionCriteria.push(obj);

        var id = step.id;
        var i = report.steps.length;
        while (i--) {
            if (report.steps[i]) {
                if (report.steps[i].hasOwnProperty('id')) {
                    if (report.steps[i].id == id) {
                        report.steps[i] = step;
                    }
                }
            }
        }

        id = report.id;
        i = template.length;
        while (i--) {
            if (template[i]) {
                if (template[i].hasOwnProperty('id')) {
                    if (template[i].id == id) {
                        template[i].steps = report.steps;
                    }
                }
            }
        }
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
        Session.set('selectedDamageStep', step);
        Session.set('selectedDamageReport', report);

    },
        'change .systemSelect': function (e) {
        var system;
        var value = e.target.value;
        if (value == "simulator") system = Flint.simulator();
        else system = Flint.system(value);
        Session.set('selectedSystem-damageSteps', system);
    },
        'click .removeCriteria': function (e) {
        var id = this.id;
        if (Session.get('selectedDamageStep') === '') {
            return null;
        }
        var step = Session.get('selectedDamageStep');
        var report = Session.get('selectedDamageReport');
        var template = Session.get('selectedSystem-damage').damageReportTemplates;

        var i = step.completionCriteria.length;
        while (i--) {
            if (step.completionCriteria[i]) {
                if (step.completionCriteria[i].hasOwnProperty('id')) {
                    if (step.completionCriteria[i].id == id) {
                        step.completionCriteria.splice(i, 1);
                        break;
                    }
                }
            }
        }


        id = step.id;
        i = report.steps.length;
        while (i--) {
            if (report.steps[i]) {
                if (report.steps[i].hasOwnProperty('id')) {
                    if (report.steps[i].id == id) {
                        report.steps[i] = step;
                    }
                }
            }
        }

        id = report.id;
        i = template.length;
        while (i--) {
            if (template[i]) {
                if (template[i].hasOwnProperty('id')) {
                    if (template[i].id == id) {
                        template[i].steps = report.steps;
                    }
                }
            }
        }
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
        Session.set('selectedDamageStep', step);
        Session.set('selectedDamageReport', report);
    },
        'click .updateCriteria': function (e, context) {
        var target = e.target;
        if (Session.get('selectedDamageStep') === '') {
            return null;
        }
        var step = Session.get('selectedDamageStep');
        var report = Session.get('selectedDamageReport');
        var template = Session.get('selectedSystem-damage').damageReportTemplates;

        var obj = {
            'id': this.id,
                'system': context.find("#" + target.parentElement.id + " .systemSelect").value,
                'systemValue': context.find("#" + target.parentElement.id + " .systemValueSelect").value,
                'value': context.find("#" + target.parentElement.id + " .criteriaValue").value
        };

        var id = obj.id;
        var i = step.completionCriteria.length;
        while (i--) {
            if (step.completionCriteria[i]) {
                if (step.completionCriteria[i].hasOwnProperty('id')) {
                    if (step.completionCriteria[i].id == id) {
                        step.completionCriteria[i] = obj;
                    }
                }
            }
        }


        id = step.id;
        i = report.steps.length;
        while (i--) {
            if (report.steps[i]) {
                if (report.steps[i].hasOwnProperty('id')) {
                    if (report.steps[i].id == id) {
                        report.steps[i] = step;
                    }
                }
            }
        }

        id = report.id;
        i = template.length;
        while (i--) {
            if (template[i]) {
                if (template[i].hasOwnProperty('id')) {
                    if (template[i].id == id) {
                        template[i].steps = report.steps;
                    }
                }
            }
        }
        Flint.system(Session.get('selectedSystem-damage').name, "damageReportTemplates", template);
        Session.set('selectedDamageStep', step);
        Session.set('selectedDamageReport', report);
    }

});