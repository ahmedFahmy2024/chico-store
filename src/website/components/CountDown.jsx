import { useContext, useEffect, useState } from 'react'
import { LocalContext } from '../../context/LocalContext'
import { useTranslation } from 'react-i18next'

const CountDown = ({ duration }) => {
    const { locale } = useContext(LocalContext)
    const [time, setTime] = useState(duration)
    const { t } = useTranslation();

    useEffect(() => {
        setTimeout(() => {
            setTime(time - 1000)
        }, 1000)
    }, [time])

    const getFormattedTime = (milliseconds) => {
        let total_seconds = parseInt(Math.floor(milliseconds / 1000));
        let total_minutes = parseInt(Math.floor(total_seconds / 60));
        let total_hours = parseInt(Math.floor(total_minutes / 60));
        let days = parseInt(Math.floor(total_hours / 24));

        let seconds = parseInt(total_seconds % 60);
        let minutes = parseInt(total_minutes % 60)
        let hours = parseInt(total_hours % 24)

        // return `${days} days : ${hours} hours : ${minutes} minutes : ${seconds} seconds`;
        return (
            <div className='stack'>
                <div className='timer-col'>
                    <div>{days}</div>
                    <div>{t("days")}</div>
                </div>
                <div className='timer-col'>
                    <div>{hours}</div>
                    <div>{t("hours")}</div>
                </div>
                <div className='timer-col'>
                    <div>{minutes}</div>
                    <div>{t("minutes")}</div>
                </div>
                <div className='timer-col'>
                    <div>{seconds}</div>
                    <div>{t("seconds")}</div>
                </div>
            </div>
        )
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} >{getFormattedTime(time)}</div>
    )
}

export default CountDown