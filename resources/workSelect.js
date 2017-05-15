/* globals TextBrowser, Templates, IMF, getJSON */
TextBrowser.prototype.workSelect = function workSelect ({
    lang, localeFromFileData, fallbackLanguages, getMetaProp, $p, followParams
} /* , l, defineFormatter */) {
    // We use getJSON instead of JsonRefs as we do not necessarily need to
    //    resolve the file contents here
    getJSON(this.files, (dbs) => {
        this.fileData = dbs;
        const imfFile = IMF({ // eslint-disable-line new-cap
            locales: lang.map(localeFromFileData),
            fallbackLocales: fallbackLanguages.map(localeFromFileData)
        });
        const lf = imfFile.getFormatter();
        document.title = lf({key: 'browserfile-workselect', fallback: true});

        /*
        function ld (key, values, formats) {
            return l({
                key: key, values: values, formats: formats, fallback: ({message}) =>
                    // Displaying as div with inline display instead of span since
                    //    Firefox puts punctuation at left otherwise
                    ['div', {
                        style: 'display: inline;direction: ' + fallbackDirection
                    }, [message]]
            });
        }
        */

        getJSON(dbs.groups.reduce((arr, fileGroup) => {
            const metadataBaseDir = (dbs.metadataBaseDirectory || '') +
                (fileGroup.metadataBaseDirectory || '') + '/';
            return fileGroup.files.reduce((ar, fileData) =>
                ar.concat(metadataBaseDir + fileData.metadataFile),
                arr);
        }, [])).then((metadataObjs) => {
            const metadataObjsIter = metadataObjs[Symbol.iterator]();
            const getNextAlias = () => {
                const metadataObj = metadataObjsIter.next().value;
                return getMetaProp(metadataObj, 'alias');
            };
            Templates.workSelect({dbs, lf, getNextAlias, $p, followParams});
        }, (err) => {
            alert('Error: ' + err);
        });
    }, (err) => {
        alert(err);
    });
};