const vowels = ["а", "о", "у", "э", "ы", "и"];
const consonants = ["б", "в", "г", "д", "ж", "з", "й", "к", "л", "м", "н", "п", "р", "с", "т", "ф", "х", "ц", "ч", "ш", "щ"];
const soft_consonants = ["б", "в", "г", "д", "з", "к", "л", "м", "н", "п", "р", "с", "т", "ф", "х"];

const vowels_with_j = { "е": "э", "ё": "о", "ю": "у", "я": "а" };
const i = "и";
const j = "й";

const ji_shi = [["жи", "жы"], ["ши", "шы"]];

const ch_replace = ["сч", "зч", "зч", "жч"];
const ch = "щ";

const c_replace = ["ться", "тся"];
const c = "ца";

const s_replace = [["сс", "с"], ["сш", "ш"]];
const soft_sign = "ь";

const hard_sign = "ъ";

export class Transcription {

    static getTranscription(text) {
        text = text.toLowerCase();

        let newText = "";

        // пугаются бриться
        c_replace.forEach((elem) => {
            let regex = new RegExp(elem, 'g');
            text = text.replace(regex, c);
        });

        // юла коюта кря скамья ёж + бязь вязь связь 
        [...text].forEach((letter, index, array) => {
            if (Object.keys(vowels_with_j).includes(letter)) {
                if (index === 0 ||
                    array[index - 1] === " " ||
                    array[index - 1] === soft_sign ||
                    array[index - 1] === hard_sign ||
                    vowels.includes(array[index - 1])) {
                    newText += j;
                    newText += vowels_with_j[letter];
                    return;
                } else {
                    if (index !== 0 &&
                        soft_consonants.includes(array[index - 1])) {
                        newText += "_";
                    }
                    newText += vowels_with_j[letter];
                    return;
                }
            }
            newText += letter;
        });

        text = newText;

        // жилы шило
        ji_shi.forEach((elem) => {
            let regex = new RegExp(elem[0], 'g');
            text = text.replace(regex, elem[1]);
        });

        // счастье
        ch_replace.forEach((elem) => {
            let regex = new RegExp(elem, 'g');
            text = text.replace(regex, ch);
        });    

        // класс
        s_replace.forEach((elem) => {
            let regex = new RegExp(elem[0], 'g');
            text = text.replace(regex, elem[1]);
        });

        // подъезд
        let regex_hard_sign = new RegExp(hard_sign, 'g');
        text = text.replace(regex_hard_sign, '');

        let newText_2 = "";
        // бязь вязь нить
        [...text].forEach((letter, index, array) => {
            if (index !== array.length - 1 &&
                (array[index + 1] === soft_sign || array[index + 1] === i) &&
                soft_consonants.includes(letter)) {
                newText_2 += letter;
                newText_2 += "_";
            } else {
                newText_2 += letter;
            }
        });

        text = newText_2;

        let regex_soft_sign = new RegExp(soft_sign, 'g');
        text = text.replace(regex_soft_sign, '');

        return text;
    };

    static getTranscriptionArray(text) {
        text = this.getTranscription(text);

        let resultArray = [];
        for (let id = 0; id < text.length; id++) {
            const element = text[id];
            if (text[id] === " ") {
                resultArray.push("pause");
                continue;
            }
            if (!vowels.includes(element) && !consonants.includes(element)) {
                continue;
            }
            if (id === text.length - 1) {
                resultArray.push(element);
                continue;
            }
            if (text[id + 1] === "_") {
                resultArray.push(element + "_");
                id++;
                continue;
            } else {
                resultArray.push(element);
            }
        }

        return resultArray;
    }
}