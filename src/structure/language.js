//Класс языка

class Language {
    /**
     * @typedef {{languageFile: Object}} langOptions
     * @param {langOptions} options 
     */
    constructor(options) {
        this.languageFile = options.languageFile;
        console.log(`[INFO] ${this.getText("loadedLanguage", this.languageFile.Language)}`);
    }

    /**
     * Возвращает текст с заменеными аргументами
     * @param {String} id - ID текста
     * @param  {...String} vars - Значения на которые нужно заменить ваши аргументы
     * @returns Готовый текст
     */
    getText(id, ...vars) {
        if (!id) return "";

        let textBuilder = this.languageFile.TEXT[id];
        if (!textBuilder) return "";
        
        const variablesInText = textBuilder.match(/%[a-zA-Z0-9]+%/g);

        if (vars.length > 0) {
            for (let i = 0; i < variablesInText.length; i++) {
                textBuilder = textBuilder.replace(variablesInText[i], vars[i]);
            }
        }

        return textBuilder;
    }
}

module.exports = Language;