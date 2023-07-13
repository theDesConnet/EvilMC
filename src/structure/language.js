/**
 * EvilMC v2.0 (https://github.com/theDesConnet/EvilMC)
 * c0d9d by DesConnet
 * 
 * Класс языка
 */

class Language {
    /**
     * @typedef {{languageFile: Object}} langOptions
     * @param {langOptions} options 
     */
    constructor(options) {
        this.languageFile = options.languageFile;
        console.log(`[INFO] ${this.getText("loadedLanguage", { Lang: this.languageFile.Language })}`);
    }

    /**
     * Возвращает текст с заменеными аргументами
     * @param {String} id - ID текста
     * @param {object} vars - Значения на которые нужно заменить ваши аргументы
     * @returns Готовый текст
     */
    getText(id, vars) {
        if (!id) return "";

        let textBuilder = this.languageFile.TEXT[id];
        if (!textBuilder) return "";
        
        if (typeof(vars) !== 'undefined') {
            Object.keys(vars).forEach((key) => {
                textBuilder = textBuilder.replace(`%${key}%`, vars[key]);
            })
        }

        return textBuilder;
    }
}

module.exports = Language;