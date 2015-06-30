/*globals getJSON, jml*/
(function () {'use strict';

document.title = "Sacred Writings Browser";

// Need for directionality even if language specified (and we don't want to require it as a param)
getJSON('langs.json', function (langs) {

function getDirectionForLanguage (language) {
    return langs[langs.findIndex(function (lang) {
        return lang[0] === language;
    })][1];
}

function paramChange () {
    
    document.body.parentNode.replaceChild(document.createElement('body'), document.body);
    
    var params = new URLSearchParams(location.hash.slice(1));
    var language = params.get('lang');

    if (!language) {
        jml('div', {'class': 'focus'},
            [['select', {size: langs.length, $on: {change: function (e) {
                params.set('lang', e.target.selectedOptions[0].value);
                location.hash = '#' + params.toString();
            }}}, langs.map(function (lang) {
                return ['option', {value: lang[0]}, [lang[2]]];
            })]], document.body
            
            /* Works too:
            langs.map(function (lang) {
                return ['div', [
                    ['a', {href: '#', dataset: {code: lang[0]}}, [lang[2]]]
                ]];
            }), document.body
            */
        );
        return;
    }
    
    var lang = language.split('.');
    
    IMF({
        languages: lang,
        callback: function (l, defineFormatter) {

            var ta = defineFormatter('tablealias');
            
            var direction = getDirectionForLanguage(lang[0]);

            getJSON('databases.json', function (dbs) {
                jml(
                    'div',
                    {'class': 'focus ' + direction},
                    dbs.map(function (db, i) {
                        return ['div', [
                            (i > 0 ? ['br', 'br', 'br'] : ''),
                            ['div', [l(db.directions)]],
                            ['br'],
                            ['select', {'class': 'file', dataset: {name: db.name}, $on: {change: function (e) {
                                // Submit
                                // alert(e.target.dataset.name);
                                
                                
                                getJSON(e.target.selectedOptions[0].dataset.file, function (fileJSON) {
                                    alert(JSON.stringify(fileJSON));
                                });
                                
                                
                            }}},
                                db.files.map(function (file) {
                                    return ['option', {value: file.name, dataset: {file: db.baseDirectory + '/' + file.file}}, [ta(file.name)]];
                                })
                            ],
                            ['p', [
                                ['input', {type: 'button', value: "Go"}]
                            ]]
                        ]];
                    }),
                    document.body
                );
            });

            /*
            Add back to databases.json when overcome memory issue
            ,
                {"name": "Other Writings", "directions": "choosewritings_bahai_writingsotherdb", "baseDirectory": "other-works", "files": [
                    {"file": "Collins.json", "name": "Collins bibliography"},
                    {"file": "lights.json", "name": "Lights of Guidance"}
                ]}
            */
            
        }
    });
    
    
}

// INIT/ADD EVENTS

paramChange();
window.addEventListener('hashchange', paramChange, false);


});




}());
