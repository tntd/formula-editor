import mapLocale, { getLang } from '../../I18N';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const TypeMap = (I18N) => ({
    INT: I18N.formulaedit.otp.zhengShu,
    DOUBLE: I18N.formulaedit.otp.xiaoShu,
    STRING: I18N.formulaedit.otp.ziFuChuan,
    ENUM: I18N.formulaedit.otp.meiJu,
    BOOLEAN: I18N.formulaedit.otp.buEr,
    DATETIME: I18N.formulaedit.otp.shiJian,
    ARRAY: I18N.formulaedit.otp.shuZu,
})



export const getTypeMap = (I18N) => {

    let otp = TypeMap(I18N);

    const TYPE_MAP = {
        'INT': {
            'displayName': otp.INT,
            'color': '#5262C7'
        },
        'LONG': {
            'displayName': otp.INT,
            'color': '#5262C7'
        },
        'DOUBLE': {
            'displayName': otp.DOUBLE,
            'color': '#00D2C2'
        },
        'STRING': {
            'displayName': otp.STRING,
            'color': '#826AF9'
        },
        'ENUM': {
            'displayName': otp.ENUM,
            'color': '#00C5DC'
        },
        'BOOLEAN': {
            'displayName': otp.BOOLEAN,
            'color': '#4A9AF7'
        },
        'DATETIME': {
            'displayName': otp.DATETIME,
            'color': '#826AF9'
        },
        'ARRAY': {
            'displayName': otp.ARRAY,
            'color': '#E5A74F'
        }
    };

    return TYPE_MAP || {};
};


