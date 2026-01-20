import React from 'react';
import Cookies from 'universal-cookie';
import zhCN from '../.octopus/zh-CN';
import zhTW from '../.octopus/zh-TW';
import enUS from '../.octopus/en-US';
import thTH from '../.octopus/th-TH';
import arEG from '../.octopus/ar-EG';
import koKR from '../.octopus/ko-KR';
import esES from '../.octopus/es-ES';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver'
const cookies = new Cookies();

const mapLocale = {
    'zh-cn': zhCN,
    'zh-tw': zhTW,
    en: enUS,
    th: thTH, // 泰语
    ar: arEG, // 阿拉伯语（埃及）
    ko: koKR, // 韩语
    es: esES // 西班牙语
};


export const getLang = () => {
    const lang = cookies.get('lang');
    return lang !== 'cn' ? lang : 'zh-cn';
};

export const WrapLocaleReceiver = (Component) => {
    return (props) => (
        <LocaleReceiver componentName="TNTDFormulaEdit">
            {(locale, localeCode) => {
                const I18N = !!Object.keys(locale).length ? locale : (mapLocale[localeCode] || mapLocale[getLang()]);
                const transformLocaleCode = localeCode === 'zh-cn' ? 'cn' : localeCode;
                return (
                    <Component locale={locale} localeCode={transformLocaleCode} I18N={I18N} {...props} />
                )
            }}
        </LocaleReceiver>
    )
}




export default mapLocale;
